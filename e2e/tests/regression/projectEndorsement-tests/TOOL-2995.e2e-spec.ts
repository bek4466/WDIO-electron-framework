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
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfoTmp.json");
const downloadPath = path.join(__dirname, "..", "..", "..", "resources", "TmpDownloadProject");
const downloadedProject = path.join(__dirname, "..", "..", "..", "resources", "TmpDownloadProject", "systeminfo.json");
const dirPath = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject");
const logClient = new LogClient("e2e:CSP-2995");
import { reject } from "q";
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
const comClient = new CommunicationClient();
comClient.setTimeout(10000);
/**
 * @Author `Miguel.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2995`
 * @Date `10/20/2021`
 */

xdescribe(`${tabTitles.REGRESSION.Deployment} TOOL-2386 Certify Project Only Works for Certified User`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2386: Certify Project Only Works for Certified User");
        allure.addLink("User Story: TOOL-2386", "https://extron.atlassian.net/browse/TOOL-2386");
        allure.addLink("Task Issue: TOOL-2995", "https://extron.atlassian.net/browse/TOOL-2995");
        allure.addLink("Test Case: TOOL-T526", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T526");
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

    it("Verify that Certified user is able to certify the project", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            const systemInfo1 = fs.readJsonSync(a1);
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            systemInfo1.system.system_id = "3154"
            const sysID = systemInfo1.system.system_id;
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
            const secondlastendorsed = await common.getCertificationFormattedDate();
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
            await systemDeployment.lastEndorsedTimestamp.checkLastEndorsedTime(lastendorsed, secondlastendorsed)
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("lastEndorsedTimestamp");
                });
            await browser.pause(timeout.medium);
            let fileFound: boolean = false;
            fs.readdirSync(dirPath)
                .forEach((file) => {
                    if (file === "systeminfoTmp-certification.dat") {
                        fileFound = true;
                    }
                });
            await expect(fileFound)
                .toBe(true);
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
            await comClient.connectSession(ipcp360)
                .then(async (result) => {
                    IPCP360 = await result;
                    const response = await comClient.sendGlobalMessage(IPCP360, new GetBoxID());
                    let systemidMatched = false;
                    if (response.systemid === Number(sysID)) {
                        systemidMatched = true;

                    }
                    await expect(systemidMatched)
                        .toBe(false);
                    await comClient.disconnectSession(IPCP360);
                })
                .catch((err: Error) => {
                    //fail("System number1 match fail");
                });
            await comClient.connectSession(ipcp350)
                .then(async (result) => {
                    IPCP350 = await result;
                    const response = await comClient.sendGlobalMessage(IPCP350, new GetBoxID());
                    let systemidMatched = false;

                    if (response.systemid === Number(sysID)) {
                        systemidMatched = true;

                    }
                    await expect(systemidMatched)
                        .toBe(false);
                    await comClient.disconnectSession(IPCP350);
                })
                .catch((err: Error) => {
                    //will not fail here, as expectation is that systemID does not match.
                    //if Global message fails it implies that the device is not deployed
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
                        .toBe(false);
                    await comClient.disconnectSession(TLP525NC);
                })
                .catch((err: Error) => {
                    //fail("System number1 match fail");
                });
            resolve();
        }).catch((err) => {
            logClient.error("CSP-2995: Exception Error: " + `${err}`);
            //fail("CSP-2995");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Deployment} TOOL-2386 Certify Project Only Works for Certified User`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2386: Certify Project Only Works for Certified User");
        allure.addLink("User Story: TOOL-2386", "https://extron.atlassian.net/browse/TOOL-2386");
        allure.addLink("Task Issue: TOOL-2995", "https://extron.atlassian.net/browse/TOOL-2995");
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
        winExplorer.ClickApplication();;
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
        await common.switchToWin(browser, tabTitles.mainTab, data.unLicensedUser1, data.unLicensedUser1pass, true);
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
