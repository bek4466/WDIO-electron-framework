import fs from 'node:fs';
import path from 'node:path';

const expectedVersion = '41.0.0';
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'),
);
const declaredVersion = packageJson.devDependencies?.electron;

if (declaredVersion !== expectedVersion) {
  console.error(
    `Expected devDependencies.electron to be ${expectedVersion}, received ${declaredVersion}`,
  );
  process.exit(1);
}

const installedPackagePath = path.resolve(process.cwd(), 'node_modules/electron/package.json');

if (fs.existsSync(installedPackagePath)) {
  const installedPackage = JSON.parse(fs.readFileSync(installedPackagePath, 'utf8'));

  if (installedPackage.version !== expectedVersion) {
    console.error(
      `Expected installed electron to be ${expectedVersion}, received ${installedPackage.version}`,
    );
    process.exit(1);
  }
}

console.log(`Electron dependency is pinned to ${expectedVersion}`);
