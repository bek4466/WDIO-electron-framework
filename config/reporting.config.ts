import fs from 'node:fs';
import path from 'node:path';

export const reportPaths = {
  root: path.resolve(process.cwd(), 'reports'),
  allureResults: path.resolve(process.cwd(), 'reports/allure-results'),
  allureReport: path.resolve(process.cwd(), 'reports/allure-report'),
  screenshots: path.resolve(process.cwd(), 'reports/screenshots'),
  videos: path.resolve(process.cwd(), 'reports/videos'),
  wdioLogs: path.resolve(process.cwd(), 'reports/wdio-logs'),
};

export function ensureReportDirectories(): void {
  for (const directory of Object.values(reportPaths)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}
