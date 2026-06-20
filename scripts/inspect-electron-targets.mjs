import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const reportDir = path.resolve(process.cwd(), 'reports/wdio-logs');
const outputPath = path.join(reportDir, 'electron-devtools-targets.json');

function getEnv(name, fallback = '') {
  const value = process.env[name];
  return value === undefined || value.trim() === '' ? fallback : value.trim();
}

function getBooleanEnv(name, fallback = false) {
  const value = getEnv(name);

  if (!value) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

function getNumberEnv(name, fallback) {
  const parsed = Number(getEnv(name));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getListEnv(name) {
  return getEnv(name)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function killProcessTree(child) {
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

    child.kill('SIGTERM');
  } catch {
    // Diagnostic cleanup should not hide the target inspection result.
  }
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function pollDevToolsTargets(port, timeoutMs) {
  const startedAt = Date.now();
  let lastError = '';

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const [version, targets] = await Promise.all([
        fetchJson(`http://127.0.0.1:${port}/json/version`),
        fetchJson(`http://127.0.0.1:${port}/json/list`),
      ]);

      return { version, targets };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      await sleep(500);
    }
  }

  throw new Error(
    `Timed out waiting for DevTools targets on port ${port}. Last error: ${lastError}`,
  );
}

async function main() {
  const appBinaryPath = getEnv('CSDU_EXE_LOCATION') || getEnv('ELECTRON_APP_BINARY_PATH');

  if (!appBinaryPath) {
    throw new Error(
      'Set CSDU_EXE_LOCATION or ELECTRON_APP_BINARY_PATH before running this script.',
    );
  }

  if (!fs.existsSync(appBinaryPath) || !fs.statSync(appBinaryPath).isFile()) {
    throw new Error(`Electron app binary does not exist or is not a file: ${appBinaryPath}`);
  }

  const port = getNumberEnv('ELECTRON_TARGET_INSPECT_PORT', 9229);
  const timeoutMs = getNumberEnv('ELECTRON_TARGET_INSPECT_TIMEOUT_MS', 60000);
  const keepAppOpen = getBooleanEnv('ELECTRON_TARGET_INSPECT_KEEP_APP', false);
  const appCwd = getEnv('ELECTRON_APP_CWD') || path.dirname(appBinaryPath);
  const appArgs = [
    ...getListEnv('ELECTRON_APP_ARGS'),
    ...getListEnv('ELECTRON_CHROME_ARGS'),
    `--remote-debugging-port=${port}`,
  ];

  fs.mkdirSync(reportDir, { recursive: true });

  console.log(`[electron-targets] Launching: ${appBinaryPath}`);
  console.log(`[electron-targets] cwd: ${appCwd}`);
  console.log(`[electron-targets] args: ${appArgs.join(' ') || '(none)'}`);

  const child = childProcess.spawn(appBinaryPath, appArgs, {
    cwd: appCwd,
    detached: false,
    stdio: 'ignore',
    windowsHide: false,
  });

  try {
    const result = await pollDevToolsTargets(port, timeoutMs);
    const payload = {
      inspectedAt: new Date().toISOString(),
      appBinaryPath,
      appCwd,
      port,
      version: result.version,
      targets: result.targets,
      targetSummary: result.targets.map((target) => ({
        id: target.id,
        type: target.type,
        title: target.title,
        url: target.url,
        attached: target.attached,
        webSocketDebuggerUrl: target.webSocketDebuggerUrl,
      })),
    };

    fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);

    console.log(`[electron-targets] Wrote ${outputPath}`);
    console.log('[electron-targets] Targets exposed by the app:');
    for (const target of payload.targetSummary) {
      console.log(
        `- type=${target.type || '(unknown)'} title=${JSON.stringify(
          target.title || '',
        )} url=${JSON.stringify(target.url || '')}`,
      );
    }
  } finally {
    if (!keepAppOpen) {
      killProcessTree(child);
    }
  }
}

main().catch((error) => {
  console.error(`[electron-targets] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
