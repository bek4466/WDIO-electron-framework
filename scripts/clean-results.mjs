import fs from 'node:fs';
import path from 'node:path';

const includeDist = process.argv.includes('--all') || process.argv.includes('--dist');
const targets = ['reports', 'allure-results', 'allure-report', ...(includeDist ? ['dist'] : [])];

for (const target of targets) {
  fs.rmSync(path.resolve(process.cwd(), target), { recursive: true, force: true });
}
