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
const ssoLocators = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "accessControlLocators.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:TOOL-2602");

/*
 * @Author `Neelam.S-QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2253`
 * @Description `Access Control Feature`
 * @Date `05/20/2021`
*/

xdescribe(`${tabTitles.REGRESSION.Login} TOOL-2253:(Profile Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("TOOL-2253: Expiration - Renew");
        allure.addLink("User Story: TOOL-2253", "https://extron.atlassian.net/browse/TOOL-2253");
        allure.addLink("Task Issue: TOOL-2602", "https://extron.atlassian.net/browse/TOOL-2602");
        allure.addLink("Test Case: TOOL-T398", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T398");
        return new Promise<void>(async (resolve) => {
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    xit("Verify that renew button is hidden from user during Offline Authorization sign in", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const login = new LoginComponent(browser);
            const profile = new ProfileComponent(browser);
            await login.logoutBtn.exists()
            .then(async (value: boolean) => {
                if (value) {
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
                } else {
                    await browser.pause(timeout.fast);
                }
            })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);

                });
            await login.offlineSignInlink.offlineSignInClick()
            .then(async () => {
            })
            .catch(async (err: Error) => {
                logClient.error("Exception caught" + `${err}`);
                //fail("offline signin click");
            });
            await browser.pause(timeout.fast);
            await login.offlineResponseKeyInput.sendResponseKey(data.offlineAuthKey)
                .then(async (value) => {
                    await expect(value)
                    .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                    //fail("Failed to send response key");
                });

            await login.offlineVerify.clickVerify()
                .then(async () => {
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("click Verify");
                });
            await browser.pause(timeout.fast);
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
            await profile.renewButton.exists()
            .then(async (value) => {
                await expect(value)
                .toEqual(false);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
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
