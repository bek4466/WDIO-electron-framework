import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';
import { allureStep, attachJson } from '../../../src/support/allure.js';

type JsonRecord = Record<string, unknown>;

export type AuthenticationState =
  | 'signed-in-certified'
  | 'signed-in-uncertified'
  | 'signed-out'
  | 'sso-window'
  | 'unknown';

type Credentials = {
  username: string;
  password: string;
  role: 'certified' | 'uncertified' | 'custom';
};

type ElementQueryBrowser = {
  $(elementSelector: string): Promise<WebdriverIO.Element>;
};

function readJson(fileName: string): JsonRecord {
  const filePath = path.join(process.cwd(), 'e2e/src/JSON', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonRecord;
}

const accessLocators = readJson('accessControlLocators.json');
const deploymentLocators = readJson('deploymentLocators.json');
const tabTitles = readJson('tabTitles.json');
const legacyCredentials = readJson('dataTool.json');

function valueAt(source: JsonRecord, dottedPath: string): unknown {
  return dottedPath.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    return (current as JsonRecord)[key];
  }, source);
}

function selector(source: JsonRecord, dottedPath: string): string {
  const value = valueAt(source, dottedPath);
  return typeof value === 'string' ? value : '';
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

const mainWindowTitle = stringValue(tabTitles.mainTab) || 'ControlScript Deployment Utility';
const ssoWindowTitle = stringValue(tabTitles.ExtronInsider);
const signInSelector = selector(accessLocators, 'signInBtn');
const logoutSelector = selector(accessLocators, 'logOutBtn');
const logoutConfirmSelector =
  selector(accessLocators, 'popUpSignOutBtn') || selector(accessLocators, 'popUpLogOutBtn');
const emailSelector = selector(accessLocators, 'emailInputField');
const passwordSelector = selector(accessLocators, 'passwordInputField');
const loginSelector = selector(accessLocators, 'loginBtn');
const certifySelector = selector(deploymentLocators, 'endorseBtn');

async function queryElement(elementSelector: string): Promise<WebdriverIO.Element> {
  return (browser as unknown as ElementQueryBrowser).$(elementSelector);
}

class AuthenticationSession {
  private readonly timeout = Number(process.env.E2E_AUTH_TIMEOUT_MS ?? 90000);

  private async isPresent(elementSelector: string): Promise<boolean> {
    if (!elementSelector) {
      return false;
    }

    const element = await queryElement(elementSelector);
    return element.isExisting().catch(() => false);
  }

  private async switchToMatchingWindow(
    title: string,
    requiredSelector = '',
  ): Promise<boolean> {
    let lastWindows: Array<{ handle: string; title: string }> = [];

    const found = await browser
      .waitUntil(
        async () => {
          const handles = await browser.getWindowHandles().catch(() => []);
          const observed: Array<{ handle: string; title: string }> = [];

          for (const handle of handles) {
            await browser.switchToWindow(handle);
            const currentTitle = await browser.getTitle().catch(() => '');
            observed.push({ handle, title: currentTitle });

            const titleMatches = !title || currentTitle.includes(title);
            const selectorMatches = !requiredSelector || (await this.isPresent(requiredSelector));

            if (titleMatches && selectorMatches) {
              lastWindows = observed;
              return true;
            }
          }

          lastWindows = observed;
          return false;
        },
        {
          timeout: this.timeout,
          interval: 500,
          timeoutMsg: `Unable to find authentication window titled "${title}".`,
        },
      )
      .catch(() => false);

    if (!found) {
      await attachJson('Authentication window lookup failure', {
        expectedTitle: title,
        requiredSelector: requiredSelector || null,
        observedWindows: lastWindows,
      });
    }

    return found;
  }

  resolveCredentials(usernameOrRole?: string, passwordOrRole?: string): Credentials {
    const requestedRole = (usernameOrRole || passwordOrRole || 'certified').toLowerCase();
    const role =
      requestedRole.includes('uncertified') || requestedRole.includes('unlicensed')
        ? 'uncertified'
        : requestedRole.includes('certified') || requestedRole.includes('licensed')
          ? 'certified'
          : 'custom';

    if (role === 'uncertified') {
      return {
        username: stringValue(legacyCredentials.unLicensedUser1),
        password: stringValue(legacyCredentials.unLicensedUser1pass),
        role,
      };
    }

    if (role === 'certified') {
      return {
        username: stringValue(legacyCredentials.licensedUser1),
        password: stringValue(legacyCredentials.licensedUser1pass),
        role,
      };
    }

    return {
      username: usernameOrRole ?? '',
      password: passwordOrRole ?? '',
      role,
    };
  }

  async switchToMainWindow(): Promise<void> {
    const found = await this.switchToMatchingWindow(mainWindowTitle);
    if (!found) {
      throw new Error(`Unable to switch to the CSDU window titled "${mainWindowTitle}".`);
    }
  }

  async switchToSsoWindow(): Promise<void> {
    const found = await this.switchToMatchingWindow(ssoWindowTitle, emailSelector);
    if (!found) {
      throw new Error('Unable to switch to the Extron Insider SSO window.');
    }
  }

  async detectState(): Promise<AuthenticationState> {
    const handles = await browser.getWindowHandles().catch(() => []);
    let ssoWindowFound = false;

    for (const handle of handles) {
      await browser.switchToWindow(handle);
      const title = await browser.getTitle().catch(() => '');

      if ((ssoWindowTitle && title.includes(ssoWindowTitle)) || (await this.isPresent(emailSelector))) {
        ssoWindowFound = true;
        continue;
      }

      if (!title.includes(mainWindowTitle)) {
        continue;
      }

      if (await this.isPresent(signInSelector)) {
        return 'signed-out';
      }

      if (await this.isPresent(logoutSelector)) {
        return (await this.isPresent(certifySelector))
          ? 'signed-in-certified'
          : 'signed-in-uncertified';
      }
    }

    return ssoWindowFound ? 'sso-window' : 'unknown';
  }

  async waitForState(expected: AuthenticationState): Promise<void> {
    let lastState: AuthenticationState = 'unknown';

    await browser.waitUntil(
      async () => {
        lastState = await this.detectState();
        return lastState === expected;
      },
      {
        timeout: this.timeout,
        interval: 500,
        timeoutMsg: `Authentication state did not become "${expected}". Last state: "${lastState}".`,
      },
    );

    if (expected !== 'sso-window') {
      await this.switchToMainWindow();
    }
  }

  async openSignOutDialog(): Promise<void> {
    await this.switchToMainWindow();
    const state = await this.detectState();

    if (state === 'signed-out') {
      return;
    }

    if (!['signed-in-certified', 'signed-in-uncertified'].includes(state)) {
      throw new Error(`Cannot open sign-out dialog from authentication state "${state}".`);
    }

    await (await queryElement(logoutSelector)).click();
    await (await queryElement(logoutConfirmSelector)).waitForDisplayed({ timeout: this.timeout });
  }

  async signOut(): Promise<void> {
    await allureStep('Sign out of CSDU', async () => {
      await this.switchToMainWindow();
      if ((await this.detectState()) === 'signed-out') {
        return;
      }

      await this.openSignOutDialog();
      await (await queryElement(logoutConfirmSelector)).click();
      await this.waitForState('signed-out');
    });
  }

  async signIn(usernameOrRole?: string, passwordOrRole?: string): Promise<void> {
    const credentials = this.resolveCredentials(usernameOrRole, passwordOrRole);

    if (!credentials.username || !credentials.password) {
      throw new Error(
        `Missing ${credentials.role} CSDU credentials in e2e/src/JSON/dataTool.json.`,
      );
    }

    await allureStep(`Sign in to CSDU as ${credentials.role} user`, async () => {
      const initialState = await this.detectState();

      if (
        initialState === 'signed-in-certified' ||
        initialState === 'signed-in-uncertified'
      ) {
        await this.signOut();
      }

      if ((await this.detectState()) !== 'sso-window') {
        await this.switchToMainWindow();
        await (await queryElement(signInSelector)).waitForClickable({ timeout: this.timeout });
        await (await queryElement(signInSelector)).click();
      }

      await this.switchToSsoWindow();
      await (await queryElement(emailSelector)).setValue(credentials.username);
      await (await queryElement(passwordSelector)).setValue(credentials.password);
      await (await queryElement(loginSelector)).click();

      let finalState: AuthenticationState;
      if (credentials.role === 'custom') {
        finalState = 'unknown';
        await browser.waitUntil(
          async () => {
            finalState = await this.detectState();
            return ['signed-in-certified', 'signed-in-uncertified'].includes(finalState);
          },
          {
            timeout: this.timeout,
            interval: 500,
            timeoutMsg: `Custom CSDU user did not reach a signed-in state. Last state: "${finalState}".`,
          },
        );
        await this.switchToMainWindow();
      } else {
        finalState =
          credentials.role === 'uncertified'
            ? 'signed-in-uncertified'
            : 'signed-in-certified';
        await this.waitForState(finalState);
      }

      await attachJson('Authentication transition', {
        role: credentials.role,
        username: credentials.username,
        state: finalState,
      });
    });
  }

  async ensureCertifiedUser(): Promise<void> {
    const state = await this.detectState();
    await attachJson('Authentication bootstrap state', { state });

    if (state === 'signed-in-certified') {
      await this.switchToMainWindow();
      return;
    }

    await this.signIn('certified', 'certified');
  }

  async ensureSignedInUser(): Promise<void> {
    const state = await this.detectState();

    if (['signed-in-certified', 'signed-in-uncertified'].includes(state)) {
      await this.switchToMainWindow();
      return;
    }

    await this.signIn('certified', 'certified');
  }
}

export const authenticationSession = new AuthenticationSession();
