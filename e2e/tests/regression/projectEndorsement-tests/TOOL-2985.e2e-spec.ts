// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { CredentialsTable } from "../../../src/credentials/credentialsTable/credentialsTable.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { DownloadRecoveryComponent } from "../../../src/downloadRecoveryComponent/downloadRecoveryComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { LoginComponent } from '../../../src/accessControlComponent/loginComponent.po';
import { WinExplorer } from '../../../src/WindowsExplorer/WindowsExplorer.po';
import { CommonMethods } from "../../commonMethods.po";
import { Grabber } from "../../../src/messagePane/grabber.po";
import { reject } from "q";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementDataFile", "systemInfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementDataFile", "systemInfoTmp.json");
const downloadPath = path.join(__dirname, "..", "..", "..", "resources", "TmpDownloadProject");
const downloadDataFilePath = path.join(__dirname, "..", "..", "..", "resources", "TmpDownloadProject", "dataFile");
const downloadedProject = path.join(__dirname, "..", "..", "..", "resources", "TmpDownloadProject", "systemInfoTmp.json");
const srcFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "src", "main.py");
const dataFilePath = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementDataFile", "dataFile");
const systemInfoFileData = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementDataFile", "dataFile", "DataFile.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2985");


/**
 * @Author `Miguel Cruz - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2516`
 * @Description `Ability to retrieve the certification file(project download,recovery)`
 * @Date `11/1/2021`
 */

describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-2985:(Ability to retrieve the certification file(project download,recovery))`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2516: Ability to retrieve the certification file(project download,recovery)");
        allure.addLink("User Story: TOOL-2516", "https://extron.atlassian.net/browse/TOOL-2516");
        allure.addLink("Task Issue: TOOL-2985", "https://extron.atlassian.net/browse/TOOL-2985");
        allure.addLink("Test Case: TOOL-T523", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T523");
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

    it("Verify that Uncertified User can Redeploy an un Modified Project that has Been Downloaded from the Controller", async () => {
        return new Promise<void>(async (resolve) => {
            await common.deleteFolderContents(downloadPath)
                .then(async () => { })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deleteFolderContents");
                });
            var systemDeployment = new DeployComponent(browser);
            var messageComponent = new MessagePaneComponent(browser);
            const creds = new CredsComponent(browser);
            // copying systemInfoFile -> systemInfoFileTemp
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const b = path.resolve(systemInfoFileData);
            const dataFile = fs.readJSONSync(b);
            // systemInfo1 read into memory
            const systemInfo1 = fs.readJsonSync(a1);
            const login = new LoginComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    return systemDeployment.deployCodeOnlyBtn.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch(async (err: Error) => {
                            logClient.error(err);
                            await reject(err);
                            //fail("deploybuttonisEnabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${systemDeployment.deployButton}` + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    await reject(err);
                    //fail("checkMessagePaneLog");
                });
            const downloadRecovery = new DownloadRecoveryComponent(browser);
            const winExplorer = new WinExplorer(browser);
            winExplorer.ClickApplication();;
            await downloadRecovery.downloadInputAddress.setDownload(dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost);
            await downloadRecovery.downloadBtn.click()
                .then(async () => { })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("downloadbuttonClick");
                });
            await browser.pause(timeout.medium);
            await downloadRecovery.downloadUserName.setUsername(data.controllerUserName);
            await downloadRecovery.downloadPassword.setPassword(data.controllerPassword);
            await downloadRecovery.sidePanelDownloadBtn.click()
                .then(async () => { })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("sidePanelbuttonClick");
                });
            await downloadRecovery.downloadCompletePopup.checkElementPresent()
                .then(async (val: boolean) => {
                    await expect(val)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("downloadCompletePopUp did not browserear");
                });
            await downloadRecovery.closeSidePanelBtn.click()
                .then(async () => { })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("closeSidePanelbuttonClick");
                });
            await common.switchToWin(browser, tabTitles.mainTab, data.unLicensedUser1, data.unLicensedUser1pass, true);
            systemDeployment = new DeployComponent(browser);
            messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(dataFilePath, downloadDataFilePath)
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(downloadedProject);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch(async (err: Error) => {
                            logClient.error(err);
                            await reject(err);
                            //fail("deploybuttonisEnabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    await reject(err);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-2985: Exception Error: " + `${err}`);
            //fail("TOOL-2985 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-2985:(Ability to retrieve the certification file(project download,recovery))`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2516: Ability to retrieve the certification file(project download,recovery)");
        allure.addLink("User Story: TOOL-2516", "https://extron.atlassian.net/browse/TOOL-2516");
        allure.addLink("Task Issue: TOOL-2985", "https://extron.atlassian.net/browse/TOOL-2985");
        allure.addLink("Test Case: TOOL-T523", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T523");
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

    it("Verify that Uncertified User can Redeploy an un Modified Project that has Been Downloaded from the Controller", async () => {
        return new Promise<void>(async (resolve) => {
            await common.deleteFolderContents(downloadPath)
                .then(async () => { })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deleteFolderContents");
                });
            var systemDeployment = new DeployComponent(browser);
            var messageComponent = new MessagePaneComponent(browser);
            const creds = new CredsComponent(browser);
            // copying systemInfoFile -> systemInfoFileTemp
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const b = path.resolve(systemInfoFileData);
            const dataFile = fs.readJSONSync(b);
            // systemInfo1 read into memory
            const systemInfo1 = fs.readJsonSync(a1);
            const login = new LoginComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    return systemDeployment.deployCodeOnlyBtn.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch(async (err: Error) => {
                            logClient.error(err);
                            await reject(err);
                            //fail("deploybuttonisEnabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${systemDeployment.deployButton}` + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    await reject(err);
                    //fail("checkMessagePaneLog");
                });
            const downloadRecovery = new DownloadRecoveryComponent(browser);
            const winExplorer = new WinExplorer(browser);
            winExplorer.ClickApplication();;
            await downloadRecovery.downloadInputAddress.setDownload(dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost);
            await downloadRecovery.downloadBtn.click()
                .then(async () => { })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("downloadbuttonClick");
                });
            await browser.pause(timeout.medium);
            await downloadRecovery.downloadUserName.setUsername(data.controllerUserName);
            await downloadRecovery.downloadPassword.setPassword(data.controllerPassword);
            await downloadRecovery.sidePanelDownloadBtn.click()
                .then(async () => { })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("sidePanelbuttonClick");
                });
            await downloadRecovery.downloadCompletePopup.checkElementPresent()
                .then(async (val: boolean) => {
                    await expect(val)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("downloadCompletePopUp did not browserear");
                });
            await downloadRecovery.closeSidePanelBtn.click()
                .then(async () => { })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("closeSidePanelbuttonClick");
                });
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, true);
            systemDeployment = new DeployComponent(browser);
            messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(dataFilePath, downloadDataFilePath)
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(downloadedProject);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch(async (err: Error) => {
                            logClient.error(err);
                            await reject(err);
                            //fail("deploybuttonisEnabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    await reject(err);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-2985: Exception Error: " + `${err}`);
            //fail("TOOL-2985 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});