import { defineJsonMasterSuite } from '../../support/json-master-runner.js';

defineJsonMasterSuite({
  title: '[UpdatedMasterSpec] JSON-driven regression catalog',
  baseDirUrl: import.meta.url,
  suite: 'E2E JSON',
  folderFilterEnv: 'E2E_JSON_FOLDERS',
  folders:
    process.env.TESTTYPE === 'smoke'
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
