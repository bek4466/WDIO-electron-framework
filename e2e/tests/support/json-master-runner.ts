import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import allureReporter from '@wdio/allure-reporter';
import { expect } from 'chai';
import { annotateTest, allureStep, attachJson } from '../../../src/support/allure.js';
import { bootstrapLiveJsonSession, executeJsonCaseLive } from './json-live-executor.js';

type JsonRecord = Record<string, unknown>;

type MasterSuiteConfig = {
  title: string;
  baseDirUrl: string;
  suite: 'E2E JSON' | 'E2E JSON Hardware' | 'E2E JSON NBP';
  folders?: string[];
  dataDirName?: string;
  manifestFileName?: string;
  folderFilterEnv?: string;
};

type NormalizedCase = {
  id: string;
  sourceFile: string;
  sourceFolder: string;
  raw: JsonRecord;
  info: JsonRecord;
  description: string;
  owner: string;
  suiteType: string;
  userStory: string;
  projectFile?: string;
};

const defaultLimit = Number(process.env.E2E_JSON_LIMIT ?? 0);
const executionMode = (process.env.E2E_JSON_EXECUTION_MODE ?? 'catalog').toLowerCase();
const fileFilters = parseEnvList('E2E_JSON_FILES').map((fileName) => path.basename(fileName));
const caseFilters = parseEnvList('E2E_JSON_CASES');
const includeManifestTest = parseBooleanEnv(
  'E2E_JSON_INCLUDE_MANIFEST_TEST',
  fileFilters.length === 0 && caseFilters.length === 0,
);

function debugLog(message: string, details?: JsonRecord): void {
  const suffix = details ? ` ${JSON.stringify(details)}` : '';
  console.info(`[E2E JSON][${new Date().toISOString()}] ${message}${suffix}`);
}

