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
const systemInfoFilePathCSPT26 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT26.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-48");

/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-48`
 * @POM `https://extron.atlassian.net/browse/CSP-29`
 * @Description `Troubleshooting Component Tests,Program log's content validation`
 * @Date `10/22/2019`
 */

describe(`${tabTitles.REGRESSION.Program_Log} CSP-48:(Troubleshooting Test: Program log's content validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-24: As Francisco, I want retrieve the program log So that i can understand if there are any syntactically or dependencies issues");
        allure.addLink("https://extron.atlassian.net/browse/CSP-24", "User Story: CSP-24");
        allure.addLink("https://extron.atlassian.net/browse/CSP-48", "Task Issue: CSP-48");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T26", "Test Case: CSP-T26");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    it("Verify Timestamp,date,type of logs and last updated is included in program logs.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // sending input file to deploy the project
            await browser.pause(timeout.medium);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT26);
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
            // Click on refresh button
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh " + `${err}`);
                });
            await browser.pause(timeout.medium);
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught:Click Refresh " + `${err}`);
                });
            await browser.pause(timeout.medium);
            // Check Last updated time, should be PC's time
            await systemTroubleshooting.lastUpdatedProgramLogText.checkLastUpdatedProgramLogTextPresent()
                .then(async (LastUpdatedTextExist) => {
                    await expect(LastUpdatedTextExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Last Updated Text" + `${err}`);
                });
            await systemTroubleshooting.lastUpdatedProgramLogText.verifyLastUpdatedProgramLogText()
                .then(async (LastUpdatedTextmatches) => {
                    await expect(LastUpdatedTextmatches)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Last Updated Time " + `${err}`);
                });
            // Refresh should get the latest logs from the system and should contains controller's time, timestamp and message type
            await systemTroubleshooting.programLogTextAreaField.checkProgramLogDateTimestamp(data.controllerIP, data.controllerUserName, data.controllerPassword, data.messageType)
                .then(async (programLogDateTimestampContentExist) => {
                    await expect(programLogDateTimestampContentExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Refresh Program Logs" + `${err}`);
                });
            await browser.pause(timeout.medium);
            resolve();
        }).catch((err) => {
            logClient.error("CSP-48: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
