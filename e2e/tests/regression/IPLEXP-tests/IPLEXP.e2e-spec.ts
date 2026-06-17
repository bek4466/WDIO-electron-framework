// @ts-nocheck
import { LogClient } from "@extron/winston-logger";
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { Jsonparser } from "../../../src/deployment/Jsonparser.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { CredsComponent } from "../../../src/credentialsComponent";
import { reject } from "q";
// import * as robot from "@jitsi/robotjs";
import { browser } from "@wdio/globals";
import { environment } from '../../../../electron/src/environment/environment';
import { GmObject } from "../../../src/deployment/GmObject.po";
import { TraceComponent } from "../../../src/traceComponent/traceComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { DebugSetupOptions, DefaultSetupOptions, ServicePoolManager } from "@extron/module-service-initializer";
const common = new CommonMethods();
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "HardwareValidationProject", "systeminfoTmp.json");
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "HardwareValidationProject", "systeminfo.json");
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const msgPaneLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "messagePaneLocators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const datajsonfile = fs.readJsonSync(path.join(__dirname, "datajson", "filesIPLEXP.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
let logClient: LogClient;
var firstTimeFlag: boolean = true;
const time: Date = new Date();

let displayConsoleLogs = true;
let disableTestCasesWithLogout = true;
let wentIntoTroubleShootingPage = false;

/**
 * @Author `Amit B.QA, Austin L. QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3324`
 * @Description `IPL EXP Automation Test Suite`
 * @Date `12/21/2021`
 */
