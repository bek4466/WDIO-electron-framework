/* tslint:disable */
// @ts-nocheck
import { browser } from '@wdio/globals'
import * as fs from "fs-extra";
import * as path from "path";
import { CommonMethods } from "../../commonMethods.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent";
import { allure } from 'e2e/src/allure/allure';

const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
let common = new CommonMethods();
let csduWindowHandle: any;

/**
 * Changes I made:
 * 1. allure --> allure
 * 2. allure.screenshot --> browser.takeScreenshot()    // may need to change if not showing up on allure.
 * 3. remove 'Import' Application and Protractor
 * 4. add windowHandle switcher to beforeEach
 * 4. common.switchToWin --> logIn
 * 5. app: WebdriverIO.Browser --> app: WebdriverIO.Browser
 *    a. follow parent upward: new SideNavigationComponent(app) --> sideNaveComponent.po.ts --> deployPage.po.ts --> matButton.po.ts --> element.ts
 *       1. element.ts: update 'app.client' --> app.appropriate replacement function
 *       2. matButton.po.ts: update 'app.client' --> app.appropriate replacement function
 *       3. deployPage.po.ts: update 'app.client' --> app.appropriate replacement function
 *       4. helpPage.po.ts update 'app.client' --> app.appropriate replacement function
 * 6. SideNavigationComponent(app); --> browser
 * 7. in MatButton replace allure.step --> allure.step
 */

describe(`${tabTitles.REGRESSION.Side_Navigation}  Side Navigation Model Tests`, () => {
    beforeEach(async () => {
        // allure.addOwner("Oybek T");
        // allure.addO
        // allure.addStory("Not Created");
        // allure.addLink("Not Created", "");
        await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
        browser.takeScreenshot()
    });

    afterEach(async () => {
        //OLD if (app && app.isRunning()) {
        //OLD await allure.screenshot(app, "After");
        //OLD }
        browser.takeScreenshot()
    });

    it("Navigation Side Panel tests for Deployment and Troubleshooting Pages", async () => {
        const sideNav = new SideNavigationComponent(browser);
        await sideNav.deployWindow.click();
        await sideNav.troubleshootingWindow.click();
        await sideNav.helpPage.click();
        await sideNav.deployWindow.click();
    });
});