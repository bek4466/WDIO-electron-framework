// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProgramLogProject", "systeminfo.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-593");
/**
 * @Author `Neelam.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-593`
 * @POM `https://extron.atlassian.net/browse/CSP-176`
 * @Description `Program Log Bad Scenario`
 * @Date `04/17/2020`
 */

describe(`${tabTitles.REGRESSION.Program_Log} CSP-593:(Program Log bad scenario)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-544:Program Log Bad Scenarios for Tech Preview");
        allure.addLink("https://extron.atlassian.net/browse/CSP-544", "User Story: CSP-544");
        allure.addLink("https://extron.atlassian.net/browse/CSP-593", "Task Issue: CSP-593");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T857", "Test Case: CSP-T857");
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

    it("Verify that incompatible device specified for primary controller gives browserropriate error message while retrieving program logs .", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const systemInfo = fs.readJsonSync(a);
            const ipAddress = systemInfo.devices[0].network.interfaces[0].address;
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            systemInfo.devices[0].network.interfaces[0].address = "10.113.89.202";
            await fs.writeJSONSync(a, systemInfo);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            const programLog = new ProgramLogComponent(browser);
            await browser.pause(timeout.slow);
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
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkTroublrshootingMessagePaneLogs(data.incompatibleDeviceMessage, data.errorSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            systemInfo.devices[0].network.interfaces[0].address = ipAddress;
            await fs.writeJSONSync(a, systemInfo);
            resolve();
        }).catch((err) => {
            logClient.error("CSP-593: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

xdescribe(`${tabTitles.REGRESSION.Program_Log} CSP-593:(Program Log bad scenario)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-544:Program Log Bad Scenarios for Tech Preview");
        allure.addLink("https://extron.atlassian.net/browse/CSP-544", "User Story: CSP-544");
        allure.addLink("https://extron.atlassian.net/browse/CSP-593", "Task Issue: CSP-593");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T858", "Test Case: CSP-T858");
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

    // commented out due to no device that has blank program logs for testing in CI
    xit("Verify that no program uploaded to the primary controller gives browserropriate message while retrieving program logs.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const a = path.resolve(systemInfoFile);
            const systemInfo = fs.readJsonSync(a);
            const ipAddress = systemInfo.devices[0].network.interfaces[0].address;
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFile);
            systemInfo.system.project_root_folder_path = path.dirname(a);
            systemInfo.devices[0].network.interfaces[0].address = "10.113.89.201";
            await fs.writeJSONSync(a, systemInfo);
            await browser.pause(timeout.fast);
            await systemDeployment.deployButton.exists()
                .then(async (deployExist) => {
                    await expect(deployExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            const programLog = new ProgramLogComponent(browser);
            await browser.pause(timeout.slow);
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
            await browser.pause(timeout.medium);
            await messageComponent.messageRowValue.checkTroublrshootingMessagePaneLogs(data.noProgramMessageRefreshProgram, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    
                });
            systemInfo.devices[0].network.interfaces[0].address = ipAddress;
            await fs.writeJSONSync(a, systemInfo);
            resolve();
        }).catch((err) => {
            logClient.error("CSP-593: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Program_Log} CSP-593:(Program Log bad scenario)`, () => {
    before(async () => {
        allure.addOwner("Neelam Sharma");
        allure.story("CSP-544:Program Log Bad Scenarios for Tech Preview");
        allure.addLink("https://extron.atlassian.net/browse/CSP-544", "User Story: CSP-544");
        allure.addLink("https://extron.atlassian.net/browse/CSP-593", "Task Issue: CSP-593");
        allure.addLink("https://extron.atlassian.net/projects/CSP?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/CSP-T860", "Test Case: CSP-T860");
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

    it("Verify that refresh program log button should be disabled, if no project file is selected.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const traceComponent = new TraceComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            await browser.pause(timeout.medium);
            await sideNav.troubleshootingWindow.click();
            const programLog = new ProgramLogComponent(browser);
            await browser.pause(timeout.medium);

            await programLog.programLogRefreshButton.isDisabled()
                .then(async (refreshDisabled) => {
                    await expect(refreshDisabled)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: Click Refresh " + `${err}`);
                });

            await browser.pause(timeout.medium);
            resolve();
        }).catch((err) => {
            logClient.error("CSP-593: Exception Error: " + `${err}`);
            
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

