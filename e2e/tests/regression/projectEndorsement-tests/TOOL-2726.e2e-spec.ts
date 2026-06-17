// @ts-nocheck
import { LogClient } from "@extron/winston-logger";
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { LoginComponent } from '../../../src/accessControlComponent/loginComponent.po';
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const accessKeys = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "keys.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementNestedLayout", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementNestedLayout", "systeminfoTmp.json");
const systemInfoFileTempdat = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementNestedLayout", "systeminfoTmp-certification.dat");
const dirPath = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementNestedLayout");
const systemInfoLayoutFile1 = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "layout", "CSPTestingProjectQA.gdl");
const systemInfoLayoutFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementNestedLayout", "layout", "CSPTestingProjectQA.gdl");
const systemInfoNestedLayoutFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementNestedLayout", "layout", "FolderX", "CSPTestingProjectQATestNew.gdl");
const logClient = new LogClient("e2e:TOOL-2726");
import { reject } from "q";
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2726`
 * @Date `7/05/2021`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2256 Provide certified/uncertified users the ability to deploy the shared project files`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2256: Provide certified/uncertified users the ability to deploy the shared project files");
        allure.addLink("User Story: TOOL-2256", "https://extron.atlassian.net/browse/TOOL-2256");
        allure.addLink("Task Issue: TOOL-2726", "https://extron.atlassian.net/browse/TOOL-2726");
        allure.addLink("Test Case: TOOL-T290", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T290");
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

    it("Verify Files are not endorsed, if they are in main folder but path is referenced to the subfolder.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const userSettings = new CredsComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const systemInfo = fs.readJsonSync(a);
            await systemDeployment.endorseButton.isDisabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("endorsebuttonisDisabled");
                });
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFile);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a, systemInfo);
            await browser.pause(timeout.fast);
            await systemDeployment.endorseButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("endorsebuttonisEnabled");
                });
            var secondEndorsedDate: string = await common.getCertificationFormattedDate();
            await systemDeployment.endorseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            const lastendorsed = await common.getCertificationFormattedDate();
            await browser.pause(timeout.fast);
            await systemDeployment.endorsedAlertMessage.endorseAlertIsVisible()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("endorsedAlertMessage");
                });
            await browser.pause(timeout.fast);
            await systemDeployment.lastEndorsedTimestamp.checkLastEndorsedTime(lastendorsed, secondEndorsedDate)
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("lastEndorsedTimestamp");
                });
            const login = new LoginComponent(browser);
            await common.switchToWin(browser, tabTitles.mainTab, data.unLicensedUser1, data.unLicensedUser1pass, true);
            let fileFound: boolean = false;
            fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfo.dat") {
                        fileFound = true;
                    }
                });
            await expect(fileFound)
                .toBe(true);
            await browser.pause(timeout.fast);
            try {
                fs.unlinkSync(systemInfoLayoutFile);
            } catch (err) {
                console.error(err);
            }
            let layoutFound: boolean = false;
            await browser.pause(timeout.fast);
            await fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "CSPTestingProjectQA.gdl") {
                        layoutFound = true;
                    }
                });
            await expect(layoutFound)
                .toBe(false);

            await systemDeployment.destinyInputField.inputFilePathEditable(systemInfoFile);
            // systemInfo.system.project_root_folder_path = path.dirname(a);
            // await fs.writeJSONSync(a, systemInfo);
            await systemDeployment.deployButton.click()
                .then(async () => {
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
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            await common.copyFolder(systemInfoLayoutFile1, systemInfoLayoutFile);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2726: Exception Error: " + `${err}`);
            //fail("TOOL-2726");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});


