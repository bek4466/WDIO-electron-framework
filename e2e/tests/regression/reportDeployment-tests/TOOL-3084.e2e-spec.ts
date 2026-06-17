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
const fileGDLPath = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "layout", "CSPTestingProjectQATestNew.gdl");
const dataFile = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "dataFile", "DataFile.json");
const controllerLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "controllerLocators.json"));
const common = new CommonMethods();
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const packageJSONPath : string =  path.join(__dirname , "..", "..", "..", "..", "package.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const devices = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
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
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2982`
 * @Description `Report Toolbelt (TB)`
 * @Date `11/17/2021`
 */

xdescribe(`${tabTitles.REGRESSION.Deployment} TOOL-2981:(Report Deployment Test)`, () => {
    before(async () => {
        allure.addOwner("Miguel C");
        allure.story("Report Toolbelt (TB) Information");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2982", "User Story: TOOL-2982");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3084", "Task Issue: TOOL-3084");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T618", "Test Case: TOOL-T618");
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


    it("Verify Default Web Page(DWP) menu contains proper information after deployment", async () => {
        const systemDeployment = new DeployComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        let projectCredentialUI = new CredsComponent(browser);
        await common.copyFolder(systemInfoFile, systemInfoFileTemp);
        const a = path.resolve(systemInfoFile);
        const a1 = path.resolve(systemInfoFileTemp);
        const b = path.resolve(dataFile);
        const dataInfo = fs.readJsonSync(b);
        const systemInfo = fs.readJsonSync(a1);
        const sysID = systemInfo.system.system_id;
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
        systemInfo.system.project_root_folder_path = path.dirname(a);
        systemInfo.devices[2].network.interfaces[0].address = devices.TLP725CNC;
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
        const creationDate = await common.getCreationDate(systemInfoFileTemp)
            .catch(async (err: Error) => {
                console.log("Exception caught" + `${err}`);
            });
        const packageJson = fs.readJSONSync(path.resolve(packageJSONPath));
        const csduVersion = "CSDU " + packageJson.version.substring(0, packageJson.version.indexOf("-"));
        await common.checkECW(browser, dataInfo.ENG.B3.Devices[0].deviceCredentials[0].IP, "admin", "extron").
            catch(async (err: Error) => {
                console.log("Exception caught" + `${err}`);
            });
        let text = await browser.$(controllerLocators.PrimaryProjectName).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("systeminfoTmp.json");
        text = await browser.$(controllerLocators.SystemVersion).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(systemInfo.system.version);
        text = await browser.$(controllerLocators.CreationDate).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(creationDate);
        text = await browser.$(controllerLocators.RevisionDate).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(lastRevisionDate);
        text = await browser.$(controllerLocators.savedBy).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(csduVersion);
        await common.checkECW(browser, devices.TLP725CNC, "admin", "extron").
            catch(async (err: Error) => {
                console.log("Exception caught" + `${err}`);
            });
        text = await browser.$(controllerLocators.TLPProjectNameFile).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("systeminfoTmp.json");
        text = await browser.$(controllerLocators.TLPPrimaryIP).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(dataInfo.ENG.B3.Devices[0].deviceCredentials[0].IP);
        text = await browser.$(controllerLocators.TLPPrimaryName).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(systemInfo.devices[0].name);
        text = await browser.$(controllerLocators.TLPLayoutName).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("CSPTestingProjectQATestNew.gdl");
        text = await browser.$(controllerLocators.TLPLayoutFileVersion).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("0.0.14");
        text = await browser.$(controllerLocators.TLPLayoutCreation).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("9/27/2019, 8:24:08 AM");
        text = await browser.$(controllerLocators.TLPLayoutRevision).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("9/27/2019, 1:56:17 PM");
        text = await browser.$(controllerLocators.TLPLayoutSavedBy).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("GUI Designer 1.11.0.106");
        text = await browser.$(controllerLocators.TLPLayoutResolution).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("1024x600");
        
    });
    
});
xdescribe(`${tabTitles.REGRESSION.Deployment} TOOL-2981:(Report Deployment Test)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel C");
        allure.story("Report Toolbelt (TB) Information");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2982","User Story: TOOL-2982");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3084", "Task Issue: TOOL-3084");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T619", "Test Case: TOOL-T619");
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

    it("Verify Default Web Page(DWP) menu contains proper information after deployment with fallback values", async () => {
        const systemDeployment = new DeployComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        await common.copyFolder(systemInfoFile, systemInfoFileTemp);
        const a = path.resolve(systemInfoFile);
        const a1 = path.resolve(systemInfoFileTemp);
        const b = path.resolve(dataFile);
        const dataInfo = fs.readJsonSync(b);
        const systemInfo = fs.readJsonSync(a1);
        const sysID = systemInfo.system.system_id;
        delete systemInfo.devices[0].name;
        delete systemInfo.devices[2].name;
        delete systemInfo.devices[2].ui.layout_file;
        delete systemInfo.system.version;
        systemInfo.devices[2].network.interfaces[0].address = devices.TLP725CNC;
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
        systemInfo.system.project_root_folder_path = path.dirname(a);
        await fs.writeJSONSync(a1, systemInfo);
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
        const creationDate = await common.getCreationDate(systemInfoFileTemp)
            .catch(async (err: Error) => {
                console.log("Exception caught" + `${err}`);
            });
        const packageJson = fs.readJSONSync(path.resolve(packageJSONPath));
        const csduVersion = "CSDU " + packageJson.version.substring(0, packageJson.version.indexOf("-"));
        console.log(csduVersion);
        await common.checkECW(browser, dataInfo.ENG.B3.Devices[0].deviceCredentials[0].IP, "admin", "extron").
            catch(async (err: Error) => {
                console.log("Exception caught" + `${err}`);
            });
        let text = await browser.$(controllerLocators.PrimaryProjectName).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("systeminfoTmp.json");
        text = await browser.$(controllerLocators.SystemVersion).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("0.0.0");
        text = await browser.$(controllerLocators.CreationDate).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(creationDate);
        text = await browser.$(controllerLocators.RevisionDate).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(lastRevisionDate);
        text = await browser.$(controllerLocators.savedBy).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(csduVersion);

        await common.checkECW(browser, devices.TLP725CNC, "admin", "extron").
            catch(async (err: Error) => {
                console.log("Exception caught" + `${err}`);
            });
        text = await browser.$(controllerLocators.TLPProjectNameFile).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("systeminfoTmp.json");
        text = await browser.$(controllerLocators.TLPPrimaryIP).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual(dataInfo.ENG.B3.Devices[0].deviceCredentials[0].IP);
        text = await browser.$(controllerLocators.TLPPrimaryName).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual('device[0]');
        text = await browser.$(controllerLocators.TLPLayoutName).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("Undefined");
        text = await browser.$(controllerLocators.TLPLayoutFileVersion).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("0.0.0");
        text = await browser.$(controllerLocators.TLPLayoutCreation).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("1/1/1970 12:00:00 AM");
        text = await browser.$(controllerLocators.TLPLayoutRevision).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("1/1/1970 12:00:00 AM");
        text = await browser.$(controllerLocators.TLPLayoutSavedBy).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("Undefined 0.0.0.0");
        text = await browser.$(controllerLocators.TLPLayoutResolution).getText().catch(async (err: Error) => {
            console.log("Get file stats error: " + err);
        });
        await expect(text).toEqual("Undefined");
        
    });
});