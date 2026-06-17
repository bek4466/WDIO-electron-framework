import { defineJsonMasterSuite } from '../../support/json-master-runner.js';

defineJsonMasterSuite({
  title: '[NBP TestMaster] JSON-driven regression catalog',
  baseDirUrl: import.meta.url,
  suite: 'E2E JSON NBP',
  dataDirName: 'datajson',
  manifestFileName: 'Files.json',
});
