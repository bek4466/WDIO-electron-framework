// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../src/allure/allure";
import { DeployComponent } from "../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../src/messagePaneComponent/messagePaneComponent.po";
import { TraceComponent } from "../../src/traceComponent";
import { ProfileComponent } from '../../src/ProfileComponent/ProfileComponent.po';
import { CommonMethods } from "../commonMethods.po";
let app: WebdriverIO.Browser;
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "dataTool.json"));
const foreignDates = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "foreignDates.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "tabTitles.json"));
const traceProjectDestiny = path.join(__dirname, "..", "..", "resources", "TraceProject", "systeminfo.json");
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePathForSmoke = path.join(__dirname, "..", "..", "resources", "SmokeDeploy", "systeminfo1.json");
import { CommunicationClient } from "@extron/communication/release/index";
const comClient = new CommunicationClient();
comClient.setTimeout(10000);
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:SMOKE 2.0 TEST");

describe(`${tabTitles.SMOKE} TOOL-temp:(Message pane date: suite)`, () => {

    /**
     * Languages: English(AUS, UK), GER, FRENCH, DUTCH, CHINESE, HEBREW
     * 
     * env.LANG RESULT:
     * en_US: USA
     * en_GB: UK, AUS
     * nl_NL: Dutch aka Netherlands
     * de_DE: German aka Deutchland
     * fr_FR: French
     * he_IL: Hebrew
     *      Expiration: יום ו׳, 13 במאי 2022, 16:32:13
     *      Last Renewed: יום ד׳, 13 באפריל 2022, 16:32:13
     * zh_CN: Chinese
     */
    beforeEach(async () => {
        allure.addOwner("Kiran S");
        allure.story("TOOL-temp: temptitle");
        allure.addLink("User Story: TOOL-temp", "link here");
        allure.addLink("Task Issue: TOOL-temp", "link here");
        allure.addLink("Test Case: TOOL-temp", "link here");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(app, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(app, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    afterEach(async () => {
        if (app && app.isRunning()) {
            await allure.screenshot(app, "After");
        }
        await common.safeLogout(app);
    });

    it("Check message pane for date base in format", async () => {
        return new Promise<void>(async (resolve) => {
            let messagePaneComponent = new MessagePaneComponent(app);
            const systemDeployment = new DeployComponent(app);
            const a = path.resolve(systemInfoFilePathForSmoke);
            const systemInfo = fs.readJsonSync(a);
            const sysid = await common.generateRandomNumber(4);
            const sysID = sysid.toString();
            systemInfo.system.system_id = sysID;
            common.getEnvLocale();
            await fs.writeJSONSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForSmoke);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await app.client.pause(timeout.medium);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                            //fail("deploybuttonisEnabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });

            await messagePaneComponent.timeRowValue.foreignTimeStampColumnIncludesValue().then(async res => {
                await expect(res).toBe(true);
            });
            resolve();
        });
    });

    it("Check that time is in correct format", async () => {
        return new Promise<void>(async (resolve) => {
            let messagePaneComponent = new MessagePaneComponent(app);
            const systemDeployment = new DeployComponent(app);
            const a = path.resolve(systemInfoFilePathForSmoke);
            const systemInfo = fs.readJsonSync(a);
            const sysid = await common.generateRandomNumber(4);
            const sysID = sysid.toString();
            systemInfo.system.system_id = sysID;
            common.getEnvLocale();
            await fs.writeJSONSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePathForSmoke);
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await app.client.pause(timeout.medium);
                    return systemDeployment.deployButton.isEnabled()
                        .then(async (status) => {
                            await expect(status)
                                .toEqual(false);
                        })
                        .catch((err: Error) => {
                            logClient.error(err);
                            //fail("deploybuttonisEnabled");
                        });
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                    //fail("deploybuttonClick");
                });


            await messagePaneComponent.timeRowValue.getText().then(res => {
                expect(common.hasCorrectTimeFormatting(res)).toBe(true);
            });
            resolve();
        });
    });
});

describe(`${tabTitles.SMOKE} TOOL-temp:(Profile Test: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Kiran S");
        allure.story("TOOL-temp: temptitle");
        allure.addLink("User Story: TOOL-temp", "link here");
        allure.addLink("Task Issue: TOOL-temp", "link here");
        allure.addLink("Test Case: TOOL-temp", "link here");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(app, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await browser.maximizeWindow();
            await allure.screenshot(app, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    afterEach(async () => {
        if (app && app.isRunning()) {
            await allure.screenshot(app, "After");
        }
        await common.safeLogout(app);
    });

    it("Check that expiration date is correct format", async () => {
        return new Promise<void>(async (resolve) => {
            const profile = new ProfileComponent(app);
            let date = new Date();

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
            await app.client.pause(timeout.fast);

            //Check Exp or Current Date                        set to 1 here for expiration month 0 for current month
            await profile.expirationDateText.hasCorrectForeignDate(1).then(res => {
                expect(res).toBe(true);
            });
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });

    it("Check that last renew date is correct format", async () => {
        return new Promise<void>(async (resolve) => {
            const profile = new ProfileComponent(app);
            let date = new Date();

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
            await app.client.pause(timeout.fast);

            //Check Last Renew Date                 set to 0 for current month 1 for expiration
            await profile.lastRenewedDate.hasCorrectForeignDate(0).then(res => {
                expect(res).toBe(true);
            });
            await app.client.pause(timeout.slow);
            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });

    it("Check that time is in correct format", async () => {
        return new Promise<void>(async (resolve) => {
            const profile = new ProfileComponent(app);

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
            await app.client.pause(timeout.fast);
            await profile.expirationDateText.getText().then(res => {
                expect(common.hasCorrectTimeFormatting(res)).toBe(true);
            })

            resolve();
        }).catch((err) => {
            return Promise.resolve(err + "Should have thrown");
        });
    });
});

/**
 * Code to get Date and Month for any Language.
 * https://jsfiddle.net/y5hxck87/21/
 * 
 * 
 * const options = { weekday: "short", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
const datesArr = [new Date("January 17, 1995 03:24:00"),
 new Date("February 17, 1995 03:24:00"),
 new Date("March 17, 1995 03:24:00"),
 new Date("April 17, 1995 03:24:00"),
 new Date("May 17, 1995 03:24:00"),
 new Date("June 17, 1995 03:24:00"),
 new Date("July 17, 1995 03:24:00"),
 new Date("August 17, 1995 03:24:00"),
new Date("September 17, 1995 03:24:00"),
new Date("October 17, 1995 03:24:00"),
new Date("November 17, 1995 03:24:00"),
new Date("December 17, 1995 03:24:00")]

const weekArr = [new Date("January 1, 1995 03:24:00"),
 new Date("January 2, 1995 03:24:00"),
 new Date("January 3, 1995 03:24:00"),
 new Date("January 4, 1995 03:24:00"),
 new Date("January 5, 1995 03:24:00"),
 new Date("January 6, 1995 03:24:00"),
 new Date("January 7, 1995 03:24:00")]
// http://www.lingoes.net/en/translator/langcode.htm

for(let i = 0; i < weekArr.length; i+=1){
console.log(weekArr[i].toLocaleString("zh-CH", options))
}

for(let i = 0; i < datesArr.length; i+=1){
console.log(datesArr[i].toLocaleString("zh-CH", options))
}

 */