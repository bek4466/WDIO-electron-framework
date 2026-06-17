// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


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
const defaultMessageLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Message Log");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3004");

/**
 * @Author `Amit B QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3004`
 * @Date `11/04/2021`
 */
describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3004", "https://extron.atlassian.net/browse/TOOL-3004");
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



    it("Verify that the Export Button is disabled when there are no messages in the Message logs pane and is enabled when Program messages start browserearing in the Message logs pane", async () => {
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
                    await winExplorer.saveFile();
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message  log export button");
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
                    fileName_2 = await winExplorer.getFileNameBeforeSave();
                    await winExplorer.saveFile();
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message  log export button");
                });

            expect(fileName_1).not.toEqual(fileName_2);

            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3004: Exception Error: " + `${err}`);
                //fail("TOOL-3004 failed ");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3004", "https://extron.atlassian.net/browse/TOOL-3004");
        allure.addLink("Test Case: TOOL-T574", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T574");
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



    it("Verify the message log filename's format", async () => {
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
            await browser.pause(5000);

            let fileName_1: string;
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
                    const regex = new RegExp('Build_[0-9]{2}_[0-9]{2}_[0-9]{4}_[0-9]{2}_[0-9]{2}_[0-9]{2}');
                    const doesMatch = regex.test(fileName_1)
                    expect(doesMatch).toBe(true)
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message  log export button");
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
                console.log("TOOL-3004: Exception Error: " + `${err}`);
                //fail("TOOL-3004 failed ");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`Regression Save Logs: TOOL-2910:(Save Message Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-2910: Save Message Logs");
        allure.addLink("User Story: TOOL-2910", "https://extron.atlassian.net/browse/TOOL-2910");
        allure.addLink("Task Issue: TOOL-3004", "https://extron.atlassian.net/browse/TOOL-3004");
        allure.addLink("Test Case: TOOL-T573", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T573");
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



    it("Verify that the logs saved match the messages in the message pane", async () => {
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
            let fileName_1: string;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter();
            await browser.pause(timeout.fast);
            await messageComponent.exportMessageButton.click()
                .then(async () => {
                    await browser.pause(timeout.superFast);
                    fileName_1 = await winExplorer.getFileNameBeforeSave();
                    await browser.pause(timeout.superFast);
                    await winExplorer.saveFile();
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click Message  log export button");
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
            let fullFilePath = path.join(defaultMessageLogSavePath, fileName_1);
            const b = await common.readFile(fullFilePath)
            const c = await messageComponent.messageTable.getMessagesContents()
            await common.compareFileContents(c.toString(), b.toString())
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("compareFileContents");
                });
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3004: Exception Error: " + `${err}`);
                //fail("TOOL-3004 failed ");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});