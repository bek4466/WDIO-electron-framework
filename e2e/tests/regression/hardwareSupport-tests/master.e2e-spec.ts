import { defineJsonMasterSuite } from '../../support/json-master-runner.js';

defineJsonMasterSuite({
  title: '[HardwareSupport Master] JSON-driven regression catalog',
  baseDirUrl: import.meta.url,
  suite: 'E2E JSON Hardware',
  folderFilterEnv: 'E2E_JSON_HARDWARE_FOLDERS',
  folders: ['FOX3-tests', 'NAV-tests', 'VCP-tests'],
});
