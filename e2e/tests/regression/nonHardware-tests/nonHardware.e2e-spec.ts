// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { LoginComponent } from "../../../src/accessControlComponent/loginComponent.po";
import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { TroubleshootingPage } from "../../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TitleBarMenu } from "../../../src/titleBarMenu/titleBarMenu.po";
import { TraceComponent } from "../../../src/traceComponent/traceComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
/**
 * @Author `Neelam.S`
 * @LinkToJIRA `https:// extron.atlassian.net/browse/CSP-343`
 * @POM `https:// extron.atlassian.net/browse/CSP-29`
 * @Description `Non Hardware Test`
 * @Date `1/08/2020`
 */

const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathT72 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT72.json");
const systemInfoFilePathT73 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT73.json");
const systemInfoFilePathT130 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT130.json");
const systemInfoFilePathT128 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT128.json");
const systemInfoFilePathT367 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT367.json");
const systemInfoFilePathT370 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT370.json");
const systemInfoFilePathT124 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT124.json");
const systemInfoFilePathT125 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT125.json");
const systemInfoFilePathT55 = path.join(__dirname, "..", "..", "..", "resources", "GoodProject", "systeminfo.json");
const systemInfoFilePathT361 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT361.json");
const systemInfoFilePathT362 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT362.json");
const systemInfoFilePathT349 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT349.json");
const systemInfoFilePathT356 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT356.json");
const systemInfoFilePathT357 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT357.json");
const systemInfoFilePathStartProgram = path.join(__dirname, "..", "..", "..", "resources", "HardwareTestDeploy", "systeminfo1.json");
const systemInfoFileextra = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "resources", "GoodProject", "systeminfo.json"));
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfo.json");
const systemInfoFilePathT60 = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT60.json");
const systemInfoFilePathT56 = path.join(__dirname, "..", "..", "..", "resources", "GoodProject", "systeminfo.json");
const systemInfoFilePathT54 = path.join(__dirname, "..", "..", "..", "resources", "GoodProject", "systeminfoT54.json");
const systemInfoFilePathKevin = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT60.json");
const systemInfoFilePathCSPT57Version1 = path.join(__dirname, "..", "..", "..", "resources", "ProjectForCSP-20", "systeminfoT57Version1.json");
const systemInfoFilePathCSPT57Version2 = path.join(__dirname, "..", "..", "..", "resources", "ProjectForCSP-20", "systeminfoT57Version2.json");
const systemInfoFilePathCSPT57Version3 = path.join(__dirname, "..", "..", "..", "resources", "ProjectForCSP-20", "systeminfoT57Version3.json");
const systemInfoFilePathCSPT57Version4 = path.join(__dirname, "..", "..", "..", "resources", "ProjectForCSP-20", "systeminfoT57Version4.json");
const invalidsystemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "NotGoodProject", "invalidsysteminfo.txt");
const systemInfoFilePathForHardware = path.join(__dirname, "..", "..", "..", "resources", "HardwareTestDeploy", "systeminfo.json");
const systemInfoFilePathForPagination = path.join(__dirname, "..", "..", "..", "resources", "HardwareTestDeploy", "systeminfotestpagination.json");
const systemInfoFilePathCSP20T53 = path.join(__dirname, "..", "..", "..", "resources", "ProjectForCSP-20", "systeminfoT53.json");
const systemInfoFilePathCSP20T52 = path.join(__dirname, "..", "..", "..", "resources", "ProjectForCSP-20", "systeminfoT52.json");
const systemInfoFilePathCSPT211 = path.join(__dirname, "..", "..", "..", "resources", "ProgramMessages", "systeminfoT211.json");
const systemInfoFilePathCSPT32 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT32.json");
const systemInfoFilePathCSPT25 = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfoT25.json");
const systemInfoFilePathCSPT275 = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275.json");
import { LogClient } from "@extron/winston-logger";
import { reject } from "q";
const logClient = new LogClient("NonHardware:e2e");

describe(`${tabTitles.NON_HARDWARE_TESTS}  Side Navigation Model Tests`, () => {
    beforeEach(async () => {
        allure.addOwner("Oybek T");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        await allure.screenshot(browser, "After");
    });

    it("NON-HardwareTest:LOGIN", async () => {
        await browser.pause(timeout.medium);
        const login = new LoginComponent(browser);
        await login.logoutBtn.loginbrowser()
            .then(async (value) => {
                await expect(value)
                    .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.warn(`${err}`);
            });
    });

    it("NON-HardwareTest:Navigation Side Panel tests for Deployment and Troubleshooting Pages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new SideNavigationComponent(browser);
            await systemDeployment.deployWindow.isVisible()
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
                                    logClient.error(err);
                                });
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-SideNav: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});


