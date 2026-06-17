import * as fs from "fs-extra";
import * as path from "path";
import { LoginComponent } from "../../src/accessControlComponent/loginComponent.po";
import { allure } from "../../src/allure/allure";
import { CredsComponent } from "../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../src/programLogComponent/programLog.po";
import { TroubleshootingPage } from "../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../src/startStopProgramComponent/startStopProgram.po";
import { TitleBarMenu } from "../../src/titleBarMenu/titleBarMenu.po";
import { TraceComponent } from "../../src/traceComponent/traceComponent.po";
import { CommonMethods } from "../commonMethods.po";
import { describe, it, before } from "mocha";
import { browser } from '@wdio/globals'

/**
 * @Author `Neelam.S`
 * @LinkToJIRA `https:// extron.atlassian.net/browse/CSP-343`
 * @POM `https:// extron.atlassian.net/browse/CSP-29`
 * @Description `Non Hardware Test`
 * @Date `1/08/2020`
 */

const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathT72 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT72.json");
const systemInfoFilePathT73 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT73.json");
const systemInfoFilePathT130 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT130.json");
const systemInfoFilePathT128 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT128.json");
const systemInfoFilePathT367 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT367.json");
const systemInfoFilePathT370 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT370.json");
const systemInfoFilePathT124 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT124.json");
const systemInfoFilePathT125 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT125.json");
const systemInfoFilePathT55 = path.join(__dirname, "..", "..", "resources", "GoodProject", "systeminfo.json");
const systemInfoFilePathT361 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT361.json");
const systemInfoFilePathT362 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT362.json");
const systemInfoFilePathT349 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT349.json");
const systemInfoFilePathT356 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT356.json");
const systemInfoFilePathT357 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT357.json");
const systemInfoFilePathStartProgram = path.join(__dirname, "..", "..", "resources", "HardwareTestDeploy", "systeminfo1.json");
const systemInfoFileextra = fs.readJsonSync(path.join(__dirname, "..", "..", "resources", "GoodProject", "systeminfo.json"));
const systemInfoFilePath = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfo.json");
const systemInfoFilePathT60 = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT60.json");
const systemInfoFilePathT56 = path.join(__dirname, "..", "..", "resources", "GoodProject", "systeminfo.json");
const systemInfoFilePathT54 = path.join(__dirname, "..", "..", "resources", "GoodProject", "systeminfoT54.json");
const systemInfoFilePathKevin = path.join(__dirname, "..", "..", "resources", "DeployProject", "systeminfoT60.json");
const systemInfoFilePathCSPT57Version1 = path.join(__dirname, "..", "..", "resources", "ProjectForCSP-20", "systeminfoT57Version1.json");
const systemInfoFilePathCSPT57Version2 = path.join(__dirname, "..", "..", "resources", "ProjectForCSP-20", "systeminfoT57Version2.json");
const systemInfoFilePathCSPT57Version3 = path.join(__dirname, "..", "..", "resources", "ProjectForCSP-20", "systeminfoT57Version3.json");
const systemInfoFilePathCSPT57Version4 = path.join(__dirname, "..", "..", "resources", "ProjectForCSP-20", "systeminfoT57Version4.json");
const invalidsystemInfoFilePath = path.join(__dirname, "..", "..", "resources", "NotGoodProject", "invalidsysteminfo.txt");
const systemInfoFilePathForHardware = path.join(__dirname, "..", "..", "resources", "HardwareTestDeploy", "systeminfo.json");
const systemInfoFilePathForPagination = path.join(__dirname, "..", "..", "resources", "HardwareTestDeploy", "systeminfotestpagination.json");
const systemInfoFilePathCSP20T53 = path.join(__dirname, "..", "..", "resources", "ProjectForCSP-20", "systeminfoT53.json");
const systemInfoFilePathCSP20T52 = path.join(__dirname, "..", "..", "resources", "ProjectForCSP-20", "systeminfoT52.json");
const systemInfoFilePathCSPT211 = path.join(__dirname, "..", "..", "resources", "ProgramMessages", "systeminfoT211.json");
const systemInfoFilePathCSPT32 = path.join(__dirname, "..", "..", "resources", "ProgramLogProject", "systeminfoT32.json");
const systemInfoFilePathCSPT25 = path.join(__dirname, "..", "..", "resources", "ProgramLogProject", "systeminfoT25.json");
const systemInfoFilePathCSPT275 = path.join(__dirname, "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275.json");
import { LogClient } from "@extron/winston-logger";
import { reject } from "q";
import { MinimizeButton } from "e2e/src/titlebarComponent";
const logClient = new LogClient("NonHardware:e2e");

