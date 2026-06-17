// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { LoginComponent } from '../../../src/accessControlComponent/loginComponent.po';
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { ProfileComponent } from "../../../src/profileComponent/profileComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "accessKeysData.json"));
const dataKeys = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "accessKeysData.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:TOOL-2321");

/*
 * @Author `Neelam.S-QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2253`
 * @Description `Access Control Feature`
 * @Date `05/20/2021`
*/

describe(`${tabTitles.REGRESSION.Login} TOOL-2253:(Profile Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2253: Expiration - Renew");
        allure.addLink("User Story: TOOL-2253", "https://extron.atlassian.net/browse/TOOL-2253");
        allure.addLink("Task Issue: TOOL-2321", "https://extron.atlassian.net/browse/TOOL-2321");
        allure.addLink("Test Case: TOOL-T280", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T280");
        return new Promise<void>(async (resolve) => {
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    it("Verify manually renewing browser license", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const login = new LoginComponent(browser);
            const profile = new ProfileComponent(browser);
            await profile.profileLink.isClickable()
            .then(async (value) => {
                await expect(value)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("profile link is visible");
            });
            await profile.profileLink.click()
            .then(async () => {
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("failed profile click");
            });
            await browser.pause(timeout.fast);
            await profile.lisenceCardInfo.isClickable()
            .then(async (value) => {
                await expect(value)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("profile card visible");
            });
            await profile.profileTitleText.checkUserName(data.licensedUser1)
            .then(async (value) => {
                await expect(value)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("licensed user is visible");
            });
            await profile.licenseStatusText.isClickable()
            .then(async (value) => {
                await expect(value)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("licensed user is visible");
            });
            await profile.remainingDaysValue.isClickable()
            .then(async (value) => {
                await expect(value)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("remaining is visible");
            });
            await profile.expirationDateText.isClickable()
            .then(async (value) => {
                await expect(value)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("expiration date is visible");
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
            await login.logoutBtn
                    .performLogout()
                    .then(async (value1) => {
                        await expect(value1)
                        .toEqual(true);
                    })
                    .catch((err: Error) => {
                        logClient.error(`${err}`);
                        //fail("Failed performLogout");
                    });
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
