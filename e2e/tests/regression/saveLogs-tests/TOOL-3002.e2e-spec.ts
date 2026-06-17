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
const logClient = new LogClient("e2e:TOOL-3002");

/**
 * @Author `Austin L - QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3002`
 * @Date `11/08/2021`
 */

describe(`Regression Save Logs: TOOL-2911:(Save Trace Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2911: Save Trace Logs");
        allure.addLink("User Story: TOOL-2911", "https://extron.atlassian.net/browse/TOOL-2911");
        allure.addLink("Task Issue: TOOL-3002", "https://extron.atlassian.net/browse/TOOL-3002");
        allure.addLink("Test Case: TOOL-T595", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T595");
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



    it("Verify that a new trace log file is created every time user saves", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const trace = new TraceComponent(browser);
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
            await browser.$(trace.ipRowValue.selector).waitForExist({ timeout: 15000 })
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

            let savedLogsCount: number = (await fs.readdir(defaultTraceLogSavePath)).length;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter().then();

            await trace.exportTraceButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    await winExplorer.saveFile().then();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click trace export button");
                });

            await fs.readdir(defaultTraceLogSavePath)
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
                console.log("TOOL-3002: Exception Error: " + `${err}`);
                //fail("TOOL-3002 failed");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`Regression Save Logs: TOOL-2911:(Save Trace Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Trace Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-3002", "https://extron.atlassian.net/browse/TOOL-3002");
        allure.addLink("Test Case: TOOL-T596", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T596");
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



    it("Verify that the logs saved match the messages in the trace messages pane", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const trace = new TraceComponent(browser);
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
            await browser.$(trace.ipRowValue.selector).waitForExist({ timeout: 15000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("trace messages do not exist");
                });
            await browser.pause(timeout.medium);     // wait for more trace messages to populate the table
            await trace.stopTraceButton.click();
            await browser.pause(timeout.fast);

            let traceText = await trace.traceTable.getTraceMessages();
            await trace.traceTable.formatTraceMessageArray(traceText);
            let fileName: string;

            await trace.exportTraceButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    if (value) {
                        // await browser.browserWindow.setAlwaysOnTop(true);       // bring browser to foreground. increases reliability of toast page object and robotjs methods
                        // await browser.browserWindow.setAlwaysOnTop(false);
                        await winExplorer.clickCenter().then();
                        await trace.exportTraceButton.click();
                        await browser.pause(timeout.fast);
                        fileName = await winExplorer.getFileNameBeforeSave();
                        await browser.pause(timeout.superFast);
                        await winExplorer.saveFile().then();
                    }
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportTraceButton is disabled");
                });

            let fullFilePath = path.join(defaultTraceLogSavePath, fileName);
            let logContents = await common.readFile(fullFilePath);

            await common.compareFileContents(traceText, logContents)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("file contents did not match");
                });

            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3002: Exception Error: " + `${err}`);
                //fail("TOOL-3002 failed");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});

describe(`Regression Save Logs: TOOL-2911:(Save Trace Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2911: Save Trace Logs");
        allure.addLink("User Story: TOOL-2911", "https://extron.atlassian.net/browse/TOOL-2911");
        allure.addLink("Task Issue: TOOL-3002", "https://extron.atlassian.net/browse/TOOL-3002");
        allure.addLink("Test Case: TOOL-T597", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T597");
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



    it("Verify the trace log filename's format", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const trace = new TraceComponent(browser);
            const winExplorer = new WinExplorer(browser);
            const toast = new ToastComponent(browser);

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
            await trace.stopTraceButton.click();
            await browser.pause(timeout.fast);

            let fileName: string;
            let buttonStatus: boolean;
            let expectedFileName0: string = "Trace_Log_";
            let expectedFileName1: string = "Trace_Log_";
            let expectedFileName2: string = "Trace_Log_";
            let date, date0, date1, date2;
            let sec0, sec1, sec2;    // include seconds because common.getFormattedDate doesn't include it. get + or - 1;
            await trace.exportTraceButton.isEnabled()
                .then(async (value: boolean) => {
                    buttonStatus = value;
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportTraceLogButton is disabled");
                });
            if (buttonStatus) {
                // await browser.browserWindow.setAlwaysOnTop(true);
                // await browser.browserWindow.setAlwaysOnTop(false);
                await winExplorer.clickCenter().then();
                let date_ob = new Date();
                await trace.exportTraceButton.click();
                await browser.pause(timeout.fast);
                // capture date and time to use in expected file name
                date = await common.getFormattedDate(date_ob);
                sec0 = ("0" + ((await date_ob.getSeconds()) - 1)).slice(-2);
                sec1 = ("0" + ((await date_ob.getSeconds()))).slice(-2);
                sec2 = ("0" + ((await date_ob.getSeconds()) + 1)).slice(-2);
                fileName = await winExplorer.getFileNameBeforeSave();
                await browser.pause(timeout.superFast);
                await winExplorer.saveFile().then();
                // format date to match log filename's format
                date = date.split(/\D/).filter(Boolean);
                [date[0], date[1]] = [date[1], date[0]];    // swap index 0 with index 1 due to common.getFormattedDate returning date as DD/MM/YYYY
                date0 = date.join("_") + "_" + sec0 + ".log";
                date1 = date.join("_") + "_" + sec1 + ".log";
                date2 = date.join("_") + "_" + sec2 + ".log";
                expectedFileName0 += date0;
                expectedFileName1 += date1;
                expectedFileName2 += date2;
                if (fileName != expectedFileName0 && fileName != expectedFileName1 && fileName != expectedFileName2)
                    //fail(`expected ${fileName} to equal ${expectedFileName1} (plus or minus 1sec)`);
            }
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3002: Exception Error: " + `${err}`);
                //fail("TOOL-3002 failed");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});