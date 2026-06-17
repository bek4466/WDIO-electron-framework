// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { CommonMethods } from "../../commonMethods.po";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathCSPT275 = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275.json");
const dataFilePathProgramStartStopProject = path.join(__dirname, "..", "..","..", "resources", "ProgramStartStopProject", "dataFile", "DataFile.json");
import { LogClient } from "@extron/winston-logger";
import { browser } from "@wdio/globals";
const logClient = new LogClient("e2e:TOOL-1957");
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-275`
 * @POM `https://extron.atlassian.net/browse/CSP-176`
 * @Description `Troubleshooting Component Tests,Start/Stop Program validation`
 * @Date `11/06/2019`
 */

xdescribe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-1957:(Troubleshooting Test: Start Program validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1602", "User Story: TOOL-1602");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1957", "Task Issue: TOOL-1957");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2384", "Test Case: TOOL-T2384");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it("Verify that Start Program button functions correctly (using Trace Messages to verify)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            // clicking on destiny file input field
            await browser.pause(timeout.medium);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT275);
            await systemDeployment.deployButton.click()
                .then(async () => {
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
            await browser.pause(timeout.slow);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            // verify Stop Program button is displaying checkStopProgramButtonPresent
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await browser.pause(timeout.medium);
            //  check if program is running on tlp by launching vtlp ui
            const a2 = path.resolve(dataFilePathProgramStartStopProject);
            const sysjson = fs.readJsonSync(a2);
            //  check if program is running on tlp by launching vtlp ui
            await systemTroubleshooting.startProgramButton.checkProgramIsRunning(sysjson.ENG.B3.Devices[0].deviceCredentials[6].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui, data.vtlpLabel1, data.vtlpLabel2, data.vtlpLabel3, data.vtlpLabel4)
                .then(async (isProgramRunning) => {
                    await expect(isProgramRunning)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-1957: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-1957:(Troubleshooting Test: Stop Program validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1602", "User Story: TOOL-1602");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1957", "Task Issue: TOOL-1957");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2379", "Test Case: TOOL-T2379");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it("Verify that Stop Program button functions correctly (using Trace Messages to verify)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            await browser.pause(timeout.slow);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT275);
            await browser.pause(timeout.slow);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.click()
                .then(async () => {

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
            await browser.pause(timeout.fast);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            // verify Stop Program button is displaying
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            // click on stop button
            await systemTroubleshooting.stopProgramButton.click();
            await browser.pause(timeout.medium);
            //  verify Start Program button is displaying
            await systemTroubleshooting.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);

                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await browser.pause(timeout.medium);
            // check if program is stopped on tlp by launching vtlp ui
            const a2 = path.resolve(dataFilePathProgramStartStopProject);
            const sysjson = fs.readJsonSync(a2);
            await systemTroubleshooting.stopProgramButton.checkProgramGotStopped(sysjson.ENG.B3.Devices[0].deviceCredentials[6].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui, data.vtlpProgramNotRunningMessage)
                .then(async (isProgramstopped) => {
                    await expect(isProgramstopped)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await systemTroubleshooting.startProgramButton.click();
            await browser.pause(2 * timeout.slow);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-1957: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
