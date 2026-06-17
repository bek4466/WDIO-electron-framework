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
const data = fs.readJSONSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJSONSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJSONSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathCSPT25 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT25.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-97");

/**
 * @Author `JoeV.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-97`
 * @POM `https://extron.atlassian.net/browse/CSP-27`
 * @Description `Troubleshooting Component Tests, Program Logs functionality verification`
 * @Date `11/6/2019`
 */

describe(`${tabTitles.REGRESSION.Program_Log} CSP-97:(Troubleshooting Component Tests, Program Logs functionality verification)`, () => {
    before(async () => {
        allure.addOwner("Joe Vanacore");
        allure.story("CSP-27: As Francisco, I want to know the program information running on my system so I can troubleshoot and make updates accordingly");
        allure.addLink("https://extron.atlassian.net/browse/CSP-27", "User Story: CSP-27");
        allure.addLink("https://extron.atlassian.net/browse/CSP-97", "Task IssueL CSP-97");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/2857795", "Test Case: CSP-T30");
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

    it("Verify Program Logs should be available", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            // Type input file to deploy project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT25);
            await browser.pause(timeout.fast);
            // Verify deploy button is displayed
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
            // Navigate to Troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            // Program log should be opened on the same page
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh Button" + `${err}`);
                });
            await browser.pause(timeout.medium);
            // Click on refresh button
            await systemTroubleshooting.programLogRefreshButton.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh Button" + `${err}`);
                });
            await browser.pause(timeout.medium);
            // Verify program log text area is present
            await systemTroubleshooting.programLogTextAreaField.checkProgramLogTextAreaPresent()
                .then(async (programLogTextPresent) => {
                    await expect(programLogTextPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log Area Present" + `${err}`);
                });
            // Check program log content
            await systemTroubleshooting.programLogContent.checkNotEmpty()
                .then(async (programLogContentNotEmpty) => {
                    await expect(programLogContentNotEmpty)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Program Log Area not empty " + `${err}`);
                });
            resolve();
        }).catch((err) => {
            logClient.error("CSP-97: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });

});
