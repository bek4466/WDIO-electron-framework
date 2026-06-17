// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { ProgramLogComponent } from "../../../src/ProgramLogComponent/programLog.po";
import { TroubleshootingPage } from "../../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFilePathCSPT25 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT25.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-96");

/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-96`
 * @POM `https://extron.atlassian.net/browse/CSP-29`
 * @Description `Troubleshooting Component Tests, No Program logs validation`
 * @Date `10/22/2019`
 */

describe(`${tabTitles.REGRESSION.Program_Log} CSP-96:(Troubleshooting Test: No Program log validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-24: As Francisco, I want retrieve the program log So that i can understand if there are any syntactically or dependencies issues");
        allure.addLink("https://extron.atlassian.net/browse/CSP-24", "User Story: CSP-24");
        allure.addLink("https://extron.atlassian.net/browse/CSP-96", "Task Issue: CSP-96");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T25", "Test Case: CSP-T25");
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

    it("Verify User can manually refresh the program logs.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT25);
            await browser.pause(timeout.slow);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Deploy Button exists" + `${err}`);
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            // Program log should be opened on same page and there should be a refresh button
            await systemTroubleshooting.programLogRefreshButton.checkRefreshProgramLogPresent()
                .then(async (programLogrefreshIsPresent) => {
                    await expect(programLogrefreshIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught:  Refresh Button Present" + `${err}`);
                });
            await systemTroubleshooting.clearProgramLogButton.checkClearProgramLogPresent()
                .then(async (programLogClearIsPresent) => {
                    await expect(programLogClearIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Clear Button Present" + `${err}`);
                });
            // Click on refresh button
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                    await systemTroubleshooting.programLogRefreshButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh " + `${err}`);
                });

            resolve();
        })
            .catch((err: Error) => {
                logClient.error("Exception caught: Log Verification" + `${err}`);
            });
    });
});

