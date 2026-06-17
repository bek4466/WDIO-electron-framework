/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { CommonMethods } from "../../commonMethods.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent";
import { browser } from "@wdio/globals";
let common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));

xdescribe(`${tabTitles.SMOKE} Side Navigation Model Tests`, () => {
    beforeEach(async () => {
        allure.addOwner("Oybek T");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async resolve => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch(err => {
            console.log(err);
        });
    });

    afterEach(async () => {
    });

    it("Navigation Side Panel tests for Deployment and Troubleshooting Pages", async () => {
        const d: Date = new Date();
        return new Promise<void>(async resolve => {
        const systemDeployment = new SideNavigationComponent(browser);
        await systemDeployment.deployWindow.click();
        await allure.screenshot(browser, "Navigated to Deployment View: ");
        await systemDeployment.troubleshootingWindow.click();
        await allure.screenshot(browser, "Navigated to Troubleshooting View: ");
            resolve();
        }).catch((err) => {
            console.log("Side Nav: Exception Error: " + `${err}`);
            return Promise.resolve(err +'Should have thrown');
        });
    });
});
