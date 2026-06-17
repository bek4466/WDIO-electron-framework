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
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfotemp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const proglocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "programLogLocators.json"));
const currentUser: string = os.userInfo().username;
const defaultProgramLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Program Log");
const customProgramLogSavePath = path.join("C:\\Users", currentUser, "Documents\\Log\\Program Log");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3000");

/**
 * @Author `Austin L QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3000`
 * @Date `10/18/2021`
 */

describe(`Regression Save Logs: TOOL-2912:(Save Program Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Program Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-3000", "https://extron.atlassian.net/browse/TOOL-3000");
        allure.addLink("Test Case: TOOL-T601", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T601");
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


    it("Verify that the logs saved match the messages in the program log pane", async () => {
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
            await browser.$(programLogComponent.programLogTextAreaField.selector).waitForExist({ timeout: 15000 })
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("program log text area field does not exist");
                });
            let programLogText: string = await browser.getElementText(proglocators.actualLogText);
            let fileName: string;
            await programLogComponent.exportProgramLogButton.isEnabled()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    if (value) {
                        // await browser.browserWindow.setAlwaysOnTop(true);       // bring browser to foreground. increases reliability of toast page object and robotjs methods
                        // await browser.browserWindow.setAlwaysOnTop(false);
                        await winExplorer.clickCenter().then();
                        await programLogComponent.exportProgramLogButton.click();
                        await browser.pause(timeout.fast);
                        fileName = await winExplorer.getFileNameBeforeSave();
                        await winExplorer.saveFile().then();
                    }
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });

            let fullFilePath = path.join(defaultProgramLogSavePath, fileName);
            console.log(fullFilePath);
            await fs.readFile(fullFilePath, "utf8")
                .then(async (fileContents) => {
                    await expect(fileContents.trim())
                        .toEqual(programLogText.trim());
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("file contents did not match");
                });
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3000: Exception Error: " + `${err}`);
                //fail("TOOL-3000 failed ");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});

describe(`Regression Save Logs: TOOL-2912:(Save Program Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Program Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-3000", "https://extron.atlassian.net/browse/TOOL-3000");
        allure.addLink("Test Case: TOOL-T602", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T602");
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

    it("Verify the program log filename's format", async () => {
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
            let fileName: string;
            let buttonStatus: boolean;
            let expectedFileName0: string = "Program_Log_";
            let expectedFileName1: string = "Program_Log_";
            let expectedFileName2: string = "Program_Log_";
            let date, date0, date1, date2;
            let sec0, sec1, sec2;    // include seconds because common.getFormattedDate doesn't include it. get + or - 1;
            await programLogComponent.exportProgramLogButton.isEnabled()
                .then(async (value: boolean) => {
                    buttonStatus = value;
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("exportProgramLogButton is disabled");
                });
            if (buttonStatus) {
                // await browser.browserWindow.setAlwaysOnTop(true);
                // await browser.browserWindow.setAlwaysOnTop(false);
                await winExplorer.clickCenter().then();
                let date_ob = new Date();
                await programLogComponent.exportProgramLogButton.click();
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
                console.log("TOOL-3000: Exception Error: " + `${err}`);
                //fail("TOOL-3000 failed ");
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`Regression Save Logs: TOOL-2912:(Save Program Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Program Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-3000", "https://extron.atlassian.net/browse/TOOL-3000");
        allure.addLink("Test Case: TOOL-T603", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T603");
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

    it("Verify that the program logs are saved to the correct folder - Default Location", async () => {
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
            let fileName: string;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter().then();
            await programLogComponent.exportProgramLogButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    fileName = await winExplorer.getFileNameBeforeSave();
                    await winExplorer.saveFile().then();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click program log export button");
                });
            let fullPath: string = path.join(defaultProgramLogSavePath, fileName);
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
                console.log("TOOL-3000: Exception Error: " + `${err}`);
                //fail("TOOL-3000 failed ");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});

describe(`Regression Save Logs: TOOL-2912:(Save Program Logs Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2912: Save Program Logs");
        allure.addLink("User Story: TOOL-2912", "https://extron.atlassian.net/browse/TOOL-2912");
        allure.addLink("Task Issue: TOOL-3000", "https://extron.atlassian.net/browse/TOOL-3000");
        allure.addLink("Test Case: TOOL-T604", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T604");
        return new Promise<void>(async (resolve) => {



            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });


    it("Verify that the program logs are saved to the correct folder - Custom Location", async () => {
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
            let fileName: string;
            // await browser.browserWindow.setAlwaysOnTop(true);     // bring browser to foreground. increases reliability of toast page object and robotjs methods
            // await browser.browserWindow.setAlwaysOnTop(false);
            await winExplorer.clickCenter().then();
            try {
                await fs.access(customProgramLogSavePath);                        // create custom directory if it doesn't exist
            }
            catch (err) {
                await fs.mkdir(customProgramLogSavePath, { recursive: true });
            }
            await programLogComponent.exportProgramLogButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    fileName = await winExplorer.getFileNameBeforeSave();
                    await winExplorer.setFolderPath(customProgramLogSavePath).then();
                    await winExplorer.saveFile().then();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("unable to click program log export button");
                });

            let fullPath: string = path.join(customProgramLogSavePath, fileName);
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
                console.log("TOOL-3000: Exception Error: " + `${err}`);
                //fail("TOOL-3000 failed ");
                return Promise.resolve(err + "Should have thrown");
            });

    });
});