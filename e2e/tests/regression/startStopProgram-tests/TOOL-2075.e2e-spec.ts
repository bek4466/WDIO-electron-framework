// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathCSPT275 = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "systeminfoT275.json");
const DataFile = path.join(__dirname, "..", "..", "..", "resources", "ProgramStartStopProject", "dataFile", "DataFile.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2075");
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2075`
 * @Description `Troubleshooting Component Tests,Start/Stop Icon Program validation`
 * @Date `11/07/2019`
 */

describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2075:(Troubleshooting Test: Start/stop Icon Program validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1602", "User Story: TOOL-1602");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2075", "Task Issue: TOOL-2075");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2438", "Test Case: TOOL-T2438");
        return new Promise<void>(async (resolve) => {
            
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);;
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it("Verify stop program from Isle of Arran, when trace is started in Isle of Arran", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT275);
            await browser.pause(timeout.medium);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            await traceComponent.startTraceButton.exists()
            .then(async (traceExist) => {
                await expect(traceExist)
                    .toBe(true);
                if (traceExist) {
                    await traceComponent.startTraceButton.click();
                }
            })
            .catch((err: Error) => {
                logClient.error(err);
                
            });
        await browser.pause(timeout.slow);
        await traceComponent.traceSpinner.checkSpinner()
            .then(async (result) => {
                await expect(result)
                    .toBe(true);
            })
            .catch((err: Error) => {
                logClient.error(err);
                
            });
        await traceComponent.stopTraceButton.exists()
            .then(async (traceExist) => {
                await expect(traceExist)
                    .toBe(true);
            })
            .catch((err: Error) => {
                logClient.error(err);
                
            });

            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            // click on stop button
            await systemTroubleshooting.stopProgramButton.click();
            await browser.pause(timeout.medium);
            //  verify Start Program button is displaying
            await systemTroubleshooting.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);

                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            await browser.pause(timeout.medium);
            // check if program is stopped on tlp by launching vtlp ui
            const sysjson = fs.readJsonSync(DataFile);
            await systemTroubleshooting.stopProgramButton.checkProgramGotStopped(sysjson.ENG.B3.Devices[0].deviceCredentials[9].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui, data.vtlpProgramNotRunningMessage)
                .then(async (isProgramstopped) => {
                    await expect(isProgramstopped)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2075: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});
xdescribe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2075:(Troubleshooting Test: Start/stop Icon Program validation)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("TOOL-1602: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-1602", "User Story: TOOL-1602");
        allure.addLink("https://extron.atlassian.net/browse/TOOL-2075", "Task Issue: TOOL-2075");
        allure.addLink("https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2439", "Test Case: TOOL-T2439");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow("ControlScript Deployment Utility");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);;
            await allure.screenshot(browser, "Before");
            resolve();
        })
            .catch((err) => {
                throw new Error(err);
            });
    });

    it("Verify start program from Isle of Arran, when trace is started in Isle of Arran", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            // Provide valid destiny file
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathCSPT275);
            await browser.pause(timeout.medium);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    
                });
            const messageComponent = new MessagePaneComponent(browser);
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            // Navigate to troubleshooting option from sidebar
            const sideNav = new SideNavigationComponent(browser);
            const traceComponent = new TraceComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            await traceComponent.startTraceButton.exists()
            .then(async (traceExist) => {
                await expect(traceExist)
                    .toBe(true);
                if (traceExist) {
                    await traceComponent.startTraceButton.click();
                }
            })
            .catch((err: Error) => {
                logClient.error(err);
                
            });
        await browser.pause(timeout.slow);
        await traceComponent.traceSpinner.checkSpinner()
            .then(async (result) => {
                await expect(result)
                    .toBe(true);
            })
            .catch((err: Error) => {
                logClient.error(err);
                
            });
        await traceComponent.stopTraceButton.exists()
            .then(async (traceExist) => {
                await expect(traceExist)
                    .toBe(true);
            })
            .catch((err: Error) => {
                logClient.error(err);
                
            });

            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                })
            await browser.pause(timeout.medium);
            // check if program is stopped on tlp by launching vtlp ui
            const sysjson = fs.readJsonSync(DataFile)
            await systemTroubleshooting.startProgramButton.checkProgramIsRunning(sysjson.ENG.B3.Devices[0].deviceCredentials[9].IP, data.controllerUserName, data.controllerPassword, data.vtlpGui, data.vtlpLabel1, data.vtlpLabel2, data.vtlpLabel3, data.vtlpLabel4)
                .then(async (isProgramRunning) => {
                    console.log("isProgramRunning"+ isProgramRunning);
                    await expect(isProgramRunning)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2075: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });
});

