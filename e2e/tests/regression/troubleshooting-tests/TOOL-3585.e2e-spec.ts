// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";



import { allure } from "../../../src/allure/allure";
import { CommonMethods } from "../../commonMethods.po";
import { LogClient } from "@extron/winston-logger";

const common = new CommonMethods();
const logClient = new LogClient("e2e:CSP-30");

const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));

/**
 * @Author `Kiran S`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-3501`
 * @JIRA_Link_POM `https://extron.atlassian.net/browse/TOOL-3585`
 * @Description `Splashscreen validation`
 * @Date `03/17/2022`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-3585: Splash screen implementation`, () => {
    beforeEach(async () => {
        allure.addOwner("Kiran S");
        allure.story("TOOL-3501: Splash screen implementation");
        allure.addLink("User Story: TOOL-3501", "https://extron.atlassian.net/browse/TOOL-3501");
        allure.addLink("Task Issue: TOOL-3585", "https://extron.atlassian.net/browse/TOOL-3502");
        return new Promise<void>(async (resolve) => {


            await common.checkSplashScreen(browser);
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Dummy test to check for splash screen", async () => {
        expect(true).toBe(true);
    });

});
