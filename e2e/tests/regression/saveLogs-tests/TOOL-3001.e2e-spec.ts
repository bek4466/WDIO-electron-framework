// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { TraceComponent } from "../../../src/traceComponent/traceComponent.po";
import { WinExplorer } from "../../../src/WindowsExplorer/WindowsExplorer.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { ToastComponent } from "../../../src/toastComponent/toastComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfoT592.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const currentUser: string = os.userInfo().username;
const defaultTraceLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Trace Log");
const customTraceLogSavePath = path.join("C:\\Users", currentUser, "Documents\\Log\\Trace Log");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3001");

/**
 * @Author `Austin L - QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3001`
 * @Date `10/29/2021`
 */

describe(`Regression Save Logs: TOOL-2911:(Save Trace Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2911: Save Trace Logs");
        allure.addLink("User Story: TOOL-2911", "https://extron.atlassian.net/browse/TOOL-2911");
        allure.addLink("Task Issue: TOOL-3001", "https://extron.atlassian.net/browse/TOOL-3001");
        allure.addLink("Test Case: TOOL-T592", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T592");
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



    it("Verify that that toast hyperlink navigates user to correct location where the trace log file is saved", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const toast = new ToastComponent(browser);
            const winExplorer = new WinExplorer(browser);

            //#region successful deploy
            const systemInfo = fs.readJsonSync(systemInfoFile);
            systemInfo.system.project_root_folder_path = path.dirname(systemInfoFile);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deployment unsuccessful");
                });
            //#endregion

            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.slow);
            await trace.startTraceButton.click();
            await browser.$(trace.ipRowValue.selector).waitForExist({ timeout: 10000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("trace messages do not exist");
                });

            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter().then();

            /* check default file path */
            await trace.exportTraceButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    if (value) {
                        await trace.exportTraceButton.click();
                        await browser.pause(timeout.fast);
                        await winExplorer.saveFile().then();
                        await browser.$(toast.toastLink.selector).isDisplayedInViewport()
                            .then(async (value: boolean) => {
                                await expect(value)
                                    .toBe(true);
                                if (value) {
                                    await toast.toastLink.click();
                                    await browser.pause(timeout.fast);
                                    await winExplorer.verifyFolderPath(defaultTraceLogSavePath)
                                        .then(async (value: boolean) => {
                                            await expect(value)
                                                .toBe(true);
                                        })
                                        .catch((err: Error) => {
                                            logClient.error("Exception caught: " + `${err}`);
                                            //fail("show in folder link did not open to default path");
                                        });
                                    await winExplorer.closeExplorer();
                                }
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                //fail("toastLink does not exist");
                            });
                    }
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportTraceButton is disabled");
                });

            /* check custom file path */
            try {
                await fs.access(customTraceLogSavePath);                        // create custom directory if it doesn't exist
            }
            catch (err) {
                await fs.mkdir(customTraceLogSavePath, { recursive: true });
            }

            await browser.pause(timeout.medium);         // wait for toast message to disbrowserear
            // await browser.browserWindow.setAlwaysOnTop(true);   // bring browser to foreground
            // await browser.browserWindow.setAlwaysOnTop(false);            
            await winExplorer.clickCenter().then();

            await trace.exportTraceButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    if (value) {
                        await trace.exportTraceButton.click();
                        await browser.pause(timeout.fast);
                        await winExplorer.setFolderPath(customTraceLogSavePath).then();
                        await winExplorer.saveFile().then();
                        await browser.$(toast.toastLink.selector).waitForExist({ timeout: 2500 })
                            .then(async (value: boolean) => {
                                await expect(value)
                                    .toBe(true);
                                if (value) {
                                    await toast.toastLink.click();
                                    await browser.pause(timeout.fast);
                                    await winExplorer.verifyFolderPath(customTraceLogSavePath)
                                        .then(async (value: boolean) => {
                                            await expect(value)
                                                .toBe(true);
                                        })
                                        .catch((err: Error) => {
                                            logClient.error("Exception caught: " + `${err}`);
                                            //fail("show in folder link did not open to default path");
                                        });
                                }
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                //fail("toastLink is not visible");
                            });
                        await winExplorer.closeExplorer();
                    }
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportTraceButton is disabled");
                });


            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3001: Exception Error: " + `${err}`);
                //fail("TOOL-3001 failed");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`Regression Save Logs: TOOL-2911:(Save Trace Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2911: Save Trace Logs");
        allure.addLink("User Story: TOOL-2911", "https://extron.atlassian.net/browse/TOOL-2911");
        allure.addLink("Task Issue: TOOL-3001", "https://extron.atlassian.net/browse/TOOL-3001");
        allure.addLink("Test Case: TOOL-T593", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T593");
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



    it("Verify that the Export Button is disabled when there are no messages in the trace message pane and is enabled when trace messages start browserearing in the trace message pane", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const toast = new ToastComponent(browser);
            const winExplorer = new WinExplorer(browser);

            //#region successful deploy
            const systemInfo = fs.readJsonSync(systemInfoFile);
            systemInfo.system.project_root_folder_path = path.dirname(systemInfoFile);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deployment unsuccessful");
                });
            //#endregion

            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            // await browser.browserWindow.setAlwaysOnTop(true);
            // await browser.browserWindow.setAlwaysOnTop(false);

            await trace.exportTraceButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportTraceButton is disabled");
                });

            await trace.startTraceButton.click();
            await browser.$(trace.ipRowValue.selector).waitForExist({ timeout: 10000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await trace.exportTraceButton.isEnabled()
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            //fail("exportTraceButton is disabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("trace messages do not exist");
                });

            await trace.stopTraceButton.click();
            await trace.clearTraceButton.click();
            await trace.exportTraceButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportTraceButton is disabled");
                });

            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3001: Exception Error: " + `${err}`);
                //fail("TOOL-3001 failed");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`Regression Save Logs: TOOL-2911:(Save Trace Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2911: Save Trace Logs");
        allure.addLink("User Story: TOOL-2911", "https://extron.atlassian.net/browse/TOOL-2911");
        allure.addLink("Task Issue: TOOL-3001", "https://extron.atlassian.net/browse/TOOL-3001");
        allure.addLink("Test Case: TOOL-T594", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T594");
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



    it("Verify that user can save trace logs when trace is running and when trace is not running", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const toast = new ToastComponent(browser);
            const winExplorer = new WinExplorer(browser);

            //#region successful deploy
            const systemInfo = fs.readJsonSync(systemInfoFile);
            systemInfo.system.project_root_folder_path = path.dirname(systemInfoFile);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deployment unsuccessful");
                });
            //#endregion

            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            // await browser.browserWindow.setAlwaysOnTop(true);
            // await browser.browserWindow.setAlwaysOnTop(false);

            await trace.startTraceButton.click();
            await browser.$(trace.ipRowValue.selector).waitForExist({ timeout: 10000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("trace messages do not exist");
                });

            await trace.exportTraceButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportTraceButton is disabled");
                });

            await trace.stopTraceButton.click();

            await trace.exportTraceButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportTraceButton is disabled");
                });

            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3001: Exception Error: " + `${err}`);
                //fail("TOOL-3001 failed ");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});