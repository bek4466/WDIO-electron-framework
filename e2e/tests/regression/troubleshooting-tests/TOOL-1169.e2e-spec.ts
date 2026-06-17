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
import { browser } from "@wdio/globals";
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
const logClient = new LogClient("e2e:TOOL-1169");

/**
 * @Author `Neelam.s - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2796`
 * @Description `Troubleshooting Component : Device Validation Tests`
 * @Date `07/30/2021`
 */


describe(`TOOL-1169:(Troubleshooting Bad Scenarios: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2796: Troubleshooting Bad Scenarios - Primary Device Part Number Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2796", "User Story: TOOL-2796");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1169", "Task Issue: TOOL-1169");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2931", "Test Case: TOOL-T2931");
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

    it("Verify error message should be shown in message pane for missing primary controller's Part number.", async () => {
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
            delete systemInfo1.devices[0].part_number;
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
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.missingPartNumber, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startstopProgram.startProgramButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.missingPartNumber, data.errorSeverity)
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
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.missingPartNumber, data.errorSeverity)
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
            logClient.error("TOOL-1169: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`TOOL-1169:(Troubleshooting Bad Scenarios: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2796: Troubleshooting Bad Scenarios - Primary Device Part Number Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2796", "User Story: TOOL-2796");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1169", "Task Issue: TOOL-1169");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2932", "Test Case: TOOL-T2932");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
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

    it("Verify there should be error message in message pane for primary's device invalid part number- Invalid type.", async () => {
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
            systemInfo1.devices[0].part_number = true;
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
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.partNumberInvalidMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await startstopProgram.startProgramButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.partNumberInvalidMessage, data.errorSeverity)
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
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[0].name + data.partNumberInvalidMessage, data.errorSeverity)
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
            logClient.error("TOOL-1169: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});