// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { reject } from "q";

import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfo.json");
const systemInfoFileDual = path.join(__dirname, "..", "..", "..", "resources", "GoldenDualnicProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfoTmp.json");
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
import { GetPortExpPrimaryAddressList } from "@extron/communication/release/lib/models/globalMessages/getPortExpPrimaryAddressList";
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-1598");
const comClient = new CommunicationClient();

/*
 * @Author `Miguel Cruz QA`s
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2042`
 * @Date `10/14/2020`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1598:(TroubleShooting)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-1598:Troubleshooting");
        allure.addLink("User Story: TOOL-1598", "https://extron.atlassian.net/browse/TOOL-1598");
        allure.addLink("Task Issue: TOOL-2042", "https://extron.atlassian.net/browse/TOOL-2042");
        allure.addLink("Test Case: TOOL-T2219", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2219");
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

    it("Verify that Trace Log can be started without a program running", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo1 = fs.readJsonSync(a1);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            const sysID = "9589";
            systemInfo1.system.system_id = sysID;
            await fs.writeJSONSync(a1, systemInfo1);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
            await trace.exists()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                });
            await trace.traceTable
                .checkColumnExists(data.traceMessageColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(false);
                })
                .catch((err: Error) => {
                    logClient.error(
                        "Exception caught:  message Column Exists" + `${err}`
                    );
                });
            await trace.traceSpinner.checkSpinnerState()
                .then(async (result) => {
                    await expect(result)
                        .toBe(false);
                });
            await trace.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await trace.startTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("trace:playdoesnotexists");
                });
            await browser.pause(timeout.superFast);
            await trace.traceSpinner.checkSpinner()
                .then(async (result) => {
                    await expect(result)
                        .toBe(true);
                });
            await trace.stopTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await trace.stopTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("trace:playdoesnotexists");
                });
            await trace.traceSpinner.checkSpinnerState()
                .then(async (result) => {
                    await expect(result)
                        .toBe(false);
                });
            await trace.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("trace:playdoesnotexists");
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2042: Exception Error: " + `${err}`);
            //fail('TOOL-2042: "Troubleshooting"');
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1598:(TroubleShooting)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-1598:Troubleshooting");
        allure.addLink("User Story: TOOL-1598", "https://extron.atlassian.net/browse/TOOL-1598");
        allure.addLink("Task Issue: TOOL-2042", "https://extron.atlassian.net/browse/TOOL-2042");
        allure.addLink("Test Case: TOOL-T2220", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2220");
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

    it("Verify Trace Log should open and be horizontally split with Program Log", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo1 = fs.readJsonSync(a1);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            const sysID = "7589";
            systemInfo1.system.system_id = sysID;
            await fs.writeJSONSync(a1, systemInfo1);
            await systemDeployment.deployButton.click()
            .then(async () => {
                await browser.pause(timeout.medium);
                return systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                   await expect(status)
                   .toEqual(false);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("deploybuttonisEnabled");
                });
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`);
                //fail("deploybuttonClick");
            });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
            await trace.exists()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                });
            await programLog.programLogTextAreaField.exists()
            .then(async (IsProgramLogTitleExist) => {
                await expect(IsProgramLogTitleExist)
                    .toBe(true);
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: programLogText" + `${err}`);
            });
            await trace.traceTable
                .checkColumnExists(data.traceMessageColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(false);
                })
                .catch((err: Error) => {
                    logClient.error(
                        "Exception caught:  message Column Exists" + `${err}`
                    );
                });
            await trace.traceSpinner.checkSpinnerState()
                .then(async (result) => {
                    await expect(result)
                        .toBe(false);
                });
            await trace.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("trace:playdoesnotexists");
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2042: Exception Error: " + `${err}`);
            //fail('TOOL-2042: "Troubleshooting"');
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
