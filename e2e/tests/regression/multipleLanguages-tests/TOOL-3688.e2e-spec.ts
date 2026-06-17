import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";

const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminforT578.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfotemp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deploymentLocators.json"));
const messagePaneLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "messagePaneLocators.json"));
import { LogClient } from "@extron/winston-logger";
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";

const logClient = new LogClient("e2e:TOOL-3688");
const comClient = new CommunicationClient();

/**
 * @Author `Austin L QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3688`
 * @Date `04/20/2022`
 */
describe(`Regression Multiple Languages: TOOL-3628:(Implementing International Date and Time formatting in the Message pane & certify project: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-3628: Implementing International Date and Time formatting in the Message pane & certify project");
        allure.addLink("User Story: TOOL-3628", "https://extron.atlassian.net/browse/TOOL-3628");
        allure.addLink("Task Issue: TOOL-3688", "https://extron.atlassian.net/browse/TOOL-3688");
        allure.addLink("Test Case: TOOL-T4488", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T4488");
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

    it("Verify a successful build and upload behaves as expected when using a different language/region", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);

            // deploy to populate message pane
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const sysID = "1396";
            systemInfo.system.system_id = sysID;
            await fs.writeJSONSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await systemDeployment.deployButton.click()
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            // check devices are paired 
            let IPCP350: string;
            let TLP1022T: string;

            const ipcp350: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo.devices[0].network.interfaces[0].address,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };
            const tlp1022T: IConnectionInfo = {
                auth_type: EAuthType.GENERIC,
                ip: systemInfo.devices[1].network.interfaces[0].address,
                password: "extron",
                port: 4503,
                protocol: EProtocol.GM,
                tunnel: false,
                username: "admin",
            };

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
                    await comClient.disconnectSession(IPCP350);
                })
                .catch((err: Error) => {
                });
            await comClient.connectSession(tlp1022T)
                .then(async (result) => {
                    TLP1022T = await result;
                    const response = await comClient.sendGlobalMessage(TLP1022T, new GetBoxID());
                    let systemidMatched = false;
                    if (response.systemid === Number(sysID)) {
                        systemidMatched = true;
                    }
                    await expect(systemidMatched)
                        .toBe(true);
                    await comClient.disconnectSession(TLP1022T);
                })
                .catch((err: Error) => {
                });

            resolve();
        })
        .catch((err: Error) => {
            console.log("TOOL-3688: Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`Regression Multiple Languages: TOOL-3628:(Implementing International Date and Time formatting in the Message pane & certify project: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-3628: Implementing Message consistency on a Localized system after switching pages");
        allure.addLink("User Story: TOOL-3628", "https://extron.atlassian.net/browse/TOOL-3628");
        allure.addLink("Task Issue: TOOL-3688", "https://extron.atlassian.net/browse/TOOL-3688");
        allure.addLink("Test Case: TOOL-T4490", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T4490");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
       }).catch((err) => {
           console.log(err);
       });
    });

    it("Verify that correct date/time regional formatting is seen in the Deploy page", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);

            // deploy to populate message pane
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const sysID = "1395";
            systemInfo.system.system_id = sysID;
            await fs.writeJSONSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await systemDeployment.deployButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            // check that sorting by time is not allowed
            let latestMessageDateTime = await messageComponent.timeRowValue.getText()
            await messageComponent.timeColumn.click();
            await messageComponent.timeRowValue.getText()
                .then(async (value: string) => {
                    await expect(value)
                        .toEqual(latestMessageDateTime);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });

            // check that milliseconds are not visible in the time & check date/time format in messages
            const messageDateTime = await browser.$(messagePaneLocators.TimeCol.row1Time).getText();
            await messageComponent.timeRowValue.foreignTimeStampColumnIncludesValue()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await common.hasCorrectTimeFormatting(messageDateTime.split(' ').splice(1).join(' '))
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            // check date/time format in certify project
            await systemDeployment.endorseButton.click();
            await browser.pause(timeout.superFast);
            const lastEndorsed = await browser.$(deploymentLocators.lastEndorsedTime).getText();
            const certifiedDateTime = lastEndorsed.split(' ').splice(2);        // filter out last certified text 
            const certifiedDate = certifiedDateTime[0];                         // get date
            const certifiedTime = certifiedDateTime.splice(1).join(' ');        // get time
            await common.convertForeignDateToUsa(certifiedDate)
                .then(async res => {
                    await common.getCurrDateMDY()
                        .then(date => {
                            expect(res)
                                .toEqual(date);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                        });
            });
            await common.hasCorrectTimeFormatting(certifiedTime)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            resolve();
        })
        .catch((err: Error) => {
            console.log("TOOL-3688: Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});