// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import * as os from "os";
import * as robot from 'robotjs';


import { allure } from "../../../src/allure/allure";
import { CommonMethods } from "../../commonMethods.po";
import { LogClient } from "@extron/winston-logger";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { ToastComponent } from "../../../src/toastComponent/toastComponent.po";
import { TraceComponent } from "../../../src/traceComponent";
import { WinExplorer } from "../../../src/WindowsExplorer/WindowsExplorer.po";
import { browser } from '@wdio/globals';

const common = new CommonMethods();
const logClient = new LogClient("e2e:CSP-30");
const systemInfoFile2 = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfoTmp.json");

const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const currentUser: string = os.userInfo().username;
const defaultMessageLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Message Log");
const defaultProgramLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Program Log");
const customProgramLogSavePath = path.join("C:\\Users", currentUser, "Documents\\Log\\Program Log");
const customTraceLogSavePath = path.join("C:\\Users", currentUser, "Documents\\Log\\Trace Log");
const testingAltTraceLogSavePath = path.join("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Trace Log")
const testingAltMessageLogSavePath = path.join("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Message Log")
const customMessageLogSavePath = path.resolve("C:\\Users", currentUser, "Documents\\Extron\\csdu\\log\\Message Log");

/**
 * @Author `Kiran S`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-4175`
 * @JIRA_Link_POM `https://extron.atlassian.net/browse/TOOL-4211`
 * @Description `Export validation`
 * @Date `10/21/2022`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-4211: TLP w/ LL - Program Log and Trace Message Validation`, () => {
    beforeEach(async () => {
        allure.addOwner("Kiran S");
        allure.story("TOOL-4175: TLP w/ LL - Program Log and Trace Message Validation");
        allure.addLink("User Story: TOOL-4175", "https://extron.atlassian.net/browse/TOOL-4175");
        allure.addLink("Task Issue: TOOL-4211", "https://extron.atlassian.net/browseTOOL-4211");
        allure.addLink("Test Case: TOOL-4617", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T4617");
        
        return new Promise<void>(async (resolve) => {
            // await common.checkSplashScreen(browser);
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            // await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify export works for trace messages, logs messages, and message pane in troubleshooting window.", async () => {
        const programLogComponent = new ProgramLogComponent(browser);
        const winExplorer = new WinExplorer(browser);

        const systemDeployment = new DeployComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        const sideNav = new SideNavigationComponent(browser);
        const projectCredentialUI = new CredsComponent(browser);
        const toast = new ToastComponent(browser);
        const trace = new TraceComponent(browser);
        const programLog = new ProgramLogComponent(browser);
        const startStopProgram = new StartStopProgramComponent(browser);
        // copying systemInfoFile2 -> systemInfoFileTemp
        await common.copyFolder(systemInfoFile2, systemInfoFileTemp);
        const a1 = path.resolve(systemInfoFileTemp);
        // systemInfo1 read into memory
        const systemInfo1 = fs.readJsonSync(a1);
        systemInfo1.project_root_folder_path = path.dirname(a1);
        // systemInfo1.devices[0].name = "TLP 300M w LL";
        // systemInfo1.devices[0].part_number = "60-1667-02C";
        // systemInfo1.devices[0].network.interfaces = [];
        // systemInfo1.devices[0].network.interfaces[0] = {};
        // systemInfo1.devices[0].network.interfaces[0].address = "10.113.89.248";
        // systemInfo1.devices[0].network.interfaces[0].type = "LAN";
        await fs.writeJSONSync(a1, systemInfo1);
        console.log(systemInfo1)

        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
        const credsVisible = await projectCredentialUI.credsTable.isVisible();
        if (!credsVisible) await projectCredentialUI.KEVIN_SETTING_BUTTON.isEnabled()
            .then(async (kevinEnabled) => {
                await expect(kevinEnabled)
                    .toBe(true);
                await projectCredentialUI.KEVIN_SETTING_BUTTON.click();
            })
            .catch(async (err: Error) => {
            });
        let credentialsArr = [{
            "user": "admin",
            "pass": "extron"
        },
        {
            "user": "admin",
            "pass": "extron"
        },
        {
            "user": "admin",
            "pass": "extron"
        }]
        for (let idx in credentialsArr) {
            await projectCredentialUI.usernameRow1.setUsername(credentialsArr[idx].user, idx);
            await projectCredentialUI.passwordRow1.setPassword(credentialsArr[idx].pass, idx);
        }
        await browser.pause(timeout.fast);
        await projectCredentialUI.saveConnectionManagerButton.click();
        await browser.pause(timeout.fast);
        await systemDeployment.deployButton.click();
        await browser.pause(timeout.fast);
        await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMessage, data.infoSeverity)
            .then(async (value: boolean) => {
                await expect(value)
                    .toBe(true);
                await messageComponent.clearAllButton.click();
            })
            .catch((err: Error) => {
                logClient.error("Exception caught" + `${err}`);
                
            });
        await sideNav.troubleshootingWindow.click();
        // await browser.browserWindow.setAlwaysOnTop(true);
        // await browser.browserWindow.setAlwaysOnTop(false);
        await winExplorer.clickCenter();

        //export program log
        await programLogComponent.programLogRefreshButton.click();
        await browser.pause(timeout.slow);
        await programLogComponent.exportProgramLogButton.isEnabled()
            .then(async (value: boolean) => {
                await expect(value)
                    .toBe(true);
                if (value) {
                    await browser.pause(timeout.fast);
                    await programLogComponent.exportProgramLogButton.click();
                    await browser.pause(timeout.fast);
                    // await winExplorer.setFolderPath(customProgramLogSavePath).then();
                    await winExplorer.saveFile().then();
                    await browser.$(toast.toastLink.selector).waitForExist({ timeout: 2500 })
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toBe(true);
                            if (value) {
                                await toast.toastLink.click();
                                await browser.pause(timeout.fast);
                                await winExplorer.verifyFolderPath(defaultProgramLogSavePath)
                                    .then(async (value: boolean) => {
                                        await expect(value)
                                            .toBe(true);
                                    })
                                    .catch((err: Error) => {
                                        logClient.error("Exception caught: " + `${err}`);
                                        
                                    });
                                await winExplorer.closeExplorer();
                            }
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                }
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`);
                
            });


        //export trace 
        await trace.startTraceButton.click();
        await browser.pause(timeout.slow);
        await trace.exportTraceButton.isEnabled()
            .then(async (value: boolean) => {
                await expect(value)
                    .toBe(true);
                if (value) {
                    await trace.exportTraceButton.click();
                    await browser.pause(timeout.fast);

                    //robotjs remove old patch and type new path to save to then press enter
                    await robot.keyTap("f4");
                    for(let i = 0; i < 80; i++){
                        await robot.keyTap('backspace');
                    }
                    await robot.typeString(testingAltTraceLogSavePath);
                    await robot.keyTap('f4');
                    for(let i = 0; i < 7; i++){
                        await robot.keyTap('tab')
                    }
                    await robot.keyTap('enter');

                    await browser.pause(timeout.slow);

                    //verify new file is saved and content has date and time (with milliseconds)
                    await fs.readdir(testingAltTraceLogSavePath, (err, files) => {
                        if (err) {
                          console.error(err);
                          return;
                        }

                        //get the file that was created the most recently
                        files.sort((a,b) => {
                            const statA = fs.statSync(testingAltTraceLogSavePath + '/' + a);
                            const statB = fs.statSync(testingAltTraceLogSavePath + '/' + b);
                            return statB.birthtime.getTime() - statA.birthtime.getTime();
                        })
                        const mostRecentFile = files[0];
        
                        // read file content and verify correct formatting
                        const filePath = testingAltTraceLogSavePath + '/' + mostRecentFile;
                        fs.readFile(filePath, 'utf-8', (err, data) => {
                            if (err) {
                            console.log(err);
                            return;
                            }
                            const traceDateAndTimeRegex = /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{1,2}:\d{1,2}\.\d{3} (AM|PM)/g;

                            const traceMatches = data.match(traceDateAndTimeRegex);
                            expect(traceMatches).not.toBe(null)
                        });
                    });
                }
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`);
                
            });

        //export mesage pane
        await browser.pause(timeout.slow);
        await browser.pause(timeout.slow);
        await messageComponent.openMessagePaneButton.click();
        await messageComponent.exportMessageButton.click().then(async () => {
            await browser.pause(timeout.superFast);
            await robot.keyTap("enter");
            await browser.pause(timeout.fast);
            await fs.readdir(testingAltMessageLogSavePath, (err, files) => {
                if (err) {
                  console.error(err);
                  return;
                }

                //get the file that was created the most recently
                files.sort((a,b) => {
                    const statA = fs.statSync(testingAltMessageLogSavePath + '/' + a);
                    const statB = fs.statSync(testingAltMessageLogSavePath + '/' + b);
                    return statB.birthtime.getTime() - statA.birthtime.getTime();
                })
                const mostRecentFile = files[0];

                // read file content and verify correct formatting
                const filePath = testingAltMessageLogSavePath + '/' + mostRecentFile;
                fs.readFile(filePath, 'utf-8', (err, data) => {
                    if (err) {
                    console.log(err);
                    return;
                    }
                    const msgPaneDateAndTimeRegex = /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{1,2}:\d{1,2}\.\d{3} (AM|PM)/g;

                    const msgPaneMatches = data.match(msgPaneDateAndTimeRegex);
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    console.log(msgPaneMatches)
                    expect(msgPaneMatches).not.toBe(null)
                });
            });
        })
        await browser.$(toast.toastLink.selector).waitForExist({ timeout: 2500 })
            .then(async (value: boolean) => {
                await expect(value)
                    .toBe(true);
                await browser.pause(timeout.slow);
            });
    });

});
