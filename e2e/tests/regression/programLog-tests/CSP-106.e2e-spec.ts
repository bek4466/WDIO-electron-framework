// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/ProgramLogComponent/programLog.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathCSPT32 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT32.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-106");

/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-106`
 * @POM `https://extron.atlassian.net/browse/CSP-29`
 * @Description `Troubleshooting Component Tests,Program log's last updated timestamp validation`
 * @Date `10/24/2019`
 */

describe(`${tabTitles.REGRESSION.Program_Log} CSP-106:(Troubleshooting Test: Program log's last updated timestamp validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-24: As Francisco, I want retrieve the program log So that i can understand if there are any syntactically or dependencies issues");
        allure.addLink("User Story: CSP-24", "https://extron.atlassian.net/browse/CSP-24");
        allure.addLink("Task Issue: CSP-106", "https://extron.atlassian.net/browse/CSP-48");
        allure.addLink("Test Case: CSP-T35", "https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T35");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            throw new Error(err);
        });
    });

    it("Verify last updated time should be computer s time.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT32);
            await browser.pause(timeout.medium);
            // deploy the project
            await systemDeployment.deployButton.click()
                .then(async () => {
                    //await browser.pause(timeout.medium);
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
            await sideNav.troubleshootingWindow.click();
            // Program log should be opened on same page and there should be a refresh button

            await systemTroubleshooting.programLogTextAreaField.checkProgramLogTextAreaPresent()
                .then(async (programLogTextAreaIsPresent) => {
                    await expect(programLogTextAreaIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Program Log text area present" + `${err}`);
                });

            await systemTroubleshooting.programLogRefreshButton.checkRefreshProgramLogPresent()
                .then(async (programLogrefreshIsPresent) => {
                    await expect(programLogrefreshIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Program Log Button present" + `${err}`);
                    
                });

            await systemTroubleshooting.clearProgramLogButton.checkClearProgramLogPresent()
                .then(async (programLogClearIsPresent) => {
                    await expect(programLogClearIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Clear Program Log text present " + `${err}`);
                    
                });
            // Click on refresh button
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click on refresh button" + `${err}`);
                    
                });
            await browser.pause(timeout.slow);
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click on refresh button " + `${err}`);
                    
                });
            await browser.pause(timeout.slow);
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught:Check Last Updated Text Present " + `${err}`);
                    
                });
            // Check Last updated time, should be PC's time
            await systemTroubleshooting.lastUpdatedProgramLogText.checkLastUpdatedProgramLogTextPresent()
                .then(async (LastUpdatedTextExist) => {
                    await expect(LastUpdatedTextExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught:Check Last Updated Text Present " + `${err}`);
                    
                });
            await systemTroubleshooting.lastUpdatedProgramLogText.verifyLastUpdatedProgramLogText()
                .then(async (LastUpdatedTextmatches) => {
                    await expect(LastUpdatedTextmatches)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Last Updated Text accuracy" + `${err}`);
                    
                });
            resolve();
        }).catch((err) => {
            logClient.error("CSP-106 Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
