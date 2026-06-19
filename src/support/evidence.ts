import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import allureReporter from '@wdio/allure-reporter';
import { reportPaths } from '../../config/reporting.config.js';

type TestLike = {
  title: string;
  fullTitle?: string;
};

type TestResultLike = {
  error?: Error;
  passed?: boolean;
  retries?: unknown;
  duration?: number;
};

type VideoState = {
  process?: ChildProcessWithoutNullStreams;
  filePath?: string;
  stdout: string;
  stderr: string;
  started: boolean;
  reason?: string;
};

const videoStates = new Map<string, VideoState>();
const shouldRecordVideo = process.env.E2E_RECORD_VIDEO === 'true';
const videoMaxSeconds = Math.max(1, Number(process.env.E2E_VIDEO_MAX_SECONDS ?? 10));
const videoFps = Math.max(1, Number(process.env.E2E_VIDEO_FPS ?? 10));
const maxAttachmentBytes = Number(process.env.E2E_LOG_ATTACHMENT_BYTES ?? 80_000);

function sanitizeFileName(value: string): string {
  return value
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function testKey(test: TestLike): string {
  return test.fullTitle ?? test.title;
}

function tailFile(filePath: string, maxBytes = maxAttachmentBytes): string {
  const stats = fs.statSync(filePath);
  const bytesToRead = Math.min(stats.size, maxBytes);
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(bytesToRead);

  try {
    fs.readSync(fd, buffer, 0, bytesToRead, Math.max(0, stats.size - bytesToRead));
  } finally {
    fs.closeSync(fd);
  }

  const prefix =
    stats.size > bytesToRead
      ? `--- truncated to last ${bytesToRead} of ${stats.size} bytes ---\n`
      : '';

  return `${prefix}${buffer.toString('utf8')}`;
}

function recentLogFiles(directory: string, limit = 5): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .map((fileName) => path.join(directory, fileName))
    .filter((filePath) => fs.statSync(filePath).isFile())
    .sort((left, right) => fs.statSync(right).mtimeMs - fs.statSync(left).mtimeMs)
    .slice(0, limit);
}

async function attachText(name: string, value: string): Promise<void> {
  await allureReporter.addAttachment(name, value, 'text/plain');
}

async function attachJson(name: string, value: unknown): Promise<void> {
  await allureReporter.addAttachment(name, JSON.stringify(value, null, 2), 'application/json');
}

async function attachFinalScreenshot(test: TestLike, isFailure: boolean): Promise<void> {
  const screenshot = await browser.takeScreenshot();
  const screenshotBuffer = Buffer.from(screenshot, 'base64');
  const fileName = `${Date.now()}-${sanitizeFileName(test.title)}-${
    isFailure ? 'failure' : 'final'
  }.png`;
  const screenshotPath = path.join(reportPaths.screenshots, fileName);

  fs.writeFileSync(screenshotPath, screenshotBuffer);
  await allureReporter.addAttachment(
    isFailure ? 'Failure screenshot' : 'Final screenshot',
    screenshotBuffer,
    'image/png',
  );
}

async function attachRuntimeState(result: TestResultLike): Promise<void> {
  const runtimeState = await browser
    .execute(() => ({
      title: document.title,
      url: globalThis.location.href,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      webdriver: navigator.webdriver,
      viewport: {
        width: globalThis.innerWidth,
        height: globalThis.innerHeight,
        devicePixelRatio: globalThis.devicePixelRatio,
      },
      documentReadyState: document.readyState,
    }))
    .catch((error: Error) => ({
      available: false,
      reason: error.message,
    }));

  await attachJson('Electron renderer runtime state', {
    result: {
      passed: result.passed,
      retries: result.retries,
      duration: result.duration,
    },
    host: {
      platform: process.platform,
      release: os.release(),
      arch: process.arch,
      node: process.version,
    },
    renderer: runtimeState,
  });
}

