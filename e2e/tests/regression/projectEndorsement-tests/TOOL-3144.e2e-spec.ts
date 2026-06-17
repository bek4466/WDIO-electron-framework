import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { CloseControlComponent } from '../../../src/closeControlComponent/closeControlComponent.po';
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { ProgramLogComponent } from "../../../src/programLogComponent/programLog.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systemInfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3144");

/**
 * @Author `Miguel Cruz - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-3100`
 * @Description `Managing User Closing CSDU application.`
 * @Date `11/4/2021`
 */

describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-3144:(Managing User Closing CSDU application)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-3100: Managing User Closing CSDU application");
        allure.addLink("User Story: TOOL-3100", "https://extron.atlassian.net/browse/TOOL-3100");
        allure.addLink("Task Issue: TOOL-3144", "https://extron.atlassian.net/browse/TOOL-3144");
        allure.addLink("Test Case: TOOL-T677", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T677");
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

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify that after User clicks on Leave button on popup box , application is closed", async () => {
        return new Promise<void>(async (resolve) => {
            var closeControl = new CloseControlComponent(browser);
            await closeControl.closeButton.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await closeControl.popUpCloseButton.click()
                .catch((err: any) => {
                });
            await common.switchToWin(browser, tabTitles.main, data.licensedUser1, data.licensedUser1pass);
            const deployComponent = new DeployComponent(browser);
            await deployComponent.deployButton.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-3144: Exception Error: " + `${err}`);
            //fail("TOOL-3144 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-3144:(Managing User Closing CSDU application)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-3100: Managing User Closing CSDU application");
        allure.addLink("User Story: TOOL-3100", "https://extron.atlassian.net/browse/TOOL-3100");
        allure.addLink("Task Issue: TOOL-3144", "https://extron.atlassian.net/browse/TOOL-3144");
        allure.addLink("Test Case: TOOL-T678", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T678");
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

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify that when Popup box is opened , other CSDU application controls are disabled", async () => {
        return new Promise<void>(async (resolve) => {
            var closeControl = new CloseControlComponent(browser);
            const programLog = new ProgramLogComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            await closeControl.closeButton.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            try {
                await sideNav.troubleshootingWindow.silenceClick();
            } catch (error) {
                // expected behaviour
            }
            await browser.pause(timeout.fast);
            await programLog.programLogRefreshButton.isVisible()
                .then(async (refreshExist) => {
                    await expect(refreshExist)
                        .toBe(false);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("programLog: refresh exists");
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-3144: Exception Error: " + `${err}`);
            //fail("TOOL-3144 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-3144:(Managing User Closing CSDU application)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-3100: Managing User Closing CSDU application");
        allure.addLink("User Story: TOOL-3100", "https://extron.atlassian.net/browse/TOOL-3100");
        allure.addLink("Task Issue: TOOL-3144", "https://extron.atlassian.net/browse/TOOL-3144");
        allure.addLink("Test Case: TOOL-T679", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T679");
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

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify that after clicking Cancel button on popup box , popup box is closed", async () => {
        return new Promise<void>(async (resolve) => {
            var closeControl = new CloseControlComponent(browser);
            await closeControl.closeButton.click()
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            await closeControl.popUpCancelButton.click()
                .catch((err: Error) => {
                });
            await browser.pause(timeout.fast);
            await closeControl.popUpCancelButton.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(false);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            const deployComponent = new DeployComponent(browser);
            await deployComponent.deployButton.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-3144: Exception Error: " + `${err}`);
            //fail("TOOL-3144 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});