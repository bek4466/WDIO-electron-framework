import allureReporter from '@wdio/allure-reporter';
import { ContentType, Status } from 'allure-js-commons';

type BrowserLike = {
  takeScreenshot: () => Promise<string>;
};

function normalizeAttachmentContent(content: string | object | Buffer): string | object | Buffer {
  if (Buffer.isBuffer(content) || typeof content === 'string') {
    return content;
  }

  return JSON.stringify(content, null, 2);
}

export class AllureWrapper {
  async projectAttachment(browser: BrowserLike, data: unknown): Promise<void> {
    await this.screenshot(browser, 'Project screenshot');
    await this.attachLogs('Project system', data ?? {}, ContentType.JSON);
  }

  async screenshot(browser: BrowserLike, screenshotName = 'Screenshot'): Promise<void> {
    const screenshot = await browser.takeScreenshot();
    await allureReporter.addAttachment(screenshotName, Buffer.from(screenshot, 'base64'), 'image/png');
  }

  async story(text: string): Promise<void> {
    await allureReporter.addStory(text);
  }

  async addLabel(name: string, value = ''): Promise<void> {
    allureReporter.addLabel(name, value);
  }

  async startStep(title: string): Promise<void> {
    await allureReporter.startStep(title);
  }

  async addStep(
    title: string,
    attachment?: { content: string; name?: string; type?: ContentType },
    status?: Status,
  ): Promise<void> {
    await allureReporter.addStep(title, attachment, status);
  }

  async endStep(status?: Status): Promise<void> {
    await allureReporter.endStep(status);
  }

  async epic(epic: string): Promise<void> {
    await allureReporter.addEpic(epic);
  }

  async setDescription(text: string, type = 'markdown'): Promise<void> {
    await allureReporter.addDescription(text, type);
  }

  async addOwner(owner: string): Promise<void> {
    await allureReporter.addOwner(owner);
  }

  async setSeverity(severity: string): Promise<void> {
    await allureReporter.addSeverity(severity);
  }

  async addIssue(issue: string): Promise<void> {
    await allureReporter.addIssue(issue);
  }

  async addFeature(feature: string): Promise<void> {
    await allureReporter.addFeature(feature);
  }

  async addAllureId(id: string): Promise<void> {
    await allureReporter.addAllureId(id);
  }

  async addTestId(testId: string): Promise<void> {
    await allureReporter.addTestId(testId);
  }

  async addSuite(suiteName: string): Promise<void> {
    await allureReporter.addSuite(suiteName);
  }

  async attachLogs(
    name: string,
    content: string | object | Buffer,
    type: ContentType | string,
  ): Promise<void> {
    await allureReporter.addAttachment(name, normalizeAttachmentContent(content), type);
  }

  async addTag(tag: string): Promise<void> {
    await allureReporter.addTag(tag);
  }

  async addLink(url: string, name?: string, type?: string): Promise<void> {
    await allureReporter.addLink(url, name, type);
  }

  async step<T>(name: string, action: () => T | Promise<T>): Promise<T> {
    return allureReporter.step(name, action);
  }

  async dataValidation(browser: BrowserLike, data: unknown): Promise<void> {
    await this.projectAttachment(browser, data);
  }

  async attachCustomScreenshot(
    _browser: BrowserLike,
    image: Buffer | string,
    screenshotName = 'Window Screenshot',
    contentType = ContentType.PNG,
  ): Promise<void> {
    await allureReporter.addAttachment(screenshotName, image, contentType);
  }

  async stdOutputAttachmentJson(data: unknown): Promise<void> {
    await this.attachLogs('Project System', data ?? {}, ContentType.TEXT);
  }

  async stdOutputAttachmentJSON(data: unknown): Promise<void> {
    await this.attachLogs('Contents of Project File to be deployed', data ?? {}, ContentType.TEXT);
  }

  async stdOutputAttachment(data: string, title: string): Promise<string> {
    await allureReporter.addAttachment(title, data, ContentType.TEXT);
    return data;
  }
}

export const allure = new AllureWrapper();
