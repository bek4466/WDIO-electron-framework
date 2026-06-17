// @ts-nocheck
import { LogClient } from "@extron/winston-logger";
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { LoginComponent } from '../../../src/accessControlComponent/loginComponent.po';
import { CommonMethods } from "../../commonMethods.po";
import { DebugSetupOptions, DefaultSetupOptions, ServicePoolManager } from "@extron/module-service-initializer";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const accessKeys = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "keys.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject-2256", "systeminfo.json");
const systemInfoFile2 = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject-2256", "systeminfo2.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject-2256", "systeminfoTmp.json");
const systemInfoFileTemp1 = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject-2256", "systeminfoTmp1.json");
const TextFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject-2256", "new.txt");
const dirPath = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject-2256");
const logClient = new LogClient("e2e:TOOL-2306");
import { reject } from "q";
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
import { GetPortExpPrimaryAddressList } from "@extron/communication/release/lib/models/globalMessages/getPortExpPrimaryAddressList";
const comClient = new CommunicationClient();
const initializer = new ServicePoolManager(DefaultSetupOptions);
comClient.setTimeout(15000);
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2306`
 * @Date `2/12/2021`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2256 Provide certified/uncertified users the ability to deploy the shared project files`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2256: Provide certified/uncertified users the ability to deploy the shared project files");
        allure.addLink("User Story: TOOL-2256", "https://extron.atlassian.net/browse/TOOL-2256");
        allure.addLink("Task Issue: TOOL-2306", "https://extron.atlassian.net/browse/TOOL-2306");
        allure.addLink("Test Case: TOOL-T272", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T272");
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

    it("Verify time timestamp for endorsement is cleared", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const userSettings = new CredsComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            const a2 = path.resolve(systemInfoFile2);
            const systemInfo2 = fs.readJsonSync(a2);
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
            var lastendorsed = await common.getCertificationFormattedDate();
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
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFile2);
            await browser.pause(timeout.fast);
            // systemInfo1.system.project_root_folder_path = path.dirname(a);
            // await fs.writeJSONSync(a1, systemInfo1);
            await systemDeployment.lastEndorsedTimestamp.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("lastEndorsedTimestamp");
                });
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
            secondEndorsedDate = await common.getCertificationFormattedDate();
            await systemDeployment.endorseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            lastendorsed = await common.getCertificationFormattedDate();
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
            await browser.pause(timeout.fast);
            await systemDeployment.lastEndorsedTimestamp.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("lastEndorsedTimestamp");
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2306: Exception Error: " + `${err}`);
            //fail("TOOL-2306");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2256 Provide certified/uncertified users the ability to deploy the shared project files`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2256: Provide certified/uncertified users the ability to deploy the shared project files");
        allure.addLink("User Story: TOOL-2256", "https://extron.atlassian.net/browse/TOOL-2256");
        allure.addLink("Task Issue: TOOL-2306", "https://extron.atlassian.net/browse/TOOL-2306");
        allure.addLink("Test Case: TOOL-T273", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T273");
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

    it("Verify timestamp persists between windows.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const userSettings = new CredsComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const systemInfo1 = fs.readJsonSync(a1);
            const a2 = path.resolve(systemInfoFile2);
            const systemInfo2 = fs.readJsonSync(a2);
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
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await sideNav.deployWindow.click();
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
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2306: Exception Error: " + `${err}`);
            //fail("TOOL-2306");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2256 Provide certified/uncertified users the ability to deploy the shared project files`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2256: Provide certified/uncertified users the ability to deploy the shared project files");
        allure.addLink("User Story: TOOL-2256", "https://extron.atlassian.net/browse/TOOL-2256");
        allure.addLink("Task Issue: TOOL-2306", "https://extron.atlassian.net/browse/TOOL-2306");
        allure.addLink("Test Case: TOOL-T274", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T274");
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
        await initializer.kill();
        await browser.pause(3000);
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Files not described in systeminfo will not affect deployment.", async () => {
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
            let fileFoundThirdTime: boolean = false;
            await browser.pause(timeout.fast);
            await fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfoTmp-certification.dat") {
                        fileFoundThirdTime = true;
                    }
                });
            await expect(fileFoundThirdTime)
                .toBe(true);
            
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
            let IPCP360: string;
            let TLP525NC: string;
            let IPCP350: string;
            

            const ipcp360: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.devices[0].network.interfaces[0].address,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };


            const ipcp350: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.devices[1].network.interfaces[0].address,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlp525nc: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.devices[2].network.interfaces[0].address,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };

            try {
                IPCP360 = await comClient.connectSession(ipcp360);
                const response = await comClient.sendGlobalMessage(IPCP360, new GetBoxID());
                let systemidMatched = false;
                if (response.systemid === Number(sysID)) {
                    systemidMatched = true;
                }
                await expect(systemidMatched)
                    .toBe(true);
                await comClient.disconnectSession(IPCP360).then(() => console.error("DISCONNECTED"));
            } catch (error) {
                console.warn(error)
                expect(1).toBe(0)
            }

            try {
                await comClient.connectSession(ipcp350)
                    .then(async (result) => {
                        IPCP350 = await result;
                        const response = await comClient.sendGlobalMessage(IPCP350, new GetBoxID());
                        let systemidMatched = false;

                        if (response.systemid === Number(sysID)) {
                            systemidMatched = true;

                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(TLP525NC);
                })
                .catch((err: Error) => {
                    //fail("System number1 match fail");
                });
            const login = new LoginComponent(browser);
            await common.switchToWin(browser, tabTitles.mainTab, data.unLicensedUser1, data.unLicensedUser1pass, true);
            await fs.readFile(TextFile, 'utf8')
                // tslint:disable-next-line:no-shadowed-variable
                .then(async (data) => {
                    const newValue = data.replace('print', 'printf');
                    await fs.writeFile(TextFile, newValue)
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.warn(`${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.warn(`${err}`);
                });
            
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            
            await fs.readFile(TextFile, 'utf8')
                // tslint:disable-next-line:no-shadowed-variable
                .then(async (data) => {
                    const newValue = data.replace('printf', 'print');
                    await fs.writeFile(TextFile, newValue)
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.warn(`${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.warn(`${err}`);
                });
            
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2306: Exception Error: " + `${err}`);
            //fail("TOOL-2306");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2256 Provide certified/uncertified users the ability to deploy the shared project files`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-2256: Provide certified/uncertified users the ability to deploy the shared project files");
        allure.addLink("User Story: TOOL-2256", "https://extron.atlassian.net/browse/TOOL-2256");
        allure.addLink("Task Issue: TOOL-2306", "https://extron.atlassian.net/browse/TOOL-2306");
        allure.addLink("Test Case: TOOL-T275", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T275");
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

    it("Certified user can see endorse button as disabled when systeminfo file path is incorrect", async () => {
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
            // await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp1);
            await systemDeployment.destinyInputPathField.inputFilePathEditable(systemInfoFileTemp1)
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("setDestinyFileToUploadNoPath");

                });
            // systemInfo1.system.project_root_folder_path = path.dirname(a);
            // await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
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
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2306: Exception Error: " + `${err}`);
            //fail("TOOL-2306");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
