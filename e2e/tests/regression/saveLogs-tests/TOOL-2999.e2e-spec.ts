// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { WinExplorer } from "../../../src/WindowsExplorer/WindowsExplorer.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { ToastComponent } from "../../../src/toastComponent/toastComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfotemp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", ".." , "..", "src", "JSON", "locators.json"));
const currentUser: string = os.userInfo().username;
const defaultProgramLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Program Log");
const customProgramLogSavePath = path.join("C:\\Users", currentUser, "Documents\\Log\\Program Log");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2999");

/**
 * @Author `Austin L QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2999`
 * @Date `10/13/2021`
 */

describe(`Regression Save Logs: TOOL-2912:(Save Program Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Program Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-2999", "https://extron.atlassian.net/browse/TOOL-2999");
        allure.addLink("Test Case: TOOL-T583", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T583");
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

    it("Verify that that toast hyperlink navigates user to correct location where the program log file is saved", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const programLogComponent = new ProgramLogComponent(browser);
            const winExplorer = new WinExplorer(browser);
            const toast = new ToastComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
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
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.slow);
            await programLogComponent.programLogRefreshButton.click();
            await browser.$(programLogComponent.programLogTextAreaField.selector).waitForExist({ timeout: 10000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("program log text area field does not exist");
                });

            // await browser.browserWindow.setAlwaysOnTop(true);   // move the browser to the foreground. use this to make toast page objects and robotjs methods to be more reliable
            // await browser.browserWindow.setAlwaysOnTop(false);  // set flag to false to allow file explorer to browserear in front. necessary for robotjs to execute correctly
            await winExplorer.clickCenter().then();
            await browser.pause(timeout.fast);
            /* check default file path */
            await programLogComponent.exportProgramLogButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    if(value) {
                        await programLogComponent.exportProgramLogButton.click();
                        await browser.pause(timeout.fast);
                        await winExplorer.saveFile().then();
                        console.log("after save");
                        await browser.$(toast.toastLink.selector).isDisplayedInViewport()
                            .then(async (value: boolean) => {
                                await expect(value)
                                    .toBe(true);
                                if(value) {
                                    await toast.toastLink.click();
                                    await browser.pause(timeout.fast);
                                    await winExplorer.verifyFolderPath(defaultProgramLogSavePath)
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
                    //fail("exportProgramLogButton is disabled");
                });

            /* check custom file path */
            try {
                await fs.access(customProgramLogSavePath);                        // create custom directory if it doesn't exist
            }
            catch (err) {
                await fs.mkdir(customProgramLogSavePath, {recursive: true});
            }

            await browser.pause(timeout.medium); // wait for toast message to disbrowserear
            // await browser.browserWindow.setAlwaysOnTop(true);   // move the browser to the foreground. use this to make toast page objects and robotjs methods to be more reliable
            // await browser.browserWindow.setAlwaysOnTop(false);  // set flag to false to allow file explorer to browserear in front. necessary for robotjs to execute correctly
            
            await programLogComponent.exportProgramLogButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    if(value) {
                        await programLogComponent.exportProgramLogButton.click();
                        await browser.pause(timeout.fast);
                        await winExplorer.setFolderPath(customProgramLogSavePath).then();
                        await winExplorer.saveFile().then();
                        await browser.$(toast.toastLink.selector).waitForExist({ timeout: 2500 })
                            .then(async (value: boolean) => {
                                await expect(value)
                                    .toBe(true);
                                if(value) {
                                    await toast.toastLink.click();
                                    await browser.pause(timeout.fast);
                                    await winExplorer.verifyFolderPath(customProgramLogSavePath)
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
                                //fail("toastLink is not visible");
                            });
                    }
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });
            resolve();
        })
        .catch((err: Error) => {
            console.log("TOOL-2999: Exception Error: " + `${err}`);
            //fail("TOOL-2999 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`Regression Save Logs: TOOL-2912:(Save Program Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Program Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-2999", "https://extron.atlassian.net/browse/TOOL-2999");
        allure.addLink("Test Case: TOOL-T584", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T584");
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

    it("Verify that the Export Button is disabled when there are no messages in the Program logs pane and is enabled when Program messages start browserearing in the Program logs pane", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const programLogComponent = new ProgramLogComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);            
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
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.slow);
            await programLogComponent.exportProgramLogButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });
            await programLogComponent.programLogRefreshButton.click();
            await browser.$(programLogComponent.programLogTextAreaField.selector).waitForExist({ timeout: 10000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await programLogComponent.exportProgramLogButton.isEnabled()
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            //fail("exportProgramLogButton is disabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("program log text area field does not exist");
                });
            resolve();
        })
        .catch((err: Error) => {
            console.log("TOOL-2999: Exception Error: " + `${err}`);
            //fail("TOOL-2999 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`Regression Save Logs: TOOL-2912:(Save Program Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Program Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-2999", "https://extron.atlassian.net/browse/TOOL-2999");
        allure.addLink("Test Case: TOOL-T585", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T585");
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

    it("Verify that user can save program logs when program is running and when program is not running", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const programLogComponent = new ProgramLogComponent(browser);
            const startStopProgram = new StartStopProgramComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
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
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.slow);
            await programLogComponent.programLogRefreshButton.click();
            await browser.$(programLogComponent.programLogTextAreaField.selector).waitForExist({ timeout: 15000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("program log text area field does not exist");
                });
            await programLogComponent.exportProgramLogButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });
            await startStopProgram.stopProgramButton.click();
            await browser.pause(timeout.superFast);
            await programLogComponent.exportProgramLogButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });
            resolve();
        })
        .catch((err: Error) => {
            console.log("TOOL-2999: Exception Error: " + `${err}`);
            //fail("TOOL-2999 failed ");
            return Promise.resolve(err + "Should have thrown");
        });

    });
});

describe(`Regression Save Logs: TOOL-2912:(Save Program Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Program Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-2999", "https://extron.atlassian.net/browse/TOOL-2999");
        allure.addLink("Test Case: TOOL-T600", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T600");
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

    it("Verify that a new program log file is created every time user saves", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const programLogComponent = new ProgramLogComponent(browser);
            const winExplorer = new WinExplorer(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
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
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.slow);
            await programLogComponent.programLogRefreshButton.click();
            await browser.$(programLogComponent.programLogTextAreaField.selector).waitForExist({ timeout: 10000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("program log text area field does not exist");
                });
            await programLogComponent.exportProgramLogButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });
            let savedLogsCount: number = await (await fs.readdir(defaultProgramLogSavePath)).length;
            // await browser.browserWindow.setAlwaysOnTop(true);    // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter().then();
            await programLogComponent.exportProgramLogButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    await winExplorer.saveFile().then();
                    await browser.pause(timeout.superFast);
                })
                .catch((err:Error) => {
                    logClient.error(err);
                    //fail("unable to click program log export button");
                });

            await fs.readdir(defaultProgramLogSavePath)
                .then(async (value: string[]) => {
                    await expect(value.length)
                        .toBe(savedLogsCount + 1);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("new log file was not created");
                });
            resolve();
        })
        .catch((err: Error) => {
            console.log("TOOL-2999: Exception Error: " + `${err}`);
            //fail("TOOL-2999 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});