// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { browser } from "@wdio/globals";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { TroubleshootingPage } from "../../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { CommonMethods } from "../../commonMethods.po";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "locators.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2854");

/**
 * @Author `Austin L. - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-1573`
 * @Description `Troubleshooting Bad Scenarios - Invalid Credentials`
 * @Date `08/02/2021`
 */


describe.skip(`TOOL-2845:(Troubleshooting Bad Scenarios - Invalid Credentials: TOOL-T4017)`, () => {
    beforeEach(async () => {
        allure.addOwner("Austin L");
        allure.story("TOOL-1573: Troubleshooting Bad Scenarios - Invalid Credentials");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1573", "User Story: TOOL-1573");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2845", "Task Issue: TOOL-2845");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T4017", "Test Case: TOOL-T4017");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    it("Verify there should be no message in message pane for missing primary devices.password key and connection manger should be prompted.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const startStopProgram = new StartStopProgramComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            const credsComponent = new CredsComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            await browser.pause(timeout.fast);
            const a = path.resolve(systemInfoFileTemp);
            let systemInfo = fs.readJsonSync(a);
            delete systemInfo.devices[0].password;
            await fs.writeJsonSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });

            // navigate to troubleshooting window
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);

            // helper function to select trace, start program, and program log when there is an invalid systeminfo file
            async function checkTroubleshootButtonsWithInvalidSetup() {
                // select start trace. verify that connection manager browserears
                await traceComponent.startTraceButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(true);
                                await credsComponent.credsCloseButton.click();
                            })
                            .catch((err: Error) => {
                                logClient.error("Excpetion caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on start trace button click: " + `${err}`);
                    });
                await browser.pause(timeout.fast);

                // select start program. verify that connection manager browserears
                await startStopProgram.startProgramButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(true);
                                await credsComponent.credsCloseButton.click();
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on start program button click: " + `${err}`);
                    });
                await browser.pause(timeout.fast);

                // select program log refresh. verify that connection manager browserears
                await programLog.programLogRefreshButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(true);
                                await credsComponent.credsCloseButton.click();
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on program log button click: " + `${err}`);
                    });
                await browser.pause(timeout.fast);
            }

            // helper function to select trace, start program, and program log when there is a valid systeminfo file
            async function checkTroubleshootButtonsWithValidSetup() {
                // select start trace. verify that connection manager doesn't browserear
                await traceComponent.startTraceButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on start trace button click: " + `${err}`);
                    });

                // select start program. verify that connection manager doesn't browserear
                await startStopProgram.startProgramButton.click()
                    .then(async () => {
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on start program button click: " + `${err}`);
                    });

                // select program log refresh. verify that connection manager doesn't browserear
                await programLog.programLogRefreshButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on program log button click: " + `${err}`);
                    });
            }

            // check that connection manager browserears with invalid setup
            await checkTroubleshootButtonsWithInvalidSetup();
            // check that connection manager browserears with invalid setup second time
            await checkTroubleshootButtonsWithInvalidSetup();

            // open connection manager. add password
            await traceComponent.startTraceButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    await credsComponent.credsComponent.isVisible()
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await credsComponent.passwordCol.verifyEmptyPrimaryPasswordIsVisibleAndEditable3(data.primaryPassword)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught while setting password: " + `${err}`);
                            //fail("verifyEmptyPrimaryPasswordIsVisibleAndEditable3")
                        });
                    await credsComponent.saveConnectionManagerButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught on start trace button click: " + `${err}`);
                });

            // check connection manager doesn't browserear with valid setup
            await checkTroubleshootButtonsWithValidSetup();

            // delete password in connection manager and select a destiny file with a valid password field
            await sideNav.deployWindow.click();
            await browser.pause(timeout.fast);
            await systemDeployment.userSettingsButtonEnable.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught clicking project connection: " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await credsComponent.credsComponent.isVisible()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    await browser.elementClear(locators.primaryPasswordEditField);
                    await browser.pause(timeout.fast);
                    await browser.$(locators.primaryPasswordEditField).getText()
                        .then(async (value: string) => {
                            expect(value)
                                .toBe("");
                            await credsComponent.saveConnectionManagerButton.click();
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught while deleting password: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });

            systemInfo.devices[0].password = "extron";
            await fs.writeJsonSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);

            // check connection manager doesn't browserear with valid setup
            await checkTroubleshootButtonsWithValidSetup();

            // check message logs
            await messageComponent.openMessagePaneButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.incorrectCredentials, data.errorSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toBe(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.incorrectCredentials, data.warningSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toBe(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                });
            resolve();
        });
    });
});

