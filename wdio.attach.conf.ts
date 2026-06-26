import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Capabilities, Options } from '@wdio/types';
import {
  ELECTRON_VERSION,
  getChromedriverOptions,
  getElectronServiceOptions,
} from './config/electron.config.js';
import { getBooleanEnv, getEnv, getListEnv, getNumberEnv } from './config/env.js';
import { ensureReportDirectories, reportPaths } from './config/reporting.config.js';
import { attachEvidence, startEvidenceCapture } from './src/support/evidence.js';

let electronProcess: childProcess.ChildProcess | undefined;

const waitTimeout = getNumberEnv('WAIT_TIMEOUT_MS', 10000);
const connectionRetryTimeout = getNumberEnv('WDIO_CONNECTION_RETRY_TIMEOUT_MS', 300000);
const connectionRetryCount = getNumberEnv('WDIO_CONNECTION_RETRY_COUNT', 1);
const attachPort = getNumberEnv('ELECTRON_ATTACH_DEBUG_PORT', 9229);
const attachTimeout = getNumberEnv('ELECTRON_ATTACH_TIMEOUT_MS', 300000);
const attachTargetTimeout = getNumberEnv('ELECTRON_ATTACH_TARGET_TIMEOUT_MS', attachTimeout);
const attachTargetStableMs = getNumberEnv('ELECTRON_ATTACH_TARGET_STABLE_MS', 3000);
const debuggerAddress = getEnv('ELECTRON_DEBUGGER_ADDRESS', `127.0.0.1:${attachPort}`);
const attachLifecycleLogPath = path.join(reportPaths.wdioLogs, 'wdio-attach-lifecycle.log');

type WdioTestrunnerConfig = Options.Testrunner & {
  capabilities: Capabilities.TestrunnerCapabilities;
};

type DevToolsTarget = {
  id?: string;
  type?: string;
  title?: string;
  url?: string;
  attached?: boolean;
  webSocketDebuggerUrl?: string;
};

function lifecycleLog(message: string, details?: Record<string, unknown>): void {
  const line = `[WDIO ATTACH][${new Date().toISOString()}] ${message}${
    details ? ` ${JSON.stringify(details)}` : ''
  }`;

  console.info(line);
  fs.mkdirSync(reportPaths.wdioLogs, { recursive: true });
  fs.appendFileSync(attachLifecycleLogPath, `${line}\n`);
}

function isWindowsAbsolutePath(value: string): boolean {
  return /^[a-zA-Z]:[\\/]/u.test(value) || /^\\\\/u.test(value);
}

function dirnameForCurrentHost(value: string): string {
  return isWindowsAbsolutePath(value) ? path.win32.dirname(value) : path.dirname(value);
}

function killProcessTree(child: childProcess.ChildProcess): void {
  if (!child.pid) {
    return;
  }

  try {
    if (process.platform === 'win32') {
      childProcess.execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
      });
      return;
    }

    process.kill(-child.pid, 'SIGTERM');
  } catch {
    child.kill();
  }
}

