import childProcess from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

const require = createRequire(import.meta.url);
const reportDir = path.resolve(process.cwd(), 'reports/wdio-logs');
const resultPath = path.join(reportDir, 'chromedriver-attach-probe.json');
const logPath = path.join(reportDir, 'chromedriver-attach-probe.log');
const driverLogPath = path.join(reportDir, 'chromedriver-attach-probe-driver.log');

function getEnv(name, fallback = '') {
  const value = process.env[name];
  return value === undefined || value.trim() === '' ? fallback : value.trim();
}

function getNumberEnv(name, fallback) {
  const parsed = Number(getEnv(name));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getPositiveNumberEnv(name, fallback) {
  const parsed = getNumberEnv(name, fallback);

  if (parsed <= 0) {
    console.warn(`[chromedriver-probe] Ignoring invalid ${name}=${parsed}. Using ${fallback}.`);

    return fallback;
  }

  return parsed;
}

function getListEnv(name, fallback = []) {
  const value = getEnv(name);

  if (!value) {
    return fallback;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function describeError(error) {
  if (error instanceof Error) {
    return error.stack || error.message || error.name;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function tailText(text, lineCount = 80) {
  return text.split(/\r?\n/u).filter(Boolean).slice(-lineCount).join('\n');
}

function readTailIfExists(filePath, lineCount = 80) {
  if (!fs.existsSync(filePath)) {
    return '';
  }

  return tailText(fs.readFileSync(filePath, 'utf8'), lineCount);
}

function resolveChromedriverPath() {
  const configuredPath = getEnv('CHROMEDRIVER_BINARY_PATH') || getEnv('CHROMEDRIVER_PATH');

  if (configuredPath) {
    return configuredPath;
  }

  try {
    const chromedriver = require('chromedriver');

    if (typeof chromedriver.path === 'string' && chromedriver.path) {
      return chromedriver.path;
    }
  } catch {
    // Fall back to package binary locations below.
  }

  const packageBinaryPath = path.resolve(
    process.cwd(),
    'node_modules/chromedriver/lib/chromedriver',
    process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver',
  );

  if (fs.existsSync(packageBinaryPath)) {
    return packageBinaryPath;
  }

  return path.resolve(
    process.cwd(),
    'node_modules/.bin',
    process.platform === 'win32' ? 'chromedriver.cmd' : 'chromedriver',
  );
}

function waitForPort(host, port, timeoutMs) {
  const startedAt = Date.now();
  let lastError;

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = net.createConnection({ host, port });

      socket.once('connect', () => {
        socket.end();
        resolve();
      });
      socket.once('error', (error) => {
        socket.destroy();
        lastError = error;

        if (Date.now() - startedAt >= timeoutMs) {
          reject(
            new Error(
              `Timed out waiting for ChromeDriver at ${host}:${port} after ${timeoutMs}ms. Last socket error: ${describeError(
                lastError,
              )}`,
            ),
          );
          return;
        }

        setTimeout(tryConnect, 250);
      });
    };

    tryConnect();
  });
}

async function webdriverRequest(host, port, method, endpoint, body) {
  const url = `http://${host}:${port}${endpoint}`;
  let response;

  try {
    response = await fetch(url, {
      method,
      headers: {
        'content-type': 'application/json',
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch (error) {
    throw new Error(`${method} ${url} failed: ${describeError(error)}`);
  }

  const text = await response.text();
  let payload;

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const message = payload?.value?.message || payload?.message || text || response.statusText;
    throw new Error(`${method} ${endpoint} failed with ${response.status}: ${message}`);
  }

  return payload;
}

async function inspectSession(host, port, sessionId) {
  const handlesResponse = await webdriverRequest(
    host,
    port,
    'GET',
    `/session/${sessionId}/window/handles`,
  );
  const handles = handlesResponse.value || [];
  const windows = [];

  for (const [index, handle] of handles.entries()) {
    const windowInfo = { index, handle };

    try {
      await webdriverRequest(host, port, 'POST', `/session/${sessionId}/window`, { handle });
      const [titleResponse, urlResponse] = await Promise.all([
        webdriverRequest(host, port, 'GET', `/session/${sessionId}/title`),
        webdriverRequest(host, port, 'GET', `/session/${sessionId}/url`),
      ]);
      windowInfo.title = titleResponse.value;
      windowInfo.url = urlResponse.value;
    } catch (error) {
      windowInfo.error = error instanceof Error ? error.message : String(error);
    }

    windows.push(windowInfo);
  }

  return windows;
}

async function main() {
  fs.mkdirSync(reportDir, { recursive: true });

  const chromedriverPath = resolveChromedriverPath();
  const debuggerAddress = getEnv('ELECTRON_DEBUGGER_ADDRESS', '127.0.0.1:9229');
  const host = getEnv('CHROMEDRIVER_ATTACH_PROBE_HOST', '127.0.0.1');
  const port = getNumberEnv('CHROMEDRIVER_ATTACH_PROBE_PORT', 9517);
  const startupTimeoutMs = getPositiveNumberEnv('CHROMEDRIVER_ATTACH_PROBE_TIMEOUT_MS', 30000);
  const windowTypes = getListEnv('ELECTRON_CHROME_WINDOW_TYPES', ['tab', 'page', 'app', 'webview']);

  if (!fs.existsSync(chromedriverPath)) {
    throw new Error(`ChromeDriver binary does not exist: ${chromedriverPath}`);
  }

  console.log(`[chromedriver-probe] chromedriver: ${chromedriverPath}`);
  console.log(`[chromedriver-probe] host: ${host}`);
  console.log(`[chromedriver-probe] port: ${port}`);
  console.log(`[chromedriver-probe] debuggerAddress: ${debuggerAddress}`);
  console.log(`[chromedriver-probe] windowTypes: ${windowTypes.join(', ')}`);

  const logStream = fs.createWriteStream(logPath, { flags: 'w' });
  const stdoutChunks = [];
  const stderrChunks = [];
  logStream.write(`[chromedriver-probe] chromedriver: ${chromedriverPath}\n`);
  logStream.write(`[chromedriver-probe] host: ${host}\n`);
  logStream.write(`[chromedriver-probe] port: ${port}\n`);
  logStream.write(`[chromedriver-probe] debuggerAddress: ${debuggerAddress}\n`);
  logStream.write(`[chromedriver-probe] windowTypes: ${windowTypes.join(', ')}\n`);
  logStream.write(`[chromedriver-probe] driverLogPath: ${driverLogPath}\n`);
  fs.writeFileSync(
    driverLogPath,
    `[chromedriver-probe] Waiting for ChromeDriver to write driver logs here.\n`,
  );

  const driver = childProcess.spawn(
    chromedriverPath,
    [
      `--port=${port}`,
      '--allowed-origins=*',
      '--allowed-ips=0.0.0.0',
      `--log-path=${driverLogPath}`,
      '--verbose',
    ],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    },
  );
  driver.stdout?.on('data', (chunk) => {
    const text = chunk.toString();
    stdoutChunks.push(text);
    logStream.write(text);
  });
  driver.stderr?.on('data', (chunk) => {
    const text = chunk.toString();
    stderrChunks.push(text);
    logStream.write(text);
  });
  const driverStartupError = new Promise((_, reject) => {
    driver.once('error', (error) => {
      const details = describeError(error);
      logStream.write(`[chromedriver-probe] driver startup error: ${details}\n`);
      reject(new Error(`ChromeDriver failed to start: ${details}`));
    });
  });
  const driverExitBeforeReady = new Promise((_, reject) => {
    driver.once('exit', (code, signal) => {
      const message = [
        `ChromeDriver exited before the probe could connect. code=${code ?? '(none)'} signal=${
          signal ?? '(none)'
        }`,
        `stdout tail:\n${tailText(stdoutChunks.join('')) || '(empty)'}`,
        `stderr tail:\n${tailText(stderrChunks.join('')) || '(empty)'}`,
        `driver log tail:\n${readTailIfExists(driverLogPath) || '(empty)'}`,
      ].join('\n');

      logStream.write(`[chromedriver-probe] ${message}\n`);
      reject(new Error(message));
    });
  });

  let sessionId;

  try {
    await Promise.race([
      waitForPort(host, port, startupTimeoutMs),
      driverStartupError,
      driverExitBeforeReady,
    ]);

    const sessionResponse = await webdriverRequest(host, port, 'POST', '/session', {
      capabilities: {
        alwaysMatch: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            debuggerAddress,
            windowTypes,
          },
        },
      },
    });

    sessionId = sessionResponse.value?.sessionId || sessionResponse.sessionId;

    if (!sessionId) {
      throw new Error(
        `ChromeDriver did not return a session id: ${JSON.stringify(sessionResponse)}`,
      );
    }

    const windows = await inspectSession(host, port, sessionId);
    const result = {
      inspectedAt: new Date().toISOString(),
      chromedriverPath,
      host,
      port,
      debuggerAddress,
      windowTypes,
      session: sessionResponse,
      windows,
    };

    fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`);
    console.log(`[chromedriver-probe] Session created: ${sessionId}`);
    console.log(`[chromedriver-probe] Wrote ${resultPath}`);
    for (const windowInfo of windows) {
      console.log(
        `- title=${JSON.stringify(windowInfo.title || '')} url=${JSON.stringify(
          windowInfo.url || '',
        )} handle=${windowInfo.handle}`,
      );
    }
  } finally {
    if (sessionId) {
      await webdriverRequest(host, port, 'DELETE', `/session/${sessionId}`).catch(() => undefined);
    }

    if (driver.pid) {
      driver.kill();
    }

    logStream.end();
  }
}

main().catch((error) => {
  console.error(`[chromedriver-probe] ${describeError(error)}`);
  console.error(`[chromedriver-probe] See log: ${logPath}`);
  console.error(`[chromedriver-probe] See ChromeDriver log: ${driverLogPath}`);
  process.exitCode = 1;
});