describe.skip(`TOOL-2845:(Troubleshooting Bad Scenarios - Invalid Credentials: TOOL-T2890)`, () => {
    beforeEach(async () => {
        allure.addOwner("Austin L");
        allure.story("TOOL-1573: Troubleshooting Bad Scenarios - Invalid Credentials");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1573", "User Story: TOOL-1573");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2845", "Task Issue: TOOL-2845");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2890", "Test Case: TOOL-T2890");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify there should be no message in message pane for missing primary devices.username key and connection manger should be prompted.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const startStopProgram = new StartStopProgramComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            const credsComponent = new CredsComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            await browser.pause(timeout.fast);
            const a = path.resolve(systemInfoFileTemp);
            let systemInfo = fs.readJsonSync(a);
            delete systemInfo.devices[0].username;
            await fs.writeJsonSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.isEnabled()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    
                });

            // navigate to troubleshooting window
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);

            // helper function to select trace, start program, and program log when there is an invalid systeminfo file
            async function checkTroubleshootButtonsWithInvalidSetup() {
                // select start trace. verify that connection manager browserears
                await traceComponent.startTraceButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(true);
                                await credsComponent.credsCloseButton.click();
                            })
                            .catch((err: Error) => {
                                logClient.error("Excpetion caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on start trace button click: " + `${err}`);
                    });
                await browser.pause(timeout.fast);

                // select start program. verify that connection manager browserears
                await startStopProgram.startProgramButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(true);
                                await credsComponent.credsCloseButton.click();
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on start program button click: " + `${err}`);
                    });
                await browser.pause(timeout.fast);

                // select program log refresh. verify that connection manager browserears
                await programLog.programLogRefreshButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(true);
                                await credsComponent.credsCloseButton.click();
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on program log button click: " + `${err}`);
                    });
                await browser.pause(timeout.fast);
            }

            // helper function to select trace, start program, and program log when there is a valid systeminfo file
            async function checkTroubleshootButtonsWithValidSetup() {
                // select start trace. verify that connection manager doesn't browserear
                await traceComponent.startTraceButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on start trace button click: " + `${err}`);
                    });

                // select start program. verify that connection manager doesn't browserear
                await startStopProgram.startProgramButton.click()
                    .then(async () => {
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on start program button click: " + `${err}`);
                    });

                // select program log refresh. verify that connection manager doesn't browserear
                await programLog.programLogRefreshButton.click()
                    .then(async () => {
                        await browser.pause(timeout.fast);
                        await credsComponent.credsComponent.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught on program log button click: " + `${err}`);
                    });
            }

            // check that connection manager browserears with invalid setup
            await checkTroubleshootButtonsWithInvalidSetup();
            // check that connection manager browserears with invalid setup second time
            await checkTroubleshootButtonsWithInvalidSetup();

            // open connection manager. add password
            await traceComponent.startTraceButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    await credsComponent.credsComponent.isVisible()
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await credsComponent.userNameCol.verifyEmptyPrimaryUserNameIsVisibleAndEditable(data.primaryUserName)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught while setting username: " + `${err}`);
                            //fail("verifyEmptyPrimaryUserNameIsVisibleAndEditable")
                        });
                    await credsComponent.saveConnectionManagerButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught on start trace button click: " + `${err}`);
                });

            // check connection manager doesn't browserear with valid setup
            await checkTroubleshootButtonsWithValidSetup();

            // delete username in connection manager and select a destiny file with a valid username field
            await sideNav.deployWindow.click();
            await browser.pause(timeout.fast);
            await systemDeployment.userSettingsButtonEnable.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught clicking project connection: " + `${err}`);
                });
            await browser.pause(timeout.fast);
            await credsComponent.credsComponent.isVisible()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    await browser.elementClear(locators.primaryUserNameEditField);
                    await browser.pause(timeout.fast);
                    await browser.$(locators.primaryUserNameEditField).getText()
                        .then(async (value: string) => {
                            expect(value)
                                .toBe("");
                            await credsComponent.saveConnectionManagerButton.click();
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught while deleting password: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });

            systemInfo.devices[0].username = "admin";
            await fs.writeJsonSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);

            // check connection manager doesn't browserear with valid setup
            await checkTroubleshootButtonsWithValidSetup();

            // check message logs
            await messageComponent.openMessagePaneButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.incorrectCredentials, data.errorSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toBe(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.incorrectCredentials, data.warningSeverity)
                        .then(async (value: boolean) => {
                            await expect(value)
                                .toBe(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                });
            resolve();
        });
    });
});
