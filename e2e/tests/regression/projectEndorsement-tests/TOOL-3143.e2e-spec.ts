import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { AccessControlComponent } from '../../../src/accessControlComponent/accessControlComponent.po';
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systemInfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const accessLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "accessControlLocators.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3144");


/**
 * @Author `Kiran Shrestha`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2969`
 * @Description `Managing User Logout`
 * @Date `02/09/2022`
 */

describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-3143:(Managing User Log Out)`, () => {
    beforeEach(async () => {
        allure.addOwner("Kiran Shrestha");
        allure.story("TOOL-2969: Managing User Log Out");
        allure.addLink("User Story: TOOL-2969", "https://extron.atlassian.net/browse/TOOL-2969");
        allure.addLink("Task Issue: TOOL-3143", "https://extron.atlassian.net/browse/TOOL-3143");
        allure.addLink("Test Case: TOOL-T674", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/15648045");
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

    it("Verify that after clicking Logout, user is successfully logged out of the application", async () => {
        return new Promise<void>(async (resolve) => {
            let accessControl = new AccessControlComponent(browser, "");
            await accessControl.logoutBtn.performLogout();
            
            await browser.switchWindow(tabTitles.mainTab);
            await accessControl.signinBtn.isClickable().then(async (value) => {
                await expect(value)
                    .toEqual(true);
            })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("openCSDUFail");
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-3143: Exception Error: " + `${err}`);
            //fail("T674 failed");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-3143:(Managing User Log Out)`, () => {
    beforeEach(async () => {
        allure.addOwner("Kiran Shrestha");
        allure.story("TOOL-2969: Managing User Log Out");
        allure.addLink("User Story: TOOL-2969", "https://extron.atlassian.net/browse/TOOL-2969");
        allure.addLink("Task Issue: TOOL-3143", "https://extron.atlassian.net/browse/TOOL-3143");
        allure.addLink("Test Case: TOOL-T675", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/15648062");
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
            let accessControl = new AccessControlComponent(browser, "");
            let sideNavComp = new SideNavigationComponent(browser);
            await accessControl.logoutBtn.click();
            await sideNavComp.aboutButton.isVisible().then(async (value) => {
                await expect(value)
                    .toEqual(false);
            })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("aboutVisibility");
                });
            await browser.$(accessLocators.popUpLogOutBtn).isClickable().then(async (value) => {
                await expect(value)
                    .toEqual(true);
            })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("logoutBtnVisibility");
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-3143: Exception Error: " + `${err}`);
            //fail("TOOL-3143 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-3143:(Managing User Log Out)`, () => {
    beforeEach(async () => {
        allure.addOwner("Kiran Shrestha");
        allure.story("TOOL-2969: Managing User Log Out");
        allure.addLink("User Story: TOOL-2969", "https://extron.atlassian.net/browse/TOOL-2969");
        allure.addLink("Task Issue: TOOL-3143", "https://extron.atlassian.net/browse/TOOL-3143");
        allure.addLink("Test Case: TOOL-T676", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/15648088");
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

    it("Verify that after clicking Cancel button on Logout popup box, the pop up box is closed", async () => {
        return new Promise<void>(async (resolve) => {
            let accessControl = new AccessControlComponent(browser, "");
            await accessControl.logoutBtn.click();
            await browser.$(accessLocators.popUpLogOutCancelBtn).click();
            await accessControl.logoutBtn.isVisible().then(async (value) => {
                await expect(value)
                    .toEqual(true);
            }).catch((err: Error) => {
                logClient.error("Exception caught: " + `${err}`);
                //fail("popUpCancelVisibility");
            });
            resolve();
        }).catch((err) => {
            console.log("TOOL-3143: Exception Error: " + `${err}`);
            //fail("TOOL-3143 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});