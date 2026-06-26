import { defineJsonMasterSuite } from '../../support/json-master-runner.js';

const testType = (process.env.TESTTYPE ?? '')
  .replace(/[^a-z0-9]/giu, '')
  .toLowerCase();
const isSmokeRun = ['smoke', 'smoketests'].includes(testType);

defineJsonMasterSuite({
  title: '[UpdatedMasterSpec] JSON-driven regression catalog',
  baseDirUrl: import.meta.url,
  suite: 'E2E JSON',
  folderFilterEnv: 'E2E_JSON_FOLDERS',
  folders: isSmokeRun
    ? ['smoke-tests']
    : [
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
});
