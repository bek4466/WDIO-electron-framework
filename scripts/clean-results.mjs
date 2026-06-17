import fs from 'node:fs';
import path from 'node:path';

const targets = ['reports', 'allure-results', 'allure-report', 'dist'];

for (const target of targets) {
  fs.rmSync(path.resolve(process.cwd(), target), { recursive: true, force: true });
}
