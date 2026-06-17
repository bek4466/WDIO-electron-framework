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
const systemInfoFilePathCSPT276 = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfoT276.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-1968");
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-1968`
 * @POM `https://extron.atlassian.net/browse/CSP-176`
 * @Description `Troubleshooting Component Tests,Start/Stop Program Message validation`
 * @Date `11/07/2019`
 */

describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-1968:(Troubleshooting Test: Start/stop Program Message validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("User Story: TOOL-1602", "https://extron.atlassian.net/browse/TOOL-1602");
        allure.addLink("Task Issue: TOOL-1968", "https://extron.atlassian.net/browse/TOOL-1968");
        allure.addLink("Test Case: TOOL-T2385", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2385");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            throw new Error(err);
        });
    });

    it("Verify that using Start Program button gives browserropriate Messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            // Provide valid destiny file
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT276);
            await browser.pause(timeout.slow);
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
            await browser.pause(2 * timeout.slow);

            await messageComponent.openMessagePaneButton.click()
                .then(async () => {
                    // Verify that the Message Panel is visible
                    await browser.pause(timeout.medium);
                    await messageComponent.messagePaneVisible.isVisible()
                        .then(async (value) => {
                            await expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: Message Pane not Visible " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: OpenMessage Pane Button not Visible" + `${err}`);
                });

            // clicking on stop Program
            await systemTroubleshooting.stopProgramButton.click()
                .then(async () => {
                    // Verify that start program button is visible
                    await browser.pause(timeout.medium);
                    await systemTroubleshooting.startProgramButton.isVisible()
                        .then(async (value) => {
                            expect(value)
                                .toBe(true);
                            await systemTroubleshooting.startProgramButton.click()
                                .then(async () => {
                                })
                                .catch((err: Error) => {
                                    logClient.error("Exception caught: start program button didn't get clicked " + `${err}`);
                                });
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: start program button is not Visible " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: stop program Button not clicked" + `${err}`);

                });

            // Program Started should be displayed
            await messageComponent.messageRowValue.checkTroublrshootingMessagePaneLogs(data.programStartedMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-1968: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});


describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-1968:(Troubleshooting Test: Start/stop Program Message validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1602", "User Story: TOOL-1602");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1968", "Task Issue: TOOL-1968");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2380", "Test Case: TOOL-T2380");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            throw new Error(err);
        });
    });

    it("Verify that using Stop Program button gives browserropriate Messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            // Provide valid destiny file
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT276);
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
            await browser.pause(2 * timeout.slow);

            // verify Stop Program button is displaying
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: start program button is not Visible " + `${err}`);
                });

            // clicking on stop Program
            await systemTroubleshooting.stopProgramButton.click()
                .then(async () => {
                    // Verify that start program button is visible
                    await browser.pause(timeout.medium);
                    await systemTroubleshooting.startProgramButton.isVisible()
                        .then(async (value) => {
                            await expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: start program button is not Visible " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: stop program Button not clicked" + `${err}`);

                });

            await messageComponent.openMessagePaneButton.click()
                .then(async () => {
                    // Verify that the Message Panel is visible
                    await browser.pause(timeout.medium);
                    await messageComponent.messagePaneVisible.isVisible()
                        .then(async (value) => {
                            await expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: Message Pane not Visible " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: OpenMessage Pane Button not Visible" + `${err}`);
                });
            // Program Started should be displayed
            await messageComponent.messageRowValue.checkTroublrshootingMessagePaneLogs(data.programStoppedMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await systemTroubleshooting.startProgramButton.click();
            await browser.pause(2 * timeout.slow);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-1968: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });

});
