// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from '@wdio/globals';
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "systeminfoSecrets.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "systeminfoTmp.json");
const dataFile = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "dataFile", "DataFile.json");
const fileGDLPath = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "layout", "CSPTestingProjectQATestNew.gdl");
const common = new CommonMethods();
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
import { LogClient } from "@extron/winston-logger";
import { reject } from "q";
const logClient = new LogClient("e2e:TOOL-2981");
const comClient = new CommunicationClient();
comClient.setTimeout(10000);
/**
 * @Author `Miguel C`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2981`
 * @Description `Report Toolbelt (TB)`
 * @Date `11/17/2021`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2981:(Report Deployment Test)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel C");
        allure.story("Report Toolbelt (TB) Information");
        allure.addLink("User Story: TOOL-2981", "https://extron.atlassian.net/browse/TOOL-2981");
        allure.addLink("Task Issue: TOOL-3141", "https://extron.atlassian.net/browse/TOOL-3141");
        allure.addLink("Test Case: TOOL-T621", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T621");
        allure.addLink("Test Case: TOOL-T622", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T622");
        allure.addLink("Test Case: TOOL-T623", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T623");
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

    it("Verify that after Project is successfully deployed , Toolbelt displays the correct project information with respect to Primary Controller, Secondary Controller, and TLP", async () => {
        const systemDeployment = new DeployComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        let projectCredentialUI = new CredsComponent(browser);
        await common.copyFolder(systemInfoFile, systemInfoFileTemp);
        const a = path.resolve(systemInfoFile);
        const a1 = path.resolve(systemInfoFileTemp);
        const systemInfo = fs.readJsonSync(a1);
        const sysID = systemInfo.system.system_id;
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
        systemInfo.system.project_root_folder_path = path.dirname(a);
        const b = path.resolve(dataFile);
        const dataInfo = fs.readJsonSync(b);
        await fs.writeJSONSync(a1, systemInfo);
        await projectCredentialUI.KEVIN_SETTING_BUTTON.isEnabled()
        .then(async (kevinEnabled) => {
            await expect(kevinEnabled)
                .toBe(true);
            await projectCredentialUI.KEVIN_SETTING_BUTTON.click();
             // change goes here
            await browser.waitUntil(async () => {
                console.warn("PROJECT CREDENTIALS SAVE BUTTON ");
                return await projectCredentialUI.saveConnectionManagerButton.isEnabled()
            }, {timeout: 5000})
        })
        .catch(async (err: any) => {
            await reject(err);
        });
        await browser.pause(timeout.fast);

        const numIterations = 3;
 
        for (let iteration = 0; iteration < numIterations; iteration++) {

            console.log("This is the iteration"+iteration)
            await projectCredentialUI.usernameRow1.setUsername("admin", iteration);
            await projectCredentialUI.passwordRow1.setPassword("extron", iteration);
            await browser.pause(1000);
        }
        await projectCredentialUI.saveConnectionManagerButton.click();
        await browser.pause(3000);
        await browser.pause(timeout.fast);
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
                    });
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`);
            });
        await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
            .then(async (value: boolean) => {
                await expect(value)
                    .toEqual(true);
            })
            .catch(async (err: Error) => {
                logClient.error("Exception caught" + `${err}`);
                await reject(err);
            });
        await browser.pause(40000);
        const lastRevisionDate = await common.getLastRevisionDate(systemInfoFileTemp)
            .catch(async (err: Error) => {
                console.log("Exception caught" + `${err}`);
            });
        const lastRevisionDateGDL = await common.getLastRevisionDate(fileGDLPath)
            .catch(async (err: Error) => {
                console.log("Exception caught" + `${err}`);
            });
        let IPCP360: string;
        let TLP725T: string;
        let IPLPROS6: string;

        const ipcp360: IConnectionInfo = {
            auth_type: EAuthType.GENERIC,
            ip: dataInfo.ENG.B3.Devices[0].deviceCredentials[0].IP,
            password: "extron",
            port: 4503,
            protocol: EProtocol.GM,
            tunnel: false,
            username: "admin",
        };

        const iplpros6: IConnectionInfo = {
            auth_type: EAuthType.GENERIC,
            ip: dataInfo.ENG.B3.Devices[0].deviceCredentials[1].IP,
            password: "extron",
            port: 4503,
            protocol: EProtocol.GM,
            tunnel: false,
            username: "admin",
        };
        const tlp725T: IConnectionInfo = {
            auth_type: EAuthType.GENERIC,
            ip: dataInfo.ENG.B3.Devices[0].tlpCredentials[0].IP,
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
                let responseName = await comClient.getConfigDeviceName(IPCP360)
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseVersion = await comClient.getConfigApplicationVersion(IPCP360, { "<config>": "controllerconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseFileName = await comClient.getConfigFileName(IPCP360, { "<config>": "controllerconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseRevisionDate = await comClient.getConfigRevisionDate(IPCP360, { "<config>": "controllerconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseAuthorName = await comClient.getConfigAuthorName(IPCP360, { "<config>": "controllerconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                await expect(responseName)
                    .toEqual(systemInfo.devices[0].name);
                await expect(responseVersion)
                    .toEqual(systemInfo.system.version);
                await expect(responseFileName)
                    .toEqual("systeminfoTmp.json");
                await expect(responseRevisionDate)
                    .toEqual(lastRevisionDate);
                await expect(responseAuthorName)
                    .toEqual(systemInfo.system.author.name);
            })
            .catch((err: Error) => {
            });
        await comClient.connectSession(iplpros6)
            .then(async (result) => {
                IPLPROS6 = await result;
                const response = await comClient.sendGlobalMessage(IPLPROS6, new GetBoxID());
                let systemidMatched = false;
                if (response.systemid === Number(sysID)) {
                    systemidMatched = true;

                }
                await expect(systemidMatched)
                    .toBe(true);

                let responseName = await comClient.getConfigDeviceName(IPLPROS6)
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseVersion = await comClient.getConfigApplicationVersion(IPLPROS6, { "<config>": "controllerconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseFileName = await comClient.getConfigFileName(IPLPROS6, { "<config>": "controllerconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseRevisionDate = await comClient.getConfigRevisionDate(IPLPROS6, { "<config>": "controllerconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseAuthorName = await comClient.getConfigAuthorName(IPLPROS6, { "<config>": "controllerconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                await expect(responseName)
                    .toEqual(systemInfo.devices[1].name);
                await expect(responseVersion)
                    .toEqual(systemInfo.system.version);
                await expect(responseFileName)
                    .toEqual("systeminfoTmp.json");
                await expect(responseRevisionDate)
                    .toEqual(lastRevisionDate);
                await expect(responseAuthorName)
                    .toEqual(systemInfo.system.author.name);
                await comClient.disconnectSession(IPLPROS6);
            })
            .catch((err: Error) => {
            });
        await comClient.connectSession(tlp725T)
            .then(async (result) => {
                TLP725T = await result;
                const response = await comClient.sendGlobalMessage(TLP725T, new GetBoxID());
                let systemidMatched = false;
                if (response.systemid === Number(sysID)) {
                    systemidMatched = true;

                }
                await expect(systemidMatched)
                    .toBe(true);
                let responseName = await comClient.getConfigDeviceName(TLP725T)
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseVersion = await comClient.getConfigApplicationVersion(TLP725T, { "<config>": "uiconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseFileName = await comClient.getConfigFileName(TLP725T, { "<config>": "uiconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseRevisionDate = await comClient.getConfigRevisionDate(TLP725T, { "<config>": "uiconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                let responseAuthorName = await comClient.getConfigAuthorName(TLP725T, { "<config>": "uiconfig" })
                    .catch(async (err: Error) => {
                        console.log("Error for GM call is: " + err.message);
                    });
                await expect(responseName)
                    .toEqual(systemInfo.devices[2].name);
                await expect(responseVersion)
                    .toEqual(systemInfo.system.version);
                await expect(responseFileName)
                    .toEqual(systemInfo.devices[2].ui.layout_file);
                // hardcoded GDL properties, as we cannot access GDL properties programatically
                await expect(responseRevisionDate)
                    .toEqual("9/27/2019, 1:56:17 PM"); 
                await expect(responseAuthorName)
                    .toEqual("PDuser");
                await comClient.disconnectSession(TLP725T);
            })
            .catch((err: Error) => {
            });
    });
});
