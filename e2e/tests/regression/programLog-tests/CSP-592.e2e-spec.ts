// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/ProgramLogComponent/programLog.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFilePathT853 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT853.json");
// const sysjson = fs.readJsonSync(systemInfoFilePathT128);
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "locators.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-592");


/**
 * @Author `Miguel C - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/CSP-547`
 * @Description `State Management tests`
 * @Date `4/22/2020`
 */

describe(`${tabTitles.REGRESSION.Program_Log} CSP-592:(Program_Log: suite)`, () => {
    before(async () => {
        allure.addOwner("Miguel C");
        allure.story("CSP-141: runtime messages ");
        allure.addLink("https://extron.atlassian.net/browse/CSP-547", "User Story: CSP-547");
        allure.addLink("https://extron.atlassian.net/browse/CSP-592", "Task Issue: CSP-592");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T853", "Test Case: CSP-T853");
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

    it("Verify that Program Log Contents remain consistent when switching between views", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const userSettings = new CredsComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT853);
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await browser.pause(timeout.medium);
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.fast);
            await sideNav.troubleshootingWindow.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await systemTroubleshooting.programLogRefreshButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    await systemTroubleshooting.programLogTextAreaField.checkProgramLogContent(data.programLogMessage)
                        .then(async (programLogContentExist) => {
                            await expect(programLogContentExist)
                                .toEqual(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: Check Program Log content " + `${err}`);
                            
                        });
                });
            await browser.pause(timeout.fast);
            await sideNav.deployWindow.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await systemTroubleshooting.programLogRefreshButton.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await browser.pause(timeout.medium);
            await systemTroubleshooting.programLogTextAreaField.checkProgramLogContent(data.programLogMessage)
                .then(async (programLogContentExist) => {
                    await expect(programLogContentExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            resolve();
        }).catch((err) => {
            console.log("CSP-592: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Program_Log} CSP-592:(Program_Log: suite)`, () => {
    before(async () => {
        allure.addOwner("Miguel C");
        allure.story("CSP-141: runtime messages ");
        allure.addLink("https://extron.atlassian.net/browse/CSP-547", "User Story: CSP-547");
        allure.addLink("https://extron.atlassian.net/browse/CSP-592", "Task Issue: CSP-592");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T884", "Test Case: CSP-T884");
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


    it("Verify that Last Updated Date & Time of Program Log remains persistent when switching views", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const userSettings = new CredsComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT853);
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.fast);
            await sideNav.troubleshootingWindow.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await systemTroubleshooting.programLogRefreshButton.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await systemTroubleshooting.lastUpdatedProgramLogText.exists()
                .then(async (dateExists) => {
                    await expect(dateExists)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            const dateText = await systemTroubleshooting.lastUpdatedProgramLogText.getProgLogDate()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await sideNav.deployWindow.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await systemTroubleshooting.lastUpdatedProgramLogText.exists()
                .then(async (dateExists) => {
                    await expect(dateExists)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            await systemTroubleshooting.lastUpdatedProgramLogText.getProgLogDate()
                .then(async (logDate) => {
                    await expect(logDate)
                        .toBe(dateText as string);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log content " + `${err}`);
                });
            resolve();
        }).catch((err) => {
            console.log("CSP-592: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
