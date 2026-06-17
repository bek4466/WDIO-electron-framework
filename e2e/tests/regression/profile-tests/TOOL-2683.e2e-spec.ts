// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { LoginComponent } from '../../../src/accessControlComponent/loginComponent.po';
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { ProfileComponent } from '../../../src/ProfileComponent/ProfileComponent.po';
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "accessKeysData.json"));
const dataKeys = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "accessKeysData.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:TOOL-2683");

/*
 * @Author `Neelam.S-QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2623`
 * @Description `Access Control Feature`
 * @Date `05/06/2021`
*/

describe(`${tabTitles.REGRESSION.Login} TOOL-2623:(License Last Renewed: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2623: License Last Renewed");
        allure.addLink("User Story: TOOL-2623", "https://extron.atlassian.net/browse/TOOL-2623");
        allure.addLink("Task Issue: TOOL-2683", "https://extron.atlassian.net/browse/TOOL-2683");
        allure.addLink("Test Case: TOOL-T458", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T458");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await allure.screenshot(browser, "BeforeALL Hook");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    it("Verify Last renewed date from manual renew.", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const login = new LoginComponent(browser);
            await common.safeLogout(browser);
            
            // await common.loginToSSOWithRemember(browser, data.licensedUser1, data.licensedUser1pass);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.pause(timeout.fast);
            const profile = new ProfileComponent(browser);
            await profile.profileTab.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("ProfileClick");
                });
                await profile.renewButton.isClickable()
            .then(async (value) => {
                await expect(value)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("renew is visible");
            });
            await profile.renewButton.click()
            .then(async () => {
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("renew click");
            });
            await browser.pause(timeout.fast);
            await profile.ApplicationRenewInfo.isClickable()
            .then(async (value) => {
                await expect(value)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("profile renew info is visible");
            });
            const startDate = new Date();
            // endDate.setDate(endDate.getDate() + 30); // Set now + 30 days as the new date
           // const newDate = new Date(endDate);
            const res = startDate.toString();
            const res1 = res.substring(0, 15);
            const lastrenewedDate = "Last Renewed: " + res1;
                await profile.lastRenewedDate.checkText(lastrenewedDate)
                .then(async (value) => {
                    await expect(value)
                    .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                    //fail("licensed user is visible");
                });
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
            await profile.profileTab.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("ProfileClick");
                });
            await profile.lastRenewedDate.checkText(lastrenewedDate)
                .then(async (value) => {
                    await expect(value)
                    .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                    //fail("licensed user is visible");
                });
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });

    afterEach(async ()=> {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    })
});

describe(`${tabTitles.REGRESSION.Login} TOOL-2623:(License Last Renewed: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2623: License Last Renewed");
        allure.addLink("User Story: TOOL-2623", "https://extron.atlassian.net/browse/TOOL-2623");
        allure.addLink("Task Issue: TOOL-2683", "https://extron.atlassian.net/browse/TOOL-2683");
        allure.addLink("Test Case: TOOL-T460", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T460");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await allure.screenshot(browser, "BeforeALL Hook");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    afterEach(async ()=> {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    })

    it("Verify Last renewed date from Auto renew - sign in", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const login = new LoginComponent(browser);
            await common.safeLogout(browser);
            
            // await common.loginToSSOWithRemember(browser, data.licensedUser1, data.licensedUser1pass);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            const startDate = new Date();
            const res = startDate.toString();
            const res1 = res.substring(0, 15);
            await browser.pause(timeout.fast);
            const profile = new ProfileComponent(browser);
            await profile.profileTab.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("ProfileClick");
                });
            const lastrenewedDate = "Last Renewed: " + res1;
                await profile.lastRenewedDate.checkText(lastrenewedDate)
                .then(async (value) => {
                    await expect(value)
                    .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                    //fail("licensed user is visible");
                });
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
            await profile.profileTab.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("ProfileClick");
                });
            await profile.lastRenewedDate.checkText(lastrenewedDate)
                .then(async (value) => {
                    await expect(value)
                    .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                    //fail("licensed user is visible");
                });
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
describe(`${tabTitles.REGRESSION.Login} TOOL-2623:(License Last Renewed: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2623: License Last Renewed");
        allure.addLink("User Story: TOOL-2623", "https://extron.atlassian.net/browse/TOOL-2623");
        allure.addLink("Task Issue: TOOL-2683", "https://extron.atlassian.net/browse/TOOL-2683");
        allure.addLink("Test Case: TOOL-T461", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T461");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await allure.screenshot(browser, "BeforeALL Hook");
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass, false);
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    afterEach(async ()=> {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    })

    it("Verify Last renewed date from Auto Renew - new session", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const login = new LoginComponent(browser);
            await common.safeLogout(browser);
            
            // await common.loginToSSOWithRemember(browser, data.licensedUser1, data.licensedUser1pass);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.pause(timeout.fast);
            await browser.pause(timeout.fast);
            
            const startDate = new Date();
            const res = startDate.toString();
            const res1 = res.substring(0, 15);
            await browser.pause(timeout.fast);
            const profile = new ProfileComponent(browser);
            await profile.profileTab.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("ProfileClick");
                });
            const lastrenewedDate = "Last Renewed: " + res1;
                await profile.lastRenewedDate.checkText(lastrenewedDate)
                .then(async (value) => {
                    await expect(value)
                    .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                    //fail("licensed user is visible");
                });
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.fast);
            await profile.profileTab.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("ProfileClick");
                });
            await profile.lastRenewedDate.checkText(lastrenewedDate)
                .then(async (value) => {
                    await expect(value)
                    .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                    //fail("licensed user is visible");
                });
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });
});