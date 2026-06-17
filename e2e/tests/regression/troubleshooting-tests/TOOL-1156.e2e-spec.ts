// @ts-nocheck
import { CommunicationClient } from "@extron/communication";
import * as fs from "fs-extra";
import * as path from "path";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { TraceComponent } from "../../../src/traceComponent";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile2 = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "GoldenSinglenicProject", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const messagePaneLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "messagePaneLocators.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
import { LogClient } from "@extron/winston-logger";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
const logClient = new LogClient("e2e:TOOL-1156");
const highestSchemaVersion = data.validSchemaVersions.sort()[data.validSchemaVersions.length - 1];

/**
 * @Author `Joe V QA, Austin L - QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-1156`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2796`
 * @Description `Updating Project Descriptor Versioning`
 * @Date `6/28/2021, updated 2/14/2022`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1156:(Schema - Project Descriptor Validation)`, () => {
    before(async () => {
        allure.addOwner("Joe Vanacore");
        allure.story("TOOL-1156: Schema - Project Descriptor Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1574", "User Story: TOOL-1574");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1156", "Task Issue: TOOL-1156");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T1014", "Test Case: TOOL-T1014");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3437", "User Story: TOOL-3437");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3496", "Task Issue: TOOL-3496");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T991", "Test Case: TOOL-T991");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });

    it("Verify error message should be shown in message pane for Missing Schema Version.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            const startStopProgram = new StartStopProgramComponent(browser);
            // copying systemInfoFile2 -> systemInfoFileTemp
            await common.copyFolder(systemInfoFile2, systemInfoFileTemp);
            const a1 = path.resolve(systemInfoFileTemp);
            // systemInfo1 read into memory
            const systemInfo1 = fs.readJsonSync(a1);
            systemInfo1.project_root_folder_path = path.dirname(a1);
            delete systemInfo1.schemaVersion;
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await fs.writeJSONSync(a1, systemInfo1);
            const verifyMessage: string = data.missingSchemaVersion + `\"${highestSchemaVersion}\"`;

            /* Check messages after deploying */
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            await browser.pause(timeout.fast);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.halfSec);
            await messageComponent.openMessagePaneButton.click();

            /* Check trace start */
            await browser.pause(timeout.fast);
            await trace.startTraceButton.click()
                .then(async () => {
                    await browser.pause(timeout.halfSec);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            /* Check program refresh */
            await programLog.programLogRefreshButton.exists()
                .then(async (refreshExist) => {
                    await expect(refreshExist)
                        .toBe(true);
                    await programLog.programLogRefreshButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on refresh click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            /* Check start program */
            await startStopProgram.startProgramButton.exists()
                .then(async (status) => {
                    await expect(status)
                        .toBe(true);
                    await startStopProgram.startProgramButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on start program click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3496: Exception Error: " + `${err}`);
                return Promise.resolve(err + " was thrown");
            });
    });

});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1156:(Schema - Project Descriptor Validation)`, () => {
    before(async () => {
        allure.addOwner("Joe Vanacore");
        allure.story("TOOL-1156: Schema - Project Descriptor Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1574", "User Story: TOOL-1574");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1156", "Task Issue: TOOL-1156");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3983", "Test Case: TOOL-T3983");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3437", "User Story: TOOL-3437");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3496", "Task Issue: TOOL-3496");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T993", "Test Case: TOOL-T993");
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

    it("Verify there should be error message in message pane for invalid schema version - not a valid value", async () => {

        const systemDeployment = new DeployComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        const sideNav = new SideNavigationComponent(browser);
        const trace = new TraceComponent(browser);
        const programLog = new ProgramLogComponent(browser);
        const startStopProgram = new StartStopProgramComponent(browser);
        // copying systemInfoFile2 -> systemInfoFileTemp
        await common.copyFolder(systemInfoFile2, systemInfoFileTemp);
        const a1 = path.resolve(systemInfoFileTemp);
        // systemInfo1 read into memory
        const systemInfo1 = fs.readJsonSync(a1);
        let versions = ["a", "9.9.9"];
        systemInfo1.project_root_folder_path = path.dirname(a1);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
        const verifyMessage: string = data.invalidSchemaVersion + `\"${highestSchemaVersion}\"`;

        for (let i = 0; i < versions.length; i++) {
            systemInfo1.schemaVersion = versions[i];
            await fs.writeJSONSync(a1, systemInfo1);
            await sideNav.deployWindow.click();
            await messageComponent.clearAllButton.click();
            /* Check messages after deploying */
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.halfSec);
            await browser.$(messagePaneLocators.messagePaneHidden).isExisting()
                .then(async (value: boolean) => {
                    if (value) {
                        await messageComponent.openMessagePaneButton.click();
                    }
                })
                .catch();

            /* Check trace start */
            await trace.startTraceButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            /* Check program refresh */
            await programLog.programLogRefreshButton.exists()
                .then(async (refreshExist) => {
                    await expect(refreshExist)
                        .toBe(true);
                    await programLog.programLogRefreshButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on refresh click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            /* Check start program */
            await startStopProgram.startProgramButton.exists()
                .then(async (status) => {
                    await expect(status)
                        .toBe(true);
                    await startStopProgram.startProgramButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on start program click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
        }
    });

});

