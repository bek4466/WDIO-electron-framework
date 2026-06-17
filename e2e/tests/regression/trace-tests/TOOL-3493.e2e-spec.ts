// @ts-nocheck
import { CommunicationClient } from "@extron/communication";
import * as fs from "fs-extra";
import * as path from "path";


import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { TraceComponent } from "../../../src/traceComponent";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "GoldenDualnicProject", "systeminfo.json");
const systemInfoFile2 = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "systeminfo.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3493");
const comClient = new CommunicationClient();

/**
 * @Author `Austin L QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3493`
 * @Date `2/10/2022`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-3466:(Terminate Trace Session After Selecting A Different Project)`, () => {
    beforeEach(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-3466: Terminate Trace Session After Selecting A Different Project");
        allure.addLink("User Story: TOOL-3466", "https://extron.atlassian.net/browse/TOOL-3466");
        allure.addLink("Task Issue: TOOL-3493", "https://extron.atlassian.net/browse/TOOL-3493");
        allure.addLink("Test Case: TOOL-T1010", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T1010");
        return new Promise<void>(async (resolve) => {
            
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });

    it("Verify that UI elements indicates that trace stops when changing projects", async () => {
        const systemDeployment = new DeployComponent(browser);
        const sideNav = new SideNavigationComponent(browser);
        const traceComponent = new TraceComponent(browser);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile);

        await sideNav.troubleshootingWindow.click();
        await traceComponent.startTraceButton.click();
        await browser.pause(timeout.halfSec);
        await traceComponent.stopTraceButton.isVisible()
            .then(async (value: boolean) => {
                expect(value)
                    .toBe(true);
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`) ;
                //fail("stopTraceButton.isVisible()");
            });
        await traceComponent.traceSpinner.isVisible()
            .then(async (value: boolean) => {
                expect(value)
                    .toBe(true);
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`) ;
                //fail("traceSpinner.isVisible()");
            });

        await sideNav.deployWindow.click();
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile2);

        await sideNav.troubleshootingWindow.click();
        await browser.pause(timeout.halfSec);
        await traceComponent.stopTraceButton.isVisible()
            .then(async (value: boolean) => {
                expect(value)
                    .toBe(false);
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`) ;
                //fail("stopTraceButton.isVisible()");
            });
        await traceComponent.traceSpinner.isVisible()
            .then(async (value: boolean) => {
                expect(value)
                    .toBe(false);
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`) ;
                //fail("traceSpinner.isVisible()");
            });
    });
});