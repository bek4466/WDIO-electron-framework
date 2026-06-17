// @ts-nocheck
import { LogClient } from "@extron/winston-logger";
import * as fs from "fs-extra";
import * as path from "path";

// import * as robot from "@jitsi/robotjs";

import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { DownloadRecoveryComponent } from "../../../src/downloadRecoveryComponent/downloadRecoveryComponent.po";
import { LoginComponent } from '../../../src/accessControlComponent/loginComponent.po';
import { WinExplorer } from '../../../src/WindowsExplorer/WindowsExplorer.po';
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const accessKeys = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "keys.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DualNicProject", "systeminfo.json");
const systemInfoFile2 = path.join(__dirname, "..", "..", "..", "resources", "MediumProject", "project.json");
const downloadPath = path.join(__dirname, "..", "..", "..", "resources", "TmpDownloadProject");
const downloadedProject = path.join(__dirname, "..", "..", "..", "resources", "TmpDownloadProject", "systeminfo.json");
const downloadedProject2 = path.join(__dirname, "..", "..", "..", "resources", "TmpDownloadProject", "project.json");
const dirPath = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject");
const logClient = new LogClient("e2e:CSP-2886");
import { reject } from "q";
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
const comClient = new CommunicationClient();
comClient.setTimeout(10000);
/**
 * @Author `Amit B `
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2990`
 * @Date `10/22/2021`
 */


 describe(`${tabTitles.REGRESSION.Deployment} TOOL-2258 Ability for uncertified user to redeploy an un modified project that has been downloaded from the controller`, () => {
    beforeEach(async () => {
        allure.addOwner("Amit B");
        allure.story("TOOL-2258: Ability for uncertified user to redeploy an un modified project that has been downloaded from the controller");
        allure.addLink("User Story: TOOL-2258", "https://extron.atlassian.net/browse/TOOL-2258");
        allure.addLink("Task Issue: TOOL-2886", "https://extron.atlassian.net/browse/TOOL-2886");
        allure.addLink("Test Case: TOOL-T563", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T563");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            throw new Error(err);
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify that Uncertified User can Redeploy an un Modified Project that has Been Downloaded from the Controller (no Datafile)", async () => {
        await common.deleteFolderContents(downloadPath)
            .then(async () => { })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`);
                //fail("deleteFolderContents");
            });
        const systemDeployment = new DeployComponent(browser);
        await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFile);
        const a = path.resolve(systemInfoFile);
        const systemInfo = fs.readJsonSync(a);
        await browser.pause(timeout.fast);
        const login = new LoginComponent(browser);
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
        const messageComponent = new MessagePaneComponent(browser);
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
        winExplorer.ClickApplication();
        await downloadRecovery.downloadInputAddress.setDownload(systemInfo.devices[0].network.interfaces[0].address);
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

        await browser.pause(timeout.medium);
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
    });
});