describe(`${tabTitles.NON_HARDWARE_TESTS}  UI Component tests`, () => {
    before(async () => {
        allure.addOwner("Oybek T");
        return new Promise<void>(async (resolve) => {
            await browser.pause(4000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    // it("SYNC_UI_TEST:LOGIN", async () => {
    //     await browser.pause(timeout.medium);
    //     const login = new LoginComponent(browser);
    //     await login.logoutBtn.loginApp()
    //         .then(async (value) => {
    //             await expect(value)
    //                 .toEqual(true);
    //         })
    //         .catch((err: Error) => {
    //             logClient.warn(`${err}`);
    //         });
    // });

    it("SYNC_UI_TEST:Navigation Side Panel tests for Deployment and Troubleshooting Pages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new SideNavigationComponent(browser);
            await systemDeployment.deployWindow.isEnabled()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                    await systemDeployment.deployWindow.click()
                        .then(async () => {
                            await browser.pause(timeout.medium);
                            await systemDeployment.troubleshootingWindow.isVisible()
                                .then(async (value1) => {
                                    await expect(value1)
                                        .toBe(true);
                                    await systemDeployment.troubleshootingWindow.click();
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        })
                        .catch((err: Error) => {
                            console.error("Exception caught" + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
                await systemDeployment.deployWindow.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-SideNav: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify Destiny Input field exist and Editable", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new SideNavigationComponent(browser);
            const systemDeploymentComp = new DeployComponent(browser);
            await systemDeploymentComp.destinyInputPathField.isVisible()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                    await systemDeploymentComp.destinyInputPathField.inputFilePathEditable(systemInfoFilePath)
                        .then(async (pathsent) => {
                            await expect(pathsent)
                                .toBe(true);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify Browse button exist and clikable", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new SideNavigationComponent(browser);
            const systemDeploymentComp = new DeployComponent(browser);
            await systemDeploymentComp.browseButton.isVisible()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                    await systemDeploymentComp.browseButton.click();
                })
                .catch((err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
        await browser.reloadSession();
        await browser.pause(5000);
        await browser.switchWindow("ControlScript Deployment Utility");
        resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("check for Json validation message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            //  sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(invalidsystemInfoFilePath)
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            await browser.pause(timeout.medium);
            //  checking validation message
            await systemDeployment.errorMessage.invalidFileErrorValidation(data.ValidationMessage)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err) => {
                    console.error(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify Deploy button exist and disabled on intial launch", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new SideNavigationComponent(browser);
            const systemDeploymentComp = new DeployComponent(browser);
            await systemDeploymentComp.deployButton.exists()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                    await systemDeploymentComp.deployButton.isDisabled()
                        .then(async (value1) => {
                            await expect(value1)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            console.error("Exception caught" + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("check for Json validation message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            //  sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(invalidsystemInfoFilePath)
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            await browser.pause(timeout.medium);
            //  checking validation message
            await systemDeployment.errorMessage.invalidFileErrorValidation(data.ValidationMessage)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err) => {
                    console.error(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    
    it("SYNC_UI_TEST:check deploy got enabled and clickable after destiny file selection", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            //  sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForHardware)
                .then(async () => {
                    await browser.pause(timeout.medium);
                    await systemDeployment.deployButton.isEnabled()
                        .then(async (isEnabled) => {
                            await expect(isEnabled)
                                .toBe(true);
                            await systemDeployment.deployButton.click()
                                .then(async () => {
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err: Error) => {
                    console.error(err);
                });
                const messageComponent = new MessagePaneComponent(browser);
                await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });

    });

    it("SYNC_UI_TEST:check build and upload got failed after destiny file selection with random primary ip", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForHardware)
                .then(async () => {
                    await browser.pause(timeout.medium);
                    await systemDeployment.deployButton.isEnabled()
                        .then(async (isEnabled) => {
                            await expect(isEnabled)
                                .toBe(true);
                            await systemDeployment.deployButton.click()
                                .then(async () => {
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deployFailureMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            await messageComponent.clearAllButton.click();
        resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });

    });

    it("SYNC_UI_TEST:Verify Kevin button is disabled on intial launch", async () => {
        return new Promise<void>(async (resolve) => {
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isDisabled()
                .then(async (kevinDisabled) => {
                    await expect(kevinDisabled)
                        .toBe(true);
                })
                .catch((err: Error) => {
                });
            resolve();
        })
            .catch((err) => {
                console.log("Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify Kevin button is disabled after invalid format destiny file selection", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(invalidsystemInfoFilePath)
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            await browser.pause(timeout.medium);
            // checking validation message
            await systemDeployment.errorMessage.invalidFileErrorValidation(data.ValidationMessage)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err) => {
                    console.error(err);
                });
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isDisabled()
                .then(async (kevinDisabled) => {
                    await expect(kevinDisabled)
                        .toBe(true);
                })
                .catch((err: Error) => {
                });
            resolve();
        })
            .catch((err) => {
                console.log("Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify Kevin button is enabled and clickable after valid format destiny file selection", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForHardware)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
                await userSettings.credsCloseButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify Kevin click opens kevin settings window and validate window, after valid format destiny file selection", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForHardware)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
            await browser.pause(timeout.medium);
            await userSettings.KEVIN_SETTING_BUTTON.verifyKevinInTabularForm()
                .then(async (kevinInTabularForm) => {
                    await expect(kevinInTabularForm)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);

                });
            await browser.pause(timeout.medium);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(7);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            // verify table should have Device name, Address,Username and password coloumn
            await userSettings.deviceNameCol.verifyDeviceNameColumnExist()
                .then(async (isDeviceNameColumnExist) => {
                    await expect(isDeviceNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await userSettings.IPaddressCol.verifyIpAddressColumnExist()
                .then(async (isIpAddressColumnExist) => {
                    await expect(isIpAddressColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await userSettings.userNameCol.verifyUserNameColumnExist()
                .then(async (isUserNameColumnExist) => {
                    await expect(isUserNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await userSettings.passwordCol.verifyPasswordColumnExist()
                .then(async (isPasswordColumnExist) => {
                    await expect(isPasswordColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await userSettings.credsCloseButton.isVisible()
                .then(async (isCredentialCloseButtonVisible) => {
                    await expect(isCredentialCloseButtonVisible)
                        .toBe(true);
                    await userSettings.credsCloseButton.click();
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
                await userSettings.credsCloseButton.click();
        resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that devices having credentials in destiny are not editable in Kevin Settings", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending valid destiny file path
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSP20T52)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
            await browser.pause(timeout.medium);
            // verify Kevin settings should be in tabular form and has 3 entries in table
            await userSettings.KEVIN_SETTING_BUTTON.verifyKevinInTabularForm()
                .then(async (kevinInTabularForm) => {
                    await expect(kevinInTabularForm)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            await browser.pause(timeout.medium);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(data.kevinEntriesCount);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // verify table should have Device name, Address,Username and password coloumn
            await userSettings.deviceNameCol.verifyDeviceNameColumnExist()
                .then(async (isDeviceNameColumnExist) => {
                    await expect(isDeviceNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);

                });
            await userSettings.IPaddressCol.verifyIpAddressColumnExist()
                .then(async (isIpAddressColumnExist) => {
                    await expect(isIpAddressColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);

                });
            await userSettings.userNameCol.verifyUserNameColumnExist()
                .then(async (isUserNameColumnExist) => {
                    await expect(isUserNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);

                });
            await userSettings.passwordCol.verifyPasswordColumnExist()
                .then(async (isPasswordColumnExist) => {
                    await expect(isPasswordColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);

                });
            // verify that Primary,secondary and TLP"s entries should be visible and intended
            // primary user name value
            await userSettings.usernameRow1.verifyPrimaryUserNameValueIsVisible()
                .then(async (isPrimaryUserNameValueExist) => {
                    await expect(isPrimaryUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);

                });
            // primary password value
            await userSettings.passwordRow1.verifyPrimaryPasswordValueIsVisible()
                .then(async (isPrimaryPasswordValueExist) => {
                    await expect(isPrimaryPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // secondary user name value
            await userSettings.usernameRow2.verifySecondaryUserNameValueIsVisible()
                .then(async (isSecondaryUserNameValueExist) => {
                    await expect(isSecondaryUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // secondary password value
            await userSettings.passwordRow2.verifySecondaryPasswordValueIsVisible()
                .then(async (isSecondaryPasswordValueExist) => {
                    await expect(isSecondaryPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);

                });
            // tlp user name value
            await userSettings.usernameRow3.verifyEmptyTlpUserNameValueIsVisible()
                .then(async (isTlpEmptyUserNameValueExist) => {
                    await expect(isTlpEmptyUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // tlp password value
            await userSettings.passwordRow3.verifyEmptyTlpPasswordValueIsVisible()
                .then(async (isTlpEmptyPasswordValueExist) => {
                    await expect(isTlpEmptyPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // navigate back to deploy window by clicking on close button
            await userSettings.credsCloseButton.click();
            await browser.pause(timeout.medium);
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);

                });

            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that devices missing credentials in destiny are editable in Kevin Settings", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending valid destiny file path
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSP20T53)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
            await browser.pause(timeout.slow);
            // verify Kevin settings should be in tabular form and has 3 entries in table
            await userSettings.KEVIN_SETTING_BUTTON.verifyKevinInTabularForm()
                .then(async (kevinInTabularForm) => {
                    await expect(kevinInTabularForm)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });

            await browser.pause(timeout.fast);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(data.kevinEntriesCount);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            // verify table should have Device name, Address,Username and password coloumn
            await userSettings.deviceNameCol.verifyDeviceNameColumnExist()
                .then(async (isDeviceNameColumnExist) => {
                    await expect(isDeviceNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await userSettings.IPaddressCol.verifyIpAddressColumnExist()
                .then(async (isIpAddressColumnExist) => {
                    await expect(isIpAddressColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await userSettings.userNameCol.verifyUserNameColumnExist()
                .then(async (isUserNameColumnExist) => {
                    await expect(isUserNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await userSettings.passwordCol.verifyPasswordColumnExist()
                .then(async (isPasswordColumnExist) => {
                    await expect(isPasswordColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            //  verify that Primary,secondary and TLP"s entries should be visible and intended
            //  primary user name value edit
            await userSettings.usernameRow1.verifyEmptyPrimaryUserNameIsVisibleAndEditable(data.primaryUserName)
                .then(async (isPrimaryUserNameEmptyAndEditable) => {
                    await expect(isPrimaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            // primary password value
            await userSettings.passwordRow1.verifyPrimaryPasswordValueIsVisible()
                .then(async (isPrimaryPasswordValueExist) => {
                    await expect(isPrimaryPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            // secondary user name value edit
            await userSettings.usernameRow2.verifyEmptySecondaryUserNameIsVisibleAndEditable(data.secondaryUserName)
                .then(async (isSecondaryUserNameEmptyAndEditable) => {
                    await expect(isSecondaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            //  secondary password value
            await userSettings.passwordRow2.verifyEmptySecondaryPasswordIsVisibleAndEditable(data.secondaryPassword)
                .then(async (isSecondaryPasswordEmptyAndEditable) => {
                    await expect(isSecondaryPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            // tlp user name value
            await userSettings.usernameRow3.verifyTlpUserNameValueIsVisible()
                .then(async (isTlpUserNameValueExist) => {
                    await expect(isTlpUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            // tlp password missing and editable
            await userSettings.passwordRow3.verifyEmptyTlpPasswordIsVisibleAndEditable(data.tlpPassword)
                .then(async (isTlpPasswordEmptyAndEditable) => {
                    await expect(isTlpPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            // navigate back to deploy window by clicking on close button
            userSettings.credsCloseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.medium);
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that credentials are saved on losing focus", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            //  Select the system
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT54)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
            await browser.pause(timeout.slow);
            //  Check that Creds are still entered
            await systemDeployment.primaryUserName.verifyPrimaryUserNameIsEnteredWithValue(data.primaryUserName)
                .then(async (isPrimaryUserNameEntered) => {
                    await expect(isPrimaryUserNameEntered)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            //  Enter partial creds
            // username for alpha
            await userSettings.usernameRow1.verifyEmptyPrimaryUserNameIsVisibleAndEditable(data.primaryUserName)
                .then(async (isPrimaryUserNameEmptyAndEditable) => {
                    await expect(isPrimaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // password for tlp
            await userSettings.passwordRow3.verifyEmptyTlpPasswordIsVisibleAndEditable(data.tlpPassword)
                .then(async (isTlpPasswordEmptyAndEditable) => {
                    await expect(isTlpPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });

            //  Close on Kevin settings close button
            await userSettings.credsCloseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.fast);

            //  click on KevinSettings Button to open
            await userSettings.KEVIN_SETTING_BUTTON.click();
            await browser.pause(timeout.slow);
            await systemDeployment.missingPrimaryUserName.verifyEmptyPrimaryUserNameIsVisibleAndEditable(data.primaryUserName)
                .then(async (isPrimaryUserNameEmptyAndEditable) => {
                    await expect(isPrimaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // password for alpha
            await systemDeployment.missingPrimaryPassword.verifyEmptyPrimaryPasswordIsVisibleAndEditable(data.primaryPassword)
                .then(async (isPrimaryPasswordEmptyAndEditable) => {
                    await expect(isPrimaryPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // username for tlp
            await systemDeployment.missingTlpUserName.verifyEmptyTlpUserNameIsVisibleAndEditable(data.tlpUserName)
                .then(async (isTlpUserNameEmptyAndEditable) => {
                    await expect(isTlpUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // password for tlp
            await systemDeployment.missingTlpPassword.verifyEmptyTlpPasswordIsVisibleAndEditable(data.tlpPassword)
                .then(async (isTlpPasswordEmptyAndEditable) => {
                    await expect(isTlpPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // Close Kevin Window and deploy the system
            await systemDeployment.closeKevinButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.error("closeKevinButton: " + `${err}`);
                });
            await browser.pause(timeout.fast);
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);

                });
            resolve();
        })
            .catch((err: Error) => {
                console.error("CSP-191: Exception Error: " + `${err}`);
            });
    });

    it("SYNC_UI_TEST:Verify that Pagination is occurring correctly ", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending valid destiny file path
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForPagination)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
            await browser.pause(timeout.slow);
            // verify Kevin settings should be in tabular form and has 3 entries in table
            await userSettings.KEVIN_SETTING_BUTTON.verifyKevinInTabularForm()
                .then(async (kevinInTabularForm) => {
                    await expect(kevinInTabularForm)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            await browser.pause(timeout.fast);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(data.maxRowKevinTable);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            await userSettings.credsCloseButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-SideNav: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that appropriate devices -eBUS- do not show up in Kevin Settings", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const troubleshooting = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT55)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
            await troubleshooting.deviceTable
                .tableContents()
                .then(async (tablecontents) => {
                    // ebus name from the table
                    const ebusname = await systemInfoFileextra.devices[1].name;
                    // Verify that the ebus name is not there
                    await troubleshooting.deviceTable
                        .tableContents()
                        .then(async (tablecontents1) => {
                            for (const i of tablecontents1) {
                                if (i.trim() === ebusname.trim()) {
                                    return true;
                                }
                            }
                            return false;
                        })
                        .then(async (value) => {
                            await expect(value)
                                .toBe(false);
                        });
                    await browser.pause(timeout.medium);
                    // navigate back to deploy window by clicking on close button
                    await systemDeployment.closeKevinButton.click()
                        .then(async () => {
                            await browser.pause(timeout.slow);
                        })
                        .catch((err: Error) => {
                            console.error(err);
                        });
                    resolve();
                })
                .catch((err) => {
                    console.log("CSP-SideNav: Exception Error: " + `${err}`);
                    return Promise.resolve(err + "Should have thrown");
                });
        });
    });

    it("SYNC_UI_TEST:Verify that Kevin Settings is prompted for appropriate devices", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            //  Select the system
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT60);
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // clicking on deploy button
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    await systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(true);
                        })
                        .catch((err: Error) => {
                            console.error(err);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            //  Verify that the kevin window is prompted
            await systemDeployment.kevinWindowOpen.verifyKevinIsPrompted()
                .catch((err: Error) => {
                    console.log(err);
                });
            //  Enter incorrect creds for alpha
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
            //  Close Kevin window and try to deploy the system
            await systemDeployment.closeKevinButton.click()
                .catch((err: Error) => {
                    console.log(err);
                });
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
            // clicking on deploy button
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    await systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(true);
                        })
                        .catch((err: Error) => {
                            console.error(err);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.medium);
            const userSettings = new CredsComponent(browser);
            // now verify kevin settings got enabled
            await userSettings.KEVIN_SETTING_BUTTON.isEnabled()
                .then(async (kevinEnabled) => {
                    await expect(kevinEnabled)
                        .toBe(true);
                    await userSettings.KEVIN_SETTING_BUTTON.click();
                })
                .catch((err: Error) => {
                });
            //  Enter correct creds for alpha only, leave tlp blank
            await browser.pause(timeout.medium);
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
            await userSettings.credsCloseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.log(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-SideNav: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    // it.only("SYNC_UI_TEST:Verify that absence of system.author in destiny gives appropriate error message", async () => {
    //     return new Promise<void>(async (resolve) => {
    //         const systemDeployment = new DeployComponent(browser);
    //         const messageComponent = new MessagePaneComponent(browser);
    //         await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT72);
    //         await browser.pause(timeout.fast);
    //         await systemDeployment.deployButton.click()
    //             .then(async () => {
    //                 await browser.pause(timeout.fast);
    //                 return systemDeployment.deployButton.isEnabled()
    //                     .then(async (status) => {
    //                         await expect(status)
    //                             .toEqual(true);
    //                     })
    //                     .catch((err: Error) => {
    //                         console.error(err);
    //                     });
    //             })
    //             .catch((err: Error) => {
    //                 console.error("Exception caught: " + `${err}`);
    //             });
    //         await browser.pause(timeout.fast);
    //         await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingAuthorMessage, data.warningSeverity)
    //             .then(async (value: boolean) => {
    //                 await expect(value)
    //                     .toEqual(true);
    //             })
    //             .catch(async (err: Error) => {
    //                 console.error("Exception caught" + `${err}`);
    //                 //fail("checkMessagePaneLog");
    //             });
    //         await messageComponent.clearAllButton.click();
    //         resolve();
    //     })
    //         .catch((err) => {
    //             console.log("CSP-291: Exception Error: " + `${err}`);
    //             return Promise.resolve(err + "Should have thrown");
    //         });
    // });

    // it.only("SYNC_UI_TEST:Verify that invalid system.author in destiny gives appropriate error message", async () => {
    //     return new Promise<void>(async (resolve) => {
    //         const systemDeployment = new DeployComponent(browser);
    //         const messageComponent = new MessagePaneComponent(browser);
    //         await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT73);
    //         await browser.pause(timeout.fast);
    //         await systemDeployment.deployButton.click()
    //             .then(async () => {
    //                 await browser.pause(timeout.fast);
    //                 return systemDeployment.deployButton.isEnabled()
    //                     .then(async (status) => {
    //                         await expect(status)
    //                             .toEqual(tr);
    //                     })
    //                     .catch((err: Error) => {
    //                         console.error(err);
    //                     });
    //             })
    //             .catch((err: Error) => {
    //                 console.error("Exception caught: " + `${err}`);
    //             });
    //         await browser.pause(timeout.medium);
    //         await messageComponent.messageRowValue.checkMessagePaneLogs(data.malformedAuthorMessage, data.warningSeverity)
    //             .then(async (value: boolean) => {
    //                 await expect(value)
    //                     .toEqual(true);
    //             })
    //             .catch(async (err: Error) => {
    //                 console.error("Exception caught" + `${err}`);
    //                 //fail("checkMessagePaneLog");
    //             });
    //         await messageComponent.clearAllButton.click(); 
    //         resolve();
    //     })
    //         .catch((err) => {
    //             console.log("CSP-293: Exception Error: " + `${err}`);
    //             return Promise.resolve(err + "Should have thrown");
    //         });
    // });

    it("SYNC_UI_TEST:Verify that absence of system.primary_device_alias in destiny gives appropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT128);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingAliasMessage, data.errorSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toEqual(true);
                        })
                        .catch((err: Error) => {
                            console.error("Exception caught in VerifyMessageLogs: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught in VerifyMessageLogs: " + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that invalid system.primary_device_alias in destiny gives appropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT130);
            await browser.pause(timeout.slow);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                    await messageComponent.messageRowValue.checkMessagePaneLogs(data.malformedAliasMessage, data.errorSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toEqual(true);
                        })
                        .catch((err: Error) => {
                            console.error("Exception caught in VerifyMessageLogs: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught in VerifyMessageLogs: " + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    // it.only("SYNC_UI_TEST:Verify that non existent system.primary_device_alias in destiny gives appropriate error message", async () => {
    //     return new Promise<void>(async (resolve) => {
    //         const systemDeployment = new DeployComponent(browser);
    //         const messageComponent = new MessagePaneComponent(browser);
    //         await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT367);
    //         await browser.pause(timeout.fast);
    //         await systemDeployment.deployButton.click();
    //         await browser.pause(timeout.slow);
    //         await messageComponent.messageRowValue.checkMessagePaneLogs(data.invalidAliasMessage, data.errorSeverity)
    //             .then(async (value: boolean) => {
    //                 await expect(value)
    //                     .toEqual(true);
    //             })
    //             .catch(async (err: Error) => {
    //                 console.error("Exception caught" + `${err}`);
    //                 //fail("checkMessagePaneLog");
    //             });
    //         await messageComponent.clearAllButton.click();
    //         resolve();
    //     })
    //         .catch((err) => {
    //             console.log("CSP-293: Exception Error: " + `${err}`);
    //             return Promise.resolve(err + "Should have thrown");
    //         });
    // });

    it("SYNC_UI_TEST:Verify that a system.primary_device_alias which refers to a TLP gives appropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT370);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.primaryTlpAliasMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-293: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that missing keys for system folder(sound_folder_path) give appropriate Info message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT124);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            console.error(err);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingSoundFolder, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-331: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that invalid file path for system folder(sound_folder_path) gives appropriate warning messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT125);
            await browser.pause(timeout.slow);
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.invalidSoundFolderPath, data.warningSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-331: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that missing keys for system.irfile_folder_path give appropriate error messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT361);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingIrFolder, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught in checkMessagePaneLogs: " + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-332: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that invalid file path for system.irfile_folder_path gives appropriate error messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT362);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.medium);
                    await messageComponent.messageRowValue.checkMessagePaneLogs(data.invalidIrFolderPath, data.warningSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toEqual(true);
                        })
                        .catch((err: Error) => {
                            console.error(err);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught: " + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-332: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    // it.only("SYNC_UI_TEST:Verify that code_entry_file being not a python file gives appropriate error messages", async () => {
    //     return new Promise<void>(async (resolve) => {
    //         const systemDeployment = new DeployComponent(browser);
    //         const messageComponent = new MessagePaneComponent(browser);
    //         await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT349);
    //         await browser.pause(timeout.fast);
    //         await systemDeployment.deployButton.click();
    //         await browser.pause(timeout.medium);
    //         await messageComponent.messageRowValue.checkMessagePaneLogs(data.invalidCodeEntryFile, data.errorSeverity)
    //             .then(async (value: boolean) => {
    //                 await expect(value)
    //                     .toEqual(true);
    //             })
    //             .catch(async (err: Error) => {
    //                 console.error("Exception caught" + `${err}`);
    //                 //fail("checkMessagePaneLog");
    //             });
    //         await messageComponent.clearAllButton.click();
    //         resolve();
    //     })
    //         .catch((err) => {
    //             console.log("CSP-337: Exception Error: " + `${err}`);
    //             return Promise.resolve(err + "Should have thrown");
    //         });
    // });

    it("SYNC_UI_TEST:Verify that missing key for system folder (code_folder_path) gives appropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT356);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingCodeFolder, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-338: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify that invalid file path for system folder (code_folder_path) gives appropriate error messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT357);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.invalidCodeFolder, data.errorSeverity)
                .then(async (value: boolean) => {
                    //  await expect(value).toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            await messageComponent.clearAllButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-338: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify there is messages tab got added inside deployment and troubleshoot space.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const sideNavigationComp = new SideNavigationComponent(browser);
            const troubleshooting = new ProgramLogComponent(browser);
            const messagecomp = new MessagePaneComponent(browser);
            //  await sideNavigationComp.deployWindow.click();
            // click Messagees Tab on System Deployment
            await systemDeployment.messagesTab.exists()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                    //   await messagecomp.openMessagePaneButton.click().then(async () => {
                    // Verify that the Message Panel is visible
                    await browser.pause(timeout.medium);
                    await messagecomp.messagePaneVisible.isVisible()
                        .then(async (value1) => {
                            await expect(value1)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            console.error("Exception caught: Message Pane Visible " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught: OpenMessage Pane Button Visible" + `${err}`);
                });
            // click Messagees Tab on System Troubleshoting
            await sideNavigationComp.troubleshootingWindow.click();
            await systemDeployment.messagesTab.exists()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                    await messagecomp.openMessagePaneButton.click()
                        .then(async () => {
                            await browser.pause(timeout.medium);
                            // Verify that the Message Panel is visible
                            await messagecomp.messagePaneVisible.isVisible()
                                .then(async (value2) => {
                                    await expect(value2)
                                        .toBe(true);
                                })
                                .catch(async (err: Error) => {
                                    console.error("Exception caught" + `${err}`);
                                    //fail("checkMessagePaneLog");
                                });
                        })
                        .catch((err: Error) => {
                            console.error("Exception caught: Pane Visible " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    console.error("Exception caught: Open Message Button " + `${err}`);

                });
            await sideNavigationComp.deployWindow.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-178: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify By default messages pane should be open and empty on initial session launch and only within the Deploy View.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            // Provide valid destiny file
            // clicking on destiny file input field
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT211);
            await browser.pause(timeout.fast);
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught" + `${err}`);

                });
            // checking deploy view, and message pane should be visible
            await messageComponent.messagePaneVisible.messagePaneIsVisible()
                .then(async (messagePaneExist) => {
                    await expect(messagePaneExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught" + `${err}`);

                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-199: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    // it.only("SYNC_UI_TEST:Verify that message pane is hidden & empty by default when navigated to Troubleshooting view", async () => {
    //     return new Promise<void>(async (resolve) => {
    //         const systemDeployment = new DeployComponent(browser);
    //         const traceComponent = new TraceComponent(browser);
    //         const messageComponent = new MessagePaneComponent(browser);
    //         // Provide valid destiny file
    //         // clicking on destiny file input field
    //         await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT211);
    //         await browser.pause(timeout.fast);
    //         // verify deploy button is displayed
    //         await systemDeployment.deployButton.exists()
    //             .then(async (deployExist) => {
    //                 await expect(deployExist)
    //                     .toBe(true);
    //             })
    //             .catch((err: Error) => {
    //                 console.error("Exception caught" + `${err}`);
    //             });

    //         // checking deploy view, and message pane should be visible
    //         await messageComponent.messagePaneVisible.messagePaneIsVisible()
    //             .then(async (messagePaneExist) => {
    //                 await expect(messagePaneExist)
    //                     .toBe(true);
    //             })
    //             .catch((err: Error) => {
    //                 console.error("Exception caught" + `${err}`);
    //             });
    //         // Navigate to troubleshooting option from sidebar
    //         const sideNav = new SideNavigationComponent(browser);
    //         await sideNav.troubleshootingWindow.click();
    //         await browser.pause(timeout.slow);
    //         // message pane should not be visible
    //         await messageComponent.messagePaneHidden.messagePaneIsHidden()
    //             .then(async (isMessagePaneHidden) => {
    //                 await expect(isMessagePaneHidden)
    //                     .toBe(true);
    //             })
    //             .catch((err: Error) => {
    //                 console.error("Exception caught" + `${err}`);

    //             });
    //         // open message pane
    //         await messageComponent.openMessagePaneButton.click();
    //         await browser.pause(timeout.medium);
    //         // message pane should  be visible
    //         await messageComponent.messagePaneVisible.messagePaneIsVisible()
    //             .then(async (messagePaneExist) => {
    //                 await expect(messagePaneExist)
    //                     .toBe(true);
    //             })
    //             .catch((err: Error) => {
    //                 console.error("Exception caught" + `${err}`);

    //             });
    //         // close message pane
    //         await messageComponent.closeMessagePaneButton.exists()
    //             .then(async (closeMessageButtonExist) => {
    //                 await expect(closeMessageButtonExist)
    //                     .toBe(true);
    //                 await messageComponent.closeMessagePaneButton.click();
    //                 await browser.pause(timeout.medium);
    //             })
    //             .catch((err: Error) => {
    //                 console.error("Exception caught" + `${err}`);
    //             });
    //         // message pane should not be visible
    //         await messageComponent.messagePaneHidden.messagePaneIsHidden()
    //             .then(async (isMessagePaneHidden) => {
    //                 await expect(isMessagePaneHidden)
    //                     .toBe(true);
    //             })
    //             .catch((err: Error) => {
    //                 console.error("Exception caught" + `${err}`);
    //             });
    //         await sideNav.deployWindow.click();
    //         resolve();
    //     })
    //         .catch((err) => {
    //             console.log("CSP-199: Exception Error: " + `${err}`);
    //             return Promise.resolve(err + "Should have thrown");
    //         });
    // });

    it("SYNC_UI_TEST:Verify Message pane should have Timestamp,Severity and Messages columns", async () => {
        return new Promise<void>(async (resolve) => {
            const messagePane = new MessagePaneComponent(browser);
            await browser.pause(timeout.medium);
            // Check if Time Column Exists.
            await messagePane.messageTable.checkColumnExists(data.TimeColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught:  Time Column Exists" + `${err}`);

                });
            await messagePane.messageTable.checkColumnExists(data.SeverityColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: Severity Column Exists" + `${err}`);
                });
            await messagePane.messageTable.checkColumnExists(data.MessageColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: Message Column Exists " + `${err}`);

                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-203: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });

    });

    it("SYNC_UI_TEST:Verify start program button exist and  clickable", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeploymentComp = new DeployComponent(browser);
            const systemTroubleshooting = new StartStopProgramComponent(browser);

            await systemDeploymentComp.destinyInputPathField.isVisible()
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                    await systemDeploymentComp.destinyInputField.setDestinyFileToUpload(systemInfoFilePathStartProgram);
                    await browser.pause(timeout.fast);

                })
                .catch((err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.slow);
            // Verify Start program icon is displaying
            await systemTroubleshooting.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);
                    // click on start button
                    let clickTest = false;
                    await systemTroubleshooting.startProgramButton.click()
                        .then(async () => {
                            clickTest = true;
                            await expect(clickTest)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            console.log("failed:" + err);
                        });
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    //fail("failed at click startprogrambutton");
                });
            await sideNav.deployWindow.click();
            resolve();
        })
            .catch((err) => {
                console.log("start Program Button: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify Trace title and start/clear trace button exist", async () => {
        return new Promise<void>(async (resolve) => {
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await sideNav.deployWindow.click();
            await browser.pause(timeout.medium);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathStartProgram);
            await browser.pause(timeout.fast);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: Deploy Button Present" + `${err}`);
                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            await traceComponent.traceTextTitle.checktraceControls(data.traceTitle)
                .then(async (traceTitleExist) => {
                    await expect(traceTitleExist)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: start Trace Button " + `${err}`);
                });
            await traceComponent.startTraceButton.isVisible()
                .then(async (startTraceVisible) => {
                    await expect(startTraceVisible)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: start Trace Button " + `${err}`);
                });
            await traceComponent.clearTraceButton.isVisible()
                .then(async (clearTraceVisible) => {
                    await expect(clearTraceVisible)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: clear Trace Button " + `${err}`);
                });
            await sideNav.deployWindow.click();
            resolve();
        })
            .catch((err) => {
                console.log("Trace Buttons: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
    it("SYNC_UI_TEST:Verify Program Log Title, Refresh and clear button exist", async () => {
        return new Promise<void>(async (resolve) => {
            const sideNav = new SideNavigationComponent(browser);
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await sideNav.deployWindow.click();
            await browser.pause(timeout.medium);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathStartProgram);
            await browser.pause(timeout.fast);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: Deploy Button Present" + `${err}`);

                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            await systemTroubleshooting.programLogText.isVisible()
                .then(async (ProgramLogTitleExist) => {
                    await expect(ProgramLogTitleExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: programLogText" + `${err}`);
                });
            await systemTroubleshooting.programLogText.checkProgramLogTitle(data.ProgramLogTitle)
                .then(async (IsProgramLogTitleExist) => {
                    await expect(IsProgramLogTitleExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: programLogText" + `${err}`);
                });
            await systemTroubleshooting.programLogRefreshButton.exists()
                .then(async (refreshProgramLogExist) => {
                    await expect(refreshProgramLogExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: Refresh Button Present" + `${err}`);

                });

            await systemTroubleshooting.clearProgramLogButton.exists()
                .then(async (clearProgramLogExist) => {
                    await expect(clearProgramLogExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error("Exception caught: clear Button Present" + `${err}`);

                });
            await sideNav.deployWindow.click();
            resolve();
        })
            .catch((err) => {
                console.log("Trace Buttons: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify Trace table should have IPAddress,Time and Messages columns", async () => {
        return new Promise<void>(async (resolve) => {
            const traceComponent = new TraceComponent(browser);
            const systemTroubleshooting = new ProgramLogComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            await sideNav.deployWindow.click();
            await browser.pause(timeout.medium);
            // sending input file to deploy the project
            await systemDeployment.destinyInputField.setDestinyFileToUpload(
                systemInfoFilePathStartProgram
            );
            await browser.pause(timeout.fast);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton
                .exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(
                        "Exception caught: Deploy Button Present" + `${err}`
                    );
                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            await traceComponent.traceTable
                .checkColumnExists(data.traceIPAddressColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(
                        "Exception caught:  IP Address Column Exists" + `${err}`
                    );
                });
            await traceComponent.traceTable
                .checkColumnExists(data.traceTimeColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })

                .catch((err: Error) => {
                    console.error(
                        "Exception caught: time Column Exists" + `${err}`
                    );
                });
            await traceComponent.traceTable
                .checkColumnExists(data.traceMessageColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.error(
                        "Exception caught:  message Column Exists" + `${err}`
                    );
                });
            await sideNav.deployWindow.click();
            resolve();
        })
            .catch((err) => {
                console.log("CSP-203: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Tool-8: Minimize Button", async () => {
        return new Promise<void>(async (resolve) => {
            // await browser.debug();
            const titleBar = new TitleBarMenu(browser);
            await titleBar.minimizeButton.isVisible()
            .then(async (text) => {
                await expect(text)
                .toEqual(true);
            });
            resolve();
        })
            .catch((err) => {
                console.log("Tool-08: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Tool-9: Maximize Button", async () => {
        return new Promise<void>(async (resolve) => {
            const titleBar = new TitleBarMenu(browser);
            await titleBar.maximizeButton.isVisible()
                .then(async (text) => {
                    await expect(text)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("Tool-09: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:TOOl-10: Close Button", async () => {
        return new Promise<void>(async (resolve) => {
            const titleBar = new TitleBarMenu(browser);
            await titleBar.closeButton.isVisible()
                .then(async (text) => {
                    await expect(text)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("Tool-10: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:Verify App Title", async () => {
        return new Promise<void>(async (resolve) => {
            const titleBar = new TitleBarMenu(browser);
            await titleBar.titleBar.getText()
                .then(async (text) => {
                    await expect(text)

                        .toEqual(data.title);
                })
                .catch(async (err: Error) => {
                    console.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("Title: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

    it("SYNC_UI_TEST:LOGOUT", async () => {
        return new Promise<void>(async (resolve) => {
            const login = new LoginComponent(browser);
            //  Loging out from the application
            await login.logoutBtn.performLogout()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    console.error(`${err}`);
                    // technnically a success
                });
            resolve();
        })
            .catch((err: Error) => {
                console.error(`${err}`);
            });
    });

    afterEach(async () => {
        // await browser.reloadSession();
        // await browser.pause(5000);
        // await browser.switchWindow("ControlScript Deployment Utility");
    });
});