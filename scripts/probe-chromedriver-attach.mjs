import childProcess from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

const require = createRequire(import.meta.url);
const reportDir = path.resolve(process.cwd(), 'reports/wdio-logs');
const resultPath = path.join(reportDir, 'chromedriver-attach-probe.json');
const logPath = path.join(reportDir, 'chromedriver-attach-probe.log');

function getEnv(name, fallback = '') {
  const value = process.env[name];
  return value === undefined || value.trim() === '' ? fallback : value.trim();
}

function getNumberEnv(name, fallback) {
  const parsed = Number(getEnv(name));
  return Number.isFinite(parsed) ? parsed : fallback;
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

function waitForPort(port, timeoutMs) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = net.createConnection({ host: '127.0.0.1', port });

      socket.once('connect', () => {
        socket.end();
        resolve();
      });
      socket.once('error', (error) => {
        socket.destroy();

        if (Date.now() - startedAt >= timeoutMs) {
          reject(error);
          return;
        }

        setTimeout(tryConnect, 250);
      });
    };

    tryConnect();
  });
}

async function webdriverRequest(port, method, endpoint, body) {
  const response = await fetch(`http://127.0.0.1:${port}${endpoint}`, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
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

async function inspectSession(port, sessionId) {
  const handlesResponse = await webdriverRequest(
    port,
    'GET',
    `/session/${sessionId}/window/handles`,
  );
  const handles = handlesResponse.value || [];
  const windows = [];

  for (const [index, handle] of handles.entries()) {
    const windowInfo = { index, handle };

    try {
      await webdriverRequest(port, 'POST', `/session/${sessionId}/window`, { handle });
      const [titleResponse, urlResponse] = await Promise.all([
        webdriverRequest(port, 'GET', `/session/${sessionId}/title`),
        webdriverRequest(port, 'GET', `/session/${sessionId}/url`),
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
  const port = getNumberEnv('CHROMEDRIVER_ATTACH_PROBE_PORT', 9517);
  const startupTimeoutMs = getNumberEnv('CHROMEDRIVER_ATTACH_PROBE_TIMEOUT_MS', 30000);
  const windowTypes = getListEnv('ELECTRON_CHROME_WINDOW_TYPES', ['page', 'app', 'webview']);

  if (!fs.existsSync(chromedriverPath)) {
    throw new Error(`ChromeDriver binary does not exist: ${chromedriverPath}`);
  }

  console.log(`[chromedriver-probe] chromedriver: ${chromedriverPath}`);
  console.log(`[chromedriver-probe] debuggerAddress: ${debuggerAddress}`);
  console.log(`[chromedriver-probe] windowTypes: ${windowTypes.join(', ')}`);

  const driver = childProcess.spawn(
    chromedriverPath,
    [
      `--port=${port}`,
      '--allowed-origins=*',
      '--allowed-ips=0.0.0.0',
      `--log-path=${logPath}`,
      '--verbose',
    ],
    {
      stdio: 'ignore',
      windowsHide: true,
    },
  );
  const driverStartupError = new Promise((_, reject) => {
    driver.once('error', (error) => {
      reject(error);
    });
  });

  let sessionId;

  try {
    await Promise.race([waitForPort(port, startupTimeoutMs), driverStartupError]);

    const sessionResponse = await webdriverRequest(port, 'POST', '/session', {
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

    const windows = await inspectSession(port, sessionId);
    const result = {
      inspectedAt: new Date().toISOString(),
      chromedriverPath,
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
      await webdriverRequest(port, 'DELETE', `/session/${sessionId}`).catch(() => undefined);
    }

    if (driver.pid) {
      driver.kill();
    }
  }
}

main().catch((error) => {
  console.error(`[chromedriver-probe] ${error instanceof Error ? error.message : String(error)}`);
  console.error(`[chromedriver-probe] See log: ${logPath}`);
  process.exitCode = 1;
});
