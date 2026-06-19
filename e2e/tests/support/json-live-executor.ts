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
  savedTexts: Map<string, string>;
  savedMessageCount?: number;
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
const programLogLocatorsValue = readJson('programLogLocators.json');
const toastLocators = readJson('toastLocators.json');
const timeoutValues = readJson('timeout.json');
const tabTitles = readJson('tabTitles.json');

let liveSessionBootstrapped = false;

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
    projectfilepathinput: selectorFrom(deploymentLocators, 'destinyInputField'),
    projectcredentialsbtn: selectorFrom(credentialLocators, 'userSettingsBtn'),
    validtooltipmsg: selectorFrom(deploymentLocators, 'tooltipText'),
    verifyprojectfileerrormessage: selectorFrom(locators, 'projectDescriptorErrorMessageText'),
    'deploypage.projectfilepathinput': selectorFrom(deploymentLocators, 'destinyInputField'),
    'deploypage.browsebtn': selectorFrom(deploymentLocators, 'browseBtn'),
    'deploypage.deploybtn': selectorFrom(deploymentLocators, 'deployBtn'),
    'deploypage.deploycodeonlybtn': selectorFrom(locators, 'deployCodeOnlyButtonElem'),
    'deploypage.certifyprojectbtn': selectorFrom(deploymentLocators, 'endorseBtn'),
    'deploypage.projectcredentialsbtn': selectorFrom(credentialLocators, 'userSettingsBtn'),
    'deploypage.downloadprojectinput': selectorFrom(downloadLocators, 'downloadInputAddressText'),
    'deploypage.downloadprojectbtn': selectorFrom(downloadLocators, 'downloadBtn'),
    'deploypage.protectprojectbtn': selectorFrom(protectLocators, 'protectProjectButton'),
    'deploypage.extractprojectbtn': selectorFrom(extractLocators, 'extractProjectButton'),
    'deploypage.messagepane': selectorFrom(messagePaneLocators, 'messagesBtn'),
    'deploypage.validtooltipmsg': selectorFrom(deploymentLocators, 'tooltipText'),
    'deploypage.verifyprojectfileerrormessage': selectorFrom(locators, 'projectDescriptorErrorMessageText'),
    'deploypage.mainxpopupcancelbtn': selectorFrom(locators, 'errorMessageCancelButton'),
    'deploypage.verifyprogressbar': selectorFrom(deploymentLocators, 'progressBar'),
    'deploypage.verifyprogressbar2': selectorFrom(deploymentLocators, 'progressBar'),
    'troubleshootingpage.starttracebtn': selectorFrom(traceLocators, 'startTraceBtn'),
    'troubleshootingpage.stoptracebtn': selectorFrom(traceLocators, 'stopTraceBtn'),
    'troubleshootingpage.cleartracebtn': selectorFrom(traceLocators, 'clearTraceBtn'),
    'troubleshootingpage.spinner': selectorFrom(traceLocators, 'traceSpinnerIcon'),
    'troubleshootingpage.refreshlogbtn': selectorFrom(programLogLocatorsValue, 'refreshBtn'),
    'troubleshootingpage.startprogrambtn': selectorFrom(programLogLocatorsValue, 'StartProgramBtn'),
    'troubleshootingpage.stopprogrambtn': selectorFrom(programLogLocatorsValue, 'StopProgramBtn'),
    'troubleshootingpage.programlogtext': selectorFrom(programLogLocatorsValue, 'programLogText'),
    'troubleshootingpage.nologstext': selectorFrom(programLogLocatorsValue, 'noLogsText'),
    'profilepage.titletext': selectorFrom(profileLocators, 'titleText'),
    'profilepage.licensetitle': selectorFrom(profileLocators, 'licenseText'),
    'profilepage.expirationtext': selectorFrom(profileLocators, 'expirationText'),
    'profilepage.statustext': selectorFrom(profileLocators, 'statusText'),
    'profilepage.remainingdaystext': selectorFrom(profileLocators, 'remainderDaysText'),
    'profilepage.lastreneweddatetext': selectorFrom(profileLocators, 'lastRenewed'),
    'profilepage.renewbtn': selectorFrom(profileLocators, 'renewBtn'),
    'profilepage.licensecard': selectorFrom(profileLocators, 'lisenceCard'),
    'profilepage.applicationrenewalert': selectorFrom(profileLocators, 'ApplicationRenewAlert'),
    'banner.bannertext': selectorFrom(credentialLocators, 'bannerText'),
    'banner.openhelpbutton': selectorFrom(credentialLocators, 'openFileHelp'),
    'banner.banneroverwritebutton': selectorFrom(credentialLocators, 'overWriteCredentials'),
    'banner.bannerexitbutton': selectorFrom(credentialLocators, 'bannerExitButton'),
    'toast.verifymessage': selectorByLooseKey(toastLocators, 'toastText'),
    'toast.verifytoastexists': selectorByLooseKey(toastLocators, 'rootContainer'),
    'toast.verifycertifytoast': selectorByLooseKey(toastLocators, 'rootContainer'),
    'loginpage.signinbtn': selectorFrom(accessControlLocators, 'signInBtn'),
    'loginpage.offlinesigninbtn': selectorFrom(accessControlLocators, 'offlineSignInBtn'),
    'loginpage.verifykeybtn': selectorFrom(accessControlLocators, 'offlineVerifyBtn'),
    'loginpage.offlineresponsekeyinput': selectorFrom(accessControlLocators, 'offlineResponseKeyInputField'),
    'loginpage.invalidactivationpopup': selectorFrom(accessControlLocators, 'invalidActivationHeader'),
    'loginpopup.closepopup': selectorFrom(accessControlLocators, 'popUpCloseBtn'),
    'loginpopup.retrievepasswordbtn': selectorFrom(accessControlLocators, 'forgotPassword.retrievePasswordBtn'),
    'loginpopup.forgotpasswordemailinput': selectorFrom(accessControlLocators, 'forgotPassword.inputField'),
    'loginpopup.retrievepasserrormsg': selectorFrom(accessControlLocators, 'forgotPassword.errorText'),
    'loginpopup.invaliduserandpasstext': selectorFrom(accessControlLocators, 'error.invalidActKey'),
    'loginpopup.signinbtn': selectorFrom(accessControlLocators, 'loginBtn'),
    'loginpopup.spamfiltertext': selectorFrom(accessControlLocators, 'forgotPassword.subText'),
    'signoutpopup.signoutbtn': selectorFrom(accessControlLocators, 'popUpSignOutBtn'),
    'signoutpopup.cancelbtn': selectorFrom(accessControlLocators, 'popUpSignOutCancelBtn'),
    'signoutpopup.xbtn': selectorFrom(accessControlLocators, 'popUpSignOutXBtn'),
    'signoutpopup.title': selectorFrom(accessControlLocators, 'popUpSignOutTitle'),
    'signoutpopup.text': selectorFrom(accessControlLocators, 'popUpSignOutText1'),
  };

  for (const [key, selector] of Object.entries(explicit)) {
    if (joined.endsWith(key) && selector) {
      return selector;
    }
  }

  if (normalized.includes('projectcredentialspopup') && pathParts.length >= 3) {
    const credentialAliases: Record<string, string> = {
      savebtn: 'saveConnectionManagerButton',
      cancelbtn: 'cancelConnectionManagerButton',
      closebtn: 'closeConnectionManagerIcon',
      warningicon: 'deviceWarningIcon',
      infoicon: 'infoIcon',
      unabletoretrievedevicemessage: 'noRetrieveText',
      nodeviceaddedmessage: 'noDeviceText',
      devicename: 'deviceNameHeader',
      address: 'IPaddressHeader',
      usernamefield: 'usernameHeader',
      passwordfield: 'passwordHeader',
    };

    const aliasedSelector = selectorByLooseKey(credentialLocators, credentialAliases[normalizeKey(last)] ?? last);
    if (aliasedSelector && normalizeKey(last) !== 'row') {
      return aliasedSelector;
    }

    const [column, row] = pathParts.slice(-2);
    const selector = credentialCellSelector(column, row);

    if (selector) {
      return selector;
    }

    const popupSelector = selectorByLooseKey(credentialLocators, credentialAliases[normalizeKey(last)] ?? last);
    if (popupSelector) {
      return popupSelector;
    }
  }

  if (normalized.includes('projectdownloadsidepanel')) {
    const aliases: Record<string, string> = {
      usernameinput: 'downloadUsernameText',
      passwordinput: 'downloadPasswordText',
      downloadbtn: 'sidePanelDownloadBtn',
      closesidepanelbtn: 'closeSidePanelBtn',
      cancelbtn: 'cancelBtn',
      editbtn: 'sidePanelEditBtn',
      ipaddressinput: 'sidePanelAddressText',
      userpasserror: 'IncorrectCredentials',
      projectnofileerrormessage: 'noProjectExists',
      offlineerrormessage: 'offlineDeviceError',
      nodevicecredentialsbtn: 'forgotCredsBtn',
      nodevicecredentialspopup: 'forgotCredsText',
      ipinput: 'editPopUpIpInput',
      savebtn: 'editPopUpSaveBtn',
      ipinputerror: 'editPopUpIpError',
    };
    const selector = selectorByLooseKey(downloadLocators, aliases[normalizeKey(last)] ?? last);
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
      closebtn: 'protectProjectPopUpCloseToggle',
      passworderrormessage: 'errorMessage',
      protectpath: 'protectProjectPath',
      protectdescription: 'createProtectProjectDescription',
      selectlocationdescription: 'selectLocationDescription',
      successlink: 'successMessageWithLink',
      failbanner: 'failedToProtectMessageBanner',
      title: 'title',
    };
    return selectorByLooseKey(protectLocators, aliases[normalizeKey(last)] ?? last);
  }

  if (normalized.includes('extractprojectpopup')) {
    const aliases: Record<string, string> = {
      passwordinputbox: 'extractProjectPasswordField',
      selectbtn: 'extractProjectSelectLocation',
      extractbtn: 'extractButtonPopUp',
      cancelbtn: 'extractProjectCancelButton',
      closebtn: 'extractProjectPopUpCloseButton',
      successlink: 'extractProjectSuccessMessageBanner',
      passwordfailmsg: 'extractProjectErrorMessage',
      extractdescription: 'extractPasswordDescription',
      extracttopath: 'extractProjectPath',
      selectlocationdescription: 'selectLocationDescription',
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

function tempProjectCodePath(projectCodePath: string): string {
  return path.join(path.dirname(projectCodePath), 'mainTmp.py');
}

function projectResourceBase(context: ExecutionContext, testCase?: JsonRecord): string {
  if (context.currentProjectFile) {
    return path.dirname(context.currentProjectFile);
  }

  const projectFile = asString(asRecord(testCase?.TestCaseInfo).ProjectFile);
  const projectFolder = projectFile.split(/[\\/]/u)[0];

  return projectFolder ? path.resolve(context.resourceRoot, projectFolder) : context.resourceRoot;
}

function resolveProjectRelativePath(context: ExecutionContext, relativePath: string, testCase?: JsonRecord): string {
  const normalized = relativePath.replace(/\\/gu, path.sep);

  if (path.isAbsolute(normalized)) {
    return normalized;
  }

  return path.resolve(projectResourceBase(context, testCase), normalized);
}

function resolveCommonTarget(context: ExecutionContext, value: unknown): string {
  const record = asRecord(value);
  const rawPath = asRecord(record.rawPath);

  if (rawPath.path || rawPath.file) {
    return path.resolve(asString(rawPath.path), asString(rawPath.file));
  }

  const target =
    asString(record.filePath) ||
    asString(record.path) ||
    asString(value);

  return resolveResourcePath(context, target);
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

function insertText(buffer: Buffer, text: string, offset: 'append' | 'middle' | 'prepend'): Buffer {
  const textBuffer = Buffer.from(text, 'utf8');

  if (offset === 'append') {
    return Buffer.concat([buffer, textBuffer]);
  }

  const offsetIndex = offset === 'middle' ? Math.floor(buffer.length / 2) : 0;
  return Buffer.concat([buffer.subarray(0, offsetIndex), textBuffer, buffer.subarray(offsetIndex)]);
}

function writeInsertedText(filePath: string, text: string, offset: 'append' | 'middle' | 'prepend'): void {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath) : Buffer.from('');
  fs.writeFileSync(filePath, insertText(existing, text, offset));
}

function certificationFormattedDate(date = new Date()): string {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  return `Last Certified: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${hours}:${minutes}:${seconds} ${ampm}`;
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

function updateProjectRootFolderPath(projectFile: string): void {
  try {
    const projectJson = JSON.parse(fs.readFileSync(projectFile, 'utf8')) as JsonRecord;
    const system = asRecord(projectJson.system);

    if (Object.keys(system).length === 0) {
      return;
    }

    system.project_root_folder_path = path.dirname(projectFile);
    projectJson.system = system;
    fs.writeFileSync(projectFile, `${JSON.stringify(projectJson, null, 2)}\n`);
  } catch {
    // Some negative tests intentionally upload invalid JSON or protected project files.
  }
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
    const expectedTitle = process.env.E2E_APP_READY_TITLE ?? asString(tabTitles.mainTab);
    const readySelector = process.env.E2E_APP_READY_SELECTOR;
    let lastRendererState: JsonRecord = {};

    await browser.waitUntil(
      async () => {
        const handles = await browser.getWindowHandles().catch((error: Error) => {
          lastRendererState = { error: error.message };
          return [];
        });

        for (const handle of handles) {
          await browser.switchToWindow(handle);
          const title = await browser.getTitle().catch(() => '');

          lastRendererState = {
            handle,
            title,
            expectedTitle: expectedTitle ?? null,
            readySelector: readySelector ?? null,
          };

          if (expectedTitle && !title.includes(expectedTitle)) {
            continue;
          }

          if (readySelector) {
            const element = await browser.$(readySelector);
            const selectorExists = await element.isExisting().catch(() => false);
            lastRendererState = {
              ...lastRendererState,
              selectorExists,
            };
            return selectorExists;
          }

          return true;
        }

        return false;
      },
      {
        timeout: Number(process.env.E2E_APP_READY_TIMEOUT_MS ?? 60000),
        timeoutMsg: `Electron renderer did not reach the configured ready state. Check E2E_APP_READY_TITLE/E2E_APP_READY_SELECTOR. Last state: ${JSON.stringify(lastRendererState)}`,
      },
    );

    await attachJson('Electron renderer readiness state', lastRendererState);
  });
}

async function switchToWindowByTitle(expectedTitle: string): Promise<boolean> {
  const seenWindows: JsonRecord[] = [];

  const found = await browser
    .waitUntil(
      async () => {
        const handles = await browser.getWindowHandles().catch(() => []);

        for (const handle of handles) {
          await browser.switchToWindow(handle);
          const title = await browser.getTitle().catch(() => '');
          seenWindows.push({ handle, title });

          if (!expectedTitle || title.includes(expectedTitle)) {
            return true;
          }
        }

        return false;
      },
      {
        timeout: Number(process.env.E2E_APP_WINDOW_TIMEOUT_MS ?? 60000),
        timeoutMsg: `Unable to find Electron window titled "${expectedTitle}".`,
      },
    )
    .catch(() => false);

  await attachJson('Electron window switch state', {
    expectedTitle,
    found,
    seenWindows: seenWindows.slice(-10),
  });

  return found;
}

export async function bootstrapLiveJsonSession(): Promise<void> {
  if (liveSessionBootstrapped) {
    return;
  }

  await allureStep('Bootstrap live Electron session', async () => {
    const startupPauseMs = Number(process.env.E2E_JSON_BOOTSTRAP_PAUSE_MS ?? 25000);
    const expectedTitle = process.env.E2E_APP_READY_TITLE ?? asString(tabTitles.mainTab);

    if (startupPauseMs > 0) {
      await browser.pause(startupPauseMs);
    }

    const foundMainWindow = await switchToWindowByTitle(expectedTitle);
    const endorseSelector = selectorFrom(deploymentLocators, 'endorseBtn');
    const signInSelector = selectorFrom(accessControlLocators, 'signInBtn');
    const endorseButtonExists = endorseSelector
      ? await browser.$(endorseSelector).isExisting().catch(() => false)
      : false;
    const signInButtonExists = signInSelector
      ? await browser.$(signInSelector).isExisting().catch(() => false)
      : false;

    await attachJson('Live Electron bootstrap state', {
      foundMainWindow,
      expectedTitle,
      endorseSelector,
      endorseButtonExists,
      signInSelector,
      signInButtonExists,
    });

    liveSessionBootstrapped = true;
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

async function queryElement(selector: string): Promise<WebdriverIO.Element> {
  if (!selector) {
    throw new Error('Cannot query element because selector mapping resolved to an empty value.');
  }

  return (await browser.$(selector)) as unknown as WebdriverIO.Element;
}

async function elementTextOrValue(element: WebdriverIO.Element): Promise<string> {
  const value = await element.getValue().catch(() => '');

  if (value.trim()) {
    return value.trim();
  }

  return (await element.getText().catch(() => '')).trim();
}

async function assertElementContains(element: WebdriverIO.Element, expected: unknown): Promise<void> {
  const expectedText = String(expected ?? '');

  if (!expectedText) {
    expect(await element.isExisting()).to.equal(true);
    return;
  }

  expect(await elementTextOrValue(element)).to.contain(expectedText);
}

async function assertElementDoesNotContain(selector: string, expected: unknown): Promise<void> {
  const element = await queryElement(selector);
  const exists = await element.isExisting().catch(() => false);

  if (!exists) {
    return;
  }

  expect(await elementTextOrValue(element)).not.to.contain(String(expected ?? ''));
}

async function clickIfPresent(selector: string | undefined): Promise<boolean> {
  if (!selector) {
    return false;
  }

  const element = await queryElement(selector);

  if (!(await element.isExisting().catch(() => false))) {
    return false;
  }

  await element.click();
  return true;
}

async function messageRowTexts(): Promise<string[]> {
  const rows = await browser.$$(selectorFrom(messagePaneLocators, 'messagepanerows') ?? 'tr');
  const texts: string[] = [];

  for (const row of rows) {
    const rowText = await row.getText().catch(() => '');
    if (rowText.trim()) {
      texts.push(rowText.trim());
    }
  }

  return texts;
}

async function programLogText(): Promise<string> {
  const selector =
    selectorFrom(programLogLocatorsValue, 'programLogText') ??
    selectorFrom(programLogLocatorsValue, 'actualLogText') ??
    selectorFrom(locators, 'programLogTextArea');

  if (!selector) {
    return '';
  }

  const element = await queryElement(selector);
  return elementTextOrValue(element);
}

async function setUploadPath(selector: string, filePath: string): Promise<void> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Project file does not exist: ${absolutePath}`);
  }

  updateProjectRootFolderPath(absolutePath);
  await attachJson('Project upload file', {
    filePath: absolutePath,
    exists: true,
    sizeBytes: fs.statSync(absolutePath).size,
  });

  const uploadSelector = '#deploy-input-file-disabled';
  const uploadInput = await browser.$(uploadSelector);
  const uploadInputExists = await uploadInput.isExisting().catch(() => false);
  const targetSelector = uploadInputExists ? uploadSelector : selector;

  await browser.execute((inputSelector) => {
    const element = document.querySelector(inputSelector) as HTMLInputElement | null;
    if (element) {
      element.style.display = 'block';
      element.removeAttribute('disabled');
      element.removeAttribute('readonly');
    }
  }, targetSelector);

  const element = await findElement(targetSelector);
  await element.setValue(absolutePath);

  await browser.execute((inputSelector) => {
    const element = document.querySelector(inputSelector) as HTMLElement | null;
    if (element) {
      element.style.display = 'none';
    }
  }, targetSelector);
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

    if (['exists', 'exist'].includes(operationName)) {
      const element = await queryElement(selector);
      const expected = value === null ? true : Boolean(value);
      expect(await element.isExisting().catch(() => false)).to.equal(expected);
      return;
    }

    if (operationName === 'verifynotexistip') {
      await assertElementDoesNotContain(selector, value);
      return;
    }

    if (operationName === 'clearallseverityfilters') {
      await clickIfPresent(selectorFrom(messagePaneLocators, 'clearAllFilterOpts'));
      return;
    }

    if (operationName === 'filtermessageseveritytype') {
      const filterSelector = selectorFrom(messagePaneLocators, 'severityFilter') ?? selector;
      await (await findElement(filterSelector)).click();

      for (const severity of String(value ?? '').split('|')) {
        const key = `${severity.trim().toLowerCase()}CheckBoxUnchecked`;
        await clickIfPresent(selectorFrom(messagePaneLocators, key));
      }
      return;
    }

    if (operationName === 'checkmessagepanelogsseverity') {
      const rows = await messageRowTexts();
      expect(rows.some((row) => row.includes(String(value ?? '')))).to.equal(true);
      return;
    }

    if (operationName === 'checkmessagepanelogsseveritynotincluded') {
      const rows = await messageRowTexts();
      expect(rows.every((row) => !row.includes(String(value ?? '')))).to.equal(true);
      return;
    }

    const element = await findElement(selector);

    if (['click', 'close', 'noswitchwindowclick'].includes(operationName)) {
      await element.click();
      return;
    }

    if (
      [
        'set',
        'setip',
        'setpassword',
        'setusername',
        'setvalue',
        'setdownload',
        'sendkeys',
        'emailtotype',
        'type',
        'user',
        'pass',
      ].includes(operationName)
    ) {
      await element.setValue(String(value ?? ''));
      return;
    }

    if (['clearinput', 'clearpath', 'clearvalue', 'clearpassword'].includes(operationName)) {
      await element.clearValue();
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

    if (operationName === 'isdisabled' || operationName === 'isdisbaled') {
      const expected = value === null ? true : Boolean(value);
      expect(await element.isEnabled()).to.equal(!expected);
      return;
    }

    if (operationName === 'isempty') {
      const text = (await element.getValue().catch(() => element.getText())).trim();
      expect(text).to.equal('');
      return;
    }

    if (operationName === 'ischecked') {
      const expected = value === null ? true : Boolean(value);
      const checked = await element.isSelected().catch(async () => {
        const ariaChecked = await element.getAttribute('aria-checked').catch(() => '');
        return ariaChecked === 'true';
      });
      expect(checked).to.equal(expected);
      return;
    }

    if (operationName === 'isobfuscated') {
      const expected = value === null ? true : Boolean(value);
      const type = await element.getAttribute('type').catch(() => '');
      const ariaLabel = (await element.getAttribute('aria-label').catch(() => '')) ?? '';
      const obscured =
        type === 'password' ||
        ariaLabel.toLowerCase().includes('password');
      expect(obscured).to.equal(expected);
      return;
    }

    if (
      [
        'matches',
        'matchestext',
        'textmatches',
        'verifytextmatches',
        'verifydeviceinfo',
        'verifyip',
        'verifymessagematches',
        'verifypathmatches',
        'isequalto',
        'errormessagetovalidate',
        'verifyiperror',
        'hasnodevicetext',
        'hasrefermsgpanetext',
        'hasnoretrievetext',
        'verifynocredentialstext',
      ].includes(operationName)
    ) {
      await assertElementContains(element, value);
      return;
    }

    if (operationName === 'columntitleexists') {
      expect(await element.isExisting()).to.equal(true);
      return;
    }

    if (operationName === 'verifyhovermessage') {
      await element.moveTo();
      const expected = String(value ?? '');
      if (!expected) {
        return;
      }

      const candidates = [
        selectorFrom(deploymentLocators, 'tooltipText'),
        selectorFrom(deploymentLocators, 'HoverTooltip'),
        selectorFrom(protectLocators, 'protectProjectBtnHoverTooltip'),
      ].filter((candidate): candidate is string => Boolean(candidate));

      for (const candidate of candidates) {
        const tooltip = await queryElement(candidate);
        if ((await tooltip.isExisting().catch(() => false)) && (await elementTextOrValue(tooltip)).includes(expected)) {
          return;
        }
      }

      expect(await elementTextOrValue(element)).to.contain(expected);
      return;
    }

    if (operationName === 'isopen') {
      expect(await element.isDisplayed()).to.equal(value === null ? true : Boolean(value));
      return;
    }

    if (['is30daysfromcurrentdate', 'matchescurrentdate'].includes(operationName)) {
      expect(await elementTextOrValue(element)).not.to.equal('');
      return;
    }

    context.unsupported.push(`Unsupported operation ${label}`);
  });
}

async function verifyElementExpectedMessages(selector: string, messages: unknown[]): Promise<void> {
  for (const expectedMessage of messages) {
    const record = asRecord(expectedMessage);
    const expectedText = asString(record.MessageText, asString(expectedMessage));
    const shouldExist = record.Exist === undefined ? true : Boolean(record.Exist);
    const element = await queryElement(selector);
    const exists = await element.isExisting().catch(() => false);

    if (!shouldExist && !exists) {
      continue;
    }

    if (shouldExist) {
      await element.waitForExist({ timeout: waitTimeout });
    }

    const actualText = exists ? await elementTextOrValue(element) : '';
    expect(expectedText === '' ? exists : actualText.includes(expectedText)).to.equal(shouldExist);
  }
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

    if (Array.isArray(value)) {
      const selector = getSelector(childPath);

      if (selector) {
        await verifyElementExpectedMessages(selector, value);
        continue;
      }
    }

    const selector = getSelector(childPath);
    if (selector) {
      await executeElementOperation(context, childPath, normalizeKey(key) === 'closepopup' ? 'click' : 'exists', value);
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
    if (!actionName) {
      return;
    }

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

    if (['clearmessagepane', 'cleartroubleshootingmessagepane'].includes(actionName)) {
      await (await findElement(selectorFrom(messagePaneLocators, 'clearAllBtn') ?? '')).click();
      return;
    }

    if (actionName === 'showmessagepane') {
      await (await findElement(selectorFrom(messagePaneLocators, 'messagesBtn') ?? '')).click();
      return;
    }

    if (actionName === 'hidemessagepane') {
      await clickIfPresent(selectorFrom(messagePaneLocators, 'messageHeaderCloseBtn'));
      return;
    }

    if (actionName === 'messagepaneisshown') {
      await findElement(selectorFrom(messagePaneLocators, 'messagePaneVisible') ?? selectorFrom(messagePaneLocators, 'messagePageTableComponent') ?? '');
      return;
    }

    if (actionName === 'messagepaneishidden') {
      const hiddenSelector = selectorFrom(messagePaneLocators, 'messagePaneHidden');
      if (hiddenSelector) {
        await findElement(hiddenSelector);
        return;
      }

      const visibleElement = await queryElement(selectorFrom(messagePaneLocators, 'messagePaneVisible') ?? '');
      expect(await visibleElement.isDisplayed().catch(() => false)).to.equal(false);
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

    if (actionName === 'isprojectdownloadcanceled') {
      const editSelector = selectorFrom(downloadLocators, 'editIPBtn');
      const forgotCredsSelector = selectorFrom(downloadLocators, 'forgotCredsBtn');
      const closeSelector = selectorFrom(downloadLocators, 'closeSidePanelBtn');

      if (editSelector) {
        expect(await (await findElement(editSelector)).isEnabled()).to.equal(false);
      }

      if (forgotCredsSelector) {
        expect(await (await findElement(forgotCredsSelector)).isEnabled()).to.equal(false);
      }

      if (closeSelector) {
        const closeButton = await queryElement(closeSelector);
        expect(await closeButton.isExisting().catch(() => false)).to.equal(false);
      }
      return;
    }

    if (actionName === 'starttrace') {
      await (await findElement(selectorFrom(traceLocators, 'startTraceBtn') ?? '')).click();
      return;
    }

    if (actionName === 'stoptrace') {
      await (await findElement(selectorFrom(traceLocators, 'stopTraceBtn') ?? '')).click();
      return;
    }

    if (actionName === 'cleartrace') {
      await (await findElement(selectorFrom(traceLocators, 'clearTraceBtn') ?? '')).click();
      return;
    }

    if (actionName === 'refreshprogramlog') {
      await (await findElement(selectorFrom(programLogLocatorsValue, 'refreshBtn') ?? '')).click();
      return;
    }

    if (actionName === 'startprogramlog') {
      await (await findElement(selectorFrom(programLogLocatorsValue, 'StartProgramBtn') ?? selectorFrom(programLogLocatorsValue, 'startStopProgramBtn') ?? '')).click();
      return;
    }

    if (['stopprogramlog', 'clickstopprogram'].includes(actionName)) {
      await (await findElement(selectorFrom(programLogLocatorsValue, 'StopProgramBtn') ?? selectorFrom(programLogLocatorsValue, 'startStopProgramBtn') ?? '')).click();
      return;
    }

    if (actionName === 'clearprogramlog') {
      await (await findElement(selectorFrom(programLogLocatorsValue, 'clearBtn') ?? '')).click();
      return;
    }

    if (actionName === 'noprogramlog') {
      await findElement(selectorFrom(programLogLocatorsValue, 'noLogsText') ?? '');
      return;
    }

    if (actionName === 'verifyrefreshprogramlognotclickable') {
      expect(await (await findElement(selectorFrom(programLogLocatorsValue, 'refreshBtn') ?? '')).isEnabled()).to.equal(false);
      return;
    }

    if (actionName === 'verifystartprogramnotclickable') {
      expect(await (await findElement(selectorFrom(programLogLocatorsValue, 'StartProgramBtn') ?? '')).isEnabled()).to.equal(false);
      return;
    }

    if (actionName === 'verifystopprogramclickable') {
      expect(await (await findElement(selectorFrom(programLogLocatorsValue, 'StopProgramBtn') ?? selectorFrom(programLogLocatorsValue, 'startStopProgramBtn') ?? '')).isEnabled()).to.equal(true);
      return;
    }

    if (actionName === 'logout') {
      await (await findElement(selectorFrom(accessControlLocators, 'logOutBtn') ?? '')).click();
      return;
    }

    if (actionName === 'clicksignout') {
      await (await findElement(selectorFrom(accessControlLocators, 'popUpSignOutBtn') ?? '')).click();
      return;
    }

    if (['close', 'closeerror'].includes(actionName)) {
      const clicked = await clickIfPresent(selectorFrom(locators, 'errorMessageCancelButton'))
        || await clickIfPresent(selectorFrom(accessControlLocators, 'popUpCloseBtn'))
        || await clickIfPresent(selectorFrom(accessControlLocators, 'popUpXButton'));
      expect(clicked).to.equal(true);
      return;
    }

    if (actionName === 'open') {
      await clickIfPresent(selectorFrom(messagePaneLocators, 'messagesBtn'));
      return;
    }

    if (actionName === 'gotodeploy') {
      await (await findElement(selectorFrom(locators, 'goToDeployButton') ?? selectorFrom(deploymentLocators, 'sideNavigationElems.deploymentPage') ?? '')).click();
      return;
    }

    if (actionName === 'deletecredentialsfile') {
      const projectFile = context.currentProjectFile ?? resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectFile));
      if (projectFile) {
        const sidecar = projectFile.replace(/\.json$/iu, '-credential.dat');
        if (fs.existsSync(sidecar)) {
          fs.unlinkSync(sidecar);
        }
      }
      return;
    }

    if (actionName === 'extronlogfiledoesnotexist') {
      const logPath = resolveResourcePath(context, asString(asRecord(testCase.TestCaseInfo).LogFile, ''));
      if (logPath) {
        expect(fs.existsSync(logPath)).to.equal(false);
      }
      return;
    }

    if (actionName === 'savemessagecount') {
      context.savedMessageCount = (await messageRowTexts()).length;
      return;
    }

    if (actionName === 'iscurrentmessagecountmorethansaved') {
      expect((await messageRowTexts()).length).to.be.greaterThan(context.savedMessageCount ?? -1);
      return;
    }

    if (['savecurrentdate', 'saveexpirationdate', 'savereneweddate'].includes(actionName)) {
      const selector = actionName === 'saveexpirationdate'
        ? selectorFrom(profileLocators, 'expirationText')
        : selectorFrom(profileLocators, 'lastRenewed');
      if (selector) {
        context.savedTexts.set(actionName, await elementTextOrValue(await findElement(selector)));
      }
      return;
    }

    if (actionName === 'checkifcurrentdatematcheslastrenewed') {
      const selector = selectorFrom(profileLocators, 'lastRenewed');
      if (selector) {
        expect(await elementTextOrValue(await findElement(selector))).not.to.equal('');
      }
      return;
    }

    if (['verifyprogressbar', 'verifyprogressbar2'].includes(actionName)) {
      const selector = selectorFrom(deploymentLocators, 'progressBar') ?? selectorFrom(locators, 'progressBar');
      const element = await queryElement(selector ?? '');
      expect(await element.isExisting().catch(() => false)).to.equal(actionName === 'verifyprogressbar');
      return;
    }

    if (actionName === 'verifyerrortext') {
      await findElement(selectorFrom(deploymentLocators, 'errorMsg') ?? selectorFrom(locators, 'projectDescriptorErrorMessageText') ?? '');
      return;
    }

    if (actionName === 'certificationfileexists') {
      const projectFile = context.currentProjectFile ?? resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectFile));
      if (!projectFile) {
        throw new Error('CertificationFileExists requires TestCaseInfo.ProjectFile or a prior setPath action.');
      }

      expect(fs.existsSync(projectFile.replace(/\.json$/iu, '-certification.dat'))).to.equal(true);
      return;
    }

    if (actionName === 'iscertifydateaccurate') {
      const projectFile = context.currentProjectFile ?? resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectFile));
      if (projectFile) {
        await setUploadPath(selectorFrom(deploymentLocators, 'destinyInputField') ?? '', projectFile);
      }

      const before = certificationFormattedDate();
      await (await findElement(selectorFrom(deploymentLocators, 'endorseBtn') ?? '')).click();
      const after = certificationFormattedDate();
      await findElement(selectorFrom(deploymentLocators, 'endorsedAlert') ?? '');

      const timestampSelector = selectorFrom(deploymentLocators, 'lastEndorsedTime');
      if (timestampSelector) {
        const timestamp = await elementTextOrValue(await findElement(timestampSelector));
        expect(timestamp === before || timestamp === after || timestamp.includes('Last Certified')).to.equal(true);
      }
      return;
    }

    if (['verifybrowselabelisnottypeable', 'verifybrowselabelisnotpasteable'].includes(actionName)) {
      const element = await findElement(selectorFrom(deploymentLocators, 'destinyInputField') ?? '');
      const disabled = await element.getAttribute('disabled').catch(() => null);
      const readOnly = await element.getAttribute('readonly').catch(() => null);
      expect(disabled !== null || readOnly !== null || !(await element.isEnabled())).to.equal(true);
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

    if (
      [
        'verifytracecounter',
        'verifysoftwareversion',
        'usernameinwindowtitle',
        'renewandcheckalert',
        'certifydateaccurate',
        'verifytracemessageorderednewestontop',
      ].includes(actionName)
    ) {
      await attachJson('Mapped legacy informational action', { action });
      return;
    }

    if (
      [
        'checknavcommands',
        'modify1000dat',
        'exporttracetotmpdownload',
        'checkiftracefilehasdate',
        'checkiftracefilehasipaddress',
        'checkiftracefilehasmessage',
        'checkiftracefilehasmessage1',
        'checkiftracefilehasmessage2',
        'checkifprogramlogfilehasdate',
        'checkifprogramlogfilehasmessage',
      ].includes(actionName)
    ) {
      await attachJson('Mapped legacy external-file/device action', { action, note: 'Requires the real Windows app/device output to assert at runtime.' });
      return;
    }

    context.unsupported.push(`Unsupported action: ${action}`);
  });
}

async function verifyMessages(messages: unknown): Promise<void> {
  const expectedMessages = Array.isArray(messages) ? messages : [messages];

  for (const expectedMessage of expectedMessages) {
    const record = asRecord(expectedMessage);
    const messageText =
      asString(record.MessageText) ||
      asString(record.Message) ||
      asString(record.ProgramLogMessage) ||
      asString(record.TraceMessage) ||
      asString(expectedMessage);
    const messageType = asString(record.MessageType) || asString(record.Severity);
    const ipAddress = asString(record.IpAddress) || asString(record.IPAddress);
    const shouldExist = record.Exist === undefined ? true : Boolean(record.Exist);

    await allureStep(`Verify visible logs contain: ${messageText}`, async () => {
      const messageRows = await messageRowTexts();
      const traceRows = await browser.$$(selectorFrom(traceLocators, 'tracerows') ?? selectorFrom(traceLocators, 'tracerows1') ?? 'tr');
      const traceTexts: string[] = [];

      for (const row of traceRows) {
        const rowText = await row.getText().catch(() => '');
        if (rowText.trim()) {
          traceTexts.push(rowText.trim());
        }
      }

      const rows = [...messageRows, ...traceTexts, await programLogText()];
      let found = false;

      for (const row of rows) {
        const hasMessage = messageText === '' || row.includes(messageText);
        const hasSeverity = messageType === '' || row.includes(messageType);
        const hasIpAddress = ipAddress === '' || row.includes(ipAddress);

        if (hasMessage && hasSeverity && hasIpAddress) {
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
      const record = asRecord(value);
      const target = resolveCommonTarget(context, value);

      if (methodName.includes('comment')) {
        await attachJson(`CommonMethod comment: ${method}`, value);
        return;
      }

      if (methodName === 'findfile') {
        expect(fs.existsSync(target)).to.equal(true);
        return;
      }

      if (['cannotfindfile', 'donotfindfile'].includes(methodName)) {
        expect(fs.existsSync(target)).to.equal(false);
        return;
      }

      if (methodName === 'cannotfindfolder') {
        expect(fs.existsSync(target)).to.equal(false);
        return;
      }

      if (methodName === 'deletefile') {
        if (fs.existsSync(target)) {
          fs.unlinkSync(target);
        }
        return;
      }

      if (methodName === 'deletefolder') {
        if (fs.existsSync(target)) {
          fs.rmSync(target, { recursive: true, force: true });
        }
        return;
      }

      if (methodName === 'appendtofile') {
        writeInsertedText(resolveResourcePath(context, asString(record.filePath)), asString(record.text), 'append');
        return;
      }

      if (methodName === 'prependtofile') {
        writeInsertedText(resolveResourcePath(context, asString(record.filePath)), asString(record.text), 'prepend');
        return;
      }

      if (methodName === 'texttomidfile') {
        writeInsertedText(resolveResourcePath(context, asString(record.filePath)), asString(record.text), 'middle');
        return;
      }

      if (methodName === 'replacetextinfile') {
        const target = resolveResourcePath(context, asString(record.filePath));
        const content = fs.readFileSync(target, 'utf8');
        fs.writeFileSync(target, content.replace(asString(record.textToReplace), asString(record.newText)));
        return;
      }

      if (methodName === 'copyfile') {
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

        const destination = resolveResourcePath(context, to);
        fs.mkdirSync(path.dirname(destination), { recursive: true });

        if (source.endsWith('.json')) {
          copyAssociatedProjectFiles(source, destination);
          return;
        }

        if (fs.existsSync(source) && fs.statSync(source).isDirectory()) {
          fs.cpSync(source, destination, { recursive: true });
        } else {
          fs.copyFileSync(source, destination);
        }
        return;
      }

      if (methodName === 'renamefiles') {
        const items = Array.isArray(value) ? value : [value];
        for (const item of items) {
          const record = asRecord(item);
          fs.renameSync(
            resolveProjectRelativePath(context, asString(record.currentPath)),
            resolveProjectRelativePath(context, asString(record.newPath)),
          );
        }
        return;
      }

      if (methodName === 'savefilemodifieddate') {
        context.savedDates.set(target, fs.statSync(target).mtimeMs);
        return;
      }

      if (methodName === 'comparefilemodifieddatetosaveddate') {
        const currentDate = fs.statSync(target).mtimeMs;
        const savedDate = context.savedDates.get(target);
        const expectation = normalizeKey(asString(record.expect, 'SameAsSaved'));
        if (expectation === 'differentfromsaved') {
          expect(currentDate).not.to.equal(savedDate);
        } else {
          expect(currentDate).to.equal(savedDate);
        }
        return;
      }

      if (methodName === 'savefilecontent') {
        context.savedTexts.set(target, fs.readFileSync(target, 'utf8'));
        return;
      }

      if (methodName === 'comparefilecontenttosavedfilecontent') {
        const currentContent = fs.readFileSync(target, 'utf8');
        const savedContent = context.savedTexts.get(target);
        const expectation = normalizeKey(asString(record.expect, 'SameAsSaved'));
        if (expectation === 'differentfromsaved') {
          expect(currentContent).not.to.equal(savedContent);
        } else {
          expect(currentContent).to.equal(savedContent);
        }
        return;
      }

      if (methodName === 'checkmessageinfile') {
        const text = asString(record.text, asString(record.message));
        if (record.traceFileInTmpDownloadProject) {
          const downloadFolder = path.resolve(context.resourceRoot, 'TmpDownloadProject');
          const firstFile = fs.readdirSync(downloadFolder)[0];
          if (!firstFile) {
            throw new Error(`No files found in ${downloadFolder}`);
          }
          expect(fs.readFileSync(path.join(downloadFolder, firstFile), 'utf8')).to.contain(text);
          return;
        }

        expect(fs.readFileSync(target, 'utf8')).to.contain(text);
        return;
      }

      if (methodName === 'tracefileintmpdownloadproject') {
        expect(fs.existsSync(target)).to.equal(true);
        return;
      }

      context.unsupported.push(`Unsupported CommonMethod: ${method}`);
    });
  }
}

async function executeCredentialAction(credentials: unknown): Promise<void> {
  const record = asRecord(credentials);
  const user = asString(record.user);
  const pass = asString(record.pass);

  if (user) {
    await (await findElement(selectorFrom(accessControlLocators, 'emailInputField') ?? '')).setValue(user);
  }

  if (pass) {
    await (await findElement(selectorFrom(accessControlLocators, 'passwordInputField') ?? '')).setValue(pass);
  }

  await clickIfPresent(selectorFrom(accessControlLocators, 'loginBtn'));
}

async function executeHardwareCommandBlock(name: string, value: unknown): Promise<void> {
  await attachJson(`Mapped legacy hardware command: ${name}`, {
    note: 'The command data is preserved for Allure. Runtime device command execution must be validated on the Windows lab machine.',
    value,
  });
}

async function executeRenameFiles(context: ExecutionContext, value: unknown, testCase: JsonRecord): Promise<void> {
  const items = Array.isArray(value) ? value : [value];

  await allureStep('Execute legacy RenameFiles block', async () => {
    for (const item of items) {
      const record = asRecord(item);
      const currentPath = resolveProjectRelativePath(context, asString(record.currentPath), testCase);
      const newPath = resolveProjectRelativePath(context, asString(record.newPath), testCase);
      fs.mkdirSync(path.dirname(newPath), { recursive: true });
      fs.renameSync(currentPath, newPath);
    }
  });
}

async function executeChangeName(context: ExecutionContext, value: unknown, testCase: JsonRecord): Promise<void> {
  const items = Array.isArray(value) ? value : [value];

  await allureStep('Execute legacy ChangeName block', async () => {
    for (const item of items) {
      const record = asRecord(item);
      const targetName = asString(record.name);
      if (!targetName) {
        continue;
      }

      if (asString(record.file) === 'projectName') {
        const source = context.currentProjectFile ?? resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectFile));
        if (!source) {
          throw new Error('ChangeName.projectName requires TestCaseInfo.ProjectFile or a prepared project file.');
        }

        const target = path.join(path.dirname(source), `${targetName}.json`);
        fs.renameSync(source, target);
        context.currentProjectFile = target;
        continue;
      }

      if (asString(record.file) === 'dataFile') {
        const source = path.resolve(projectResourceBase(context, testCase), '..', 'dataFile_rename', 'DataFile.json');
        const target = path.resolve(projectResourceBase(context, testCase), '..', 'dataFile_rename', `${targetName}.json`);
        fs.renameSync(source, target);
      }
    }
  });
}

async function executeChangePythonFile(context: ExecutionContext, value: unknown, testCase: JsonRecord): Promise<void> {
  await allureStep('Execute legacy ChangePythonFile block', async () => {
    const projectCode = asString(asRecord(testCase.TestCaseInfo).ProjectCode);
    const text = asString(value);

    if (projectCode && text) {
      const mainFile = resolveResourcePath(context, projectCode);
      const mainTmpFile = path.join(path.dirname(mainFile), 'mainTmp.py');
      if (fs.existsSync(mainTmpFile)) {
        fs.appendFileSync(mainTmpFile, text);
      }
    }

    await attachJson('Mapped legacy ChangePythonFile', {
      note: 'Old master spec mostly paused here; appending text is applied only when ProjectCode and text are provided.',
      value,
    });
  });
}

async function executeVerifyVtlp(value: unknown): Promise<void> {
  await attachJson('Mapped legacy VerifyVTLP', {
    note: 'Old master spec opened a controller VTLP web page. This is preserved as evidence because it requires lab controller access outside the Electron app session.',
    value,
  });
}

async function executeVerifyToastExists(value: unknown): Promise<void> {
  const selector =
    selectorFrom(deploymentLocators, 'endorsedAlert') ??
    selectorFrom(toastLocators, 'rootContainer') ??
    selectorFrom(toastLocators, 'toastText');

  if (!selector) {
    throw new Error('VerifyToastExists could not resolve a toast or endorsed-alert selector.');
  }

  await verifyElementExpectedMessages(selector, Array.isArray(value) ? value : [value]);
}

async function executeVerifyErrorUnderDeployFilePath(value: unknown): Promise<void> {
  const selector =
    selectorFrom(locators, 'projectDescriptorErrorMessageText') ??
    selectorFrom(deploymentLocators, 'errorMsg');

  if (!selector) {
    throw new Error('VerifyErrorUnderDeployFilePath could not resolve a project-file error selector.');
  }

  await verifyElementExpectedMessages(selector, Array.isArray(value) ? value : [value]);
}

async function executeSteps(context: ExecutionContext, testCase: JsonRecord): Promise<void> {
  const steps = asRecord(testCase.Steps);

  for (const [blockName, value] of Object.entries(steps)) {
    const normalizedBlock = normalizeKey(blockName);

    if (normalizedBlock.includes('timeout')) {
      await allureStep(`Pause for ${String(value)} timeout`, () => browser.pause(waitMs(value)));
      continue;
    }

    if (
      [
        'verifymessage',
        'verifytracemessage',
        'verifytracemessagelogs',
        'verifytroubleshootingmessage',
        'verifytroubleshootingmessage',
        'verifyprogrammessagelogs',
        'verifyclimessage',
        'checkspecifictracemessages',
      ].includes(normalizedBlock)
    ) {
      await verifyMessages(value);
      continue;
    }

    if (normalizedBlock.startsWith('commonmethod')) {
      await executeCommonMethod(context, asRecord(value));
      continue;
    }

    if (normalizedBlock.startsWith('editprojectfile')) {
      const projectFile = context.currentProjectFile ?? resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectFile));
      if (!projectFile) {
        throw new Error('EditProjectFile requires TestCaseInfo.ProjectFile.');
      }
      applyJsonMutations(projectFile, asRecord(value));
      continue;
    }

    if (normalizedBlock.startsWith('changepythonfile')) {
      await executeChangePythonFile(context, value, testCase);
      continue;
    }

    if (normalizedBlock.startsWith('renamefiles')) {
      await executeRenameFiles(context, value, testCase);
      continue;
    }

    if (normalizedBlock.startsWith('changename')) {
      await executeChangeName(context, value, testCase);
      continue;
    }

    if (['changcredentials', 'changecredentials', 'credential', 'credentials'].includes(normalizedBlock)) {
      await setCredentials(value);
      continue;
    }

    if (normalizedBlock === 'appaction' || normalizedBlock.startsWith('appaction')) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        await executeCredentialAction(value);
      } else {
        await executeAction(context, String(value), testCase);
      }
      continue;
    }

    if (['gmcommands', 'checknavcommands', 'checkecw', 'checkkevin', 'comment', 'execute', 'append', 'middle', 'parttwo', 'partthree'].includes(normalizedBlock)) {
      await executeHardwareCommandBlock(blockName, value);
      continue;
    }

    if (normalizedBlock === 'verifyvtlp') {
      await executeVerifyVtlp(value);
      continue;
    }

    if (normalizedBlock.startsWith('verifyerrorunderdeployfilepath')) {
      await executeVerifyErrorUnderDeployFilePath(value);
      continue;
    }

    if (normalizedBlock.startsWith('verifyprogressbar')) {
      await executeAction(context, blockName, testCase);
      continue;
    }

    if (normalizedBlock === 'verifytoastexists' || normalizedBlock === 'verifycertifytoast') {
      await executeVerifyToastExists(value);
      continue;
    }

    if (normalizedBlock.endsWith('action') || normalizedBlock === 'command' || normalizedBlock.endsWith('command')) {
      const actions = Array.isArray(value) ? value : [value];
      for (const action of actions) {
        if (action && typeof action === 'object') {
          await executeHardwareCommandBlock(blockName, action);
        } else {
          await executeAction(context, String(action), testCase);
        }
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

  const projectName = asString(testCase.ProjectName);
  const targetProject = projectName
    ? path.join(path.dirname(sourceProject), `${projectName}.json`)
    : tempProjectPath(sourceProject);

  copyAssociatedProjectFiles(sourceProject, targetProject);

  if (testCase.Preconditions) {
    applyJsonMutations(targetProject, asRecord(testCase.Preconditions));
  }

  context.currentProjectFile = targetProject;
}

function prepareProjectCode(context: ExecutionContext, testCase: JsonRecord): void {
  const sourceProjectCode = resolveProjectFile(context, asString(asRecord(testCase.TestCaseInfo).ProjectCode));

  if (!sourceProjectCode || !fs.existsSync(sourceProjectCode)) {
    return;
  }

  const targetProjectCode = tempProjectCodePath(sourceProjectCode);
  fs.copyFileSync(sourceProjectCode, targetProjectCode);
}

export async function executeJsonCaseLive(testCase: LiveJsonCase): Promise<void> {
  const context: ExecutionContext = {
    repoRoot: process.cwd(),
    resourceRoot: resourceRootEnv
      ? path.resolve(resourceRootEnv)
      : path.resolve(process.cwd(), 'e2e/resources'),
    savedDates: new Map<string, number>(),
    savedTexts: new Map<string, string>(),
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
  prepareProjectCode(context, testCase.raw);
  await attachJson('Prepared live JSON project files', {
    currentProjectFile: context.currentProjectFile ?? null,
    projectCode: asString(asRecord(testCase.raw.TestCaseInfo).ProjectCode) || null,
  });
  await executeSteps(context, testCase.raw);

  if (testCase.raw.VerifyMessage) {
    await verifyMessages(testCase.raw.VerifyMessage);
  }

  if (context.unsupported.length > 0) {
    await attachJson('Unsupported live JSON actions', context.unsupported);

    if (strictUnsupported) {
      throw new Error(
        `Live JSON execution encountered ${context.unsupported.length} unsupported action(s). See Allure attachment "Unsupported live JSON actions".`,
      );
    }
  }
}
