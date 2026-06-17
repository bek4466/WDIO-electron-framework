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
const logClient = new LogClient("e2e:CSP-2730");
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2730`
 * @Description `Primary Extron Control for Web`
 * @Date `08/24/2021`
 */

xdescribe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2730:(ECW Test: Primary Extron Control for Web)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1741: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1741", "User Story: TOOL-1741");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2730", "Task Issue: TOOL-2730");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3261", "Test Case: TOOL-T3261");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);;
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

    it("Verify Default value used when extron_control_web_id not provided(ECW)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            delete systemInfo1.devices[2].extron_control_web_id;
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
});

xdescribe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2730:(ECW Test: Primary Extron Control for Web)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1741: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1741", "User Story: TOOL-1741");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2730", "Task Issue: TOOL-2730");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3262", "Test Case: TOOL-T3262");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);;
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

    it("Verify provided extron_control_web id is used for ECW", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
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
            logClient.error("TOOL-2730: Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});