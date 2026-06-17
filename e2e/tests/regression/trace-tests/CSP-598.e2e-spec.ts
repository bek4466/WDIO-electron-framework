// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
const common = new CommonMethods();
const systemInfoFilePathT862 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT862.json");
const systemInfoFilePathT863 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT863.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "locators.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-1341");


/**
 * @Author `Miguel C - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-1521`
 * @Description `Add e2e specs : for Trace Bad Scenarios: CSP- T862, T863, T865`
 * @Date `4/20/2020`
 */

// Currently disabled due to innability of testing trace component in CI
describe(`${tabTitles.REGRESSION.Trace} TOOL-1341:(Trace Test  Bad Scenarios: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel C");
        allure.story("CSP-81: system.system_id ");
        allure.addLink("User Story: TOOL-1521", "https://extron.atlassian.net/browse/TOOL-1521");
        allure.addLink("Task Issue: TOOL-1341", "https://extron.atlassian.net/browse/TOOL-1341");
        allure.addLink("Test Case: TOOL-T2794", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2794");
        return new Promise<void>(async (resolve) => {
            
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    it("Verify that incorrect credentials for Primary controller gives browserropriate error message while starting trace.", async () => {
        return new Promise<void>(async (resolve) => {
        const systemDeployment = new DeployComponent(browser);
        const systemTroubleshooting = new StartStopProgramComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        const userSettings = new CredsComponent(browser);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT862);
        await browser.pause(timeout.fast);
        const sideNav = new SideNavigationComponent(browser);
        await browser.pause(timeout.fast);
        await sideNav.troubleshootingWindow.click();
        await browser.pause(timeout.fast);
        const tracearea =  new TraceComponent(browser);
        await tracearea.startTraceButton.click();
        await browser.pause(timeout.slow);
        await messageComponent.messageRowValue.checkMessagePaneLogs(data.controllerCredentialsIncorrectMessage, data.errorSeverity)
        .then(async (value: boolean) => {
            await expect(value)
            .toEqual(true);
        })
        .catch((err: Error) => {
            logClient.error("Exception caught" + `${err}`);
            //fail("checkMessagePaneLogs");
        });
        resolve();
        }).catch((err) => {
            logClient.error("TOOL-1341: Exception Error: " + `${err}`);
            //fail("CSP598 invalid datatype ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Trace} TOOL-1341:(Trace Test  Bad Scenarios: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel C");
        allure.story("CSP-81: system.system_id ");
        allure.addLink("User Story: TOOL-1521", "https://extron.atlassian.net/browse/TOOL-1521");
        allure.addLink("Task Issue: TOOL-1341", "https://extron.atlassian.net/browse/TOOL-1341");
        allure.addLink("Test Case: TOOL-T2795", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2795");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    it("Verify that incompatible model for Primary controller gives browserropriate error message while starting trace.", async () => {
        return new Promise<void>(async (resolve) => {
        const systemDeployment = new DeployComponent(browser);
        const systemTroubleshooting = new StartStopProgramComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        const userSettings = new CredsComponent(browser);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT863);
        await browser.pause(timeout.medium);
        const sideNav = new SideNavigationComponent(browser);
        await sideNav.troubleshootingWindow.click();
        await browser.pause(timeout.fast);
        const tracearea =  new TraceComponent(browser);
        await tracearea.startTraceButton.click();
        await browser.pause(timeout.slow);
        await messageComponent.messageRowValue.checkMessagePaneLogs(data.deviceIncompatible, data.errorSeverity)
        .then(async (value: boolean) => {
            await expect(value)
            .toEqual(true);
        })
        .catch((err: Error) => {
            logClient.error("Exception caught" + `${err}`);
            //fail("checkMessagePaneLogs");
        });
        resolve();
        }).catch((err) => {
            logClient.error("TOOL-1341: Exception Error: " + `${err}`);
            //fail("CSP598 invalid datatype ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Trace} TOOL-1341:(Trace Test  Bad Scenarios: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel C");
        allure.story("CSP-81: system.system_id ");
        allure.addLink("User Story: TOOL-1521", "https://extron.atlassian.net/browse/TOOL-1521");
        allure.addLink("Task Issue: TOOL-1341", "https://extron.atlassian.net/browse/TOOL-1341");
        allure.addLink("Test Case: TOOL-T2795", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2795");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    it("Verify trace is disabled, if no destiny file is selected and starting trace.", async () => {
        return new Promise<void>(async (resolve) => {
        await browser.pause(timeout.medium);
        const sideNav = new SideNavigationComponent(browser);
        await sideNav.deployWindow.click();
        await browser.pause(timeout.medium);
        await sideNav.troubleshootingWindow.click();
        await browser.pause(timeout.medium);
        const tracearea =  new TraceComponent(browser);
        await tracearea.startTraceButton.isDisabled()
            .then(async (result) => {
                await expect(result)
                .toBe(true);
            })
        .catch((err: Error) => {
            logClient.error(err);
            //fail("trace:playexists");
        });
        resolve();
        }).catch((err) => {
            logClient.error("TOOL-1341: Exception Error: " + `${err}`);
            //fail("CSP598 invalid datatype ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