describe(`${tabTitles.REGRESSION.Deployment} TOOL-1156:(Schema - Project Descriptor Validation)`, () => {
    before(async () => {
        allure.addOwner("Joe Vanacore");
        allure.story("TOOL-1156: Schema - Project Descriptor Validation");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1574", "User Story: TOOL-1574");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1156", "Task Issue: TOOL-1156");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T3984", "Test Case: TOOL-T3984");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3437", "User Story: TOOL-3437");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3496", "Task Issue: TOOL-3496");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T992", "Test Case: TOOL-T992");
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

    it("Verify there should be error message in message pane for invalid schema version - data type mismatch", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            const startStopProgram = new StartStopProgramComponent(browser);
            // copying systemInfoFile2 -> systemInfoFileTemp
            await common.copyFolder(systemInfoFile2, systemInfoFileTemp);
            const a1 = path.resolve(systemInfoFileTemp);
            // systemInfo1 read into memory
            const systemInfo1 = fs.readJsonSync(a1);
            systemInfo1.project_root_folder_path = path.dirname(a1);
            systemInfo1.schemaVersion = 0;
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await fs.writeJSONSync(a1, systemInfo1);
            const verifyMessage: string = data.invalidSchemaVersionType + `\"${highestSchemaVersion}\"`;

            /* Check messages after deploying */
            await systemDeployment.deployButton.click();
            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.halfSec);
            await messageComponent.openMessagePaneButton.click();

            /* Check trace start */
            await trace.startTraceButton.click()
                .then(async () => {
                    await browser.pause(timeout.halfSec);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            /* Check program refresh */
            await programLog.programLogRefreshButton.exists()
                .then(async (refreshExist) => {
                    await expect(refreshExist)
                        .toBe(true);
                    await programLog.programLogRefreshButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on refresh click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                    await messageComponent.clearAllButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            /* Check start program */
            await startStopProgram.startProgramButton.exists()
                .then(async (status) => {
                    await expect(status)
                        .toBe(true);
                    await startStopProgram.startProgramButton.click()
                        .then(async () => {
                        })
                        .catch((err: Error) => {
                            logClient.error("Exception caught on start program click: " + `${err}`);
                        });
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            await browser.pause(timeout.superFast);
            await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3496: Exception Error: " + `${err}`);
                return Promise.resolve(err + " was thrown");
            });
    });
});

describe(`TOOL-3496:(Updating Project Descriptor Versioning)`, () => {
    before(async () => {
        allure.addOwner("Austin L");
        allure.story("TOOL-3437: Updating Project Descriptor Versioning");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3437", "User Story: TOOL-3437");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-3496", "Task Issue: TOOL-3496");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T994", "Test Case: TOOL-T994");
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

    it("Verify that a unrecognized schemaVersion value gives the browserropriate error message", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            const startStopProgram = new StartStopProgramComponent(browser);
            // copying systemInfoFile2 -> systemInfoFileTemp
            await common.copyFolder(systemInfoFile2, systemInfoFileTemp);
            const a1 = path.resolve(systemInfoFileTemp);
            // systemInfo1 read into memory
            const systemInfo1 = fs.readJsonSync(a1);
            systemInfo1.project_root_folder_path = path.dirname(a1);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            const verifyMessage: string = data.invalidSchemaVersion + `\"${highestSchemaVersion}\"`;

            for (let i = 0; i < data.validSchemaVersions.length; i++) {
                systemInfo1.schemaVersion = data.validSchemaVersions[i];
                await fs.writeJSONSync(a1, systemInfo1);
                await sideNav.deployWindow.click();
                await messageComponent.clearAllButton.click();
                await browser.pause(timeout.halfSec);

                /* Check messages after deploying */
                await systemDeployment.deployButton.click();
                await browser.pause(timeout.superFast);
                await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                    .then(async (value: boolean) => {
                        await expect(value)
                            .toBe(false);
                        await messageComponent.clearAllButton.click();
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught" + `${err}`);
                    });

                await sideNav.troubleshootingWindow.click();
                await browser.pause(timeout.halfSec);
                await browser.$(messagePaneLocators.messagePaneHidden).isExisting()
                    .then(async (value: boolean) => {
                        if (value) {
                            await messageComponent.openMessagePaneButton.click();
                        }
                    })
                    .catch();

                /* Check trace start */
                await trace.startTraceButton.click()
                    .then(async () => {
                        await browser.pause(timeout.superFast);
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught" + `${err}`);
                    });
                await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                    .then(async (value: boolean) => {
                        await expect(value)
                            .toEqual(false);
                        await messageComponent.clearAllButton.click();
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught" + `${err}`);
                    });

                /* Check program refresh */
                await programLog.programLogRefreshButton.exists()
                    .then(async (refreshExist) => {
                        await expect(refreshExist)
                            .toBe(true);
                        await programLog.programLogRefreshButton.click()
                            .then(async () => {
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught on refresh click: " + `${err}`);
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error(err);
                    });
                await browser.pause(timeout.superFast);
                await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                    .then(async (value: boolean) => {
                        await expect(value)
                            .toEqual(false);
                        await messageComponent.clearAllButton.click();
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught" + `${err}`);
                    });

                /* Check start program */
                await startStopProgram.startProgramButton.exists()
                    .then(async (status) => {
                        await expect(status)
                            .toBe(true);
                        await startStopProgram.startProgramButton.click()
                            .then(async () => {
                            })
                            .catch((err: Error) => {
                                logClient.error("Exception caught on start program click: " + `${err}`);
                            });
                    })
                    .catch((err: Error) => {
                        logClient.error(err);
                    });
                await browser.pause(timeout.superFast);
                await messageComponent.messageRowValue.checkMessagePaneLogs(verifyMessage, data.errorSeverity)
                    .then(async (value: boolean) => {
                        await expect(value)
                            .toEqual(false);
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught" + `${err}`);
                    });
            }
            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3496: Exception Error: " + `${err}`);
                return Promise.resolve(err + " was thrown");
            });
    });
});