// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathCSPT275 = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-1952");
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-1952`
 * @POM `https://extron.atlassian.net/browse/CSP-176`
 * @Description `Troubleshooting Component Tests,Start/Stop Icon Program validation`
 * @Date `11/07/2019`
 */

describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-1952:(Troubleshooting Test: Start/stop Icon Program validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1602", "User Story: TOOL-1602");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1952", "Task Issue: TOOL-1952");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2386", "Test Case: TOOL-T2386");
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

    it("Verify that on clicking Start button, icon changes to Stop icon", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT275);
            await browser.pause(timeout.medium);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
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
            await browser.pause(2 * timeout.slow);

            // verify Stop Program button is displaying
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    
                });
            await browser.pause(timeout.medium);
            // click on stop button
            await systemTroubleshooting.stopProgramButton.click();
            await browser.pause(2 * timeout.slow);

            // checking stop icon changed to start icon
            // Verify Start program icon is displaying
            await systemTroubleshooting.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    
                });
            await browser.pause(timeout.medium);

            // click on start button
            await systemTroubleshooting.startProgramButton.click();
            await browser.pause(timeout.slow);

            // verify stop program icon is displaying
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-1952: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });

});


describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-1952:(Troubleshooting Test: Start/stop icon Program validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1602", "User Story: TOOL-1602");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1952", "Task Issue: TOOL-1952");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2382", "Test Case: TOOL-T2382");
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

    it("Verify that on clicking Stop button, icon changes to Start icon", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            // const startStopProgram = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT275);
            await browser.pause(timeout.medium);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
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
            await browser.pause(2 * timeout.slow);

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
            await browser.pause(timeout.slow);

            // checking stop icon changed to start icon
            // Verify Start program icon is displaying
            await systemTroubleshooting.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await systemTroubleshooting.startProgramButton.click();
            await browser.pause(2 * timeout.slow);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-1952: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
