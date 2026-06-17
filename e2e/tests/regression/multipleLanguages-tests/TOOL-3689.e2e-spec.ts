import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { ProfileComponent } from '../../../src/profileComponent/profileComponent.po';
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const foreignDates = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "foreignDates.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const traceProjectDestiny = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfo.json");
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathForSmoke = path.join(__dirname, "..", "..", "..", "resources", "SmokeDeploy", "systeminfo1.json");
import { CommunicationClient } from "@extron/communication/release/index";
const comClient = new CommunicationClient();
comClient.setTimeout(10000);
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:SMOKE 2.0 TEST");

describe(`${tabTitles.SMOKE} TOOL-temp:(Profile Test: suite)`, () => {
    before(async () => {
        allure.addOwner("Amit B ");
        allure.story("TOOL-3554: https://extron.atlassian.net/browse/TOOL-3644");
        allure.addLink("User Story: TOOL-3554", "https://extron.atlassian.net/browse/TOOL-3554");
        allure.addLink("Task Issue: TOOL-3689", "https://extron.atlassian.net/browse/TOOL-3689");
        allure.addLink("Test Case: TOOL-T4494", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T4494");
        return new Promise<void>(async (resolve) => {
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await await browser.maximizeWindow();
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    it("Verify that correct date/time regional formatting is seen in the Profile page", async () => {
        return new Promise<void>(async (resolve) => {
            const profile = new ProfileComponent(browser);

            let date = new Date();
            var time = new Date();
            var timeString = date.toDateString() + " " + time.toLocaleTimeString();

            await profile.profileLink.isClickable()
                .then(async (value) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                });
            await profile.profileLink.click()
                .then(async () => {
                })
                .catch((err: Error) => {
                    logClient.error(`${err}`);
                });
            await browser.pause(timeout.fast);

            //Check Exp or Current Date                        set to 1 here for expiration month 0 for current month
            await profile.expirationDateText.hasCorrectForeignDate(1).then(res => {
                expect(res).toBe(true);
            })
            .catch((err: Error) => {
                logClient.error(`${err}`);
            })

            await profile.renewButton.click()
                .then(async () => {
                    date = new Date();
                    time = new Date();
                    timeString = date.toDateString() + " " + time.toLocaleTimeString();
                    await profile.lisenceCardInfo.checkLastRenewed(timeString)
                        .then(async (val: boolean) => {
                            await expect(val)
                                .toEqual(true);
                        })
                        .catch(async (err: Error) => {
                            logClient.error("Exception caught" + `${err}`);
                        });
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            await profile.lastRenewedDate.hasCorrectForeignDate(0).then(res => {
                expect(res).toBe(true);
            })
            .catch(async (err: Error) => {
                logClient.error("Exception caught" + `${err}`);
            });
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        })
    });
});