// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfo.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-1335");
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-1335`
 * @POM `https://extron.atlassian.net/browse/CSP-176`
 * @Description `start stop Program  Bad Scenario`
 * @Date `04/22/2020`
 */

describe.skip(`${tabTitles.REGRESSION.StartStop_Program} TOOL-1335:(start/stop Program bad scenario)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1663:Start/Stop Program Bad Scenarios for Tech Preview");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1663", "User Story: TOOL-1663");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1335", "Task Issue: TOOL-1335");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2804", "Test Case: TOOL-T2804");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });

    it("Verify that no program uploaded to the primary controller gives browserropriate message while starting program.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const systemInfo = fs.readJsonSync(a);
            const ipAddress = systemInfo.devices[0].network.interfaces[0].address;
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            systemInfo.devices[0].network.interfaces[0].address = "10.113.89.x";
            await fs.writeJSONSync(a, systemInfo);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            const startStopProgram = new StartStopProgramComponent(browser);
            await browser.pause(timeout.slow);
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
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkTroublrshootingMessagePaneLogs(data.noProgramMessageStartProgram, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            systemInfo.devices[0].network.interfaces[0].address = ipAddress;
            await fs.writeJSONSync(a, systemInfo);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-1335: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-1335:(start/stop Program bad scenario)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1663:start/stop Program Bad Scenarios for Tech Preview");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1663", "User Story: TOOL-1663");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1335", "Task Issue: TOOL-1335");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2807", "Test Case: TOOL-T2807");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });

    it("Verify that incorrect credentials for Primary controller gives browserropriate error message while starting program when message pane is opened.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const systemInfo = fs.readJsonSync(a);
            const userName = systemInfo.devices[0].username;
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            systemInfo.devices[0].username = "neelam";
            await fs.writeJSONSync(a, systemInfo);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            const startStopProgram = new StartStopProgramComponent(browser);
            await browser.pause(timeout.slow);
            await messageComponent.openMessagePaneButton.click()
                .then(async () => {
                    await messageComponent.messagePaneVisible.isVisible()
                        .then(async (value) => {
                            await expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: Message Pane is not Visible " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: OpenMessage Pane Button is not Visible" + `${err}`);

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
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkTroublrshootingMessagePaneLogs(data.controllerCredentialsIncorrectMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            systemInfo.devices[0].username = userName;
            await fs.writeJSONSync(a, systemInfo);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-1335: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
