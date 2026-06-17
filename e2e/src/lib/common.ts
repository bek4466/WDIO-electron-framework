/* tslint:disable */
// @ts-nocheck
import * as chai from "chai";
import * as chaiAsPromised from "chai";
import * as fs from "fs-extra";
import * as path from "path";

import { AllureInterface, ContentType } from "jasmine-allure2-reporter";
const timeoutData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const titles = fs.readJsonSync(path.join(__dirname, "..", "JSON", "tabTitles.json"));
declare let global;
const allure: AllureInterface = global.allure;

export async function titleValidation(app: WebdriverIO.Browser){
    await app.getTitle().then(async (title)=>{
        await expect(title).toEqual(titles.mainTab)
    });
    await app.$(locators.titleBar).getText().then(async (text)=>{
        await expect(text).toBe(titles.mainTab);
    });
}

export function stopApp(app: WebdriverIO.Browser) {
  
}

export function getPlatform(): string {
    switch (process.platform) {
        case "win32":
            return "Windows";
        case "linux":
            return "Linux";
        case "darwin":
            return "Mac";
        default:
            return "";
    }
}

export async function fullScreen(app: WebdriverIO.Browser) {
    return await browser.maximizeWindow()
}

export async function Url(app: WebdriverIO.Browser) {
    await app.getUrl().then(async url => {
        await expect(url).toBeTruthy();
    });
}


export async function setUp(app, browserWindow) {
   // await switchToWindow(app, "Toolbelt");
   // await fullScreen(app, browserWindow);
}
