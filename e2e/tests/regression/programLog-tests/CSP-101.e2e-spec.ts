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
const systeminfoT26 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT26.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-101");
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-101`
 * @POM `https://extron.atlassian.net/browse/CSP-29`
 * @Description `Troubleshooting Component Tests,Program log's timestamp validation`
 * @Date `10/22/2019`
 */

describe(`${tabTitles.REGRESSION.Program_Log} CSP-101:(Troubleshooting Test: Program log's timestamp validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-24: As Francisco, I want retrieve the program log So that i can understand if there are any syntactically or dependencies issues");
        allure.addLink("https://extron.atlassian.net/browse/CSP-24", "User Story: CSP-24");
        allure.addLink("https://extron.atlassian.net/browse/CSP-101", "Task Issue: CSP-101");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T34", "Test Case: CSP-T34");
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

    it("Verify program log should have primary controller s timestamp and date.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await browser.pause(timeout.fast);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systeminfoT26);
            // await systemTroubleshooting.destinyInputPathField.inputPathT26();
            await browser.pause(timeout.fast);
            // deploy the project
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
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh Button " + `${err}`);
                });
            await browser.pause(timeout.slow);
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh Button " + `${err}`);
                });
            await browser.pause(timeout.slow);
            // program log content should contains controller's time
            await systemTroubleshooting.programLogTextAreaField.checkProgramLogControllerDateTimestamp(data.controllerIP, data.controllerUserName, data.controllerPassword)
                .then(async (programLogControllerDateTimestampExist) => {
                    await expect(programLogControllerDateTimestampExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Check Timestamp " + `${err}`);
                });
            resolve();
        }).catch((err) => {
            logClient.error("CSP-101: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
