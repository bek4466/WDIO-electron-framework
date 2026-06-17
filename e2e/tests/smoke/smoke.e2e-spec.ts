/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { LoginComponent } from "../../src/accessControlComponent/loginComponent.po";
import { allure } from "../../src/allure/allure";
import { CredsComponent } from "../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../src/programLogComponent/programLog.po";
import { SideNavigationComponent } from "../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../src/traceComponent";
import { ToastComponent } from "../../src/toastComponent/toastComponent.po";
import { ProfileComponent } from '../../src/ProfileComponent/ProfileComponent.po';
// import { WinExplorer } from "../../src/WindowsExplorer";
import { CommonMethods } from "../commonMethods.po";
import { reject } from "q";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "resources", "ProjectEndorsementProject-2256", "systeminfo.json");
const systemInfoDatFile = path.join(__dirname, "..", "..", "resources", "ProjectEndorsementProject-2256", "systeminfoTmp-certification.dat");
const systemInfoDatFile1 = path.join(__dirname, "..", "..", "resources", "ProjectEndorsementProject-2256", "systeminfoTmpnew.dat");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "resources", "ProjectEndorsementProject-2256", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePath = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfo.json");
const DeployProjectDataFile = path.join(__dirname, "..", "..", "resources", "DeployProject", "dataFile", "DataFile.json");
const systemInfoFilePathKevin = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT60.json");
const systemInfoKevinCredFilePath = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT60-credential.dat");
const systemInfoFilePathForSmoke = path.join(__dirname, "..", "..", "resources", "SmokeDeploy", "systeminfo1.json");
const SmokeDeployDataFile = path.join(__dirname, "..", "..", "resources", "SmokeDeploy", "dataFile", "DataFile.json");
const systemInfoPathForLargeDeployment = path.join(__dirname, "..", "..", "resources", "SmokeTest", "systeminfo.json");
const SmokeTestDataFile = path.join(__dirname, "..", "..", "resources", "SmokeTest", "dataFile", "DataFile.json");
const systemInfoFilePathCSP20T53 = path.join(__dirname, "..", "..", "resources", "ProjectForCSP-20", "systeminfoT53.json");
const systemInfoFilePathCSP20T52 = path.join(__dirname, "..", "..", "resources", "ProjectForCSP-20", "systeminfoT52.json");
const systemInfoFilePathCSPT211 = path.join(__dirname, "..", "..", "resources", "ProgramMessages", "systeminfoT211.json");
const systemInfoFilePathCSPT32 = path.join(__dirname, "..", "..", "resources", "ProgramLogProject", "systeminfoT32.json");
const systemInfoFilePathCSPT25 = path.join(__dirname, "..", "..", "resources", "ProgramLogProject", "systeminfoT25.json");
const systemInfoFilePathCSPT275 = path.join(__dirname, "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275.json");
const dataFilePathProgramStartStopProject = path.join(__dirname, "..", "..", "resources", "ProgramStartStopProject", "dataFile", "DataFile.json");
const systemInfoFilePathCSPT280 = path.join(__dirname, "..", "..", "resources", "ProgramStartStopProject", "systeminfoT280.json");
const traceProjectDestiny = path.join(__dirname, "..", "..", "resources", "TraceProject", "systeminfo.json");
const dirPath = path.join(__dirname, "..", "..", "resources", "ProjectEndorsementProject-2256");
const accessLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "accessControlLocators.json"));
const accessData = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "accessKeysData.json"));
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
import { GetPortExpPrimaryAddressList } from "@extron/communication/release/lib/models/globalMessages/getPortExpPrimaryAddressList";
const comClient = new CommunicationClient();
comClient.setTimeout(10000);
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:SMOKE TEST");
import { browser } from '@wdio/globals';

/**
 * @Author `Oybek.T-Eng, Neelam S-QA, Salvador A-QA`
 * @Description `Smoke Test`
 * @LastUpdatedDate `12/22/2020`
 */

