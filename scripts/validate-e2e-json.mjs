import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const suites = [
  {
    name: 'NEWMASTERSPEC',
    baseDir: path.join(repoRoot, 'e2e/tests/regression/NEWMASTERSPEC'),
    folders: [
      'Deployment-tests',
      'deviceValidation-tests',
      'systemValidation-tests',
      'messagePane-tests',
      'projectCredentials-tests',
      'projectEndorsement-tests',
      'projectDownload-tests',
      'smoke-tests',
      'protectingSensitiveData-tests',
    ],
  },
  {
    name: 'NBP',
    baseDir: path.join(repoRoot, 'e2e/tests/regression/NBP'),
    dataDirName: 'datajson',
    manifestFileName: 'Files.json',
  },
  {
    name: 'HardwareSupport',
    baseDir: path.join(repoRoot, 'e2e/tests/regression/hardwareSupport-tests'),
    folders: ['FOX3-tests', 'NAV-tests', 'VCP-tests'],
  },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readManifest(dataDir, manifestFileName) {
  const names = manifestFileName ? [manifestFileName] : ['files.json', 'Files.json'];
  const manifestPath = names.map((name) => path.join(dataDir, name)).find(fs.existsSync);

  if (!manifestPath) {
    throw new Error(`No manifest found in ${dataDir}`);
  }

  return readJson(manifestPath).filter((fileName) => fileName.endsWith('.json'));
}

function isExecutable(rootExecute, caseId, candidate) {
  if (Array.isArray(rootExecute)) {
    return rootExecute.includes(caseId);
  }

  return candidate.Execute === true || String(candidate.Execute).toLowerCase() === 'true';
}

function getInfo(candidate) {
  return candidate.TestCaseInfo && typeof candidate.TestCaseInfo === 'object'
    ? candidate.TestCaseInfo
    : candidate;
}

function validateCase(suiteName, folder, fileName, caseId, candidate) {
  const info = getInfo(candidate);
  const errors = [];

  if (!info.TestDescription) {
    errors.push('missing TestDescription');
  }

  if (!info.Owner) {
    errors.push('missing Owner');
  }

  if (!info.SuiteType) {
    errors.push('missing SuiteType');
  }

  if (!candidate.Steps && !candidate.VerifyMessage && !candidate.ModifyTestData) {
    errors.push('missing Steps, VerifyMessage, or ModifyTestData');
  }

  return errors.map((error) => `${suiteName}/${folder}/${fileName}/${caseId}: ${error}`);
}

function discoverSuite(suite) {
  const folders = suite.dataDirName ? ['.'] : suite.folders;
  const errors = [];
  let files = 0;
  let cases = 0;

  for (const folder of folders) {
    const dataDir = suite.dataDirName
      ? path.join(suite.baseDir, suite.dataDirName)
      : path.join(suite.baseDir, folder, 'datajson');
    const manifest = readManifest(dataDir, suite.manifestFileName);

    for (const fileName of manifest) {
      const filePath = path.join(dataDir, fileName);
      const fileJson = readJson(filePath);
      files += 1;

      for (const [caseId, candidate] of Object.entries(fileJson)) {
        if (caseId === 'Execute' || !candidate || typeof candidate !== 'object') {
          continue;
        }

        if (!isExecutable(fileJson.Execute, caseId, candidate)) {
          continue;
        }

        cases += 1;
        errors.push(...validateCase(suite.name, folder, fileName, caseId, candidate));
      }
    }
  }

  return { name: suite.name, files, cases, errors };
}

const results = suites.map(discoverSuite);
const errors = results.flatMap((result) => result.errors);

for (const result of results) {
  console.log(`${result.name}: ${result.files} files, ${result.cases} executable cases`);
}

if (errors.length > 0) {
  console.error('\nValidation errors:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
}
