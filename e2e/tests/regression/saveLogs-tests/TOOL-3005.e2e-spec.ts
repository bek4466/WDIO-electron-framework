// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import * as os from "os";

import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { WinExplorer } from "../../../src/WindowsExplorer/WindowsExplorer.po";
import { ToastComponent } from "../../../src/toastComponent/toastComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";

const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfotemp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const currentUser: string = os.userInfo().username;
const defaultMessageLogsSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Message Log");
const customMessageLSaogsvePath = path.join("C:\\Users", currentUser, "Documents\\Log\\Message_Log");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3000");

/**
 * @Author `Amit B QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3005`
 * @Date `10/18/2021`
 */

describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3005", "https://extron.atlassian.net/browse/TOOL-3005");
        allure.addLink("Test Case: TOOL-T577", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T577");
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



    it("Verify that that toast hyperlink navigates user to correct location where the message log file is saved", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
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
            // await browser.browserWindow.setAlwaysOnTop(true);   // move the browser to the foreground. use this to make toast page objects and robotjs methods to be more reliable
            // await browser.browserWindow.setAlwaysOnTop(false);  // set flag to false to allow file explorer to browserear in front. necessary for robotjs to execute correctly
            await winExplorer.clickCenter();
            await browser.pause(timeout.fast);
            /* check default file path */
            await messageComponent.exportMessageButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    if (value) {
                        await messageComponent.exportMessageButton.click();
                        await browser.pause(timeout.fast);
                        await winExplorer.saveFile();
                        await browser.$(toast.toastLink.selector).isDisplayedInViewport()
                            .then(async (value: boolean) => {
                                await expect(value)
                                    .toBe(true);
                                if (value) {
                                    await toast.toastLink.click();
                                    await browser.pause(timeout.superFast);
                                    await winExplorer.verifyFolderPath(defaultMessageLogsSavePath)
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
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3005: Exception Error: " + `${err}`);
                //fail("TOOL-3005 failed ");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});


describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3005", "https://extron.atlassian.net/browse/TOOL-3000");
        allure.addLink("Test Case: TOOL-T576", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T576");
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



    it("Verify that the message logs are saved to the correct folder - Custom Location", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
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
            await messageComponent.exportMessageButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });

            try {
                await fs.access(customMessageLSaogsvePath);                        // create custom directory if it doesn't exist
            }
            catch (err) {
                await fs.mkdir(customMessageLSaogsvePath, { recursive: true });
            }

            let fileName: string;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter();
            await browser.pause(timeout.fast);
            await messageComponent.exportMessageButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    fileName = await winExplorer.getFileNameBeforeSave();
                    await winExplorer.setFolderPath(customMessageLSaogsvePath).then();
                    await winExplorer.saveFile().then();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message  log export button");
                });
            let fullPath: string = path.join(customMessageLSaogsvePath, fileName);
            console.log(fullPath);
            await fs.pathExists(fullPath)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("file does not exist in custom file path");
                });
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3005: Exception Error: " + `${err}`);
                //fail("TOOL-3005 failed ");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});

describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3005", "https://extron.atlassian.net/browse/TOOL-3000");
        allure.addLink("Test Case: TOOL-T575", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T575");
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



    it("Verify that the message logs are saved to the correct folder - Default Location", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
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
            await messageComponent.exportMessageButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });

            let fileName: string;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter();
            await browser.pause(timeout.fast);
            await messageComponent.exportMessageButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    fileName = await winExplorer.getFileNameBeforeSave();
                    await winExplorer.saveFile();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message  log export button");
                });

            let fullPath: string = path.join(defaultMessageLogsSavePath, fileName);
            console.log(fullPath);
            await fs.pathExists(fullPath)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("file does not exist in default file path");
                });
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3005: Exception Error: " + `${err}`);
                //fail("TOOL-3005 failed ");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});