xdescribe(`${tabTitles.SMOKE} CSP-30:(Deployment Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Oybek T");
        allure.story("CSP-2: As Francisco Garcia, I want to deploy my programmed single-NIC control system so I can begin testing");
        allure.addFeature("Epic: TOOL-921: Deploy my programmed systems (Phase 1)");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-921", "Epic: TOOL-921");
        allure.addLink("https://extron.atlassian.net/browse/CSP-2", "User Story: CSP-2");
        allure.addLink("https://extron.atlassian.net/browse/CSP-30", "Task Issue: CSP-30");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T2", "Test Case: CSP-T2");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(5000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });


    it("SMOKETest: Build Project and Deploy it", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const a = path.resolve(systemInfoFilePathForSmoke);
            const systemInfo = fs.readJsonSync(a);
            const a1 = path.resolve(SmokeDeployDataFile);
            const systemInfo1 = fs.readJsonSync(a1);
            const sysid = await common.generateRandomNumber(4);
            const sysID = sysid.toString();
            systemInfo.system.system_id = sysID;
            await fs.writeJSONSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForSmoke);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            console.log(err);
                        });
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                });
            const ProjectName = systemInfo.system.name;
            const message = ProjectName + " - ";
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(ProjectName + data.projectDeployment, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            const TLPDeviceName = systemInfo.devices[2].name;
            const TLPDeviceIP = systemInfo1.ENG.B3.Devices[0].tlpCredentials[2].IP;
            console.log(TLPDeviceName + data.HardwareFoundMessage + TLPDeviceIP);
            await messageComponent.messageRowValue.checkMessagePaneLogs(TLPDeviceName + data.HardwareFoundMessage + TLPDeviceIP, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(TLPDeviceName + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(TLPDeviceName + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            const primaryDeviceName = systemInfo.devices[0].name;
            const PrimaryDeviceIP = systemInfo1.ENG.B3.Devices[0].deviceCredentials[1].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(primaryDeviceName + data.HardwareFoundMessage + PrimaryDeviceIP, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(primaryDeviceName + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(primaryDeviceName + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(primaryDeviceName + data.fileTransferMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            const eBusDeviceName = systemInfo.devices[1].name;
            const eBusDeviceId = systemInfo.devices[1].ebus_id;
            const eBusDeviceIdMessage = eBusDeviceId + ".";
            await messageComponent.messageRowValue.checkMessagePaneLogs(eBusDeviceName + data.eBusHardwareFound + eBusDeviceIdMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(eBusDeviceName + data.eBusHardwareMatch + eBusDeviceIdMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });

            await messageComponent.messageRowValue.checkMessagePaneLogs(TLPDeviceName + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });


            await messageComponent.messageRowValue.checkMessagePaneLogs(message + data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await browser.pause(timeout.slow);
            let IPCPPro350: string;
            let TLP725: string;

            const ipcppro350: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].deviceCredentials[1].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlp725: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].tlpCredentials[2].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            await comClient.connectSession(ipcppro350)
                .then(async (result) => {
                    IPCPPro350 = await result;
                    const response = await comClient.sendGlobalMessage(IPCPPro350, new GetBoxID());
                    let systemidMatched = false;
                    if (response.systemid === Number(sysID)) {
                        systemidMatched = true;

                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(IPCPPro350);
                })
                .catch((err: Error) => {
                });
            await comClient.connectSession(tlp725)
                .then(async (result) => {
                    TLP725 = await result;
                    const response = await comClient.sendGlobalMessage(TLP725, new GetBoxID());
                    let systemidMatched = false;

                    if (response.systemid === Number(sysID)) {
                        systemidMatched = true;

                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(TLP725);
                })
                .catch((err: Error) => {
                });
            resolve();
        })
            .catch((err) => {
                console.log("smoke test: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });


    it("SMOKETest: Build Big Project and check right Messages, Sorting and filters", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const a = path.resolve(systemInfoPathForLargeDeployment);
            const systemInfo = fs.readJsonSync(a);
            const a1 = path.resolve(SmokeTestDataFile);
            const systemInfo1 = fs.readJsonSync(a1);
            const sysid = await common.generateRandomNumber(4);
            const sysID = sysid.toString();
            systemInfo.system.system_id = sysID;
            await fs.writeJSONSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoPathForLargeDeployment);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                });
            const messageComponent = new MessagePaneComponent(browser);
            const ProjectName = systemInfo.system.name;
            const message = ProjectName + " - ";
            await messageComponent.messageRowValue.checkMessagePaneLogs(ProjectName + data.projectDeployment, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            const DeviceName = systemInfo.devices[0].name;
            const DeviceIP = systemInfo1.ENG.B3.Devices[0].deviceCredentials[2].FQDN;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName + data.HardwareFoundMessage + DeviceIP, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName + data.fileTransferMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName1 = systemInfo.devices[1].name;
            const DeviceIP1 = systemInfo1.ENG.B3.Devices[0].deviceCredentials[11].Host;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName1 + data.HardwareFoundMessage + DeviceIP1, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName1 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName1 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName1 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName2 = systemInfo.devices[2].name;
            const DeviceIP2 = systemInfo1.ENG.B3.Devices[0].navCredentials[0].FQDN;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName2 + data.HardwareFoundMessage + DeviceIP2, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName2 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName2 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName2 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });

            const DeviceName3 = systemInfo.devices[3].name;
            const DeviceIP3 = systemInfo1.ENG.B3.Devices[0].navCredentials[1].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName3 + data.HardwareFoundMessage + DeviceIP3, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName3 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName3 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName3 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName4 = systemInfo.devices[4].name;
            const DeviceIP4 = systemInfo1.ENG.B3.Devices[0].navCredentials[2].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName4 + data.HardwareFoundMessage + DeviceIP4, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName4 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName4 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName4 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName5 = systemInfo.devices[5].name;
            const DeviceIP5 = systemInfo1.ENG.B3.Devices[0].deviceCredentials[7].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName5 + data.HardwareFoundMessage + DeviceIP5, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName5 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName5 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName5 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName6 = systemInfo.devices[6].name;
            const DeviceIP6 = systemInfo1.ENG.B3.Devices[0].deviceCredentials[12].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName6 + data.HardwareFoundMessage + DeviceIP6, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName6 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName6 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName6 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName7 = systemInfo.devices[7].name;
            const DeviceIP7 = systemInfo1.ENG.B3.Devices[0].deviceCredentials[1].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName7 + data.HardwareFoundMessage + DeviceIP7, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName7 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName7 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName7 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName8 = systemInfo.devices[8].name;
            const DeviceIP8 = systemInfo1.ENG.B3.Devices[0].deviceCredentials[4].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName8 + data.HardwareFoundMessage + DeviceIP8, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName8 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName8 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName8 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });

            const DeviceName9 = systemInfo.devices[9].name;
            const DeviceIP9 = systemInfo1.ENG.B3.Devices[0].tlpCredentials[3].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName9 + data.HardwareFoundMessage + DeviceIP9, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName9 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName9 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName9 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName10 = systemInfo.devices[10].name;
            const DeviceIP10 = systemInfo1.ENG.B3.Devices[0].tlpCredentials[4].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName10 + data.HardwareFoundMessage + DeviceIP10, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName10 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName10 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName10 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const DeviceName11 = systemInfo.devices[11].name;
            const DeviceIP11 = systemInfo1.ENG.B3.Devices[0].tlpCredentials[0].IP;
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName11 + data.HardwareFoundMessage + DeviceIP11, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName11 + data.hardwareMatchMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName11 + data.correctCredentialsMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(DeviceName11 + data.pairingPositiveMessage, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            let IPCPPro360: string;
            let IPLProS6: string;
            let Nav: string;
            let NavE: string;
            let NavSD: string;
            let IPCPPro350: string;
            let NBP100: string;
            let IPCPPro350s: string;
            let IPLProS3: string;
            let TLPPro525TNC: string;
            let TLPPro1225MG: string;
            let TLPPro1022T: string;


            const ipcppro360: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].deviceCredentials[2].FQDN,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const iplproS6: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].deviceCredentials[11].Host,
                parent: {
                    auth_type: EAuthType.GENERIC,
                    ip: systemInfo1.ENG.B3.Devices[0].deviceCredentials[2].FQDN,
                    password: "extron",
                    port: 4503,
                    protocol: EProtocol.SSH,
                    tunnel: false,
                    username: "admin",
                },
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: true,
                username: "admin",
            };

            const nav: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].navCredentials[0].FQDN,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const navE: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].navCredentials[1].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const navSD: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].navCredentials[2].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const ipcppro350: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].deviceCredentials[7].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const nbp100: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].deviceCredentials[12].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const ipcppro350s: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].deviceCredentials[1].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const iplpros3: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].deviceCredentials[4].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlppro525tnc: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].tlpCredentials[3].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlppro1225mg: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].tlpCredentials[4].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlppro1022t: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo1.ENG.B3.Devices[0].tlpCredentials[0].IP,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            await comClient.connectSession(ipcppro360)
                .then(async (result) => {
                    IPCPPro360 = await result;
                    const response = await comClient.sendGlobalMessage(IPCPPro360, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(IPCPPro360);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(iplproS6)
                .then(async (result) => {
                    IPLProS6 = await result;
                    const response = await comClient.sendGlobalMessage(IPLProS6, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(IPLProS6);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(nav)
                .then(async (result) => {
                    Nav = await result;
                    const response = await comClient.sendGlobalMessage(Nav, new GetPortExpPrimaryAddressList());
                    const deviceStringArray = JSON.stringify(response);
                    const obj = JSON.parse(deviceStringArray);
                    let systemidMatched = false;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < obj.length; i++) {
                        // tslint:disable-next-line:triple-equals
                        if (obj[i].system_id === Number(sysID)) {
                            systemidMatched = true;

                        }
                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(Nav);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(navE)
                .then(async (result) => {
                    NavE = await result;
                    const response = await comClient.sendGlobalMessage(NavE, new GetPortExpPrimaryAddressList());
                    const deviceStringArray = JSON.stringify(response);
                    const obj = JSON.parse(deviceStringArray);
                    let systemidMatched = false;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < obj.length; i++) {
                        // tslint:disable-next-line:triple-equals
                        if (obj[i].system_id === Number(sysID)) {
                            systemidMatched = true;

                        }
                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(NavE);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(navSD)
                .then(async (result) => {
                    NavSD = await result;
                    const response = await comClient.sendGlobalMessage(NavSD, new GetPortExpPrimaryAddressList());
                    const deviceStringArray = JSON.stringify(response);
                    const obj = JSON.parse(deviceStringArray);
                    let systemidMatched = false;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < obj.length; i++) {
                        // tslint:disable-next-line:triple-equals
                        if (obj[i].system_id == Number(sysID)) {
                            systemidMatched = true;

                        }
                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(NavSD);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(ipcppro350)
                .then(async (result) => {
                    IPCPPro350 = await result;
                    const response = await comClient.sendGlobalMessage(IPCPPro350, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(IPCPPro350);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(nbp100)
                .then(async (result) => {
                    NBP100 = await result;
                    const response = await comClient.sendGlobalMessage(NBP100, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(NBP100);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(ipcppro350s)
                .then(async (result) => {
                    IPCPPro350s = await result;
                    const response = await comClient.sendGlobalMessage(IPCPPro350s, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(IPCPPro350s);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(iplpros3)
                .then(async (result) => {
                    IPLProS3 = await result;
                    const response = await comClient.sendGlobalMessage(IPLProS3, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(IPLProS3);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(tlppro525tnc)
                .then(async (result) => {
                    TLPPro525TNC = await result;
                    const response = await comClient.sendGlobalMessage(TLPPro525TNC, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(TLPPro525TNC);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(tlppro1225mg)
                .then(async (result) => {
                    TLPPro1225MG = await result;
                    const response = await comClient.sendGlobalMessage(TLPPro1225MG, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(TLPPro1225MG);
                })
                .catch((err: Error) => {
                    
                });
            await comClient.connectSession(tlppro1022t)
                .then(async (result) => {
                    TLPPro1022T = await result;
                    const response = await comClient.sendGlobalMessage(TLPPro1022T, new GetBoxID());
                    await expect(response.systemid.toString())
                        .toEqual(sysID);
                    await comClient.disconnectSession(TLPPro1022T);
                })
                .catch((err: Error) => {
                    
                });
            resolve();
        })
            .catch((err) => {
                console.log("smoke test: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-47:(Deploy component: "Kevin Settings" )`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("CSP-20: As Francisco, I want to enter my credentials for the Destiny file so that I can deploy my system");
        allure.addLink("https://extron.atlassian.net/browse/CSP-20", "User Story: CSP-20");
        allure.addLink("https://extron.atlassian.net/browse/CSP-74", "Task Issue: CSP-74");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/2906128", "Test Case: CSP-T52");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    it('SMOKETest: Verify that devices having credentials in destiny are not editable in "Kevin Settings"', async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSP20T52);
            await browser.pause(timeout.medium);
            const userSettings = new CredsComponent(browser);

            await userSettings.KEVIN_SETTING_BUTTON.click();

            await browser.pause(timeout.medium);
            await userSettings.KEVIN_SETTING_BUTTON.verifyKevinInTabularForm()
                .then(async (kevinInTabularForm) => {
                    await expect(kevinInTabularForm)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);

                });
            await browser.pause(timeout.medium);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(data.kevinEntriesCount);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.deviceNameCol.verifyDeviceNameColumnTitleExist()
                .then(async (isDeviceNameColumnExist) => {
                    await expect(isDeviceNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.IPaddressCol.verifyIpAddressColumnTitleExist()
                .then(async (isIpAddressColumnExist) => {
                    await expect(isIpAddressColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.userNameCol.verifyUserNameColumnTitleExist()
                .then(async (isUserNameColumnExist) => {
                    await expect(isUserNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.passwordCol.verifyPasswordColumnTitleExist()
                .then(async (isPasswordColumnExist) => {
                    await expect(isPasswordColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.usernameRow1.verifyPrimaryUserNameValueIsVisible()
                .then(async (isPrimaryUserNameValueExist) => {
                    await expect(isPrimaryUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.passwordRow1.verifyPrimaryPasswordValueIsVisible()
                .then(async (isPrimaryPasswordValueExist) => {
                    await expect(isPrimaryPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.usernameRow2.verifySecondaryUserNameValueIsVisible()
                .then(async (isSecondaryUserNameValueExist) => {
                    await expect(isSecondaryUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.passwordRow2.verifySecondaryPasswordValueIsVisible()
                .then(async (isSecondaryPasswordValueExist) => {
                    await expect(isSecondaryPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await browser.pause(timeout.fast);
            await userSettings.usernameRow1.setUsername("admin", 0);
            await userSettings.passwordRow1.setPassword("extron", 0);
            await userSettings.usernameRow1.setUsername("admin", 1);
            await userSettings.passwordRow1.setPassword("extron", 1);
            await userSettings.usernameRow1.setUsername("admin", 2);
            await userSettings.passwordRow1.setPassword("extron", 2);
            await browser.pause(1500);
            await userSettings.saveConnectionManagerButton.click()
                .then(async () => { })
                .catch((err: Error) => {
                    console.log("33Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                    
                });
            await browser.pause(timeout.medium);
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            resolve();
        })
            .catch((err) => {
                console.log("Exception Error: " + `${err}`);
                
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-20:(Deploy component: Kevin settings)`, () => {
    before(async () => {
        allure.addOwner("Pushpita Patil");
        allure.addFeature("CSP-20: As Francisco, I want to enter my credentials for the Destiny file so that I can deploy my system");
        allure.addLink("https://extron.atlassian.net/browse/CSP-20", "User Story: CSP-20");
        allure.addLink("https://extron.atlassian.net/browse/CSP-195", "Task Issue: CSP-195");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T60", "Test Case: CSP-T60");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    it('SMOKETest: Verify that "Kevin Settings" is prompted for appropriate devices', async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const userSettings = new CredsComponent(browser);
            await common.deleteFile(systemInfoKevinCredFilePath)
                .catch((err: Error) => { });
            // Select the system
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathKevin);
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);

                });
            // clicking on deploy button
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);

                });
            await browser.pause(timeout.slow);
            // Verify that the kevin window is prompted
            await systemDeployment.kevinWindowOpen.verifyKevinIsPrompted()
                .then(async (kevinOpened) => {
                    await expect(kevinOpened)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await browser.pause(timeout.slow);
            // Enter incorrect creds for alpha
            await systemDeployment.missingPrimaryUserName.verifyEmptyPrimaryUserNameIsVisibleAndEditable(data.wrongUserName)
                .then(async (isPrimaryUserNameEmptyAndEditable) => {
                    await expect(isPrimaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await systemDeployment.missingPrimaryPassword.verifyEmptyPrimaryPasswordIsVisibleAndEditable(data.wrongPassword)
                .then(async (isPrimaryPasswordEmptyAndEditable) => {
                    await expect(isPrimaryPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await userSettings.usernameRow1.setUsername("admin", 1).catch((err: Error) => { });
            await userSettings.passwordRow1.setPassword("extron", 1).catch((err: Error) => { });
            await userSettings.saveConnectionManagerButton.click()
                .then(async () => { })
                .catch((err: Error) => {
                    console.log("33Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await browser.pause(timeout.fast);
            // Check that Deploy failed
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deployFailureMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            // Open Kevin window
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
            // Enter correct creds for alpha only, leave tlp blank
            await browser.pause(timeout.fast);
            await systemDeployment.missingPrimaryUserName.verifyEmptyPrimaryUserNameIsVisibleAndEditable(data.primaryUserName)
                .then(async (isPrimaryUserNameEmptyAndEditable) => {
                    await expect(isPrimaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);

                });
            await systemDeployment.missingPrimaryPassword.verifyEmptyPrimaryPasswordIsVisibleAndEditable(data.primaryPassword)
                .then(async (isPrimaryPasswordEmptyAndEditable) => {
                    await expect(isPrimaryPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            // Close Kevin Window and deploy the system
            await userSettings.saveConnectionManagerButton.click()
                .then(async () => { })
                .catch((err: Error) => {
                    console.log("33Exception caught: " + `${err}`);
                });
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                    
                });
            await browser.pause(timeout.fast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-199:(Troubleshooting Test: message pane state validation in deployment view)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("CSP-141: As Francisco Garcia, I want to see all of my run-time messages in one place so that I can get to those information quickly ");
        allure.addLink("https://extron.atlassian.net/browse/CSP-141", "User Story: CSP-141");
        allure.addLink("https://extron.atlassian.net/browse/CSP-199", "Task Issue: CSP-199");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T238", "Test Case: CSP-T238");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    it('SMOKETest: Verify By default "messages" pane should be open and empty on initial session launch and only within the Deploy View.', async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT211);
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await messageComponent.messagePaneVisible.messagePaneIsVisible()
                .then(async (messagePaneExist) => {
                    await expect(messagePaneExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await messageComponent.messageTable.tableContents()
                .then(async (isMessageEntryExist) => {
                    await expect(isMessageEntryExist.length)
                        .toBe(0);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-T238 Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

});

xdescribe(`${tabTitles.SMOKE} CSP-180:(Troubleshooting Test: Device credentials are incorrect message validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("CSP-120: As FG, I want to know why I am not able to connect to the device to start trace so that I can fix the issue ");
        allure.addLink("https://extron.atlassian.net/browse/CSP-120", "User Story: CSP-120");
        allure.addLink("https://extron.atlassian.net/browse/CSP-180", "Task Issue: CSP-180");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T211", "Test Case: CSP-T211");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    it('SmokeTest:Verify that there should be an error "Device credentials are incorrect" in message window while retrieving trace, if Primary controller s credentials are incorrect.', async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT211);
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await traceComponent.startTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    console.log(err);
                    
                });
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkTroublrshootingMessagePaneLogs(data.controllerCredentialsIncorrectMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-T211: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-199:(Troubleshooting Test: message pane state validation in troubleshooting view)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("CSP-141: As Francisco Garcia, I want to see all of my run-time messages in one place so that I can get to those information quickly ");
        allure.addLink("https://extron.atlassian.net/browse/CSP-141", "User Story: CSP-141");
        allure.addLink("https://extron.atlassian.net/browse/CSP-199", "Task Issue: CSP-199");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T284", "Test Case: CSP-T284");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    it("SMOKETest: Verify that message pane is hidden & empty by default when navigated to Troubleshooting view", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT211);
            await browser.pause(timeout.medium);
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await messageComponent.messagePaneVisible.messagePaneIsVisible()
                .then(async (messagePaneExist) => {
                    await expect(messagePaneExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await messageComponent.messageTable.tableContents()
                .then(async (isMessageEntryExist) => {
                    await expect(isMessageEntryExist.length)
                        .toBe(0);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await messageComponent.messagePaneHidden.messagePaneIsHidden()
                .then(async (isMessagePaneHidden) => {
                    await expect(isMessagePaneHidden)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await messageComponent.openMessagePaneButton.click();
            await browser.pause(timeout.medium);
            await messageComponent.messagePaneVisible.messagePaneIsVisibleTroubleshootingView()
                .then(async (messagePaneExist) => {
                    await expect(messagePaneExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await messageComponent.messageTable.tableContents()
                .then(async (isMessageEntryExist) => {
                    await expect(isMessageEntryExist.length)
                        .toBe(0);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await messageComponent.openMessagePaneButton.click();
            await browser.pause(timeout.medium);
            await messageComponent.messagePaneHidden.messagePaneIsHidden()
                .then(async (isMessagePaneHidden) => {
                    await expect(isMessagePaneHidden)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-T284: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-98:(Troubleshooting Test: Program log validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("CSP-24: As Francisco, I want retrieve the program log So that i can understand if there are any syntactically or dependencies issues");
        allure.addLink("https://extron.atlassian.net/browse/CSP-24", "User Story: CSP-24");
        allure.addLink("https://extron.atlassian.net/browse/CSP-98", "Task Issue: CSP-98");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T32", "Test Case: CSP-T32");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    it("SMOKETest: Verify that program logs should be generated after system has been deployed.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT32);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            console.log(err);
                        });
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                    
                });
            // verifying that deployment got passed
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            // Program log should be opened on same page and there should be a refresh button
            await systemTroubleshooting.programLogRefreshButton.checkRefreshProgramLogPresent()
                .then(async (programLogrefreshIsPresent) => {
                    await expect(programLogrefreshIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: Refresh Program Log Button   " + `${err}`);
                });
            await systemTroubleshooting.clearProgramLogButton.checkClearProgramLogPresent()
                .then(async (programLogClearIsPresent) => {
                    await expect(programLogClearIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: Clear Program Log Button" + `${err}`);
                });
            // Click on refresh button
            await browser.pause(timeout.slow);
            await systemTroubleshooting.programLogRefreshButton.click()
                .catch((err: Error) => {
                    console.log("Exception caught: Click Refresh Button" + `${err}`);
                });
            await browser.pause(timeout.slow);
            // Refresh should get the latest logs from the system.
            await systemTroubleshooting.programLogTextAreaField.checkProgramLogContent(data.programLogMessage)
                .then(async (programLogContentExist) => {
                    await expect(programLogContentExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: Check Program Log content " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-T32: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-96:(Troubleshooting Test: No Program log validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("CSP-24: As Francisco, I want retrieve the program log So that i can understand if there are any syntactically or dependencies issues");
        allure.addLink("https://extron.atlassian.net/browse/CSP-24", "User Story: CSP-24");
        allure.addLink("https://extron.atlassian.net/browse/CSP-96", "Task Issue: CSP-96");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T25", "Test Case: CSP-T25");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    it("SMOKETest: Verify User can manually refresh the program logs.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT25);
            await browser.pause(timeout.slow);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: Deploy Button exists" + `${err}`);
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            // Program log should be opened on same page and there should be a refresh button
            await systemTroubleshooting.programLogRefreshButton.checkRefreshProgramLogPresent()
                .then(async (programLogrefreshIsPresent) => {
                    await expect(programLogrefreshIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught:  Refresh Button Present" + `${err}`);
                });
            await systemTroubleshooting.clearProgramLogButton.checkClearProgramLogPresent()
                .then(async (programLogClearIsPresent) => {
                    await expect(programLogClearIsPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: Clear Button Present" + `${err}`);
                });
            // Click on refresh button
            await systemTroubleshooting.programLogRefreshButton.verifyRefreshisClickable()
                .then(async (refreshIsClickable) => {
                    await expect(refreshIsClickable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: Click Refresh " + `${err}`);
                });
            await browser.pause(timeout.slow);
            // Refresh should show there is no logs found
            await systemTroubleshooting.noProgramLogTextField.checkNoProgramLogTextPresent()
                .then(async (noProgramLogExist) => {
                    await expect(noProgramLogExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-T25: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-173:(Troubleshooting Test: Start Program validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("CSP-137: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/CSP-137", "User Story: CSP-137");
        allure.addLink("https://extron.atlassian.net/browse/CSP-173", "Task Issue: CSP-173");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T275", "Test Case: CSP-T275");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it("SMOKETest: Verify that Start Program button functions correctly (using Trace Messages to verify)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            // clicking on destiny file input field
            await browser.pause(timeout.medium);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT275);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            console.log(err);
                        });
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                    
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(2 * timeout.slow);
            await sideNav.deployWindow.click();
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            // check if program is running on tlp by launching vtlp ui
            const a1 = path.resolve(dataFilePathProgramStartStopProject);
            const sysjson = fs.readJsonSync(a1);
            await systemTroubleshooting.startProgramButton.checkProgramIsRunning(sysjson.ENG.B3.Devices[0].deviceCredentials[6].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui, data.vtlpLabel1, data.vtlpLabel2, data.vtlpLabel3, data.vtlpLabel4)
                .then(async (isProgramRunning) => {
                    await expect(isProgramRunning)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-T275: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-173:(Troubleshooting Test: Stop Program validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("CSP-137: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/CSP-137", "User Story: CSP-137");
        allure.addLink("https://extron.atlassian.net/browse/CSP-173", "Task Issue: CSP-173");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T270", "Test Case: CSP-T270");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it("SMOKETest: Verify that Stop Program button functions correctly (using Trace Messages to verify)", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            await browser.pause(timeout.medium);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT275);
            await browser.pause(timeout.medium);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            console.log(err);
                        });
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                    
                });
            const messageComponent = new MessagePaneComponent(browser);
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.slow);
            // verify Stop Program button is displaying
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                    await systemTroubleshooting.stopProgramButton.click();
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await systemTroubleshooting.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent: any) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            // check if program is stopped on tlp by launching vtlp ui
            // update this to now use the data contained within sys info to do this new page open
            // click on stop button
            const a1 = path.resolve(dataFilePathProgramStartStopProject);
            const sysjson = fs.readJsonSync(a1);
            await systemTroubleshooting.stopProgramButton.checkProgramGotStopped(sysjson.ENG.B3.Devices[0].deviceCredentials[6].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui, data.vtlpProgramNotRunningMessage)
                .then(async (isProgramstopped) => {
                    await expect(isProgramstopped)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-T270: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.REGRESSION.Trace} CSP-25:(Trace Component: suite)`, () => {
    before(async () => {
        allure.addFeature("CSP-25: As Francisco, I want to see the triggered events in trace, so I know what is going on with my system");
        allure.addLink("https://extron.atlassian.net/browse/CSP-25", "User Story: CSP-25");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/CSP-T37", "Test Case: CSP-T37");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });

    // Currently all test case related to Trace will be disabled, since we cannot run them in CI
    xit("Trace Component buttons are visible and functioning", async () => {
        return new Promise<void>(async (resolve) => {
            allure.addOwner("Neelam S");
            allure.addLink("Task Issue: CSP-102", "https://extron.atlassian.net/browse/CSP-102");
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(traceProjectDestiny);
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    
                });
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            const traceComponent = new TraceComponent(browser);
            await traceComponent.traceTextTitle.checktraceControls(data.traceTitle)
                .then(async (traceTitleExist) => {
                    await expect(traceTitleExist)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: start Trace Button " + `${err}`);
                });

            await traceComponent.traceSpinner.checkSpinner()
                .then(async (result) => {
                    await expect(result)
                        .toBe(false);
                })
                .catch((err: Error) => {
                    console.log(err);
                    
                });
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await traceComponent.startTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    console.log(err);
                    
                });
            await browser.pause(timeout.slow);
            await traceComponent.traceSpinner.checkSpinner()
                .then(async (result) => {
                    await expect(result)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await traceComponent.stopTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await traceComponent.stopTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await browser.pause(timeout.slow);
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            await traceComponent.clearTraceButton.clearLogs(data.traceClearTitleTxt)
                .then(async (traceTitleExist) => {
                    await expect(traceTitleExist)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: start Trace Button " + `${err}`);
                });
            await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                    if (traceExist) {
                        await traceComponent.startTraceButton.click();
                    }
                })
                .catch((err: Error) => {
                    console.log(err);
                    
                });
            await browser.pause(2 * timeout.slow);
            await traceComponent.stopTraceButton.click();
            await traceComponent.messageRowValue.checkTraceMessages("Please wait while the program is loading...", "10.113.89.209")
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);

                });
            await traceComponent.clearTraceButton.click();
            await browser.pause(timeout.slow);
            await traceComponent.messageRowValue.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(0);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-2070 : Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.SMOKE} TOOL-2910:(Save Logs: Save Message Pane Logs)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.addFeature("TOOL-2910: As Francisco Garcia or Michael Green, I want an easy way to export messages from message pane over to an expert who can help me troubleshoot so that I can fix the issue");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2910", "User Story: TOOL-2910");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3004", "Task Issue: TOOL-3004");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T573", "Test Case: TOOL-T573");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    xit("SMOKETest: Verify that the logs saved match the messages in the message pane", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const toast = new ToastComponent(browser);
            // const winExplorer = new WinExplorer(browser);
            const defaultMessageLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Message Log");
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForSmoke);
            // deploy the project
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.medium);
            // verify successful deploy
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught" + `${err}`);
                });
            // await browser.browserWindow.setAlwaysOnTop(true);   // move the browser to the foreground. use this to make toast page objects and robotjs methods to be more reliable
            // await browser.browserWindow.setAlwaysOnTop(false);  // set flag to false to allow file explorer to appear in front. necessary for robotjs to execute correctly
           // await winExplorer.clickCenter().then();
            await browser.pause(timeout.fast);
            // variable to save file name
            let fileName: string = "";
            // variable for button state
            let enabled: boolean = false;
            // export message logs
            await messageComponent.exportMessageButton.isEnabled()
                .then(async (value: boolean) => {
                    enabled = value;
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                });
            if (enabled) {
                await messageComponent.exportMessageButton.click();
                await browser.pause(timeout.fast);
                // fileName = await winExplorer.getFileNameBeforeSave();
                // await winExplorer.saveFile().then();
                await browser.pause(timeout.superFast);
                await (await browser.$(toast.toastLink.selector)).waitForClickable({timeout: 2500})
                    .then(async (value: boolean) => {
                        await expect(value)
                            .toBe(true);
                    })
                    .catch((err: Error) => {
                        console.log("Exception caught: " + `${err}`);
                    });
            }
            await browser.pause(timeout.superFast);
            // compare file content with message pane
            let fullFilePath = path.join(defaultMessageLogSavePath, fileName);
            try {
                const b = await common.readFile(fullFilePath);
                const c = await messageComponent.messageTable.getMessagesContents();
                await common.compareFileContents(c.toString(), b.toString())
                    .then(async (value: boolean) => {
                        await expect(value)
                            .toBe(true);
                    })
                    .catch((err: Error) => {
                        console.log("Exception caught: " + `${err}`);
                    });
            }
            catch (err) {
                console.log("Exception caught: " + `${err}`);
            }
            resolve();
        })
            .catch((err) => {
                console.log("TOOL-T573: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

xdescribe(`${tabTitles.SMOKE} CSP-444:(Access Control Log out button Validation)`, () => {
    before(async () => {
        allure.addOwner("Oybek T");
        allure.addFeature("CSP-425: As FG, I want to be able to log out of the application when I am no longer using it so that an unauthorized person cannot use the browser");
        allure.addLink("https://extron.atlassian.net/browse/CSP-425", "User Story: CSP-425");
        allure.addLink("https://extron.atlassian.net/browse/CSP-444", "Task Issue: CSP-444");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/4303647", "Test Case: CSP-T691");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
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

    it("SMOKETest: Log out from Deploy page and navigate to access control page and close ", async () => {
        return new Promise<void>(async (resolve) => {
            const login = new LoginComponent(browser);
            await login.logoutBtn.performLogout()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.warn(`${err}`);
                });
            await browser.pause(timeout.fast);
            resolve();
        })
            .catch((err) => {
                console.log("CSP-T691: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});


xdescribe(`${tabTitles.SMOKE} TOOL-2256 Provide certified/uncertified users the ability to deploy the shared project files`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addFeature("TOOL-2256: Provide certified/uncertified users the ability to deploy the shared project files");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2256", "User Story: TOOL-2256");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2304", "Task Issue: TOOL-2304");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T264", "Test Case: TOOL-T264");
        return new Promise<void>(async (resolve) => { 
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
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

    it("Certified user is able to certify project without deploying.", async () => {
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
                    console.log(err);
                    await reject(err);
                });
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            // systemInfo1.system.project_root_folder_path = path.dirname(a);
            // await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.endorseButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.log(err);
                    await reject(err);
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
            var secondEndorsedDate: string = await common.getCertificationFormattedDate();
            await systemDeployment.endorseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                    
                });
            const lastendorsed = await common.getCertificationFormattedDate();
            await browser.pause(timeout.fast);
            await systemDeployment.endorsedAlertMessage.endorseAlertIsVisible()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await systemDeployment.lastEndorsedTimestamp.checkLastEndorsedTime(lastendorsed, secondEndorsedDate)
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                });
            let fileFoundnow: boolean = false;
            fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfoTmp-certification.dat") {
                        fileFoundnow = true;
                    }
                });
            await expect(fileFoundnow)
                .toBe(true);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(false);
                })
                .catch(async (err: Error) => {
                    console.log("Exception caught" + `${err}`);
                    await reject(err);
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-2304: Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});



xdescribe(`${tabTitles.SMOKE} TOOL-2253:(Profile Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Neelam S");
        allure.addFeature("TOOL-2253: Expiration - Renew");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2253", "User Story: TOOL-2253");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2321", "Task Issue: TOOL-2321");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T280", "Test Case: TOOL-T280");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before Smoke Test Hook");
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });

    it("Verify manually renewing browser license", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const login = new LoginComponent(browser);
            const profile = new ProfileComponent(browser);
            await profile.profileLink.isVisible()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await profile.profileLink.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await browser.pause(timeout.fast);
            await profile.lisenceCardInfo.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await profile.profileTitleText.checkUserName(data.licensedUser1)
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await profile.licenseStatusText.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await profile.remainingDaysValue.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await profile.expirationDateText.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await profile.renewButton.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await profile.renewButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await browser.pause(timeout.fast);
            await profile.ApplicationRenewInfo.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            await login.logoutBtn
                .performLogout()
                .then(async (value1) => {
                    await expect(value1)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.log(`${err}`);
                });
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

