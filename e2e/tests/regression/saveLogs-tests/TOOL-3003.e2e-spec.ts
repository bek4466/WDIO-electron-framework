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
const logClient = new LogClient("e2e:TOOL-3003");

/**
 * @Author `Austin L - QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3003`
 * @Date `11/10/2021`
 */

describe(`Regression Save Logs: TOOL-2911:(Save Trace Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2911: Save Trace Logs");
        allure.addLink("User Story: TOOL-2911", "https://extron.atlassian.net/browse/TOOL-2911");
        allure.addLink("Task Issue: TOOL-3003", "https://extron.atlassian.net/browse/TOOL-3003");
        allure.addLink("Test Case: TOOL-T598", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T598");
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



    it("Verify that the trace logs are saved to the correct folder - Default Location", async () => {
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
            await browser.$(trace.ipRowValue.selector).waitForExist({ timeout: 10000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("trace logs do not exist");
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

            let fileName: string;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter().then();
            await browser.pause(timeout.fast);

            await trace.exportTraceButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    fileName = await winExplorer.getFileNameBeforeSave();
                    await winExplorer.saveFile();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click trace export button");
                });

            let fullPath: string = path.join(defaultTraceLogSavePath, fileName);
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
                console.log("TOOL-3003: Exception Error: " + `${err}`);
                //fail("TOOL-3003 failed");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});

describe(`Regression Save Logs: TOOL-2911:(Save Trace Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2911: Save Trace Logs");
        allure.addLink("User Story: TOOL-2911", "https://extron.atlassian.net/browse/TOOL-2911");
        allure.addLink("Task Issue: TOOL-3003", "https://extron.atlassian.net/browse/TOOL-3003");
        allure.addLink("Test Case: TOOL-T599", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T599");
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



    it("Verify that the trace logs are saved to the correct folder - Custom Location", async () => {
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
            await browser.$(trace.ipRowValue.selector).waitForExist({ timeout: 10000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("trace logs do not exist");
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

            let fileName: string;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter();
            await browser.pause(timeout.fast);

            try {
                await fs.access(customTraceLogSavePath);                        // create custom directory if it doesn't exist
            }
            catch (err) {
                await fs.mkdir(customTraceLogSavePath, { recursive: true });
            }

            await trace.exportTraceButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    fileName = await winExplorer.getFileNameBeforeSave();
                    await winExplorer.setFolderPath(customTraceLogSavePath);
                    await winExplorer.saveFile();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click trace export button");
                });

            let fullPath: string = path.join(customTraceLogSavePath, fileName);
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
                console.log("TOOL-3003: Exception Error: " + `${err}`);
                //fail("TOOL-3003 failed");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});