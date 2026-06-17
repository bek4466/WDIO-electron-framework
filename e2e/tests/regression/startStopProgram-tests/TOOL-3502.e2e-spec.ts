// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
import { reject } from "q";
const logClient = new LogClient("e2e:CSP-30");
/**
 * @Author `Amit B`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/CSP-30`
 * @JIRA_Link_POM `https://extron.atlassian.net/browse/CSP-29`
 * @Description `Deploy Component Tests`
 * @Date `09/16/2019`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-3374: Starting/Stopping Program Messages in Message Pane`, () => {
    before(async () => {
        allure.addOwner("Amit B");
        allure.story("TOOL-3374: Starting/Stopping Program Messages in Message Pane");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3374", "User Story: TOOL-3374");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3502", "Task Issue: TOOL-3502");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T986", "Test Case: TOOL-T986");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
       }).catch((err) => {
           logClient.error(err);
       });
    });

    it("Verify that start and stop messages appear during deployment", async () => {
        const systemDeployment = new DeployComponent(browser);
        await common.copyFolder(systemInfoFile, systemInfoFileTemp);
        const a = path.resolve(systemInfoFile);
        const a1 = path.resolve(systemInfoFileTemp);
        const systemInfo1 = fs.readJsonSync(a1);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
        await fs.writeJSONSync(a1, systemInfo1);
        await browser.pause(timeout.fast);
        await systemDeployment.deployButton.click()
        .then(async () => {
            return systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(false);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    
                });
        })
        .catch((err: Error) => {
            logClient.error("Exception caught: " + `${err}`);
            
        });
        const messageComponent = new MessagePaneComponent(browser);
        await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.system.name + data.programStoppedMessage, data.infoSeverity)
        .then(async (value: boolean) => {
                await expect(value)
                    .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    await reject(err);
                    
                });
                await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.system.name + data.programStartedMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                        await expect(value)
                            .toEqual(true);
                        })
                        .catch(async (err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                            await reject(err);
                            
                        });
                        await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toEqual(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                            
                        });
        
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
        
});


describe(`${tabTitles.REGRESSION.Deployment}TOOL-3374: Starting/Stopping Program Messages in Message Pane`, () => {
    before(async () => {
       allure.story("TOOL-3374: Starting/Stopping Program Messages in Message Pane");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3374", "User Story: TOOL-3374");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3502", "Task Issue: TOOL-3502");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T987", "Test Case: TOOL-T987");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
       }).catch((err) => {
           logClient.error(err);
       });
    });

    it("Verify that start message and stop message do not appear when Controller is offline", async () => {
        const systemDeployment = new DeployComponent(browser);
        await common.copyFolder(systemInfoFile, systemInfoFileTemp);
        const a = path.resolve(systemInfoFile);
        const a1 = path.resolve(systemInfoFileTemp);
        const systemInfo1 = fs.readJsonSync(a1);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
        systemInfo1.system.project_root_folder_path = path.dirname(a);
        systemInfo1.devices[0].network.interfaces[0].address = "1.2.3.4";

        await fs.writeJSONSync(a1, systemInfo1);
        await browser.pause(timeout.fast);
        await systemDeployment.deployButton.click()
        .then(async () => {
            return systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(false);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    
                });
        })
        .catch((err: Error) => {
            logClient.error("Exception caught: " + `${err}`);
            
        });
        const messageComponent = new MessagePaneComponent(browser);
        await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.system.name + data.programStoppedMessage, data.infoSeverity)
        .then(async (value: boolean) => {
                await expect(value)
                    .toEqual(false);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    await reject(err);
                    
                });
                await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.system.name + data.programStartedMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                        await expect(value)
                            .toEqual(false);
                        })
                        .catch(async (err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                            await reject(err);
                            
                        });
                        await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                            
                        });
        
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
        
});

describe(`${tabTitles.REGRESSION.Deployment}TOOL-3374: Starting/Stopping Program Messages in Message Pane`, () => {
    before(async () => {
       allure.story("TOOL-3374: Starting/Stopping Program Messages in Message Pane");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3374", "User Story: TOOL-3374");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3502", "Task Issue: TOOL-3502");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T988", "Test Case: TOOL-T988");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
       }).catch((err) => {
           logClient.error(err);
       });
    });

    it("Verify that start/stop messages do not appear when systemID is not valid", async () => {
        const systemDeployment = new DeployComponent(browser);
        await common.copyFolder(systemInfoFile, systemInfoFileTemp);
        const a = path.resolve(systemInfoFile);
        const a1 = path.resolve(systemInfoFileTemp);
        const systemInfo1 = fs.readJsonSync(a1);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
        systemInfo1.system.project_root_folder_path = path.dirname(a);
        systemInfo1.system.system_id = "abcd";
    
        await fs.writeJSONSync(a1, systemInfo1);
        await browser.pause(timeout.fast);
        await systemDeployment.deployButton.click()
        .then(async () => {
            return systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(false);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    
                });
        })
        .catch((err: Error) => {
            logClient.error("Exception caught: " + `${err}`);
            
        });
        const messageComponent = new MessagePaneComponent(browser);
        await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.system.name + data.programStoppedMessage, data.infoSeverity)
        .then(async (value: boolean) => {
                await expect(value)
                    .toEqual(false);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    await reject(err);
                    
                });
                await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo1.system.name + data.programStartedMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                        await expect(value)
                            .toEqual(false);
                        })
                        .catch(async (err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                            await reject(err);
                            
                        });
                        await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                            
                        });
        
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
        
});
