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
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deploymentLocators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfo.json");
const systemInfoDatFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfoTmp-certification.dat");
const systemInfoDatFile1 = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfoTmpnew.dat");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfoTmp.json");
const dirPath = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject");
const logClient = new LogClient("e2e:TOOL-2307");
import { reject } from "q";
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
import { GetPortExpPrimaryAddressList } from "@extron/communication/release/lib/models/globalMessages/getPortExpPrimaryAddressList";
const comClient = new CommunicationClient();
comClient.setTimeout(10000);
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2307`
 * @Date `2/10/2021`
 */
describe(`${tabTitles.REGRESSION.Deployment} TOOL-2257 Deploy projects only that are authored/verified by a certified developer`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2257: Deploy projects only that are authored/verified by a certified developer");
        allure.addLink("User Story: TOOL-2257", "https://extron.atlassian.net/browse/TOOL-2257");
        allure.addLink("Task Issue: TOOL-2307", "https://extron.atlassian.net/browse/TOOL-2307");
        allure.addLink("Test Case: TOOL-T257", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T257");
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

    it("Verify that when Project endorsement is missing and Certified User deploys a project an additional .dat file is created within Project folder", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const userSettings = new CredsComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            const sysID = systemInfo1.system.system_id;
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
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
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
            let fileFound: boolean = false;
            fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfoTmp-certification.dat") {
                        fileFound = true;
                    }
                });
            await expect(fileFound)
                .toBe(true);
            await browser.pause(timeout.fast);
            try {
                fs.unlinkSync(systemInfoDatFile);
            } catch (err) {
                console.error(err);
            }
            let fileFoundSecondTime: boolean = false;
            await browser.pause(timeout.fast);
            await fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfoTmp-certification.dat") {
                        fileFoundSecondTime = true;
                    }
                });
            await expect(fileFoundSecondTime)
                .toBe(false);
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
            let fileFoundthirdTime: boolean = false;
            fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfoTmp-certification.dat") {
                        fileFoundthirdTime = true;
                    }
                });
            await expect(fileFoundthirdTime)
                .toBe(true);
            await browser.pause(timeout.slow);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2307: Exception Error: " + `${err}`);
            //fail("TOOL-2307 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe.only(`${tabTitles.REGRESSION.Deployment} TOOL-2257 Deploy projects only that are authored/verified by a certified developer`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2257: Deploy projects only that are authored/verified by a certified developer");
        allure.addLink("User Story: TOOL-2257", "https://extron.atlassian.net/browse/TOOL-2257");
        allure.addLink("Task Issue: TOOL-2307", "https://extron.atlassian.net/browse/TOOL-2307");
        allure.addLink("Test Case: TOOL-T261", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T261");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, true);
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

    it("Verify that when user is Uncertified and when Project endorsement is present, CSDU should be able to deploy successfully", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const userSettings = new CredsComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            const sysID = systemInfo1.system.system_id;
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
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
            await systemDeployment.endorseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
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
            const login = new LoginComponent(browser);
            await common.switchToWin(browser, tabTitles.mainTab, data.unLicensedUser1,  data.unLicensedUser1pass, true);
            await browser.reloadSession();
            await browser.pause(3000);
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await browser.switchWindow("ControlScript Deployment Utility");
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);

            let endorseBtnElement = await browser.$(deploymentLocators.endorseBtn)
            let endorseBtnElementExists = await endorseBtnElement.isExisting()
            await expect(endorseBtnElementExists)
                    .toEqual(false);
            console.log(endorseBtnElementExists)
            await browser.pause(timeout.fast);
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
            await browser.pause(timeout.slow);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2307: Exception Error: " + `${err}`);
            //fail("TOOL-2307 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2257 Deploy projects only that are authored/verified by a certified developer`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2257: Deploy projects only that are authored/verified by a certified developer");
        allure.addLink("User Story: TOOL-2257", "https://extron.atlassian.net/browse/TOOL-2257");
        allure.addLink("Task Issue: TOOL-2307", "https://extron.atlassian.net/browse/TOOL-2307");
        allure.addLink("Test Case: TOOL-T263", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T263");
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

    it("Verify that when Project endorsement is missing and Uncertified User deploys a project, the project deployment fails", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const userSettings = new CredsComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const login = new LoginComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            const sysID = systemInfo1.system.system_id;
            try {
                fs.unlinkSync(systemInfoDatFile);
            } catch (err) {
                console.error(err);
            }
            let fileFound: boolean = false;
            await browser.pause(timeout.fast);
            await fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfoTmp-certification.dat") {
                        fileFound = true;
                    }
                });
            await expect(fileFound)
                .toBe(false);
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            // systemInfo1.system.project_root_folder_path = path.dirname(a);
            // await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.endorseButton.isClickable()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(false);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("endorsebuttonisVisible");
                });
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deployFailureMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.endorseFileNotFound, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2307: Exception Error: " + `${err}`);
            //fail("TOOL-2307 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2257 Deploy projects only that are authored/verified by a certified developer`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2257: Deploy projects only that are authored/verified by a certified developer");
        allure.addLink("User Story: TOOL-2257", "https://extron.atlassian.net/browse/TOOL-2257");
        allure.addLink("Task Issue: TOOL-2307", "https://extron.atlassian.net/browse/TOOL-2307");
        allure.addLink("Test Case: TOOL-T266", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T266");
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

    it("Verify that when uncertified user changes endorsement file and redeploys the project, project deployment fails.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const userSettings = new CredsComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const login = new LoginComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            const sysID = systemInfo1.system.system_id;
            // systemInfo1.system.project_root_folder_path = path.dirname(a);
            // await fs.writeJSONSync(a1, systemInfo1);
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
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            // systemInfo1.system.project_root_folder_path = path.dirname(a);
            // await fs.writeJSONSync(a1, systemInfo1);
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
            await systemDeployment.endorseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
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
            await common.switchToWin(browser, tabTitles.mainTab, data.unLicensedUser1,  data.unLicensedUser1pass, true);
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            await systemDeployment.endorseButton.isClickable()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("endorseButtonIsVisible");
                });
            let fileFoundnext: boolean = false;
            await browser.pause(timeout.fast);
            await fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfoTmp-certification.dat") {
                        fileFoundnext = true;
                    }
                });
            await expect(fileFoundnext)
                .toBe(true);
            await browser.pause(timeout.fast);
            systemInfo1.system.system_id = "abc";
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deployFailureMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.endorseFileNotMatched, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            fs.renameSync(systemInfoDatFile, systemInfoDatFile1);
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deployFailureMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.endorseFileNotMatched, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            fs.renameSync(systemInfoDatFile1, systemInfoDatFile);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2307: Exception Error: " + `${err}`);
            //fail("TOOL-2307 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