describe(`${tabTitles.NON_HARDWARE_TESTS}  Destiny Path input Field`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam. S");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });


    it("NON-HardwareTest:Verify Destiny Input field exist and Editable", async () => {
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
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS}  Browse Button`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam. S");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async (resolve) => {
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {

                console.log(err);
            });
    });


    it("NON-HardwareTest:Verify Browse button exist and clikable", async () => {
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
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS}  Deploy Button`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam. S");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async (resolve) => {
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {

                console.log(err);
            });
    });

    it("NON-HardwareTest:Verify Deploy button exist and disabled on intial launch", async () => {
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
                            logClient.error("Exception caught" + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            // });

            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-55:(Deployment Test:  Message validation)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-55: As Francisco Garcia, I want to deploy my programmed single-NIC control system so I can begin testing");
        allure.addLink("User Story: CSP-2", "https:// extron.atlassian.net/browse/CSP-2");
        allure.addLink("Task Issue: CSP-343", "https:// extron.atlassian.net/browse/CSP-343");
        allure.addLink("Test Case: CSP-T10", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T10");
        return new Promise<void>(async (resolve) => {
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
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
                    logClient.error(err);
                });
            await browser.pause(timeout.medium);
            //  checking validation message
            await systemDeployment.errorMessage.invalidFileErrorValidation(data.ValidationMessage)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err) => {
                    logClient.error(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS}deploy button `, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("Not created");
        allure.addLink("Not Created", "");
        allure.addLink("Task Issue: CSP-343", "https:// extron.atlassian.net/browse/CSP-343");
        return new Promise<void>(async (resolve) => {
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });



    it("NON-HardwareTest:check deploy got enabled and clickable after destiny file selection", async () => {
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

                                    logClient.error(err);
                                });
                        })
                        .catch((err) => {

                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);

                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });

    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} deploy button `, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("Not created");
        allure.addLink("Not Created", "");
        allure.addLink("Task Issue: CSP-343", "https:// extron.atlassian.net/browse/CSP-343");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });


    it("NON-HardwareTest:check build and upload got failed after destiny file selection with random primary ip", async () => {
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
                                    logClient.error(err);
                                });
                        })
                        .catch((err) => {
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deployFailureMsg, data.errorSeverity)
                .then(async (value: boolean) => {
                    console.log("Message returned value " + value);
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLogs");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });

    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} Kevin Button`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addLink("Not created", "");
        allure.addLink("Task Issue: CSP-343", "https:// extron.atlassian.net/browse/CSP-343");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });


    it("NON-HardwareTest:Verify Kevin button is disabled on intial launch", async () => {
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
});
describe(`${tabTitles.NON_HARDWARE_TESTS} Kevin Button`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addLink("Not created", "");
        allure.addLink("Task Issue: CSP-343", "https:// extron.atlassian.net/browse/CSP-343");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });


    it("NON-HardwareTest:Verify Kevin button is disabled after invalid format destiny file selection", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(invalidsystemInfoFilePath)
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await browser.pause(timeout.medium);
            // checking validation message
            await systemDeployment.errorMessage.invalidFileErrorValidation(data.ValidationMessage)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err) => {
                    logClient.error(err);
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
});
describe(`${tabTitles.NON_HARDWARE_TESTS} Kevin Button`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addLink("Not created", "");
        allure.addLink("Task Issue: CSP-343", "https:// extron.atlassian.net/browse/CSP-343");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });


    it("NON-HardwareTest:Verify Kevin button is enabled and clickable after valid format destiny file selection", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForHardware)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
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
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} Kevin window`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.addLink("Not created", "");
        allure.addLink("Task Issue: CSP-343", "https:// extron.atlassian.net/browse/CSP-343");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });


    it("NON-HardwareTest:Verify Kevin click opens kevin settings window and validate window, after valid format destiny file selection", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending invalid file name, to make sure it except only json files
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForHardware)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
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
                    logClient.error("Exception caught: " + `${err}`);

                });
            await browser.pause(timeout.medium);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(7);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            // verify table should have Device name, Address,Username and password coloumn
            await userSettings.deviceNameCol.verifyDeviceNameColumnExist()
                .then(async (isDeviceNameColumnExist) => {
                    await expect(isDeviceNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await userSettings.IPaddressCol.verifyIpAddressColumnExist()
                .then(async (isIpAddressColumnExist) => {
                    await expect(isIpAddressColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await userSettings.userNameCol.verifyUserNameColumnExist()
                .then(async (isUserNameColumnExist) => {
                    await expect(isUserNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await userSettings.passwordCol.verifyPasswordColumnExist()
                .then(async (isPasswordColumnExist) => {
                    await expect(isPasswordColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await userSettings.credsCloseButton.isVisible()
                .then(async (isCredentialCloseButtonVisible) => {
                    await expect(isCredentialCloseButtonVisible)
                        .toBe(true);
                    await userSettings.credsCloseButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-47:(Deploy component: "Kevin Settings" )`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-20: As Francisco, I want to enter my credentials for the Destiny file so that I can deploy my system");
        allure.addLink("User Story: CSP-20", "https:// extron.atlassian.net/browse/CSP-20");
        allure.addLink("Task Issue: CSP-47", "https:// extron.atlassian.net/browse/CSP-47");
        allure.addLink("Test Case: CSP-T52", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/2906128");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that devices having credentials in destiny are not editable in Kevin Settings", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending valid destiny file path
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSP20T52)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
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
                    logClient.error(err);
                });
            await browser.pause(timeout.medium);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(data.kevinEntriesCount);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            // verify table should have Device name, Address,Username and password coloumn
            await userSettings.deviceNameCol.verifyDeviceNameColumnExist()
                .then(async (isDeviceNameColumnExist) => {
                    await expect(isDeviceNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);

                });
            await userSettings.IPaddressCol.verifyIpAddressColumnExist()
                .then(async (isIpAddressColumnExist) => {
                    await expect(isIpAddressColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);

                });
            await userSettings.userNameCol.verifyUserNameColumnExist()
                .then(async (isUserNameColumnExist) => {
                    await expect(isUserNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);

                });
            await userSettings.passwordCol.verifyPasswordColumnExist()
                .then(async (isPasswordColumnExist) => {
                    await expect(isPasswordColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);

                });
            // verify that Primary,secondary and TLP"s entries should be visible and intended
            // primary user name value
            await userSettings.usernameRow1.verifyPrimaryUserNameValueIsVisible()
                .then(async (isPrimaryUserNameValueExist) => {
                    await expect(isPrimaryUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);

                });
            // primary password value
            await userSettings.passwordRow1.verifyPrimaryPasswordValueIsVisible()
                .then(async (isPrimaryPasswordValueExist) => {
                    await expect(isPrimaryPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            // secondary user name value
            await userSettings.usernameRow2.verifySecondaryUserNameValueIsVisible()
                .then(async (isSecondaryUserNameValueExist) => {
                    await expect(isSecondaryUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            // secondary password value
            await userSettings.passwordRow2.verifySecondaryPasswordValueIsVisible()
                .then(async (isSecondaryPasswordValueExist) => {
                    await expect(isSecondaryPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);

                });
            // tlp user name value
            await userSettings.usernameRow3.verifyEmptyTlpUserNameValueIsVisible()
                .then(async (isTlpEmptyUserNameValueExist) => {
                    await expect(isTlpEmptyUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            // tlp password value
            await userSettings.passwordRow3.verifyEmptyTlpPasswordValueIsVisible()
                .then(async (isTlpEmptyPasswordValueExist) => {
                    await expect(isTlpEmptyPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
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
                    logClient.error(err);

                });

            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-47:(Deploy component: "Kevin Settings" )`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-20: As Francisco, I want to enter my credentials for the Destiny file so that I can deploy my system");
        allure.addLink("User Story: CSP-20", "https:// extron.atlassian.net/browse/CSP-20");
        allure.addLink("Task Issue: CSP-47", "https:// extron.atlassian.net/browse/CSP-75");
        allure.addLink("Test Case: CSP-T53", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T53");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error("Exception caught: " + `${err}`);

            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that devices missing credentials in destiny are editable in Kevin Settings", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending valid destiny file path
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSP20T53)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
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
                    logClient.error("Exception caught: " + `${err}`);
                });

            await browser.pause(timeout.fast);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(data.kevinEntriesCount);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            // verify table should have Device name, Address,Username and password coloumn
            await userSettings.deviceNameCol.verifyDeviceNameColumnExist()
                .then(async (isDeviceNameColumnExist) => {
                    await expect(isDeviceNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await userSettings.IPaddressCol.verifyIpAddressColumnExist()
                .then(async (isIpAddressColumnExist) => {
                    await expect(isIpAddressColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await userSettings.userNameCol.verifyUserNameColumnExist()
                .then(async (isUserNameColumnExist) => {
                    await expect(isUserNameColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await userSettings.passwordCol.verifyPasswordColumnExist()
                .then(async (isPasswordColumnExist) => {
                    await expect(isPasswordColumnExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            //  verify that Primary,secondary and TLP"s entries should be visible and intended
            //  primary user name value edit
            await userSettings.usernameRow1.verifyEmptyPrimaryUserNameIsVisibleAndEditable(data.primaryUserName)
                .then(async (isPrimaryUserNameEmptyAndEditable) => {
                    await expect(isPrimaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            // primary password value
            await userSettings.passwordRow1.verifyPrimaryPasswordValueIsVisible()
                .then(async (isPrimaryPasswordValueExist) => {
                    await expect(isPrimaryPasswordValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            // secondary user name value edit
            await userSettings.usernameRow2.verifyEmptySecondaryUserNameIsVisibleAndEditable(data.secondaryUserName)
                .then(async (isSecondaryUserNameEmptyAndEditable) => {
                    await expect(isSecondaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            //  secondary password value
            await userSettings.passwordRow2.verifyEmptySecondaryPasswordIsVisibleAndEditable(data.secondaryPassword)
                .then(async (isSecondaryPasswordEmptyAndEditable) => {
                    await expect(isSecondaryPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            // tlp user name value
            await userSettings.usernameRow3.verifyTlpUserNameValueIsVisible()
                .then(async (isTlpUserNameValueExist) => {
                    await expect(isTlpUserNameValueExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            // tlp password missing and editable
            await userSettings.passwordRow3.verifyEmptyTlpPasswordIsVisibleAndEditable(data.tlpPassword)
                .then(async (isTlpPasswordEmptyAndEditable) => {
                    await expect(isTlpPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            // navigate back to deploy window by clicking on close button
            userSettings.credsCloseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.medium);
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-343: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-191:(Deploy component: Kevin settings)`, () => {
    beforeEach(async () => {
        allure.addOwner("Pushpita Patil");
        allure.story("CSP-20: As Francisco, I want to enter my credentials for the Destiny file so that I can deploy my system");
        allure.addLink("User Story: CSP-20", "https:// extron.atlassian.net/browse/CSP-20");
        allure.addLink("Task Issue: CSP-191", "https:// extron.atlassian.net/browse/CSP-191");
        allure.addLink("Test Case: CSP-T54", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T54");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);

            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that credentials are saved on losing focus", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            //  Select the system
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT54)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
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
                    logClient.error(err);
                });
            //  Enter partial creds
            // username for alpha
            await userSettings.usernameRow1.verifyEmptyPrimaryUserNameIsVisibleAndEditable(data.primaryUserName)
                .then(async (isPrimaryUserNameEmptyAndEditable) => {
                    await expect(isPrimaryUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            // password for tlp
            await userSettings.passwordRow3.verifyEmptyTlpPasswordIsVisibleAndEditable(data.tlpPassword)
                .then(async (isTlpPasswordEmptyAndEditable) => {
                    await expect(isTlpPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            //  Close on Kevin settings close button
            await userSettings.credsCloseButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
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
                    logClient.error(err);
                });
            // password for alpha
            await systemDeployment.missingPrimaryPassword.verifyEmptyPrimaryPasswordIsVisibleAndEditable(data.primaryPassword)
                .then(async (isPrimaryPasswordEmptyAndEditable) => {
                    await expect(isPrimaryPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            // username for tlp
            await systemDeployment.missingTlpUserName.verifyEmptyTlpUserNameIsVisibleAndEditable(data.tlpUserName)
                .then(async (isTlpUserNameEmptyAndEditable) => {
                    await expect(isTlpUserNameEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            // password for tlp
            await systemDeployment.missingTlpPassword.verifyEmptyTlpPasswordIsVisibleAndEditable(data.tlpPassword)
                .then(async (isTlpPasswordEmptyAndEditable) => {
                    await expect(isTlpPasswordEmptyAndEditable)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            // Close Kevin Window and deploy the system
            await systemDeployment.closeKevinButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("closeKevinButton: " + `${err}`);
                });
            await browser.pause(timeout.fast);
            // verify deploy button is displayed
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);

                });
            resolve();
        })
            .catch((err: Error) => {
                logClient.error("CSP-191: Exception Error: " + `${err}`);
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS}  kevin table pagination`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that Pagination is occurring correctly ", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            // sending valid destiny file path
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForPagination)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
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
                    logClient.error(err);
                });
            await browser.pause(timeout.slow);
            await userSettings.credsTable.verifyTableLength()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(data.maxRowKevinTable);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await userSettings.secondPage.click()
                .then(async () => {
                    await userSettings.previousPage.checkElementPresent()
                        .then(async (value) => {
                            await expect(value)
                                .toEqual(true);
                            await browser.pause(timeout.slow);
                            await userSettings.credsTable.verifyTableLength()
                                .then(async (value1) => {
                                    await expect(value1)
                                        .toEqual(data.nextPageRowCount);
                                })
                                .catch((err: Error) => {
                                    logClient.error(err);
                                });
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                        });
                })
                .catch((err) => {
                    logClient.error(err);
                });
            await userSettings.defaultPage.checkElementPresent()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await userSettings.secondPage.checkElementPresent()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await userSettings.nextPage.checkElementPresent()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await userSettings.lastPage.checkElementPresent()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await userSettings.leftPage.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                    await userSettings.credsTable.verifyTableLength()
                        .then(async (value) => {
                            await expect(value)
                                .toEqual(data.maxRowKevinTable);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await userSettings.rightPage.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                    await userSettings.credsTable.verifyTableLength()
                        .then(async (value) => {
                            await expect(value)
                                .toEqual(data.nextPageRowCount);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await userSettings.stepForward.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                    await userSettings.credsTable.verifyTableLength()
                        .then(async (value) => {
                            await expect(value)
                                .toEqual(data.nextPageRowCount);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            await userSettings.stepBackward.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
                    await userSettings.credsTable.verifyTableLength()
                        .then(async (value) => {
                            await expect(value)

                                .toEqual(data.maxRowKevinTable);

                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-SideNav: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-192:(Deploy component: Kevin settings)`, () => {
    beforeEach(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("CSP-20: As Francisco, I want to enter my credentials for the Destiny file so that I can deploy my system");
        allure.addLink("User Story: CSP-20", "https:// extron.atlassian.net/browse/CSP-20");
        allure.addLink("Task Issue: CSP-192", "https:// extron.atlassian.net/browse/CSP-192");
        allure.addLink("Test Case: CSP-T55", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T55");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that browserropriate devices -eBUS- do not show up in Kevin Settings", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const troubleshooting = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT55)
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
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
                        })
                        .catch((err) => {
                            logClient.error(err);
                        })
                        .catch((err) => {
                            logClient.error(err);
                        })
                        ;
                    await browser.pause(timeout.medium);
                    // navigate back to deploy window by clicking on close button
                    await systemDeployment.closeKevinButton.click()
                        .then(async () => {
                            await browser.pause(timeout.slow);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                        });
                    resolve();
                })
                .catch((err) => {
                    console.log("CSP-SideNav: Exception Error: " + `${err}`);
                    return Promise.resolve(err + "Should have thrown");
                });
        });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-195:(Deploy component)`, () => {
    beforeEach(async () => {
        allure.addOwner("Pushpita Patil");
        allure.story("CSP-20: As Francisco, I want to enter my credentials for the Destiny file so that I can deploy my system");
        allure.addLink("User Story: CSP-20", "https:// extron.atlassian.net/browse/CSP-20");
        allure.addLink("Task Issue: CSP-195", "https:// extron.atlassian.net/browse/CSP-195");
        allure.addLink("Test Case: CSP-T60", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T60");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                logClient.error(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that Kevin Settings is prompted for browserropriate devices", async () => {
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
                    logClient.error(err);
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
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
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
                    logClient.error(err);
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
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
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
            await systemDeployment.closeKevinButton.click()
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
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-291:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Jessica S");
        allure.story("CSP-211: system.primary_device_alias ");
        allure.addLink("User Story: CSP-212", "https:// extron.atlassian.net/browse/CSP-212");
        allure.addLink("Task Issue: CSP-291", "https:// extron.atlassian.net/browse/CSP-291");
        allure.addLink("Test Case: CSP-T72", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T72");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that absence of system.author in destiny gives browserropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT72);
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
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingAuthorMessage, data.warningSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-291: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-291:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Jessica S");
        allure.story("CSP-291: system.author ");
        allure.addLink("User Story: CSP-212", "https:// extron.atlassian.net/browse/CSP-212");
        allure.addLink("Task Issue: CSP-291", "https:// extron.atlassian.net/browse/CSP-291");
        allure.addLink("Test Case: CSP-T73", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T73");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before"); resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that invalid system.author in destiny gives browserropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT73);
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
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.malformedAuthorMessage, data.warningSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-293: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-292:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-211: system.primary_device_alias ");
        allure.addLink("User Story: CSP-211", "https:// extron.atlassian.net/browse/CSP-211");
        allure.addLink("Task Issue: CSP-292", "https:// extron.atlassian.net/browse/CSP-292");
        allure.addLink("Test Case: CSP-T128", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T128");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that absence of system.primary_device_alias in destiny gives browserropriate error message", async () => {
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
                            logClient.error("Exception caught in VerifyMessageLogs: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught in VerifyMessageLogs: " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-293:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-211: system.primary_device_alias ");
        allure.addLink("User Story: CSP-211", "https:// extron.atlassian.net/browse/CSP-211");
        allure.addLink("Task Issue: CSP-293", "https:// extron.atlassian.net/browse/CSP-293");
        allure.addLink("Test Case: CSP-T130", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T130");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that invalid system.primary_device_alias in destiny gives browserropriate error message", async () => {
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
                            logClient.error("Exception caught in VerifyMessageLogs: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught in VerifyMessageLogs: " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-293:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-211: system.primary_device_alias ");
        allure.addLink("User Story: CSP-211", "https:// extron.atlassian.net/browse/CSP-211");
        allure.addLink("Task Issue: CSP-293", "https:// extron.atlassian.net/browse/CSP-293");
        allure.addLink("Test Case: CSP-T367", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T367");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that non existent system.primary_device_alias in destiny gives browserropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT367);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.invalidAliasMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)

                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-293: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-293:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-211: system.primary_device_alias ");
        allure.addLink("User Story: CSP-211", "https:// extron.atlassian.net/browse/CSP-211");
        allure.addLink("Task Issue: CSP-293", "https:// extron.atlassian.net/browse/CSP-293");
        allure.addLink("Test Case: CSP-T370", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T370");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that a system.primary_device_alias which refers to a TLP gives browserropriate error message", async () => {
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
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-293: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-331:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-210: system.sound_folder_path ");
        allure.addLink("User Story: CSP-210", "https:// extron.atlassian.net/browse/CSP-210");
        allure.addLink("Task Issue: CSP-331", "https:// extron.atlassian.net/browse/CSP-331");
        allure.addLink("Test Case: CSP-T124", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T124");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that missing keys for system folder(sound_folder_path) give browserropriate Info message", async () => {
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
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingSoundFolder, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-331: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-331:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-210: system.sound_folder_path ");
        allure.addLink("User Story: CSP-210", "https:// extron.atlassian.net/browse/CSP-210");
        allure.addLink("Task Issue: CSP-331", "https:// extron.atlassian.net/browse/CSP-331");
        allure.addLink("Test Case: CSP-T125", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T125");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that invalid file path for system folder(sound_folder_path) gives browserropriate warning messages", async () => {
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
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-331: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-332:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-209: system.irfile_folder_path  ");
        allure.addLink("User Story: CSP-209", "https:// extron.atlassian.net/browse/CSP-209");
        allure.addLink("Task Issue: CSP-332", "https:// extron.atlassian.net/browse/CSP-332");
        allure.addLink("Test Case: CSP-T361", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T361");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that missing keys for system.irfile_folder_path give browserropriate error messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT361);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            await browser.pause(timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingIrFolder, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught in checkMessagePaneLogs: " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-332: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-332:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-209: system.sound_folder_path ");
        allure.addLink("User Story: CSP-209", "https:// extron.atlassian.net/browse/CSP-209");
        allure.addLink("Task Issue: CSP-332", "https:// extron.atlassian.net/browse/CSP-332");
        allure.addLink("Test Case: CSP-T362", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T362");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that invalid file path for system.irfile_folder_path gives browserropriate error messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT362);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(2 * timeout.slow);
                    await messageComponent.messageRowValue.checkMessagePaneLogs(data.invalidIrFolderPath, data.warningSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toEqual(true);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-332: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-337:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-206: system.code_entry_file ");
        allure.addLink("User Story: CSP-206", "https:// extron.atlassian.net/browse/CSP-206");
        allure.addLink("Task Issue: CSP-337", "https:// extron.atlassian.net/browse/CSP-337");
        allure.addLink("Test Case: CSP-T349", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T349");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that code_entry_file being not a python file gives browserropriate error messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT349);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.invalidCodeEntryFile, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-337: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-338:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-205: system.code_folder_path ");
        allure.addLink("User Story: CSP-205", "https:// extron.atlassian.net/browse/CSP-205");
        allure.addLink("Task Issue: CSP-338", "https:// extron.atlassian.net/browse/CSP-338");
        allure.addLink("Test Case: CSP-T356", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T356");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that missing key for system folder (code_folder_path) gives browserropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathT356);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click();
            await browser.pause(2 * timeout.slow);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.missingCodeFolder, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)

                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-338: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-338:(Deployment Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-205:  system.code_folder_path ");
        allure.addLink("User Story: CSP-205", "https:// extron.atlassian.net/browse/CSP-205");
        allure.addLink("Task Issue: CSP-338", "https:// extron.atlassian.net/browse/CSP-338");
        allure.addLink("Test Case: CSP-T357", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T125");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that invalid file path for system folder (code_folder_path) gives browserropriate error messages", async () => {
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
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-338: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} User Story: CSP-178", "As FG, I want to know why I am not able to connect to the device to start trace so that I can fix the issue`, () => {
    beforeEach(async () => {
        allure.addOwner("Amit B");
        allure.story("User Story: CSP-120: As FG, I want to know why I am not able to connect to the device to start trace so that I can fix the issue");
        allure.addLink("User Story: CSP-120", "As FG, I want to know why I am not able to connect to the device to start trace so that I can fix the issue");
        allure.addLink("Task Issue: CSP-178", "https:// extron.atlassian.net/browse/CSP-178");
        allure.addLink("Test Case: CSP-T214", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T214");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify there is messages tab got added inside deployment and troubleshoot space.", async () => {

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
                            logClient.error("Exception caught: Message Pane Visible " + `${err}`);

                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: OpenMessage Pane Button Visible" + `${err}`);

                });
            //  }).catch((err: Error) => {
            //    logClient.error("Exception caught: Message Tab Visible"+ `${err}`);
            //
            //    });
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
                                    logClient.error("Exception caught" + `${err}`);
                                    //fail("checkMessagePaneLog");
                                });
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: Pane Visible " + `${err}`);

                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Open Message Button " + `${err}`);

                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-178: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-199:(Troubleshooting Test: message pane state validation in deployment view)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-141: As Francisco Garcia, I want to see all of my run-time messages in one place so that I can get to those information quickly ");
        allure.addLink("User Story: CSP-141", "https:// extron.atlassian.net/browse/CSP-141");
        allure.addLink("Task Issue: CSP-199", "https:// extron.atlassian.net/browse/CSP-199");
        allure.addLink("Test Case: CSP-T238", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T238");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify By default messages pane should be open and empty on initial session launch and only within the Deploy View.", async () => {
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
                    logClient.error("Exception caught" + `${err}`);

                });
            // checking deploy view, and message pane should be visible
            await messageComponent.messagePaneVisible.messagePaneIsVisible()
                .then(async (messagePaneExist) => {
                    await expect(messagePaneExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);

                });
            // checking table should not have any rows
            await messageComponent.messageTable.tableContents()
                .then(async (isMessageEntryExist) => {
                    await expect(isMessageEntryExist.length)
                        .toBe(0);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Pane Visible " + `${err}`);

                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-199: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });

});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-199:(Troubleshooting Test: message pane state validation in troubleshooting view)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-141: As Francisco Garcia, I want to see all of my run-time messages in one place so that I can get to those information quickly ");
        allure.addLink("User Story: CSP-141", "https:// extron.atlassian.net/browse/CSP-141");
        allure.addLink("Task Issue: CSP-199", "https:// extron.atlassian.net/browse/CSP-199");
        allure.addLink("Test Case: CSP-T284", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T284");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify that message pane is hidden & empty by default when navigated to Troubleshooting view", async () => {
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
                    logClient.error("Exception caught" + `${err}`);

                });

            // checking deploy view, and message pane should be visible
            await messageComponent.messagePaneVisible.messagePaneIsVisible()
                .then(async (messagePaneExist) => {
                    await expect(messagePaneExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            // checking table should not have any rows
            await messageComponent.messageTable.tableContents()
                .then(async (isMessageEntryExist) => {
                    await expect(isMessageEntryExist.length)
                        .toBe(0);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.slow);
            // message pane should not be visible
            await messageComponent.messagePaneHidden.messagePaneIsHidden()
                .then(async (isMessagePaneHidden) => {
                    await expect(isMessagePaneHidden)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);

                });
            // open message pane
            await messageComponent.openMessagePaneButton.click();
            await browser.pause(timeout.medium);
            // message pane should  be visible
            await messageComponent.messagePaneVisible.messagePaneIsVisible()
                .then(async (messagePaneExist) => {
                    await expect(messagePaneExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);

                });
            // checking table should not have any rows
            await messageComponent.messageTable.tableContents()
                .then(async (isMessageEntryExist) => {
                    await expect(isMessageEntryExist.length)
                        .toBe(0);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            // close message pane
            await messageComponent.closeMessagePaneButton.exists()
                .then(async (closeMessageButtonExist) => {
                    await expect(closeMessageButtonExist)
                        .toBe(true);
                    await messageComponent.closeMessagePaneButton.click();
                    await browser.pause(timeout.medium);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            // message pane should not be visible
            await messageComponent.messagePaneHidden.messagePaneIsHidden()
                .then(async (isMessagePaneHidden) => {
                    await expect(isMessagePaneHidden)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-199: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} CSP-203:(Message Table : Verifying the columns`, () => {
    beforeEach(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("CSP-141: As Francisco Garcia, I want to see all of my run-time messages in one place so that I can get to those information quickly");
        allure.addLink("User Story: CSP-141", "https:// extron.atlassian.net/browse/CSP-141");
        allure.addLink("Task Issue: CSP-203", "https:// extron.atlassian.net/browse/CSP-203");
        allure.addLink("Test Case: CSP-T291", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/3187637");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify Message pane should have Timestamp,Severity and Messages columns", async () => {
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
                    logClient.error("Exception caught:  Time Column Exists" + `${err}`);

                });
            await messagePane.messageTable.checkColumnExists(data.SeverityColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Severity Column Exists" + `${err}`);
                });
            await messagePane.messageTable.checkColumnExists(data.MessageColumn)
                .then(async (value) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Message Column Exists " + `${err}`);

                });
            resolve();
        })
            .catch((err) => {
                console.log("CSP-203: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });

    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS}  start program button`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam. S");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {

                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify start program button exist and  clickable", async () => {
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
                    logClient.error("Exception caught" + `${err}`);
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
                            //fail("failed at stop programbuttonclick");
                        });
                    // });
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    //fail("failed at click startprogrambutton");
                });
            resolve();
        })
            .catch((err) => {
                console.log("start Program Button: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS}  trace title and buttons`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam. S");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {

                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify Trace title and start/clear trace button exist", async () => {
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
                    logClient.error("Exception caught: Deploy Button Present" + `${err}`);
                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            await traceComponent.traceTextTitle.checktraceControls(data.traceTitle)
                .then(async (traceTitleExist) => {
                    await expect(traceTitleExist)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: start Trace Button " + `${err}`);
                });
            await traceComponent.startTraceButton.isVisible()
                .then(async (startTraceVisible) => {
                    await expect(startTraceVisible)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: start Trace Button " + `${err}`);
                });
            await traceComponent.clearTraceButton.isVisible()
                .then(async (clearTraceVisible) => {
                    await expect(clearTraceVisible)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: clear Trace Button " + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("Trace Buttons: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS}  Program Log Title, Refresh and Clear Button`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam. S");
        allure.story("Not Created");
        allure.addLink("Not Created", "");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {

                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify Program Log Title, Refresh and clear button exist", async () => {
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
                    logClient.error("Exception caught: Deploy Button Present" + `${err}`);

                });
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.medium);
            await systemTroubleshooting.programLogText.isVisible()
                .then(async (ProgramLogTitleExist) => {
                    await expect(ProgramLogTitleExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: programLogText" + `${err}`);
                });
            await systemTroubleshooting.programLogText.checkProgramLogTitle(data.ProgramLogTitle)
                .then(async (IsProgramLogTitleExist) => {
                    await expect(IsProgramLogTitleExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: programLogText" + `${err}`);
                });
            await systemTroubleshooting.programLogRefreshButton.exists()
                .then(async (refreshProgramLogExist) => {
                    await expect(refreshProgramLogExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Refresh Button Present" + `${err}`);

                });

            await systemTroubleshooting.clearProgramLogButton.exists()
                .then(async (clearProgramLogExist) => {
                    await expect(clearProgramLogExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: clear Button Present" + `${err}`);

                });

            resolve();
        })
            .catch((err) => {
                console.log("Trace Buttons: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} Trace Table : Verifying the columns`, () => {

    beforeEach(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-25:As Francisco, I want to see the triggered events in trace, so I know what is going on with my system");
        allure.addLink("User Story: CSP-25", "https:// extron.atlassian.net/browse/CSP-25");
        allure.addLink("Task Issue: CSP-343", "https:// extron.atlassian.net/browse/CSP-343");
        allure.addLink("Test Case: CSP-T43", "https:// extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T43");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify Trace table should have IPAddress,Time and Messages columns", async () => {
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
                    logClient.error(
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
                    logClient.error(
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
                    logClient.error(
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
                    logClient.error(
                        "Exception caught:  message Column Exists" + `${err}`
                    );
                });

            resolve();
        })
            .catch((err) => {
                console.log("CSP-203: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} TOOL-03:(Title Bar: Suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Oybek T");
        allure.story("TOOL-03");
        allure.addLink("TOOL-03", "https:// extron.atlassian.net/browse/TOOL-3");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Tool-8: Minimize Button", async () => {
        return new Promise<void>(async (resolve) => {
            const titleBar = new TitleBarMenu(browser);
            await titleBar.minimizeButton.getText()
                .then(async (text) => {
                    await expect(text)
                        .toEqual(data.minimizeBtnText);
                    await titleBar.minimizeButton.click();
                });
            resolve();
        })
            .catch((err) => {
                console.log("Tool-08: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} TOOL-03:(Title Bar: Suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Oybek T");
        allure.story("TOOL-03");
        allure.addLink("TOOL-03", "https:// extron.atlassian.net/browse/TOOL-3");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });
    it("NON-HardwareTest:Tool-9: Maximize Button", async () => {
        return new Promise<void>(async (resolve) => {
            const titleBar = new TitleBarMenu(browser);
            await titleBar.maximizeButton.getText()
                .then(async (text) => {
                    await expect(text)
                        .toEqual(data.maximizeBtnText);
                    await titleBar.maximizeButton.click();
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("maxmizeButtonText");
                });
            resolve();
        })
            .catch((err) => {
                console.log("Tool-09: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} TOOL-03:(Title Bar: Suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Oybek T");
        allure.story("TOOL-03");
        allure.addLink("TOOL-03", "https:// extron.atlassian.net/browse/TOOL-3");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });
    it("NON-HardwareTest:TOOl-10: Close Button", async () => {
        return new Promise<void>(async (resolve) => {
            const titleBar = new TitleBarMenu(browser);
            await expect(await titleBar.closeButton.exists())
                .toBe(true);
            await titleBar.closeButton.getAttribute("[id='closeBtn']", "ng-reflect-message")
                .then(async (text) => {
                    await expect(text)
                        .toEqual(data.closeBtnText);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("closeButtonAttribute");
                });
            await titleBar.closeButton.click();
            resolve();
        })
            .catch((err) => {
                console.log("Tool-10: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});

describe(`${tabTitles.NON_HARDWARE_TESTS} Title validation : Suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("Not created");
        allure.addLink("not created", "not created");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:Verify browser Title", async () => {
        return new Promise<void>(async (resolve) => {
            const titleBar = new TitleBarMenu(browser);
            await titleBar.titleBar.getText()
                .then(async (text) => {
                    await expect(text)

                        .toEqual(data.title);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err) => {
                console.log("Title: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});
describe(`${tabTitles.NON_HARDWARE_TESTS} LOGOUT)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("LOGOUT");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                console.log(err);
            });
    });

    afterEach(async () => {
        if (browser && browser.isRunning()) {
            await allure.screenshot(browser, "After");
        }
        await common.stopbrowser(browser);
    });

    it("NON-HardwareTest:LOGOUT", async () => {
        return new Promise<void>(async (resolve) => {
            const login = new LoginComponent(browser);
            //  Loging out from the browserlication
            await login.logoutBtn.performLogout()

                .then(async (value) => {
                    await expect(value)

                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                    //fail("Failed performLogout");
                });
            resolve();
        })
            .catch((err: Error) => {
                logClient.error(`${err}`);
            });
    });
});
