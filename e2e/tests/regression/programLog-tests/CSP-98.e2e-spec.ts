// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/ProgramLogComponent/programLog.po";
import { TroubleshootingPage } from "../../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFilePathCSPT32 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT32.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-97");

/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-98`
 * @POM `https://extron.atlassian.net/browse/CSP-29`
 * @Description `Troubleshooting Component Tests,Program logs validation`
 * @Date `10/22/2019`
 */

describe(`${tabTitles.REGRESSION.Program_Log} CSP-98:(Troubleshooting Test: Program log validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-24: As Francisco, I want retrieve the program log So that i can understand if there are any syntactically or dependencies issues");
        allure.addLink("https://extron.atlassian.net/browse/CSP-24", "User Story: CSP-24");
        allure.addLink("https://extron.atlassian.net/browse/CSP-98", "Task Issue: CSP-98");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T32", "Test Case: CSP-T32");
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

    it("Verify that program logs should be generated after system has been deployed.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            await browser.pause(timeout.fast);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT32);
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                            
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            // Program log should be opened on same page and there should be a refresh button
            await systemTroubleshooting.programLogTextAreaField.checkProgramLogTextAreaPresent()
                .then(async (programLogTextAreaIsPresent) => {
                    await expect(programLogTextAreaIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Program Log text area" + `${err}`);
                });
            await systemTroubleshooting.programLogRefreshButton.checkRefreshProgramLogPresent()
                .then(async (programLogrefreshIsPresent) => {
                    await expect(programLogrefreshIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Refresh Program Log Button   " + `${err}`);
                });
            await systemTroubleshooting.clearProgramLogButton.checkClearProgramLogPresent()
                .then(async (programLogClearIsPresent) => {
                    await expect(programLogClearIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Clear Program Log Button" + `${err}`);
                });
            // Click on refresh button
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh Button" + `${err}`);
                });
            await browser.pause(timeout.slow);
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh Button" + `${err}`);
                });
            await browser.pause(timeout.slow);
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh Button" + `${err}`);
                });
            // Refresh should get the latest logs from the system.
            await systemTroubleshooting.programLogTextAreaField.checkProgramLogContent(data.programLogMessage)
                .then(async (programLogContentExist) => {
                    await expect(programLogContentExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            resolve();
        }).catch((err: Error) => {
            logClient.error("Exception caught:Check Program Log content " + `${err}`);
        });
    });
});
