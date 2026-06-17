// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { TroubleshootingPage } from "../../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "Troubleshooting", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "locators.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-1162");

/**
 * @Author `Austin L - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2795`
 * @Description `Troubleshooting Bad Scenarios - Primary Device Address Validation`
 * @Date `08/11/2021`
 */

describe(`TOOL-1162:(Troubleshooting Bad Scenarios - Primary Device Address Validation)`, () => {
    beforeEach(async () => {
        allure.addOwner("Austin L");
        allure.story("TOOL-2795: Troubleshooting Bad Scenarios - Primary Device Address Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2795", "User Story: TOOL-2795");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1162", "Task Issue: TOOL-1162");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2876", "Test Case: TOOL-T2876");
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

    it("Verify there should be error message in message pane for Invalid primary devices.network.interfaces.address key - not a string", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const startstopProgram = new StartStopProgramComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            systemInfo.devices[0].network.interfaces[0].address = 1234;
            await fs.writeJSONSync(a, systemInfo);
            await browser.pause(timeout.fast);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);

            // navigate to troubleshooting
            await sideNav.troubleshootingWindow.click();

            // open message pane
            await messageComponent.openMessagePaneButton.click();

            // click trace. verify that error message browserears and trace does not start
            await traceComponent.startTraceButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    await traceComponent.startTraceButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.invalidNetworkInterfaceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await traceComponent.traceSpinner.isVisible()
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                });

            // clear message pane
            await messageComponent.clearAllButton.click();

            // click program log. verify that error message browserears and program log is not retrieved
            await programLog.programLogRefreshButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    await programLog.programLogRefreshButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.invalidNetworkInterfaceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });

                    await programLog.noProgramLogTextField.isVisible() &&
                        programLog.programLogTextAreaField.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                });

            // clear message pane
            await messageComponent.clearAllButton.click();

            // click start program. verify that error message browserears and program does not start
            await startstopProgram.startProgramButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    let startStartProgramStatus: string = (await startstopProgram.startProgramButton.getText()).toLowerCase();
                    await startstopProgram.startProgramButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.invalidNetworkInterfaceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await startstopProgram.startProgramButton.getText()
                        .then(async (value: string) => {
                            expect(value.toLowerCase())
                                .toBe(startStartProgramStatus);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    
                });

            resolve();
        });
    });
});

describe(`TOOL-1162:(Troubleshooting Bad Scenarios - Primary Device Address Validation)`, () => {
    beforeEach(async () => {
        allure.addOwner("Austin L");
        allure.story("TOOL-2795: Troubleshooting Bad Scenarios - Primary Device Address Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2795", "User Story: TOOL-2795");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1162", "Task Issue: TOOL-1162");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3995", "Test Case: TOOL-T3995");
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

    it("Verify there should be error message in message pane for invalid primary devices.network.interfaces.address key-not a valid IPV4.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const startstopProgram = new StartStopProgramComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            systemInfo.devices[0].network.interfaces[0].address = "1.2.3";
            await fs.writeJSONSync(a, systemInfo);
            await browser.pause(timeout.fast);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);

            // navigate to troubleshooting
            await sideNav.troubleshootingWindow.click();

            // open message pane
            await messageComponent.openMessagePaneButton.click();

            // click trace. verify that error message browserears and trace does not start
            await traceComponent.startTraceButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    await traceComponent.startTraceButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.invalidNetworkInterfaceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await traceComponent.traceSpinner.isVisible()
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                });

            // clear message pane
            await messageComponent.clearAllButton.click();

            // click program log. verify that error message browserears and program log is not retrieved
            await programLog.programLogRefreshButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    await programLog.programLogRefreshButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.invalidNetworkInterfaceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });

                    await programLog.noProgramLogTextField.isVisible() &&
                        programLog.programLogTextAreaField.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                });

            // clear message pane
            await messageComponent.clearAllButton.click();

            // click start program. verify that error message browserears and program does not start
            await startstopProgram.startProgramButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    let startStartProgramStatus: string = (await startstopProgram.startProgramButton.getText()).toLowerCase();
                    await startstopProgram.startProgramButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.invalidNetworkInterfaceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await startstopProgram.startProgramButton.getText()
                        .then(async (value: string) => {
                            expect(value.toLowerCase())
                                .toBe(startStartProgramStatus);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    
                });

            resolve();
        });
    });
});

describe(`TOOL-1162:(Troubleshooting Bad Scenarios - Primary Device Address Validation)`, () => {
    beforeEach(async () => {
        allure.addOwner("Austin L");
        allure.story("TOOL-2795: Troubleshooting Bad Scenarios - Primary Device Address Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2795", "User Story: TOOL-2795");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1162", "Task Issue: TOOL-1162");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3996", "Test Case: TOOL-T3996");
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

    it("Verify there should be error message in message pane for Missing primary devices.network.interfaces.address key.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const startstopProgram = new StartStopProgramComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            delete systemInfo.devices[0].network.interfaces[0].address;
            await fs.writeJSONSync(a, systemInfo);
            await browser.pause(timeout.fast);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);

            // navigate to troubleshooting
            await sideNav.troubleshootingWindow.click();

            // open message pane
            await messageComponent.openMessagePaneButton.click();

            // click trace. verify that error message browserears and trace does not start
            await traceComponent.startTraceButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    await traceComponent.startTraceButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.missingPeripheralDeviceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                    await traceComponent.traceSpinner.isVisible()
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(false);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                });

            // clear message pane
            await messageComponent.clearAllButton.click();

            // click program log. verify that error message browserears and program log is not retrieved
            await programLog.programLogRefreshButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    await programLog.programLogRefreshButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.missingPeripheralDeviceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });

                    await programLog.noProgramLogTextField.isVisible() &&
                        programLog.programLogTextAreaField.isVisible()
                            .then(async (value: boolean) => {
                                expect(value)
                                    .toBe(false);
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught: " + `${err}`);
                                
                            });
                });

            // clear message pane
            await messageComponent.clearAllButton.click();

            // click start program. verify that error message browserears and program does not start
            await startstopProgram.startProgramButton.exists()
                .then(async (value: boolean) => {
                    expect(value)
                        .toBe(true);
                    let startStartProgramStatus: string = (await startstopProgram.startProgramButton.getText()).toLowerCase();
                    await startstopProgram.startProgramButton.click();
                    await messageComponent.messageRowValue.checkMessagePaneLogs(systemInfo.devices[0].name + data.missingPeripheralDeviceAddress, data.errorSeverity)
                        .then(async (value: boolean) => {
                            expect(value)
                                .toBe(true);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });

                    await startstopProgram.startProgramButton.getText()
                        .then(async (value: string) => {
                            expect(value.toLowerCase())
                                .toBe(startStartProgramStatus);
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught: " + `${err}`);
                            
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    
                });

            resolve();
        });
    });
});