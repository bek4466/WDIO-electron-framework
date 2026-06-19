import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';
import { expect } from 'chai';
import { allureStep, attachJson } from '../../../src/support/allure.js';

type JsonRecord = Record<string, unknown>;

export type LiveJsonCase = {
  id: string;
  raw: JsonRecord;
  projectFile?: string;
  sourceFolder: string;
  sourceFile: string;
};

type ExecutionContext = {
  repoRoot: string;
  resourceRoot: string;
  currentProjectFile?: string;
  savedDates: Map<string, number>;
  tempFile?: Buffer;
  unsupported: string[];
};

const waitTimeout = Number(process.env.WAIT_TIMEOUT_MS ?? 10000);
const resourceRootEnv = process.env.E2E_RESOURCE_ROOT;
const strictUnsupported = process.env.E2E_JSON_STRICT_UNSUPPORTED !== 'false';

function readJson(fileName: string): JsonRecord {
  const filePath = path.join(process.cwd(), 'e2e/src/JSON', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonRecord;
}

const locators = readJson('locators.json');
const deploymentLocators = readJson('deploymentLocators.json');
const messagePaneLocators = readJson('messagePaneLocators.json');
const profileLocators = readJson('profileLocators.json');
const aboutLocators = readJson('aboutLocators.json');
const traceLocators = readJson('traceLocators.json');
const downloadLocators = readJson('downloadRecoveryLocators.json');
const accessControlLocators = readJson('accessControlLocators.json');
const credentialLocators = readJson('userSettingsCredsLocators.json');
const protectLocators = readJson('protectProject.json');
const extractLocators = readJson('extractProject.json');
const timeoutValues = readJson('timeout.json');

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function normalizeKey(value: string): string {
  return value
    .replace(/_\d+$/u, '')
    .replace(/\d+$/u, '')
    .replace(/[^a-z0-9]/giu, '')
    .toLowerCase();
}

function findValueByPath(source: JsonRecord, dottedPath: string): unknown {
  return dottedPath.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    return (current as JsonRecord)[key];
  }, source);
}

