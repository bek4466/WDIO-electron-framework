// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfo.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-2044");

/*
 * @Author `Amit B`
 * @LinkToJIRA `https://extron.atlassian.net/browse/Tool-2044`
 * @POM `https://extron.atlassian.net/browse/CSP-176`
 * @Description `Troubleshooting Component Tests,Start/Stop Program Message validation`
 * @Date `10/13/2020`
 */

describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2044:(Verify start program from "Isle of Arran", when trace is started in "Isle of Arran")`, () => {
    beforeEach(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("User Story: TOOL-1602", "https://extron.atlassian.net/browse/TOOL-1602");
        allure.addLink("Task Issue: TOOL-2043", "https://extron.atlassian.net/browse/CSP-2043");
        allure.addLink("Test Case: TOOL-T2496", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2496");
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

    it("Verify that using Start Program button gives browserropriate Messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            // Provide valid destiny file
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePath);
            await browser.pause(timeout.slow);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                            //fail("deploybuttonisEnabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            const tracearea =  new TraceComponent(browser);
            await tracearea.startTraceButton.click();
            await browser.pause(timeout.fast);
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
            await sideNav.deployWindow.click();
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
                            //fail("deploybuttonisEnabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            // Navigate to troubleshooting option from sidebar
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            await messageComponent.messagePaneVisible.isVisible()
                        .then(async (value) => {
                            await expect(value)
                                .toBe(true);
                        })
                .catch((err: Error) => {
                    logClient.error("Exception caught: OpenMessage Pane Button not Visible" + `${err}`);
                });
            await browser.pause(10000);
            // clicking on stop Program
            await systemTroubleshooting.stopProgramButton.click()
                .then(async () => {
                    // Verify that start program button is visible
                    await browser.pause(timeout.medium);
                    await systemTroubleshooting.startProgramButton.isVisible()
                        .then(async (value) => {
                            await expect(value)
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
            await tracearea.stopTraceButton.click();
            // Program Started should be displayed
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.programStartedMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        }).catch((err) => {
            logClient.error("CSP-175: Exception Error: " + `${err}`);
            //fail("CSP-175");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

