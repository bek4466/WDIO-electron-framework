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
const deviceData = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementDataFile", "systemInfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementDataFile", "systeminfoTmp.json");
const systemInfoFileData = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementDataFile", "dataFile", "DataFile.json");
const logClient = new LogClient("e2e:TOOL-2996");
import { reject } from "q";
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
const comClient = new CommunicationClient();
comClient.setTimeout(10000);
/**
 * @Author `Miguel.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2996`
 * @Date `10/27/2021`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2514 UC user can make changes to the data file before deploying a certified project`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2514: UC user can make changes to the data file before deploying a certified project");
        allure.addLink("User Story: TOOL-2514", "https://extron.atlassian.net/browse/TOOL-2514");
        allure.addLink("Task Issue: TOOL-2996", "https://extron.atlassian.net/browse/TOOL-2996");
        allure.addLink("Test Case: TOOL-T518", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T518");
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

    it("Verify Uncertified User can make changes to data file before deploying a certified project (IP)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const b = path.resolve(systemInfoFileData);
            const dataFile = fs.readJSONSync(b);
            const systemInfo = fs.readJsonSync(a);
            const sysID = systemInfo.system.system_id;
            const oldIP = dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost;
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
            await browser.pause(timeout.fast);
            const login = new LoginComponent(browser);
            await common.switchToWin(browser, tabTitles.mainTab, data.unLicensedUser1, data.unLicensedUser1pass, true);
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFile);
            dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost = deviceData.Pro350_IPCP_1;
            await fs.writeJSONSync(b, dataFile);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("deploybuttonisDisabled");
                });
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
                    console.log("one failure");
                    //fail("checkMessagePaneLog");
                });
            await browser.pause(timeout.slow);
            let IPCP360: string;
            let TLP525NC: string;

            const ipcp360: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlp525nc: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: dataFile.ENG.B3.Devices[0].nbpCredentials[0].IPHost,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            await comClient.connectSession(ipcp360)
                .then(async (result) => {
                    IPCP360 = await result;
                    const response = await comClient.sendGlobalMessage(IPCP360, new GetBoxID());
                    let systemidMatched = false;
                    if (response.systemid === Number(sysID)) {
                        systemidMatched = true;

                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(IPCP360);
                })
                .catch((err: Error) => {
                    //fail("System number1 match fail");
                });
            await comClient.connectSession(tlp525nc)
                .then(async (result) => {
                    TLP525NC = await result;
                    const response = await comClient.sendGlobalMessage(TLP525NC, new GetBoxID());
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
            dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost = oldIP;
            await fs.writeJSONSync(b, dataFile);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2996: Exception Error: " + `${err}`);
            //fail("TOOL-2996 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Deployment} TOOL-2514 UC user can make changes to the data file before deploying a certified project`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2514: UC user can make changes to the data file before deploying a certified project");
        allure.addLink("User Story: TOOL-2514", "https://extron.atlassian.net/browse/TOOL-2514");
        allure.addLink("Task Issue: TOOL-2996", "https://extron.atlassian.net/browse/TOOL-2996");
        allure.addLink("Test Case: TOOL-T519", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T519");
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

    it("Verify Uncertified User can make changes to data file before deploying a certified project (Hostname)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const b = path.resolve(systemInfoFileData);
            const dataFile = fs.readJSONSync(b);
            const systemInfo = fs.readJsonSync(a);
            const sysID = systemInfo.system.system_id;
            const oldIP = dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost;
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFile);
            dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost = deviceData.IPCP360_dualnic_DHCP;
            await fs.writeJSONSync(b, dataFile);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("deploybuttonisDisabled");
                });
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
                    console.log("one failure");
                    //fail("checkMessagePaneLog");
                });
            await browser.pause(timeout.slow);
            let IPCP360: string;
            let TLP525NC: string;

            const ipcp360: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlp525nc: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: dataFile.ENG.B3.Devices[0].nbpCredentials[0].IPHost,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            await comClient.connectSession(ipcp360)
                .then(async (result) => {
                    IPCP360 = await result;
                    const response = await comClient.sendGlobalMessage(IPCP360, new GetBoxID());
                    let systemidMatched = false;
                    if (response.systemid === Number(sysID)) {
                        systemidMatched = true;

                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(IPCP360);
                })
                .catch((err: Error) => {
                    //fail("System number1 match fail");
                });
            await comClient.connectSession(tlp525nc)
                .then(async (result) => {
                    TLP525NC = await result;
                    const response = await comClient.sendGlobalMessage(TLP525NC, new GetBoxID());
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
            dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost = oldIP;
            await fs.writeJSONSync(b, dataFile);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2996: Exception Error: " + `${err}`);
            //fail("TOOL-2996 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Deployment} TOOL-2514 UC user can make changes to the data file before deploying a certified project`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2514: UC user can make changes to the data file before deploying a certified project");
        allure.addLink("User Story: TOOL-2514", "https://extron.atlassian.net/browse/TOOL-2514");
        allure.addLink("Task Issue: TOOL-2996", "https://extron.atlassian.net/browse/TOOL-2996");
        allure.addLink("Test Case: TOOL-T520", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T520");
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

    it("Verify Uncertified User can make changes to data file before deploying a certified project (FQDN)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const b = path.resolve(systemInfoFileData);
            const dataFile = fs.readJSONSync(b);
            const systemInfo = fs.readJsonSync(a);
            const sysID = systemInfo.system.system_id;
            const oldIP = dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost;
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFile);
            dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost = deviceData.IPCP360DUALNIC_AVLAN;
            await fs.writeJSONSync(b, dataFile);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("deploybuttonisDisabled");
                });
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
                    console.log("one failure");
                    //fail("checkMessagePaneLog");
                });
            await browser.pause(timeout.slow);
            let IPCP360: string;
            let TLP525NC: string;

            const ipcp360: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlp525nc: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: dataFile.ENG.B3.Devices[0].nbpCredentials[0].IPHost,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            await comClient.connectSession(ipcp360)
                .then(async (result) => {
                    IPCP360 = await result;
                    const response = await comClient.sendGlobalMessage(IPCP360, new GetBoxID());
                    let systemidMatched = false;
                    if (response.systemid === Number(sysID)) {
                        systemidMatched = true;

                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(IPCP360);
                })
                .catch((err: Error) => {
                    //fail("System number1 match fail");
                });
            await comClient.connectSession(tlp525nc)
                .then(async (result) => {
                    TLP525NC = await result;
                    const response = await comClient.sendGlobalMessage(TLP525NC, new GetBoxID());
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
            dataFile.ENG.B3.Devices[0].primaryCredentials.IPHost = oldIP;
            await fs.writeJSONSync(b, dataFile);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2996: Exception Error: " + `${err}`);
            //fail("TOOL-2996 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Deployment} TOOL-2514 UC user can make changes to the data file before deploying a certified project`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2514: UC user can make changes to the data file before deploying a certified project");
        allure.addLink("User Story: TOOL-2514", "https://extron.atlassian.net/browse/TOOL-2514");
        allure.addLink("Task Issue: TOOL-2996", "https://extron.atlassian.net/browse/TOOL-2996");
        allure.addLink("Test Case: TOOL-T521", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T521");
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

    xit("Verify Uncertified User can make changes to data file before deploying a certified project (UserName)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const b = path.resolve(systemInfoFileData);
            const dataFile = fs.readJSONSync(b);
            const systemInfo = fs.readJsonSync(a);
            const sysID = systemInfo.system.system_id;
            const oldUser = dataFile.ENG.B3.Devices[0].primaryCredentials.uName;
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFile);
            dataFile.ENG.B3.Devices[0].primaryCredentials.uName = "garbage";
            await fs.writeJSONSync(b, dataFile);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("deploybuttonisDisabled");
                });
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
                    console.log("one failure");
                    //fail("checkMessagePaneLog");
                });
            dataFile.ENG.B3.Devices[0].primaryCredentials.uName = oldUser;
            await fs.writeJSONSync(b, dataFile);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2996: Exception Error: " + `${err}`);
            //fail("TOOL-2996 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Deployment} TOOL-2514 UC user can make changes to the data file before deploying a certified project`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2514: UC user can make changes to the data file before deploying a certified project");
        allure.addLink("User Story: TOOL-2514", "https://extron.atlassian.net/browse/TOOL-2514");
        allure.addLink("Task Issue: TOOL-2996", "https://extron.atlassian.net/browse/TOOL-2996");
        allure.addLink("Test Case: TOOL-T522", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T522");
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

    xit("Verify Uncertified User can make changes to data file before deploying a certified project (Password)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const b = path.resolve(systemInfoFileData);
            const dataFile = fs.readJSONSync(b);
            const systemInfo = fs.readJsonSync(a);
            const sysID = systemInfo.system.system_id;
            const password = dataFile.ENG.B3.Devices[0].primaryCredentials.password;
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFile);
            dataFile.ENG.B3.Devices[0].primaryCredentials.password = "garbage";
            await fs.writeJSONSync(b, dataFile);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("deploybuttonisDisabled");
                });
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
                    console.log("one failure");
                    //fail("checkMessagePaneLog");
                });
            dataFile.ENG.B3.Devices[0].primaryCredentials.password = password;
            await fs.writeJSONSync(b, dataFile);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2996: Exception Error: " + `${err}`);
            //fail("TOOL-2996 System Did not Deploy");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});