async function attachBrowserLogs(): Promise<void> {
  const browserWithLogs = browser as unknown as {
    getLogs?: (type: string) => Promise<unknown>;
  };

  if (typeof browserWithLogs.getLogs !== 'function') {
    await attachJson('Browser console logs', {
      available: false,
      reason: 'browser.getLogs is not exposed by this WebDriver session.',
    });
    return;
  }

  try {
    await attachJson('Browser console logs', await browserWithLogs.getLogs('browser'));
  } catch (error) {
    await attachJson('Browser console logs', {
      available: false,
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}

async function attachDriverLogs(): Promise<void> {
  const files = recentLogFiles(reportPaths.wdioLogs);

  if (files.length === 0) {
    await attachJson('WDIO and ChromeDriver logs', {
      available: false,
      directory: reportPaths.wdioLogs,
      reason: 'No WDIO log files were available when this test finished.',
    });
    return;
  }

  for (const filePath of files) {
    await attachText(`WDIO and ChromeDriver log: ${path.basename(filePath)}`, tailFile(filePath));
  }
}

export async function startEvidenceCapture(test: TestLike): Promise<void> {
  const state: VideoState = {
    stdout: '',
    stderr: '',
    started: false,
  };

  videoStates.set(testKey(test), state);

  if (!shouldRecordVideo) {
    state.reason = 'Set E2E_RECORD_VIDEO=true to record native per-test videos.';
    return;
  }

  if (process.platform !== 'win32') {
    state.reason = `Windows video recording is skipped on ${process.platform}. Final framework video capture is configured for Windows runs.`;
    return;
  }

  const filePath = path.join(
    reportPaths.videos,
    `${Date.now()}-${sanitizeFileName(test.title)}.mp4`,
  );
  const recorder = spawn(
    'ffmpeg',
    [
      '-y',
      '-f',
      'gdigrab',
      '-framerate',
      String(videoFps),
      '-i',
      'desktop',
      '-t',
      String(videoMaxSeconds),
      '-pix_fmt',
      'yuv420p',
      filePath,
    ],
    {
      windowsHide: true,
    },
  );

  state.process = recorder;
  state.filePath = filePath;
  state.started = true;
  recorder.on('error', (error) => {
    state.started = false;
    state.reason = `Unable to start ffmpeg. Install ffmpeg on the Windows runner and make sure it is available in PATH. ${error.message}`;
  });
  recorder.stdout.on('data', (chunk) => {
    state.stdout += String(chunk);
  });
  recorder.stderr.on('data', (chunk) => {
    state.stderr += String(chunk);
  });
}

async function stopVideoCapture(test: TestLike): Promise<void> {
  const state = videoStates.get(testKey(test));

  if (!state) {
    return;
  }

  if (!state.process) {
    await attachJson('Video recording', {
      enabled: shouldRecordVideo,
      available: false,
      reason: state.reason,
    });
    return;
  }

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      state.process?.kill();
      resolve();
    }, 5000);

    state.process?.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });

    if (!state.started || state.process?.exitCode !== null) {
      clearTimeout(timeout);
      resolve();
      return;
    }

    if (state.process?.stdin.writable) {
      state.process.stdin.write('q');
      state.process.stdin.end();
    } else {
      state.process?.kill();
    }
  });

  const filePath = state.filePath;

  if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
    await allureReporter.addAttachment(
      'Test execution video',
      fs.readFileSync(filePath),
      'video/mp4',
    );
    return;
  }

  await attachJson('Video recording', {
    enabled: true,
    available: false,
    filePath,
    maxSeconds: videoMaxSeconds,
    fps: videoFps,
    stdout: state.stdout,
    stderr: state.stderr,
    reason:
      state.reason ??
      'Windows ffmpeg recording did not produce a video. Confirm ffmpeg is installed, available in PATH, and allowed to capture the desktop session.',
  });
}

export async function attachEvidence(test: TestLike, result: TestResultLike): Promise<void> {
  await attachFinalScreenshot(test, Boolean(result.error));
  await attachRuntimeState(result);
  await attachBrowserLogs();
  await attachDriverLogs();
  await stopVideoCapture(test);

  if (result.error) {
    await attachJson('Failure details', {
      title: test.title,
      fullTitle: test.fullTitle,
      error: {
        message: result.error.message,
        stack: result.error.stack,
      },
    });
  }
}