function selectorFrom(source: JsonRecord, dottedPath: string): string | undefined {
  const value = findValueByPath(source, dottedPath);
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function selectorByLooseKey(source: JsonRecord, key: string): string | undefined {
  const wanted = normalizeKey(key);
  const stack: Array<[string, unknown]> = Object.entries(source);

  while (stack.length > 0) {
    const [currentKey, value] = stack.shift() as [string, unknown];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      stack.push(...Object.entries(value as JsonRecord));
      continue;
    }

    if (typeof value === 'string' && normalizeKey(currentKey) === wanted && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function rowNumber(rowKey: string): number | undefined {
  const match = rowKey.match(/row[_-]?(\d+)/iu);

  if (!match) {
    return undefined;
  }

  return Number(match[1]) + 1;
}

function credentialCellSelector(column: string, rowKey: string): string | undefined {
  const row = rowNumber(rowKey);

  if (!row) {
    return undefined;
  }

  const columnMap: Record<string, string> = {
    devicename: `DeviceNameCol.row${row}DeviceName`,
    address: `IPaddressCol.row${row}IPaddress`,
    usernamefield: `UserNameCol.row${row}UserName`,
    passwordfield: `PasswordCol.row${row}Password`,
  };

  return selectorFrom(credentialLocators, columnMap[normalizeKey(column)] ?? '');
}

function getSelector(pathParts: string[]): string | undefined {
  const normalized = pathParts.map(normalizeKey);
  const last = pathParts.at(-1) ?? '';
  const joined = normalized.join('.');

  const explicit: Record<string, string | undefined> = {
    'deploypage.projectfilepathinput': selectorFrom(deploymentLocators, 'destinyInputField'),
    'deploypage.deploybtn': selectorFrom(deploymentLocators, 'deployBtn'),
    'deploypage.deploycodeonlybtn': selectorFrom(locators, 'deployCodeOnlyButtonElem'),
    'deploypage.certifyprojectbtn': selectorFrom(deploymentLocators, 'endorseBtn'),
    'deploypage.projectcredentialsbtn': selectorFrom(credentialLocators, 'userSettingsBtn'),
    'deploypage.downloadprojectinput': selectorFrom(downloadLocators, 'downloadInputAddressText'),
    'deploypage.downloadprojectbtn': selectorFrom(downloadLocators, 'downloadBtn'),
    'deploypage.protectprojectbtn': selectorFrom(protectLocators, 'protectProjectButton'),
    'deploypage.extractprojectbtn': selectorFrom(extractLocators, 'extractProjectButton'),
    'deploypage.messagepane': selectorFrom(messagePaneLocators, 'messagesBtn'),
    'troubleshootingpage.starttracebtn': selectorFrom(traceLocators, 'startTraceBtn'),
    'troubleshootingpage.refreshlogbtn': selectorFrom(programLogLocators(), 'refreshBtn'),
    'troubleshootingpage.startprogrambtn': selectorFrom(programLogLocators(), 'startProgramBtn'),
    'profilepage.titletext': selectorFrom(profileLocators, 'titleText'),
    'profilepage.licensetitle': selectorFrom(profileLocators, 'licenseText'),
    'profilepage.expirationtext': selectorFrom(profileLocators, 'expirationText'),
    'profilepage.statustext': selectorFrom(profileLocators, 'statusText'),
    'profilepage.remainingdaystext': selectorFrom(profileLocators, 'remainderDaysText'),
    'profilepage.lastreneweddatetext': selectorFrom(profileLocators, 'lastRenewed'),
    'profilepage.renewbtn': selectorFrom(profileLocators, 'renewBtn'),
    'banner.bannertext': selectorFrom(credentialLocators, 'bannerText'),
    'banner.openhelpbutton': selectorFrom(credentialLocators, 'openFileHelp'),
    'banner.banneroverwritebutton': selectorFrom(credentialLocators, 'overWriteCredentials'),
    'banner.bannerexitbutton': selectorFrom(credentialLocators, 'bannerExitButton'),
    'toast.verifymessage': selectorByLooseKey(readJson('toastLocators.json'), 'toastText'),
    'loginpage.signinbtn': selectorFrom(accessControlLocators, 'signInBtn'),
    'loginpopup.closepopup': selectorFrom(accessControlLocators, 'popUpCloseBtn'),
    'signoutpopup.signoutbtn': selectorFrom(accessControlLocators, 'popUpSignOutBtn'),
    'signoutpopup.cancelbtn': selectorFrom(accessControlLocators, 'popUpSignOutCancelBtn'),
  };

  for (const [key, selector] of Object.entries(explicit)) {
    if (joined.endsWith(key) && selector) {
      return selector;
    }
  }

  if (normalized.includes('projectcredentialspopup') && pathParts.length >= 3) {
    const [column, row] = pathParts.slice(-2);
    const selector = credentialCellSelector(column, row);

    if (selector) {
      return selector;
    }

    const popupSelector = selectorByLooseKey(credentialLocators, last);
    if (popupSelector) {
      return popupSelector;
    }
  }

  if (normalized.includes('projectdownloadsidepanel')) {
    const selector = selectorByLooseKey(downloadLocators, last);
    if (selector) {
      return selector;
    }
  }

  if (normalized.includes('protectprojectpopup')) {
    const aliases: Record<string, string> = {
      passwordinputbox: 'passwordField',
      reenterpasswordinputbox: 'passwordFieldConfirm',
      allowdeployandtroubleshootwithoutpasswordcheckbox: 'checkAllowDeployTroubleshooting',
      selectbtn: 'selectLocationBtn',
      createbtn: 'protectCreateBtn',
      cancelbtn: 'cancelBtn',
      successlink: 'successMessageWithLink',
    };
    return selectorByLooseKey(protectLocators, aliases[normalizeKey(last)] ?? last);
  }

  if (normalized.includes('extractprojectpopup')) {
    const aliases: Record<string, string> = {
      passwordinputbox: 'extractProjectPasswordField',
      selectbtn: 'extractProjectSelectLocation',
      extractbtn: 'extractButtonPopUp',
      cancelbtn: 'extractProjectCancelButton',
      successlink: 'extractProjectSuccessMessageBanner',
      passwordfailmsg: 'extractProjectErrorMessage',
      dismissbtn: 'corruptExtractPopUpDismissButton',
      xbtn: 'corruptExtractXIcon',
      mainmessage: 'corruptExtracttPopUpMainMessage',
      title: 'corruptExtractPopUpTitle',
    };
    return selectorByLooseKey(extractLocators, aliases[normalizeKey(last)] ?? last);
  }

  return [
    locators,
    deploymentLocators,
    messagePaneLocators,
    profileLocators,
    aboutLocators,
    traceLocators,
    downloadLocators,
    accessControlLocators,
    credentialLocators,
    protectLocators,
    extractLocators,
  ]
    .map((source) => selectorByLooseKey(source, last))
    .find((selector): selector is string => Boolean(selector));
}

function programLogLocators(): JsonRecord {
  return readJson('programLogLocators.json');
}

function waitMs(name: unknown): number {
  const value = timeoutValues[asString(name)];
  return typeof value === 'number' ? value : Number(value ?? waitTimeout);
}

function resolveResourcePath(context: ExecutionContext, value: string): string {
  const normalized = value.replace(/\\/gu, path.sep);

  if (path.isAbsolute(normalized)) {
    return normalized;
  }

  return path.resolve(context.resourceRoot, normalized);
}

function resolveProjectFile(context: ExecutionContext, projectFile?: string): string | undefined {
  return projectFile ? resolveResourcePath(context, projectFile) : undefined;
}

function tempProjectPath(projectPath: string): string {
  const parsed = path.parse(projectPath);
  const baseName = parsed.name.endsWith('Tmp') ? parsed.name : `${parsed.name}Tmp`;
  return path.join(parsed.dir, `${baseName}${parsed.ext}`);
}

function copyAssociatedProjectFiles(source: string, destination: string): void {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);

  for (const suffix of ['-credential.dat', '-certification.dat']) {
    const sourceSidecar = source.replace(/\.json$/iu, suffix);
    const destinationSidecar = destination.replace(/\.json$/iu, suffix);

    if (fs.existsSync(sourceSidecar)) {
      fs.copyFileSync(sourceSidecar, destinationSidecar);
    }
  }
}

function setByDottedPath(target: JsonRecord, dottedPath: string, value: unknown): void {
  const parts = dottedPath.split('.');
  const last = parts.pop();
  let current: JsonRecord = target;

  if (!last) {
    return;
  }

  for (const part of parts) {
    const existing = current[part];

    if (!existing || typeof existing !== 'object') {
      current[part] = {};
    }

    current = current[part] as JsonRecord;
  }

  current[last] = value;
}

function deleteByDottedPath(target: JsonRecord, dottedPath: string): void {
  const parts = dottedPath.split('.');
  const last = parts.pop();
  let current: JsonRecord = target;

  if (!last) {
    return;
  }

  for (const part of parts) {
    const existing = current[part];

    if (!existing || typeof existing !== 'object') {
      return;
    }

    current = existing as JsonRecord;
  }

  delete current[last];
}

function applyJsonMutations(projectFile: string, mutations: JsonRecord): void {
  const projectJson = JSON.parse(fs.readFileSync(projectFile, 'utf8')) as JsonRecord;

  for (const [operation, entries] of Object.entries(mutations)) {
    const operationName = normalizeKey(operation);
    const mutationEntries = asRecord(entries);

    for (const [dottedPath, value] of Object.entries(mutationEntries)) {
      if (operationName === 'deletetestdata' || operationName === 'deletedata') {
        deleteByDottedPath(projectJson, dottedPath);
      } else {
        setByDottedPath(projectJson, dottedPath, value);
      }
    }
  }

  fs.writeFileSync(projectFile, `${JSON.stringify(projectJson, null, 2)}\n`);
}

async function ensureRendererReady(): Promise<void> {
  await allureStep('Wait for Electron renderer readiness', async () => {
    const expectedTitle = process.env.E2E_APP_READY_TITLE;
    const readySelector = process.env.E2E_APP_READY_SELECTOR;

    await browser.waitUntil(
      async () => {
        const handles = await browser.getWindowHandles();

        for (const handle of handles) {
          await browser.switchToWindow(handle);
          const title = await browser.getTitle().catch(() => '');
          const readyState = await browser.execute(() => document.readyState).catch(() => '');

          if (expectedTitle && !title.includes(expectedTitle)) {
            continue;
          }

          if (readySelector) {
            const element = await browser.$(readySelector);
            return element.isExisting().catch(() => false);
          }

          return readyState === 'interactive' || readyState === 'complete';
        }

        return false;
      },
      {
        timeout: Number(process.env.E2E_APP_READY_TIMEOUT_MS ?? 60000),
        timeoutMsg:
          'Electron renderer did not reach the configured ready state. Check E2E_APP_READY_TITLE/E2E_APP_READY_SELECTOR.',
      },
    );
  });
}

async function findElement(selector: string): Promise<WebdriverIO.Element> {
  if (!selector) {
    throw new Error('Cannot find element because selector mapping resolved to an empty value.');
  }

  const element = await browser.$(selector);
  await element.waitForExist({ timeout: waitTimeout });
  return element as unknown as WebdriverIO.Element;
}

async function setUploadPath(selector: string, filePath: string): Promise<void> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Project file does not exist: ${absolutePath}`);
  }

  await browser.execute((targetSelector) => {
    const element = document.querySelector(targetSelector) as HTMLElement | null;
    if (element) {
      element.style.display = 'block';
      element.removeAttribute('disabled');
    }
  }, selector);

  const element = await findElement(selector);
  await element.setValue(absolutePath);

  await browser.execute((targetSelector) => {
    const element = document.querySelector(targetSelector) as HTMLElement | null;
    if (element) {
      element.style.display = 'none';
    }
  }, selector);
}

async function executeElementOperation(
  context: ExecutionContext,
  pathParts: string[],
  operation: string,
  value: unknown,
): Promise<void> {
  const selector = getSelector(pathParts);
  const operationName = normalizeKey(operation);
  const label = `${pathParts.join('.')} -> ${operation}`;

  if (!selector) {
    context.unsupported.push(`No selector mapping for ${label}`);
    return;
  }

  await allureStep(label, async () => {
    if (operationName === 'setpath') {
      const targetPath = resolveResourcePath(context, asString(value));
      context.currentProjectFile = targetPath.endsWith('.json') ? targetPath : context.currentProjectFile;
      await setUploadPath(selector, targetPath);
      return;
    }

    const element = await findElement(selector);

    if (operationName === 'click') {
      await element.click();
      return;
    }

    if (['setip', 'setpassword', 'setvalue', 'setdownload', 'type'].includes(operationName)) {
      await element.setValue(String(value ?? ''));
      return;
    }

    if (['clearinput', 'clearpath', 'clearvalue'].includes(operationName)) {
      await element.clearValue();
      return;
    }

    if (operationName === 'exists') {
      const expected = value === null ? true : Boolean(value);
      expect(await element.isExisting()).to.equal(expected);
      return;
    }

    if (operationName === 'isvisible') {
      const expected = value === null ? true : Boolean(value);
      expect(await element.isDisplayed()).to.equal(expected);
      return;
    }

    if (operationName === 'isenabled') {
      const expected = value === null ? true : Boolean(value);
      expect(await element.isEnabled()).to.equal(expected);
      return;
    }

    if (operationName === 'isdisabled') {
      const expected = value === null ? true : Boolean(value);
      expect(await element.isEnabled()).to.equal(!expected);
      return;
    }

    if (operationName === 'isempty') {
      const text = (await element.getValue().catch(() => element.getText())).trim();
      expect(text).to.equal('');
      return;
    }

    if (['matches', 'matchestext', 'textmatches', 'verifydeviceinfo'].includes(operationName)) {
      const text = await element.getText();
      expect(text).to.contain(String(value ?? ''));
      return;
    }

    if (operationName === 'isopen') {
      expect(await element.isDisplayed()).to.equal(value === null ? true : Boolean(value));
      return;
    }

    context.unsupported.push(`Unsupported operation ${label}`);
  });
}

async function executePageBlock(
  context: ExecutionContext,
  blockName: string,
  block: JsonRecord,
  pathParts: string[] = [blockName],
): Promise<void> {
  for (const [key, value] of Object.entries(block)) {
    const childPath = [...pathParts, key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const record = value as JsonRecord;
      const operationEntries = Object.entries(record).filter(
        ([operation, operationValue]) =>
          !operationValue || typeof operationValue !== 'object' || Array.isArray(operationValue),
      );
      const nestedEntries = Object.entries(record).filter(
        ([, operationValue]) =>
          operationValue && typeof operationValue === 'object' && !Array.isArray(operationValue),
      );

      for (const [operation, operationValue] of operationEntries) {
        await executeElementOperation(context, childPath, operation, operationValue);
      }

      for (const [nestedKey, nestedValue] of nestedEntries) {
        await executePageBlock(context, blockName, { [nestedKey]: nestedValue }, childPath);
      }

      continue;
    }

    context.unsupported.push(`Unsupported page block value at ${childPath.join('.')}`);
  }
}

async function setCredentials(credentials: unknown): Promise<void> {
  if (!Array.isArray(credentials) || credentials.length === 0) {
    return;
  }

  await allureStep('Enter project credentials from JSON data', async () => {
    const settingsButton = await findElement(selectorFrom(credentialLocators, 'userSettingsBtn') ?? '');
    await settingsButton.click();

    for (const [index, credential] of credentials.entries()) {
      const row = index + 1;
      const record = asRecord(credential);
      const usernameSelector = selectorFrom(credentialLocators, `UserNameCol.row${row}UserName`);
      const passwordSelector = selectorFrom(credentialLocators, `PasswordCol.row${row}Password`);

      if (usernameSelector && record.user) {
        const userCell = await findElement(usernameSelector);
        await userCell.doubleClick();
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');
        await browser.keys(String(record.user));
      }

      if (passwordSelector && record.pass) {
        const passwordCell = await findElement(passwordSelector);
        await passwordCell.doubleClick();
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');
        await browser.keys(String(record.pass));
      }
    }

    const saveSelector = selectorFrom(credentialLocators, 'saveConnectionManagerButton');
    if (saveSelector) {
      await (await findElement(saveSelector)).click();
    }
  });
}

async function executeAction(context: ExecutionContext, action: string, testCase: JsonRecord): Promise<void> {
  const actionName = normalizeKey(action);

  await allureStep(`Execute JSON action: ${action}`, async () => {
    if (actionName === 'deploy') {
      const projectFile = context.currentProjectFile ?? resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectFile));

      if (!projectFile) {
        throw new Error('Deploy action requires TestCaseInfo.ProjectFile or a prior setPath action.');
      }

      context.currentProjectFile = projectFile;
      await setUploadPath(selectorFrom(deploymentLocators, 'destinyInputField') ?? '#deploy-input-file-disabled', projectFile);
      await setCredentials(testCase.Credentials);
      await (await findElement(selectorFrom(deploymentLocators, 'deployBtn') ?? '#deploy-deploy-btn')).click();
      return;
    }

    if (actionName === 'deploycodeonly') {
      await (await findElement(selectorFrom(locators, 'deployCodeOnlyButtonElem') ?? '')).click();
      return;
    }

    if (actionName === 'clearmessagepane') {
      await (await findElement(selectorFrom(messagePaneLocators, 'clearAllBtn') ?? '')).click();
      return;
    }

    if (actionName === 'showmessagepane') {
      await (await findElement(selectorFrom(messagePaneLocators, 'messagesBtn') ?? '')).click();
      return;
    }

    if (actionName === 'certify') {
      await (await findElement(selectorFrom(deploymentLocators, 'endorseBtn') ?? '')).click();
      return;
    }

    if (actionName === 'projectdownload') {
      await (await findElement(selectorFrom(downloadLocators, 'downloadBtn') ?? '')).click();
      return;
    }

    if (actionName === 'starttrace') {
      await (await findElement(selectorFrom(traceLocators, 'startTraceBtn') ?? '')).click();
      return;
    }

    if (actionName === 'refreshprogramlog') {
      await (await findElement(selectorFrom(programLogLocators(), 'refreshBtn') ?? '')).click();
      return;
    }

    if (['notracemessage', 'verifytracecountnotpresent'].includes(actionName)) {
      const recordsSelector = selectorFrom(traceLocators, 'recordsHeader') ?? selectorFrom(traceLocators, 'traceCounter');
      if (recordsSelector) {
        await findElement(recordsSelector);
      }
      return;
    }

    if (['allsubmenuexist', 'allaboutpageelementsexist'].includes(actionName)) {
      for (const selector of [
        selectorFrom(aboutLocators, 'aboutPage'),
        selectorFrom(aboutLocators, 'aboutTitle'),
        selectorFrom(aboutLocators, 'versionNumber'),
      ].filter((value): value is string => Boolean(value))) {
        await findElement(selector);
      }
      return;
    }

    context.unsupported.push(`Unsupported action: ${action}`);
  });
}

async function verifyMessages(messages: unknown): Promise<void> {
  const expectedMessages = Array.isArray(messages) ? messages : [messages];

  for (const expectedMessage of expectedMessages) {
    const record = asRecord(expectedMessage);
    const messageText = asString(record.MessageText);
    const messageType = asString(record.MessageType);
    const shouldExist = record.Exist === undefined ? true : Boolean(record.Exist);

    await allureStep(`Verify message pane contains: ${messageText}`, async () => {
      const rows = await browser.$$(selectorFrom(messagePaneLocators, 'messagepanerows') ?? 'tr');
      let found = false;

      for (const row of rows) {
        const rowText = await row.getText().catch(() => '');
        const hasMessage = messageText === '' || rowText.includes(messageText);
        const hasSeverity = messageType === '' || rowText.includes(messageType);

        if (hasMessage && hasSeverity) {
          found = true;
          break;
        }
      }

      expect(found).to.equal(shouldExist);
    });
  }
}

async function executeCommonMethod(context: ExecutionContext, methods: JsonRecord): Promise<void> {
  for (const [method, value] of Object.entries(methods)) {
    await allureStep(`Execute CommonMethod.${method}`, async () => {
      const methodName = normalizeKey(method);

      if (methodName === 'findfile') {
        expect(fs.existsSync(resolveResourcePath(context, asString(asRecord(value).path, asString(value))))).to.equal(true);
        return;
      }

      if (methodName === 'deletefile') {
        const target = resolveResourcePath(context, asString(asRecord(value).filePath, asString(value)));
        if (fs.existsSync(target)) {
          fs.unlinkSync(target);
        }
        return;
      }

      if (methodName === 'appendtofile') {
        const record = asRecord(value);
        fs.appendFileSync(resolveResourcePath(context, asString(record.filePath)), asString(record.text));
        return;
      }

      if (methodName === 'replaceTextInFile'.toLowerCase()) {
        const record = asRecord(value);
        const target = resolveResourcePath(context, asString(record.filePath));
        const content = fs.readFileSync(target, 'utf8');
        fs.writeFileSync(target, content.replace(asString(record.textToReplace), asString(record.newText)));
        return;
      }

      if (methodName === 'copyfile') {
        const record = asRecord(value);
        const from = asString(record.from);
        const to = asString(record.to);

        if (from === 'tempFile') {
          if (!context.tempFile) {
            throw new Error('CommonMethod.copyFile requested tempFile source before it was created.');
          }
          fs.writeFileSync(resolveResourcePath(context, to), context.tempFile);
          return;
        }

        const source = resolveResourcePath(context, from);

        if (to === 'tempFile') {
          context.tempFile = fs.readFileSync(source);
          return;
        }

        fs.copyFileSync(source, resolveResourcePath(context, to));
        return;
      }

      if (methodName === 'renamefiles') {
        const items = Array.isArray(value) ? value : [value];
        for (const item of items) {
          const record = asRecord(item);
          fs.renameSync(
            resolveResourcePath(context, asString(record.currentPath)),
            resolveResourcePath(context, asString(record.newPath)),
          );
        }
        return;
      }

      if (methodName === 'savefilemodifieddate') {
        const target = resolveResourcePath(context, asString(asRecord(value).filePath, asString(value)));
        context.savedDates.set(target, fs.statSync(target).mtimeMs);
        return;
      }

      if (methodName === 'comparefilemodifieddatetosaveddate') {
        const target = resolveResourcePath(context, asString(asRecord(value).filePath, asString(value)));
        expect(fs.statSync(target).mtimeMs).to.equal(context.savedDates.get(target));
        return;
      }

      context.unsupported.push(`Unsupported CommonMethod: ${method}`);
    });
  }
}

async function executeSteps(context: ExecutionContext, testCase: JsonRecord): Promise<void> {
  const steps = asRecord(testCase.Steps);

  for (const [blockName, value] of Object.entries(steps)) {
    const normalizedBlock = normalizeKey(blockName);

    if (normalizedBlock === 'timeout') {
      await allureStep(`Pause for ${String(value)} timeout`, () => browser.pause(waitMs(value)));
      continue;
    }

    if (normalizedBlock === 'verifymessage') {
      await verifyMessages(value);
      continue;
    }

    if (normalizedBlock === 'commonmethod') {
      await executeCommonMethod(context, asRecord(value));
      continue;
    }

    if (normalizedBlock === 'editprojectfile') {
      const projectFile = context.currentProjectFile ?? resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectFile));
      if (!projectFile) {
        throw new Error('EditProjectFile requires TestCaseInfo.ProjectFile.');
      }
      applyJsonMutations(projectFile, asRecord(value));
      continue;
    }

    if (normalizedBlock.endsWith('action')) {
      const actions = Array.isArray(value) ? value : [value];
      for (const action of actions) {
        await executeAction(context, String(action), testCase);
      }
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      await executePageBlock(context, blockName, value as JsonRecord);
      continue;
    }

    context.unsupported.push(`Unsupported step block: ${blockName}`);
  }
}

async function prepareProjectFile(context: ExecutionContext, testCase: JsonRecord): Promise<void> {
  const sourceProject = resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectFile));

  if (!sourceProject) {
    return;
  }

  if (!fs.existsSync(sourceProject)) {
    context.currentProjectFile = sourceProject;
    return;
  }

  if (testCase.Preconditions) {
    const targetProject = tempProjectPath(sourceProject);
    copyAssociatedProjectFiles(sourceProject, targetProject);
    applyJsonMutations(targetProject, asRecord(testCase.Preconditions));
    context.currentProjectFile = targetProject;
    return;
  }

  context.currentProjectFile = sourceProject;
}

export async function executeJsonCaseLive(testCase: LiveJsonCase): Promise<void> {
  const context: ExecutionContext = {
    repoRoot: process.cwd(),
    resourceRoot: resourceRootEnv
      ? path.resolve(resourceRootEnv)
      : path.resolve(process.cwd(), 'e2e/resources'),
    savedDates: new Map<string, number>(),
    unsupported: [],
  };

  await ensureRendererReady();
  await attachJson('Live JSON execution context', {
    caseId: testCase.id,
    sourceFolder: testCase.sourceFolder,
    sourceFile: testCase.sourceFile,
    resourceRoot: context.resourceRoot,
    configuredReadyTitle: process.env.E2E_APP_READY_TITLE ?? null,
    configuredReadySelector: process.env.E2E_APP_READY_SELECTOR ?? null,
  });

  await prepareProjectFile(context, testCase.raw);
  await executeSteps(context, testCase.raw);

  if (context.unsupported.length > 0) {
    await attachJson('Unsupported live JSON actions', context.unsupported);

    if (strictUnsupported) {
      throw new Error(
        `Live JSON execution encountered ${context.unsupported.length} unsupported action(s). See Allure attachment "Unsupported live JSON actions".`,
      );
    }
  }
}