async function waitForDevToolsEndpoint(timeoutMs: number): Promise<Record<string, unknown>> {
  const startedAt = Date.now();
  let lastError = '';

  while (Date.now() - startedAt <= timeoutMs) {
    try {
      const response = await fetch(`http://${debuggerAddress}/json/version`);

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return (await response.json()) as Record<string, unknown>;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }

  throw new Error(
    `Timed out waiting for Electron DevTools at ${debuggerAddress} after ${timeoutMs}ms. Last error: ${lastError}`,
  );
}

async function fetchDevToolsTargets(): Promise<DevToolsTarget[]> {
  const response = await fetch(`http://${debuggerAddress}/json/list`);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return (await response.json()) as DevToolsTarget[];
}

function getAttachWindowTypes(): string[] {
  const windowTypes = getListEnv('ELECTRON_CHROME_WINDOW_TYPES');

  return windowTypes.length > 0 ? windowTypes : ['tab', 'page', 'app', 'webview'];
}

function matchesOptionalPattern(value: string | undefined, pattern: string): boolean {
  if (!pattern) {
    return true;
  }

  try {
    return new RegExp(pattern, 'iu').test(value ?? '');
  } catch {
    return (value ?? '').toLowerCase().includes(pattern.toLowerCase());
  }
}

function findAttachTarget(targets: DevToolsTarget[]): DevToolsTarget | undefined {
  const windowTypes = getAttachWindowTypes();
  const titlePattern = getEnv('ELECTRON_ATTACH_TARGET_TITLE');
  const urlPattern = getEnv('ELECTRON_ATTACH_TARGET_URL_PATTERN');
  const excludeUrlPattern = getEnv('ELECTRON_ATTACH_EXCLUDE_TARGET_URL_PATTERN');
  const candidates = targets.filter((target) => {
    const typeMatches = target.type ? windowTypes.includes(target.type) : false;
    const titleMatches = matchesOptionalPattern(target.title, titlePattern);
    const urlMatches = matchesOptionalPattern(target.url, urlPattern);
    const urlExcluded = excludeUrlPattern && matchesOptionalPattern(target.url, excludeUrlPattern);

    return typeMatches && titleMatches && urlMatches && !urlExcluded;
  });

  return (
    candidates.find((target) => target.title && target.url) ??
    candidates.find((target) => target.url) ??
    candidates[0]
  );
}

function targetMatchesCloseFilter(target: DevToolsTarget, selectedTarget: DevToolsTarget): boolean {
  if (target.id && selectedTarget.id && target.id === selectedTarget.id) {
    return false;
  }

  const closeOtherTargets = getBooleanEnv('ELECTRON_ATTACH_CLOSE_OTHER_TARGETS', false);
  const closeEmptyTargets = getBooleanEnv('ELECTRON_ATTACH_CLOSE_EMPTY_TARGETS', true);
  const closeTitlePattern = getEnv('ELECTRON_ATTACH_CLOSE_TARGET_TITLE_PATTERN');
  const closeUrlPattern = getEnv('ELECTRON_ATTACH_CLOSE_TARGET_URL_PATTERN');

  if (closeOtherTargets) {
    return true;
  }

  if (closeEmptyTargets && !(target.title ?? '').trim() && !(target.url ?? '').trim()) {
    return true;
  }

  return (
    (Boolean(closeTitlePattern) && matchesOptionalPattern(target.title, closeTitlePattern)) ||
    (Boolean(closeUrlPattern) && matchesOptionalPattern(target.url, closeUrlPattern))
  );
}

async function callDevToolsJsonEndpoint(endpoint: string): Promise<string> {
  const response = await fetch(`http://${debuggerAddress}${endpoint}`);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }

  return text;
}

