import fs from 'node:fs';
import path from 'node:path';

export const reportPaths = {
  root: path.resolve(process.cwd(), 'reports'),
  allureResults: path.resolve(process.cwd(), 'reports/allure-results'),
  screenshots: path.resolve(process.cwd(), 'reports/screenshots'),
};

export function ensureReportDirectories(): void {
  for (const directory of Object.values(reportPaths)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}
