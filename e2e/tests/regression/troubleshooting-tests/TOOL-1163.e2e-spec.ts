// @ts-nocheck
import { CommunicationClient } from "@extron/communication";
import * as fs from "fs-extra";
import * as path from "path";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { TraceComponent } from "../../../src/traceComponent";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "GoldenDualnicProject", "systeminfo.json");
const systemInfoFile2 = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
import { LogClient } from "@extron/winston-logger";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
const logClient = new LogClient("e2e:TOOL-1163");
const comClient = new CommunicationClient();

/**
 * @Author `Joe V QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-1163`
 * @Date `8/9/21`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1163:(Schema - Device Key Validation)`, () => {
    beforeEach(async () => {
        allure.addOwner("Joe Vanacore");
        allure.story("TOOL-1160: Schema - Device Key Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2838", "User Story: TOOL-2838");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1163", "Task Issue: TOOL-1163");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2880", "Test Case: TOOL-T2880");
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

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify there should be error message in message pane for missing primary devices.network.interfaces.type key.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            const startStopProgram = new StartStopProgramComponent(browser);
            // copying systemInfoFile -> systemInfoFileTemp
            await common.copyFolder(systemInfoFile2, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile2);
            const a1 = path.resolve(systemInfoFileTemp);
            // systemInfo1 read into memory
            const systemInfo1 = fs.readJsonSync(a1);
            delete systemInfo1.devices[0].network.interfaces[0].type;
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            const error = systemInfo1.devices[0].name + " - " + data.missingNetworkInterfaceTypeKey;
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
            await trace.startTraceButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(error, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await browser.pause(timeout.slow);
            await programLog.programLogRefreshButton.exists()
                .then(async (refreshExist) => {
                    await expect(refreshExist)
                        .toBe(true);
                    await programLog.programLogRefreshButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on refresh click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(error, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startStopProgram.startProgramButton.exists()
                .then(async (status) => {
                    await expect(status)
                        .toBe(true);
                    await startStopProgram.startProgramButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on start program click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(error, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            resolve();
        }).catch((err: Error) => {
            console.log("TOOL-1160: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + " was thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1163:(Schema - Device Key Validation)`, () => {
    beforeEach(async () => {
        allure.addOwner("Joe Vanacore");
        allure.story("TOOL-1160: Schema - Device Key Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2838", "User Story: TOOL-2838");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1163", "Task Issue: TOOL-1163");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2881", "Test Case: TOOL-T2881");
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

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify there should be error message in message pane for invalid primary devices.network.interfaces.type key - invalid type.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            const startStopProgram = new StartStopProgramComponent(browser);
            // copying systemInfoFile -> systemInfoFileTemp
            await common.copyFolder(systemInfoFile2, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile2);
            const a1 = path.resolve(systemInfoFileTemp);
            // systemInfo1 read into memory
            const systemInfo1 = fs.readJsonSync(a1);
            console.log(systemInfo1.devices[0].network.interfaces[0].type);
            systemInfo1.devices[0].network.interfaces[0].type = {};
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            const error = systemInfo1.devices[0].name + data.invalidNetworkInterfaceType;
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
            await trace.startTraceButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(error, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await browser.pause(timeout.slow);
            await programLog.programLogRefreshButton.exists()
                .then(async (refreshExist) => {
                    await expect(refreshExist)
                        .toBe(true);
                    await programLog.programLogRefreshButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on refresh click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(error, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startStopProgram.startProgramButton.exists()
                .then(async (status) => {
                    await expect(status)
                        .toBe(true);
                    await startStopProgram.startProgramButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on start program click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(error, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            // await browser.debug();
            resolve();
        }).catch((err: Error) => {
            console.log("TOOL-1160: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + " was thrown");
        });
    });
});