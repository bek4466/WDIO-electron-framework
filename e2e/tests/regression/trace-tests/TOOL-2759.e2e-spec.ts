// @ts-nocheck
import { CommunicationClient } from "@extron/communication";
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
const common = new CommonMethods();
const systemInfoFilePath1 = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfoT592.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2759");
/**
 * @Author `Austin L QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2759`
 * @Date `07/07/2021`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1654:(State Management - Trace Status & Content to Remain Consistent)`, () => {
    beforeEach(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-1654: State Management - Trace Status & Content to Remain Consistent");
        allure.addLink("User Story: TOOL-1654", "https://extron.atlassian.net/browse/TOOL-1654");
        allure.addLink("Task Issue: TOOL-2759", "https://extron.atlassian.net/browse/TOOL-2759");
        allure.addLink("Test Case: TOOL-T2797", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2797");
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

    it("Verify that Trace Session running remains persistent when switching between views", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);

            // deploy good project
            await systemDeployment.destinyInputPathField.setDestinyFileToUpload(systemInfoFilePath1);
            await systemDeployment.deployButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("checkMessagePaneLogs");
                });

            // navigate to troubleshooting window and start trace
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.superFast);
            await traceComponent.startTraceButton.click();
            await browser.pause(timeout.fast);
            await traceComponent.traceSpinner.checkSpinner()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("checkSpinner");
                });
            await traceComponent.stopTraceButton.exists()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("stopTraceButton.exists");
                });
            
            // navigate to deploy view
            await sideNav.deployWindow.click();
            await systemDeployment.deployButton.exists()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deployButton.exists");
                });
            
            // navigate to troubleshooting window and confirm trace is still running
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.superFast);
            await traceComponent.traceSpinner.checkSpinner()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("checkSpinner");
                });
            await traceComponent.stopTraceButton.exists()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Excpetion caught: " + `${err}`);
                    //fail("stopTraceButton.exists");
                });
            resolve();
        })
        .catch((err) => {
            logClient.error("TOOL-2759 : Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1654:(State Management - Trace Status & Content to Remain Consistent)`, () => {
        beforeEach(async () => {
            allure.addOwner("Austin Lee");
            allure.story("TOOL-1654: State Management - Trace Status & Content to Remain Consistent");
            allure.addLink("User Story: TOOL-1654", "https://extron.atlassian.net/browse/TOOL-1654");
            allure.addLink("Task Issue: TOOL-2759", "https://extron.atlassian.net/browse/TOOL-2759");
            allure.addLink("Test Case: TOOL-T2799", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2799");
            return new Promise<void>(async (resolve) => {
                
                
                await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);;
                await allure.screenshot(browser, "Before");
                resolve();
            }).catch((err) => {
                console.log(err);
            });
        });
    
    it("Verify that Trace Session Content persists when switching views", async() => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);

            // deploy good project
            await systemDeployment.destinyInputPathField.setDestinyFileToUpload(systemInfoFilePath1);
            await systemDeployment.deployButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("checkMessagePaneLogs");
                });

            // navigate to troubleshooting window and start trace
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.superFast);
            await traceComponent.startTraceButton.click();
            await browser.pause(timeout.fast);
            await traceComponent.traceSpinner.checkSpinner()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("checkSpinner");
                });
            await traceComponent.stopTraceButton.exists()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("stopTraceButton.exists");
                });

            // wait for trace messages to populate
            await browser.pause(timeout.slow);

            // confirm trace messages populate and save messages to compare later
            let traceMessageLength: number;
            await traceComponent.messageField.verifyTableLength()
                .then(async (value: number) => {
                    await expect(value)
                        .toBeGreaterThan(0);
                    traceMessageLength = value;
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("verifyTableLength");
                });

            // navigate to deploy view
            await sideNav.deployWindow.click();
            await browser.pause(timeout.superFast);
            await systemDeployment.deployButton.exists()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deployButton.exists");
                });

            // navigate to troubleshooting window and confirm trace is still running
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.superFast);

            // verify messages are still there
            await traceComponent.messageField.verifyTableLength()
                .then(async (value: number) => {
                    await expect(value)
                        .toEqual(traceMessageLength);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("verifyTableLength");
                });

            resolve();
        })
        .catch((err) => {
            logClient.error("TOOL-2759 : Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});