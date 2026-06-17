// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathCSPT275 = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275.json");
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275Tmp.json");
const dataFilePathProgramStartStopProject = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "dataFile", "DataFile.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2731");
/**
 * @Author `Miguel.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2731`
 * @Description `Primary Extron Control for IOS and Android`
 * @Date `09/28/2021`
 */

xdescribe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2731:(ECW Test: Primary Extron Control for IOS and Android)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-1744: Primary Extron Control for IOS");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1744", "User Story: TOOL-1744");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2731", "Task Issue: TOOL-2731");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3332", "Test Case: TOOL-T3332");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWindow(browser, tabTitles.mainTab);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify provided extron_control_web id is used for Extron Control for iOS", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            systemInfo1.devices[2].part_number = "79-559-01";
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
            // Provide valid destiny file
            // clicking on destiny file input field
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[2].name + data.extronControlMissingWebId, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.slow);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            // verify Stop Program button is displaying checkStopProgramButtonPresent
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await browser.pause(timeout.medium);
            const a2 = path.resolve(dataFilePathProgramStartStopProject);
            const sysjson = fs.readJsonSync(a2);
            //  check if program is running on tlp by launching vtlp ui
            await systemTroubleshooting.startProgramButton.checkProgramIsRunning(sysjson.ENG.B3.Devices[0].deviceCredentials[6].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui1, data.vtlpLabel1, data.vtlpLabel2, data.vtlpLabel3, data.vtlpLabel4)
                .then(async (isProgramRunning) => {
                    await expect(isProgramRunning)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2731: Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
xdescribe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2731:(ECW Test: Primary Extron Control for IOS and Android)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("CSP-1745: Primary Extron Control for Android");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1745", "User Story: TOOL-1745");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2731", "Task Issue: TOOL-2731");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3338", "Test Case: TOOL-T3338");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWindow(browser, tabTitles.mainTab);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it("Verify Default value used when extron_control_web_id not provided(Extron Control for Android)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            delete systemInfo1.devices[2].extron_control_web_id;
            systemInfo1.devices[2].part_number = "79-600-01";
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
            // Provide valid destiny file
            // clicking on destiny file input field
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[2].name + data.extronControlMissingWebId, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.slow);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            // verify Stop Program button is displaying checkStopProgramButtonPresent
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await browser.pause(timeout.medium);
            const a2 = path.resolve(dataFilePathProgramStartStopProject);
            const sysjson = fs.readJsonSync(a2);
            //  check if program is running on tlp by launching vtlp ui
            await systemTroubleshooting.startProgramButton.checkProgramIsRunning(sysjson.ENG.B3.Devices[0].deviceCredentials[6].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui1, data.vtlpLabel1, data.vtlpLabel2, data.vtlpLabel3, data.vtlpLabel4)
                .then(async (isProgramRunning) => {
                    await expect(isProgramRunning)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2730: Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});
xdescribe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2731:(ECW Test: Primary Extron Control for IOS and Android)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("CSP-1744: Primary Extron Control for Android");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1745", "User Story: TOOL-1745");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2731", "Task Issue: TOOL-2731");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3339", "Test Case: TOOL-T3339");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWindow(browser, tabTitles.mainTab);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it("Verify provided extron_control_web id is used for Extron Control for Android", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            systemInfo1.devices[2].part_number = "79-600-01";
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
            // Provide valid destiny file
            // clicking on destiny file input field
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.devices[2].name + data.extronControlMissingWebId, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.slow);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            // verify Stop Program button is displaying checkStopProgramButtonPresent
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await browser.pause(timeout.medium);
            const a2 = path.resolve(dataFilePathProgramStartStopProject);
            const sysjson = fs.readJsonSync(a2);
            //  check if program is running on tlp by launching vtlp ui
            await systemTroubleshooting.startProgramButton.checkProgramIsRunning(sysjson.ENG.B3.Devices[0].deviceCredentials[6].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui1, data.vtlpLabel1, data.vtlpLabel2, data.vtlpLabel3, data.vtlpLabel4)
                .then(async (isProgramRunning) => {
                    await expect(isProgramRunning)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2731: Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});