function parseEnvList(name: string): string[] {
  return (process.env[name] ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBooleanEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name];

  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function safeReadJson(filePath: string): JsonRecord {
  return fs.existsSync(filePath) ? readJsonFile<JsonRecord>(filePath) : {};
}

function toStringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function stripQuotes(value: string): string {
  return value.trim().replace(/^["']|["']$/g, '').trim();
}

function parseLink(value: unknown): Array<{ name: string; url: string }> {
  const values = Array.isArray(value) ? value : [value];

  return values
    .filter((item): item is string => typeof item === 'string')
    .map((item) => {
      const [name = '', ...urlParts] = item.split(',');
      return {
        name: stripQuotes(name),
        url: stripQuotes(urlParts.join(',')),
      };
    })
    .filter((link) => link.name !== '' && link.url !== '');
}

function sanitizeForReport(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForReport(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as JsonRecord).map(([key, entry]) => [
        key,
        /password|pass|secret|token|activation|key/i.test(key)
          ? '[redacted]'
          : sanitizeForReport(entry),
      ]),
    );
  }

  return value;
}

function replaceTokens(value: JsonRecord, repoRoot: string): JsonRecord {
  const dataTokens = safeReadJson(path.join(repoRoot, 'e2e/src/JSON/dataTool.json'));
  const deviceTokens = safeReadJson(path.join(repoRoot, 'e2e/src/JSON/deviceData.json'));
  const resourceRoot = process.env.E2E_RESOURCE_ROOT ?? path.join(repoRoot, 'e2e/resources');
  const tokenMap = {
    ...dataTokens,
    ...deviceTokens,
    ResourceDirectory: resourceRoot,
  };

  let serialized = JSON.stringify(value);

  for (const [key, replacement] of Object.entries(tokenMap)) {
    const token = new RegExp(`<<${key}>>`, 'g');
    const replacementValue = String(replacement).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    serialized = serialized.replace(token, replacementValue);
  }

  return JSON.parse(serialized) as JsonRecord;
}

function isExecutableCase(rootExecute: unknown, caseId: string, candidate: JsonRecord): boolean {
  if (Array.isArray(rootExecute)) {
    return rootExecute.includes(caseId);
  }

  const executeValue = candidate.Execute;
  return executeValue === true || String(executeValue).toLowerCase() === 'true';
}

function normalizeCase(
  id: string,
  sourceFile: string,
  sourceFolder: string,
  candidate: JsonRecord,
): NormalizedCase {
  const info = (candidate.TestCaseInfo && typeof candidate.TestCaseInfo === 'object'
    ? candidate.TestCaseInfo
    : candidate) as JsonRecord;

  return {
    id,
    sourceFile,
    sourceFolder,
    raw: candidate,
    info,
    description: toStringValue(info.TestDescription, id),
    owner: toStringValue(info.Owner, 'QA Automation'),
    suiteType: toStringValue(info.SuiteType, sourceFolder),
    userStory: toStringValue(info.UserStory, sourceFolder),
    projectFile: toStringValue(info.ProjectFile, undefined),
  };
}

function validateCase(testCase: NormalizedCase): string[] {
  const errors: string[] = [];

  if (!testCase.description) {
    errors.push('TestDescription is required.');
  }

  if (!testCase.owner) {
    errors.push('Owner is required.');
  }

  if (!testCase.suiteType) {
    errors.push('SuiteType is required.');
  }

  if (!testCase.raw.Steps && !testCase.raw.VerifyMessage && !testCase.raw.ModifyTestData) {
    errors.push('At least one Steps, VerifyMessage, or ModifyTestData block is expected.');
  }

  return errors;
}

function resolveFolders(baseDir: string, config: MasterSuiteConfig): string[] {
  const envFilter = config.folderFilterEnv ? process.env[config.folderFilterEnv] : undefined;

  if (envFilter) {
    return envFilter
      .split(',')
      .map((folder) => folder.trim())
      .filter(Boolean);
  }

  if (config.folders?.length) {
    return config.folders;
  }

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((folder) => fs.existsSync(path.join(baseDir, folder, 'datajson')));
}

function readManifest(dataDir: string, manifestFileName?: string): string[] {
  const manifestNames = manifestFileName ? [manifestFileName] : ['files.json', 'Files.json'];
  const manifestPath = manifestNames
    .map((name) => path.join(dataDir, name))
    .find((candidate) => fs.existsSync(candidate));

  if (!manifestPath) {
    return [];
  }

  return readJsonFile<string[]>(manifestPath).filter((fileName) => fileName.endsWith('.json'));
}

function matchesFileFilter(fileName: string): boolean {
  if (fileFilters.length === 0) {
    return true;
  }

  return fileFilters.includes(path.basename(fileName));
}

function matchesCaseFilter(caseId: string): boolean {
  if (caseFilters.length === 0) {
    return true;
  }

  return caseFilters.includes(caseId);
}

function discoverCases(config: MasterSuiteConfig): NormalizedCase[] {
  const baseDir = path.dirname(fileURLToPath(config.baseDirUrl));
  const repoRoot = path.resolve(baseDir, '../../../..');
  const discoveredCases: NormalizedCase[] = [];
  const folders = config.dataDirName ? ['.'] : resolveFolders(baseDir, config);

  debugLog('Discovering JSON cases', {
    title: config.title,
    baseDir,
    executionMode,
    limit: defaultLimit || 'none',
    folders,
    fileFilters: fileFilters.length > 0 ? fileFilters : 'none',
    caseFilters: caseFilters.length > 0 ? caseFilters : 'none',
  });

  for (const folder of folders) {
    const dataDir = config.dataDirName
      ? path.join(baseDir, config.dataDirName)
      : path.join(baseDir, folder, 'datajson');
    const manifest = readManifest(dataDir, config.manifestFileName);

    debugLog('Reading JSON manifest', {
      folder,
      dataDir,
      manifestCount: manifest.length,
    });

    for (const fileName of manifest.filter(matchesFileFilter)) {
      const filePath = path.join(dataDir, fileName);
      const fileJson = replaceTokens(readJsonFile<JsonRecord>(filePath), repoRoot);
      const rootExecute = fileJson.Execute;

      for (const [caseId, candidate] of Object.entries(fileJson)) {
        if (caseId === 'Execute' || !candidate || typeof candidate !== 'object') {
          continue;
        }

        const candidateRecord = candidate as JsonRecord;

        if (!isExecutableCase(rootExecute, caseId, candidateRecord)) {
          continue;
        }

        if (!matchesCaseFilter(caseId)) {
          continue;
        }

        discoveredCases.push(normalizeCase(caseId, fileName, folder, candidateRecord));
        debugLog('Discovered executable JSON case', {
          folder,
          fileName,
          caseId,
        });
      }
    }
  }

  const limitedCases = defaultLimit > 0 ? discoveredCases.slice(0, defaultLimit) : discoveredCases;

  debugLog('Finished JSON case discovery', {
    discovered: discoveredCases.length,
    selected: limitedCases.length,
  });

  return limitedCases;
}

async function addLinks(testCase: NormalizedCase): Promise<void> {
  for (const field of ['UserStoryLink', 'TaskLink', 'TestCaseLink']) {
    for (const link of parseLink(testCase.info[field])) {
      await allureReporter.addLink(link.url, link.name);
    }
  }
}

function summarizeActions(testCase: NormalizedCase): JsonRecord {
  const steps = testCase.raw.Steps;

  return {
    mode: executionMode,
    sourceFolder: testCase.sourceFolder,
    sourceFile: testCase.sourceFile,
    projectFile: testCase.projectFile,
    stepKeys: steps && typeof steps === 'object' ? Object.keys(steps as JsonRecord) : [],
    hasCredentials: Array.isArray(testCase.raw.Credentials),
    hasPreconditions: Boolean(testCase.raw.Preconditions),
    hasVerifyMessage: Boolean(testCase.raw.VerifyMessage),
  };
}

export function defineJsonMasterSuite(config: MasterSuiteConfig): void {
  const cases = discoverCases(config);

  describe(config.title, () => {
    if (cases.length === 0) {
      it('discovers matching JSON-driven test cases', async () => {
        await attachJson('JSON discovery filters', {
          folders: config.folderFilterEnv ? process.env[config.folderFilterEnv] || 'default' : 'default',
          fileFilters: fileFilters.length > 0 ? fileFilters : 'none',
          caseFilters: caseFilters.length > 0 ? caseFilters : 'none',
          executionMode,
        });

        expect(cases.length).to.be.greaterThan(0);
      });
    }

    if (includeManifestTest) {
      it('loads JSON-driven test cases from manifests', async () => {
        await annotateTest({
          suite: config.suite,
          epic: 'Data-driven E2E',
          feature: 'JSON manifest loading',
          story: config.title,
          severity: 'critical',
          owner: 'QA Automation',
          tags: ['e2e-json', 'manifest'],
          description: 'Verifies that the master spec can discover executable JSON test cases.',
        });

        await attachJson('Discovered case summary', {
          total: cases.length,
          limit: defaultLimit || 'none',
          executionMode,
          fileFilters: fileFilters.length > 0 ? fileFilters : 'none',
          caseFilters: caseFilters.length > 0 ? caseFilters : 'none',
        });

        expect(cases.length).to.be.greaterThan(0);
      });
    }

    for (const testCase of cases) {
      it(`[${testCase.sourceFolder}/${testCase.sourceFile}] ${testCase.id} - ${testCase.description}`, async () => {
        debugLog('Starting JSON test case', {
          caseId: testCase.id,
          sourceFolder: testCase.sourceFolder,
          sourceFile: testCase.sourceFile,
          executionMode,
        });
        await annotateTest({
          suite: config.suite,
          epic: testCase.userStory,
          feature: testCase.suiteType,
          story: testCase.description,
          severity: 'normal',
          owner: testCase.owner,
          tags: ['e2e-json', testCase.sourceFolder, testCase.sourceFile],
          description: `Data-driven case loaded from \`${testCase.sourceFile}\` in \`${testCase.sourceFolder}\`.`,
        });
        await addLinks(testCase);

        await allureStep('Validate JSON test case structure', async () => {
          expect(validateCase(testCase)).to.deep.equal([]);
        });

        await attachJson('E2E JSON action summary', summarizeActions(testCase));
        await attachJson('E2E JSON test case', sanitizeForReport(testCase.raw));

        if (executionMode === 'live') {
          debugLog('Starting live JSON test bootstrap', {
            title: config.title,
            caseId: testCase.id,
          });
          await bootstrapLiveJsonSession();
          debugLog('Finished live JSON test bootstrap', {
            title: config.title,
            caseId: testCase.id,
          });

          await allureStep('Execute JSON case against live Electron UI', () =>
            executeJsonCaseLive({
              id: testCase.id,
              raw: testCase.raw,
              projectFile: testCase.projectFile,
              sourceFolder: testCase.sourceFolder,
              sourceFile: testCase.sourceFile,
            }),
          );
        } else if (executionMode !== 'catalog') {
          throw new Error(
            `Unsupported E2E_JSON_EXECUTION_MODE "${executionMode}". Use "catalog" or "live".`,
          );
        }

        debugLog('Finished JSON test case', {
          caseId: testCase.id,
          sourceFolder: testCase.sourceFolder,
          sourceFile: testCase.sourceFile,
          executionMode,
        });
      });
    }
  });
}