// tslint:disable-next-line:forin
describe.only("Starting TestMaster spec: Running Test Suite: IPL EXP", () => {
    before(async () => {
        return new Promise<void>(async (resolve): Promise<void> => {
            try {
                await browser.pause(10000);
                await browser.switchWindow(tabTitles.mainTab);
                firstTimeFlag = false;
                await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, firstTimeFlag);
                await allure.screenshot(browser, "BeforeALL Hook");
                resolve();
            } catch (error) {
                console.error("Error occured in BeforeALL HOOK " + error);
                reject(error);
            }
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
    async function runTest(datajson: any, tcNum: string): Promise<void> {
        describe.only(`${datajson.TestCaseInfo.SuiteType}":"${datajson.TestCaseInfo.UserStory}`, async () => {
            let jparser;
            let updatedTestDescription = `(${datajson.TestCaseInfo.TaskLink.split('/').pop()}) (${tcNum}) - ${datajson.TestCaseInfo.TestDescription}`;

            beforeEach(async () => {
                return new Promise(async (resolve): Promise<void> => {
                let myjson = await JSON.stringify(datajson);
                // tslint:disable-next-line:forin
                for (const key in device) {
                    const re = new RegExp("\\b" + key + "\\b", 'g');
                    myjson = await myjson.replace(re, device[key]);
                }
                try {
                    // tslint:disable-next-line:no-parameter-reassignment
                    datajson = await JSON.parse(myjson);
                } catch (err) {
                    console.log(err);
                }

                const UserStoryLinkArray = datajson.TestCaseInfo.UserStoryLink;
                const TaskLink = datajson.TestCaseInfo.TaskLink.split(",");
                const TestCaseLink = datajson.TestCaseInfo.TestCaseLink.split(",");
                allure.addOwner(datajson.TestCaseInfo.Owner);
                allure.story(datajson.TestCaseInfo.UserStory);
                for (let i = 0; i < UserStoryLinkArray.length; i++) {
                    const UserStoryLink = UserStoryLinkArray[i].split(",");
                    allure.addLink(UserStoryLink[1], UserStoryLink[0]);
                }
                allure.addLink(TaskLink[1], TaskLink[0]);
                allure.addLink(TestCaseLink[1], TestCaseLink[0]);
                resolve('');
                }).catch((err) => {
                    console.log(err);
                });
            });

            it(updatedTestDescription, async () => {
                return new Promise<void>(async (resolve) => {
                    jparser = new Jsonparser();
                    const messageComponent = new MessagePaneComponent(browser);
                    const projectCredentialUI = new CredsComponent(browser);
                    const systemDeployment = new DeployComponent(browser);
                    await common.copyFolder(systemInfoFilePath, systemInfoFileTemp);
                    const a = path.resolve(systemInfoFilePath);
                    const a1 = path.resolve(systemInfoFileTemp);
                    const systemInfo1 = fs.readJsonSync(a1);
                    systemInfo1.system.project_root_folder_path = path.dirname(a);

                    for (const innerkey in datajson) {

                        if (innerkey === "Preconditions") {
                            await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + ` Modify the temp file as per following keywords to meet preconditions ${JSON.stringify(datajson.Preconditions)} `, async () => {
                                const modifiedObj = await jparser.ProcessJson(systemInfo1, datajson.Preconditions);
                                await fs.writeJSONSync(a1, modifiedObj);
                            });

                        }
                        if (innerkey === "Steps") {
                            let stdoutData;
                            // tslint:disable-next-line:forin
                            for (const realinnerkey in datajson[innerkey]) {
                                if (realinnerkey === "Command") {
                                    if (datajson[innerkey][realinnerkey] === "Deploy") {
                                        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
                                        await systemDeployment.deployButton.exists()
                                            .then(async (deployExist) => {
                                                await expect(deployExist)
                                                    .toBe(true);
                                            })
                                            .catch((err: Error) => {
                                                logClient.error(err);
                                            });
                                        //Create credentials file
                                        const userSettings = new CredsComponent(browser);
                                        // now verify kevin settings got enabled
                                        await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                                            .then(async (kevinEnabled) => {
                                                await expect(kevinEnabled)
                                                    .toBe(true);
                                                await userSettings.KEVIN_SETTING_BUTTON.click();
                                            })
                                            .catch(async (err: Error) => {
                                                await reject(err);
                                            });
                                        for (let idx in datajson.Credentials) {
                                            await browser.pause(timeout.fast);
                                            await projectCredentialUI.usernameRow1.setUsername(datajson.Credentials[idx].user, idx);
                                            await projectCredentialUI.passwordRow1.setPassword(datajson.Credentials[idx].pass, idx);
                                        }
                                        await browser.pause(timeout.fast);
                                        await projectCredentialUI.saveConnectionManagerButton.click();

                                        await browser.pause(timeout.fast);
                                        await systemDeployment.deployButton.click()
                                            .then(async () => {
                                                await browser.pause(timeout.slow);
                                                /*
                                                return systemDeployment.deployButton.isEnabled()
                                            .catch((err: Error) => {
                                                logClient.error(err);
                                                //fail("deploybuttonisEnabled");
                                            }); */
                                            })
                                            .catch((err: Error) => {
                                                logClient.error("Exception caught: " + `${err}`);
                                                // //fail("deploybuttonClick");
                                            });
                                    }
                                }

                                if (realinnerkey === "VerifyMessage") {
                                    for (const iteminnerkey in datajson[innerkey][realinnerkey]) {
                                        if (datajson[innerkey][realinnerkey].hasOwnProperty(iteminnerkey)) {

                                            await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + ` Checking the presence of message \"${datajson[innerkey][realinnerkey][iteminnerkey].MessageText}\" in  output`, async () => {
                                                await messageComponent.messageRowValue.checkMessagePaneLogs(datajson[innerkey][realinnerkey][iteminnerkey].MessageText, datajson[innerkey][realinnerkey][iteminnerkey].MessageType)
                                                .then(async (value: boolean) => {
                                                })
                                                .catch(async (err: any) => {
                                                    console.error("Exception caught" + `${err}`);
                                                    await reject(err);
                                                });
                                            });
                                        }
                                    }
                                    stdoutData = "";
                                }

                                if (realinnerkey === "GmCommands") {
                                    await allure.step(`Set the value of ${datajson[innerkey]} input to`, async () => {
                                        /* 
                                         */
                                        const initializer = environment.isDevelopment() ? new ServicePoolManager(DebugSetupOptions) : new ServicePoolManager(DefaultSetupOptions);
                                        let sysid;
                                        // tslint:disable-next-line:forin
                                        for (const iteminnerkey in datajson[innerkey][realinnerkey]) {
                                            if (datajson[innerkey][realinnerkey].hasOwnProperty(iteminnerkey)) {
                                                if (iteminnerkey === "Primary_Controller") {
                                                    const systemInfo1 = await fs.readJsonSync(a1);
                                                    const systemid = await systemInfo1.system.system_id;
                                                    const primarydevice = new GmObject(datajson[innerkey][realinnerkey][iteminnerkey]);
                                                    sysid = await primarydevice.ConnectPrimaryDevice(datajson[innerkey][realinnerkey][iteminnerkey], systemid);
                                                }
                                                if (iteminnerkey === "Peripheral_Devices") {
                                                    for (const innerobjectkey in datajson[innerkey][realinnerkey][iteminnerkey]) {
                                                        if (datajson[innerkey][realinnerkey][iteminnerkey].hasOwnProperty(innerobjectkey)) {
                                                            const peripheraldevice = new GmObject(datajson[innerkey][realinnerkey][iteminnerkey][innerobjectkey]);
                                                            await peripheraldevice.ConnectDevice(sysid);
                                                        }
                                                    }
                                                }
                                            }
                                            if (initializer) {
                                                initializer.kill();
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                    resolve();
                })
                    .catch((err: Error) => {
                        console.log("IPL EXP automation failed: " + `${err}`);
                    })
            });

            afterEach(async () => {
                let sideNav = new SideNavigationComponent(browser);
                let messageComponent = new MessagePaneComponent(browser);
                let traceComponent = new TraceComponent(browser);
                let programLogComponent = new ProgramLogComponent(browser);

                //THIS MUST be first. check for any type of pop up first then close.
                let somePopUpIsDisplayed = await (await browser.$('[class=cdk-global-overlay-wrapper]')).isExisting()
                if (somePopUpIsDisplayed) {
                    let popUpXIcon = await browser.$('[class=cdk-global-overlay-wrapper] [class=sync-icon-btn]');
                    let noXTroubleshootPopUp = await browser.$('[class=cdk-global-overlay-wrapper] [type=button]:nth-of-type(2)'); //'Unable to Read the Project File' pop up that does not have 'X' like others do.
                    await popUpXIcon.click();
                    await noXTroubleshootPopUp.click();
                }

                //MUST be second. check if download panel is open then close
                let downloadPanelIsDisplayed = (await browser.$('//*[@id="proj-download-overlay-panel"]/div/div[2]')).isExisting()
                if (downloadPanelIsDisplayed) {
                    (await browser.$('//*[@id="proj-download-overlay-panel"]/div/div[2]/sync-component-header/div/div/sync-icon-button')).click
                }

                //check if overwrite banner of any type is open then close.
                let someOverwriteBannerIsDisplayed = await (await browser.$('//sync-banner-alert')).isExisting()
                if (someOverwriteBannerIsDisplayed) {
                    (await browser.$('(//sync-banner-alert//button)[2]')).click()
                }


                //If the step went into the troubleshooting page at any point. Do clean up for troubleshooting page.
                if (wentIntoTroubleShootingPage) {
                    //Clear the trace and program log.
                    await sideNav.troubleshootingWindow.click()
                    await browser.pause(timeout.superFast);
                    await traceComponent.clearTraceButton.click();
                    await programLogComponent.clearProgramLogButton.click();


                    //If "Hide" meesage pane button exists. Click it to reset csdu to original state where troubleshooting message pane does not show
                    let showHideButton = await browser.$('//*[@id="message-trigger-button"]/span');
                    let textInShowHideButton = await showHideButton.getText()
                    if (textInShowHideButton == "HIDE") {
                        await showHideButton.click()
                    }

                    // STOP trace it it is running.
                    let traceSpinner = await browser.$("//img[@class='rotating']");
                    let traceIsRunning = await traceSpinner.isExisting()
                    if (traceIsRunning) {
                        (await browser.$('//*[@id="trace-header-bar"]/div[2]/sync-icon-button[1]')).click(); //click stop trace.
                        await browser.pause(timeout.fast)
                    }

                    //Flip the visited troubleshooting page tracker to false. 
                    wentIntoTroubleShootingPage = false
                }

                await sideNav.deployWindow.click();
                await browser.pause(timeout.superFast);
                await messageComponent.clearAllButton.click()
            });
        });
    }

    for (const filekey in datajsonfile) {
        const datajson = fs.readJsonSync(path.join(__dirname, "datajson", datajsonfile[filekey]));
        // look at the keys
        // tslint:disable-next-line:forin
        for (const key in datajson) {
            if (datajson[key].Execute === "True") {
                runTest(datajson[key], key)
                    .catch((err) => console.log(err));
            }
        }
    }
});