async function prepareAttachTarget(selectedTarget: DevToolsTarget): Promise<void> {
  const targets = await fetchDevToolsTargets();
  const targetsToClose = targets.filter((target) =>
    targetMatchesCloseFilter(target, selectedTarget),
  );
  const actions: Array<Record<string, unknown>> = [];

  for (const target of targetsToClose) {
    if (!target.id) {
      continue;
    }

    try {
      const result = await callDevToolsJsonEndpoint(`/json/close/${encodeURIComponent(target.id)}`);
      actions.push({
        action: 'close',
        id: target.id,
        type: target.type,
        title: target.title,
        url: target.url,
        result,
      });
    } catch (error) {
      actions.push({
        action: 'close',
        id: target.id,
        type: target.type,
        title: target.title,
        url: target.url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (selectedTarget.id) {
    try {
      const result = await callDevToolsJsonEndpoint(
        `/json/activate/${encodeURIComponent(selectedTarget.id)}`,
      );
      actions.push({
        action: 'activate',
        id: selectedTarget.id,
        type: selectedTarget.type,
        title: selectedTarget.title,
        url: selectedTarget.url,
        result,
      });
    } catch (error) {
      actions.push({
        action: 'activate',
        id: selectedTarget.id,
        type: selectedTarget.type,
        title: selectedTarget.title,
        url: selectedTarget.url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  const targetsAfterActions = await fetchDevToolsTargets().catch((error: unknown) => [
    {
      error: error instanceof Error ? error.message : String(error),
    },
  ]);

  writeDiagnosticJson('electron-attach-target-actions.json', {
    actedAt: new Date().toISOString(),
    debuggerAddress,
    selectedTarget,
    closeFilters: {
      closeOtherTargets: getBooleanEnv('ELECTRON_ATTACH_CLOSE_OTHER_TARGETS', false),
      closeEmptyTargets: getBooleanEnv('ELECTRON_ATTACH_CLOSE_EMPTY_TARGETS', true),
      title: getEnv('ELECTRON_ATTACH_CLOSE_TARGET_TITLE_PATTERN') || '(none)',
      url: getEnv('ELECTRON_ATTACH_CLOSE_TARGET_URL_PATTERN') || '(none)',
    },
    actions,
    targetsAfterActions,
  });

  lifecycleLog('prepared Electron attach target', {
    selectedTarget: {
      id: selectedTarget.id,
      type: selectedTarget.type,
      title: selectedTarget.title,
      url: selectedTarget.url,
    },
    actions,
    targetsAfterActions,
  });
}

async function waitForAttachTarget(timeoutMs: number): Promise<DevToolsTarget> {
  const startedAt = Date.now();
  let lastError = '';
  let firstStableSeenAt = 0;
  let stableTargetKey = '';
  let lastTargetSummary: Array<Pick<DevToolsTarget, 'id' | 'type' | 'title' | 'url'>> = [];

  while (Date.now() - startedAt <= timeoutMs) {
    try {
      const targets = await fetchDevToolsTargets();
      const target = findAttachTarget(targets);
      lastTargetSummary = targets.map(({ id, type, title, url }) => ({ id, type, title, url }));
      writeDiagnosticJson('electron-attach-targets.json', {
        inspectedAt: new Date().toISOString(),
        debuggerAddress,
        targetFilters: {
          windowTypes: getAttachWindowTypes(),
          title: getEnv('ELECTRON_ATTACH_TARGET_TITLE') || '(any)',
          url: getEnv('ELECTRON_ATTACH_TARGET_URL_PATTERN') || '(any)',
          excludeUrl: getEnv('ELECTRON_ATTACH_EXCLUDE_TARGET_URL_PATTERN') || '(none)',
          stableMs: attachTargetStableMs,
        },
        targets,
        selectedTarget: target,
      });

      if (target) {
        const currentTargetKey = `${target.id ?? ''}|${target.type ?? ''}|${target.title ?? ''}|${
          target.url ?? ''
        }`;

        if (currentTargetKey !== stableTargetKey) {
          stableTargetKey = currentTargetKey;
          firstStableSeenAt = Date.now();
        }

        if (Date.now() - firstStableSeenAt >= attachTargetStableMs) {
          return target;
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  throw new Error(
    `Timed out waiting for a stable Electron DevTools target at ${debuggerAddress} after ${timeoutMs}ms. Last error: ${
      lastError || '(none)'
    }. Last targets: ${JSON.stringify(lastTargetSummary)}`,
  );
}

function writeDiagnosticJson(fileName: string, value: unknown): void {
  fs.mkdirSync(reportPaths.wdioLogs, { recursive: true });
  fs.writeFileSync(
    path.join(reportPaths.wdioLogs, fileName),
    `${JSON.stringify(value, null, 2)}\n`,
  );
}

async function logAttachedWindows(): Promise<void> {
  const diagnostics: Array<{
    index: number;
    handle: string;
    title?: string;
    url?: string;
    error?: string;
  }> = [];
  const originalHandle = await browser.getWindowHandle().catch(() => undefined);
  const handles = await browser.getWindowHandles();

  for (const [index, handle] of handles.entries()) {
    try {
      await browser.switchToWindow(handle);
      diagnostics.push({
        index,
        handle,
        title: await browser.getTitle(),
        url: await browser.getUrl(),
      });
    } catch (error) {
      diagnostics.push({
        index,
        handle,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (originalHandle) {
    await browser.switchToWindow(originalHandle).catch(() => undefined);
  }

  writeDiagnosticJson('electron-attach-windows.json', diagnostics);
  lifecycleLog('attached windows', {
    windowCount: diagnostics.length,
    windows: diagnostics.map(({ index, title, url, error }) => ({ index, title, url, error })),
  });
}

function buildAttachCapability(): WebdriverIO.Capabilities {
  const chromedriverOptions = getChromedriverOptions();

  return {
    browserName: 'chrome',
    'wdio:enforceWebDriverClassic': true,
    'goog:chromeOptions': {
      debuggerAddress,
      windowTypes: getAttachWindowTypes(),
    },
    ...(chromedriverOptions ? { 'wdio:chromedriverOptions': chromedriverOptions } : {}),
  };
}

export const config: WdioTestrunnerConfig = {
  runner: 'local',
  outputDir: reportPaths.wdioLogs,
  specs: ['./src/specs/**/*.spec.ts'],
  suites: {
    smoke: ['./src/specs/smoke/**/*.spec.ts'],
    regression: ['./src/specs/regression/**/*.spec.ts'],
    e2eJson: [
      './e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts',
      './e2e/tests/regression/NBP/TestMaster.e2e-spec.ts',
      './e2e/tests/regression/hardwareSupport-tests/master.e2e-spec.ts',
    ],
    e2eJsonNewMaster: ['./e2e/tests/regression/NEWMASTERSPEC/UpdatedMaster.e2e-spec.ts'],
    e2eJsonNbp: ['./e2e/tests/regression/NBP/TestMaster.e2e-spec.ts'],
    e2eJsonHardware: ['./e2e/tests/regression/hardwareSupport-tests/master.e2e-spec.ts'],
  },
  maxInstances: 1,
  capabilities: [buildAttachCapability()],
  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: waitTimeout,
  connectionRetryTimeout,
  connectionRetryCount,
  services: [],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: reportPaths.allureResults,
        disableMochaHooks: process.env.ALLURE_DISABLE_MOCHA_HOOKS === 'true',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        reportedEnvironmentVars: {
          Framework: 'WDIO Electron Framework',
          'Target app': 'Packaged Electron binary attached by debuggerAddress',
          'Electron version': ELECTRON_VERSION,
          'Node version': process.version,
          Platform: `${process.platform} ${os.release()}`,
          Architecture: process.arch,
          Worker: 'local-attach',
        },
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
  onPrepare: async () => {
    ensureReportDirectories();
    fs.writeFileSync(attachLifecycleLogPath, '');

    const serviceOptions = getElectronServiceOptions();
    const appBinaryPath = serviceOptions.appBinaryPath;

    if (!appBinaryPath) {
      throw new Error('CSDU_EXE_LOCATION or ELECTRON_APP_BINARY_PATH is required.');
    }

    const appArgs = [
      ...(serviceOptions.appArgs ?? []),
      ...getListEnv('ELECTRON_CHROME_ARGS'),
      `--remote-debugging-port=${attachPort}`,
    ];

    lifecycleLog('spawning Electron app', {
      appBinaryPath,
      cwd: dirnameForCurrentHost(appBinaryPath),
      appArgs,
      debuggerAddress,
      attachTimeout,
      connectionRetryTimeout,
    });

    electronProcess = childProcess.spawn(appBinaryPath, appArgs, {
      cwd: dirnameForCurrentHost(appBinaryPath),
      detached: process.platform !== 'win32',
      stdio: 'ignore',
      windowsHide: false,
    });

    const version = await waitForDevToolsEndpoint(attachTimeout);
    writeDiagnosticJson('electron-attach-devtools-version.json', version);
    lifecycleLog('Electron DevTools endpoint is ready', {
      Browser: version.Browser,
      'Protocol-Version': version['Protocol-Version'],
      'User-Agent': version['User-Agent'],
    });

    const attachTarget = await waitForAttachTarget(attachTargetTimeout);
    lifecycleLog('stable Electron DevTools target is ready', {
      id: attachTarget.id,
      type: attachTarget.type,
      title: attachTarget.title,
      url: attachTarget.url,
      stableMs: attachTargetStableMs,
    });
    await prepareAttachTarget(attachTarget);
  },
  onWorkerStart: (cid, _capabilities, specs, args) => {
    const suiteArg = (args as { suite?: unknown }).suite;
    const selectedSuite = Array.isArray(suiteArg) ? String(suiteArg[0]) : undefined;

    if (selectedSuite) {
      process.env.TESTTYPE = selectedSuite;
    }

    lifecycleLog('onWorkerStart', { cid, specs, selectedSuite, testType: process.env.TESTTYPE });
  },
  beforeSession: (_config, capabilities, specs, cid) => {
    writeDiagnosticJson('electron-attach-capability-before-session.json', capabilities);
    lifecycleLog('beforeSession', {
      cid,
      specs,
      browserName: (capabilities as WebdriverIO.Capabilities).browserName,
      chromeOptions: (capabilities as WebdriverIO.Capabilities)['goog:chromeOptions'],
    });
  },
  before: async (_capabilities, specs) => {
    lifecycleLog('before framework hook', { specs, sessionId: browser.sessionId });
    await logAttachedWindows();
  },
  beforeTest: async (test) => {
    lifecycleLog('beforeTest', { title: test.title, fullTitle: test.fullTitle });
    await startEvidenceCapture(test);
  },
  afterTest: async (test, _context, result) => {
    lifecycleLog('afterTest', {
      title: test.title,
      fullTitle: test.fullTitle,
      passed: result.passed,
      error: result.error?.message,
    });
    await attachEvidence(test, result);
  },
  onWorkerEnd: (cid, exitCode, specs) => {
    lifecycleLog('onWorkerEnd', { cid, exitCode, specs });
  },
  onComplete: (exitCode) => {
    lifecycleLog('onComplete', { exitCode });

    if (electronProcess) {
      killProcessTree(electronProcess);
    }
  },
};
