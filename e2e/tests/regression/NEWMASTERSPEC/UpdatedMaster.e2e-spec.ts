import { defineJsonMasterSuite } from '../../support/json-master-runner.js';

const testType = (process.env.TESTTYPE ?? '')
  .replace(/[^a-z0-9]/giu, '')
  .toLowerCase();
const isSmokeRun = ['smoke', 'smoketests'].includes(testType);

const regressionFolders = [
  'Deployment-tests',
  'WCProLL-tests',
  'accessControl-tests',
  'deviceValidation-tests',
  'featureFlag-tests',
  'messagePane-tests',
  'miscellaneous-tests',
  'pairing-tests',
  'projectCredentials-tests',
  'projectDownload-tests',
  'projectEndorsement-tests',
  'protectingSensitiveData-tests',
  'smoke-tests',
  'systemValidation-tests',
  'trace-tests',
];

defineJsonMasterSuite({
  title: '[UpdatedMasterSpec] JSON-driven regression catalog',
  baseDirUrl: import.meta.url,
  suite: 'E2E JSON',
  folderFilterEnv: 'E2E_JSON_FOLDERS',
  folders: isSmokeRun ? ['smoke-tests'] : regressionFolders,
});
