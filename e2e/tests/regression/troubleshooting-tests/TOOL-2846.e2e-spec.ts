// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { TroubleshootingPage } from "../../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";


const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "systeminfo.json");
const dataFile = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "dataFile", "DataFile.json");
const dataFileTemp = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "dataFile", "DataFileTmp.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "systeminfoTmp.json");
const systemInfoFile1 = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "systeminfo1.json");
const systemInfoFile1Temp = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "systeminfo1Tmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "locators.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2846");

/**
 * @Author `Neelam.s - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2793`
 * @Description `Troubleshooting Component : Device Validation Tests`
 * @Date `07/30/2021`
 */


describe(`TOOL-2846:(Troubleshooting Bad Scenarios: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2793: Troubleshooting Bad Scenarios - Primary Device Alias Validation");
        allure.addLink("User Story: TOOL-2793", "https://extron.atlassian.net/browse/TOOL-2793");
        allure.addLink("Task Issue: TOOL-2846", "https://extron.atlassian.net/browse/TOOL-2846");
        allure.addLink("Test Case: TOOL-T2887", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2887");
        return new Promise<void>(async (resolve) => {


            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
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

    it("VVerify there should be error message in message pane for Missing primary devices.alias.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const startstopProgram = new StartStopProgramComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo1 = fs.readJsonSync(a1);
            const systemInfo = fs.readJsonSync(a);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            delete systemInfo1.devices[0].alias;
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
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
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.missingDeviceAlias, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startstopProgram.startProgramButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.missingDeviceAlias, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startstopProgram.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    
                });
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await traceComponent.startTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.missingDeviceAlias, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });

            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2846: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`TOOL-2846:(Troubleshooting Bad Scenarios: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2793: Troubleshooting Bad Scenarios - Primary Device Alias Validation");
        allure.addLink("User Story: TOOL-2793", "https://extron.atlassian.net/browse/TOOL-2793");
        allure.addLink("Task Issue: TOOL-2846", "https://extron.atlassian.net/browse/TOOL-2846");
        allure.addLink("Test Case: TOOL-T4005", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T4005");
        return new Promise<void>(async (resolve) => {


            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
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

    it("Verify there should be error message in message pane for Invalid primary devices.alias - not a string.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const startstopProgram = new StartStopProgramComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo1 = fs.readJsonSync(a1);
            const systemInfo = fs.readJsonSync(a);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            systemInfo1.devices[0].alias = true;
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
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
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.invalidDeviceAliasMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startstopProgram.startProgramButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.invalidDeviceAliasMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startstopProgram.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    
                });
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await traceComponent.startTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.invalidDeviceAliasMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });

            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2846: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`TOOL-2846:(Troubleshooting Bad Scenarios: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2793: Troubleshooting Bad Scenarios - Primary Device Alias Validation");
        allure.addLink("User Story: TOOL-2793", "https://extron.atlassian.net/browse/TOOL-2793");
        allure.addLink("Task Issue: TOOL-2846", "https://extron.atlassian.net/browse/TOOL-2846");
        allure.addLink("Test Case: TOOL-T2889", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2889");
        return new Promise<void>(async (resolve) => {


            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
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

    it("Verify there should be error message in message pane for invalid primary devices.alias- Empty.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const startstopProgram = new StartStopProgramComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo1 = fs.readJsonSync(a1);
            const systemInfo = fs.readJsonSync(a);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            systemInfo1.devices[0].alias = "";
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
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
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.invalidDeviceAliasMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startstopProgram.startProgramButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.invalidDeviceAliasMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startstopProgram.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    
                });
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await traceComponent.startTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.invalidDeviceAliasMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });

            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2846: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});