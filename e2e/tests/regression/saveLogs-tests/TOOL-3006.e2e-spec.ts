// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import * as os from "os";

import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { WinExplorer } from "../../../src/WindowsExplorer/WindowsExplorer.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";

const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfotemp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const currentUser: string = os.userInfo().username;
const defaultMessageLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Message Log");
const customMessageLogSavePath = path.join("C:\\Users", currentUser, "Documents\\Log\\Message Log");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3000");

/**
 * @Author `Amit B QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3000`
 * @Date `10/18/2021`
 */

describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit B");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3006", "https://extron.atlassian.net/browse/TOOL-3006");
        allure.addLink("Test Case: TOOL-T578", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T578");
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



    it("Verify that the Export Button is disabled when there are no messages in the Message logs pane and is enabled when Message messages start browserearing in the Message logs pane", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await messageComponent.exportMessageButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportMessageLogButton is disabled");
                });
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await browser.pause(5000);
            await messageComponent.exportMessageButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportMessageLogButton is disabled");
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
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3006: Exception Error: " + `${err}`);
                //fail("TOOL-3006 failed ");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});


describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3006", "https://extron.atlassian.net/browse/TOOL-3006");
        allure.addLink("Test Case: TOOL-T579", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T579");
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



    it("Verify that user can save message logs during and after the deployment is completed", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const winExplorer = new WinExplorer(browser);
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
            await browser.pause(timeout.medium);
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter();
            await browser.pause(timeout.fast);
            await messageComponent.exportMessageButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    await winExplorer.saveFile();
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message log export button");
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
            await messageComponent.exportMessageButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    await winExplorer.saveFile();
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message log export button");
                });
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3006: Exception Error: " + `${err}`);
                //fail("TOOL-3006 failed ");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});


describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3006", "https://extron.atlassian.net/browse/TOOL-3006");
        allure.addLink("Test Case: TOOL-T605", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T605");
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



    it("Verify that when the deployment fails, the logs saved match the messages in the message pane", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const winExplorer = new WinExplorer(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            const sysID = "3460";
            systemInfo1.system.primary_device_alias = "xyz";
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await browser.pause(5000);
            let fileName_1: string;
            let fileName_2: string;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter();
            await browser.pause(timeout.fast);
            await messageComponent.exportMessageButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    fileName_1 = await winExplorer.getFileNameBeforeSave();
                    await browser.pause(timeout.superFast);
                    await winExplorer.saveFile();
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message  log export button");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deployFailureMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deployment unsuccessful");
                });
            let fullFilePath = path.join(defaultMessageLogSavePath, fileName_1);
            const b = await common.readFile(fullFilePath);
            const c = await messageComponent.messageTable.getMessagesContents();
            await common.compareFileContents(c.toString(), b.toString())
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deployment unsuccessful");
                });
            await expect(fileName_1).not.toEqual(fileName_2)
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3004: Exception Error: " + `${err}`);
                //fail("TOOL-3004 failed ");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});
