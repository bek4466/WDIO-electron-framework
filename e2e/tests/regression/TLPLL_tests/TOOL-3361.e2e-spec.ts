// @ts-nocheck
import { LogClient } from "@extron/winston-logger";
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { browser } from '@wdio/globals';
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { Jsonparser } from "../../../src/deployment/Jsonparser.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { CredsComponent } from "../../../src/credentialsComponent";
import { reject } from "q";
// import * as robot from "@jitsi/robotjs";
import { environment } from '../../../../electron/src/environment/environment';
import { GmObject } from "../../../src/deployment/GmObject.po";
import { DebugSetupOptions, DefaultSetupOptions, ServicePoolManager } from "@extron/module-service-initializer";
import { TraceComponent } from "../../../src/traceComponent/traceComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";

let displayConsoleLogs = true;
let disableTestCasesWithLogout = true;
let wentIntoTroubleShootingPage = false;

const common = new CommonMethods();
var systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "HWTLPLLProject", "systeminfoTmp.json");
var systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "HWTLPLLProject", "systeminfo.json");
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const msgPaneLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "messagePaneLocators.json"));
const datajsonfile = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "tests", "regression", "TLPLL_tests", "datajson", "filesTLP.json"));
const controllerLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "controllerLocators.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
let logClient: LogClient;
var firstTimeFlag: boolean = true;
const time: Date = new Date();
/**
 * @Author `Miguel C. QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3361`
 * @Description `TLP w/ LL Automation Test Suite`
 * @Date `12/27/2021`
 */
// tslint:disable-next-line:forin
describe("Starting TestMaster spec: Running Test Suite: TLP", () => {
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
        describe(`${datajson.TestCaseInfo.SuiteType}":"${datajson.TestCaseInfo.UserStory}`, async () => {
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
                const UserStoryLink = datajson.TestCaseInfo.UserStoryLink.split(",");
                const TaskLink = datajson.TestCaseInfo.TaskLink.split(",");
                const TestCaseLink = datajson.TestCaseInfo.TestCaseLink.split(",");
                allure.addOwner(datajson.TestCaseInfo.Owner);
                allure.epic(datajson.TestCaseInfo.UserStory);
                allure.addLink(UserStoryLink[1], UserStoryLink[0]);
                allure.addLink(TaskLink[1], TaskLink[0]);
                allure.addLink(TestCaseLink[1], TestCaseLink[0]);
                resolve('');
                }).catch((err) => {
                    console.log(err);
                });
            });

            it(updatedTestDescription, async () => {
                jparser = new Jsonparser();
                const messageComponent = new MessagePaneComponent(browser);
                const projectCredentialUI = new CredsComponent(browser);
                const systemDeployment = new DeployComponent(browser);
                const projectFile = await datajson.TestCaseInfo.ProjectFile;
                if (projectFile != undefined) {
                    systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", projectFile);
                    systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", projectFile, "..", "systeminfoTmp.json");
                }
                await systemDeployment.destinyInputField.ChangeFile(systemInfoFilePath)
                    .then(async () => {
                    });
                await common.copyFolder(systemInfoFilePath, systemInfoFileTemp);
                const a1 = path.resolve(systemInfoFileTemp);
                const systemInfo1 = fs.readJsonSync(a1);

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
                                        await projectCredentialUI.usernameRow1.setUsername(datajson.Credentials[idx].user, idx);
                                        await projectCredentialUI.passwordRow1.setPassword(datajson.Credentials[idx].pass, idx);
                                    }
                                    await projectCredentialUI.saveConnectionManagerButton.click();


                                    await browser.pause(timeout.fast);
                                    await systemDeployment.deployButton.exists()
                                        .then(async (deployExist) => {
                                            await expect(deployExist)
                                                .toBe(true);
                                        })
                                        .catch((err: Error) => {
                                            logClient.error(err);
                                        });
                                    await systemDeployment.deployButton.click()
                                        .then(async () => {
                                            await browser.pause(timeout.slow);
                                            return systemDeployment.deployButton.isEnabled()
                                                .then(async (status) => {
                                                    //  await expect(status)
                                                    // .toEqual(false);
                                                })
                                                .catch((err: Error) => {
                                                    logClient.error(err);
                                                });
                                        })
                                        .catch((err: Error) => {
                                            logClient.error("Exception caught: " + `${err}`);
                                        });
                                }
                            }

                            if (realinnerkey === "VerifyMessage") {
                                for (const iteminnerkey in datajson[innerkey][realinnerkey]) {
                                    if (datajson[innerkey][realinnerkey].hasOwnProperty(iteminnerkey)) {
                                        await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + ` Checking the presence of message \"${datajson[innerkey][realinnerkey][iteminnerkey].MessageText}\" in  output`, async () => {
                                            const lbl = await messageComponent.messageRowValue.checkMessagePaneLogs(datajson[innerkey][realinnerkey][iteminnerkey].MessageText, datajson[innerkey][realinnerkey][iteminnerkey].MessageType);
                                            if (lbl != datajson[innerkey][realinnerkey][iteminnerkey].Exist) {
                                                await expect(datajson[innerkey][realinnerkey][iteminnerkey].MessageText).toBe("This is the message that failed.")
                                            }
                                            await expect(lbl)
                                                .toEqual(datajson[innerkey][realinnerkey][iteminnerkey].Exist);
                                        });
                                    }
                                }
                                await browser.pause(timeout.slow);
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
                            if (realinnerkey === "VerifyVTLP") {
                                await browser.pause(timeout.slow);
                                const ipAddress = systemInfo1.devices[0].network.interfaces[0].address;
                                const vtlp = systemInfo1.devices[datajson[innerkey][realinnerkey]].extron_control_web_id;
                                const username = data.controllerUserName;
                                const password = data.controllerPassword;
                                await browser.newWindow("https://" + ipAddress + "/web/vtlp/" + vtlp + "/index.html#/main", {windowName: "vtlpWindow", windowFeatures: "width=1024,height=770,resizable,scrollbars=yes,status=1"});
                                await browser.pause(timeout.medium);
                                await browser.$(controllerLocators.userName)
                                    .setValue(username);
                                await browser.$(controllerLocators.password)
                                    .setValue(password);
                                await browser.$(controllerLocators.signIn)
                                    .click();
                            }
                        }

                    }
                }

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
        const datajson = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "tests", "regression", "TLPLL_tests", "datajson", datajsonfile[filekey]));
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
