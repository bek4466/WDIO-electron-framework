import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const electronBinaryPath = require('electron');
const rootDir = process.cwd();
const sourceAppDir = path.resolve(rootDir, 'src/fixtures/electron-smoke-app');
const outputDir = path.resolve(rootDir, 'dist/electron-smoke-app');

if (process.env.ELECTRON_APP_BINARY_PATH) {
  process.exit(0);
}

function copySampleApp(resourcesAppDir) {
  fs.rmSync(resourcesAppDir, { recursive: true, force: true });
  fs.mkdirSync(resourcesAppDir, { recursive: true });

  for (const fileName of ['main.cjs', 'preload.cjs', 'index.html']) {
    fs.copyFileSync(path.join(sourceAppDir, fileName), path.join(resourcesAppDir, fileName));
  }

  fs.writeFileSync(
    path.join(resourcesAppDir, 'package.json'),
    `${JSON.stringify(
      {
        name: 'electron-41-smoke-app',
        version: '1.0.0',
        main: 'main.cjs',
      },
      null,
      2,
    )}\n`,
  );
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

if (process.platform === 'darwin') {
  const electronAppPath = path.resolve(electronBinaryPath, '../../..');
  const sampleAppPath = path.join(outputDir, 'Electron.app');
  fs.cpSync(electronAppPath, sampleAppPath, { recursive: true, verbatimSymlinks: true });
  copySampleApp(path.join(sampleAppPath, 'Contents/Resources/app'));
  process.exit(0);
}

const electronDistDir = path.dirname(electronBinaryPath);
fs.cpSync(electronDistDir, outputDir, { recursive: true, verbatimSymlinks: true });
copySampleApp(path.join(outputDir, 'resources/app'));
