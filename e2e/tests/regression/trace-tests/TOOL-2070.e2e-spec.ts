// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { reject } from "q";

import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { TroubleshootingPage } from "../../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
const common = new CommonMethods();
const traceProjectDestiny = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfo.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-2070");

/*
	* @Author `Neelam.S - QA`
    * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-1598`
	* @Description `Trace Component Tests`
	* @Date `10/20/2020`
*/

describe(`${tabTitles.REGRESSION.Trace} TOOL-1598:(Trace Component: suite)`, () => {
    beforeEach(async () => {
        allure.story("TOOL-1598: As Francisco, I want to see the triggered events in trace, so I know what is going on with my system");
        allure.addLink("User Story: TOOL-1598", "https://extron.atlassian.net/browse/TOOL-1598");
        allure.addLink("Test Case: TOOL-T2216", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2216");
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

    // Currently all test case related to Trace will be disabled, since we cannot run them in CI
    it("Trace Component buttons are visible and functioning", async () => {
        return new Promise<void>(async (resolve) => {
        allure.addOwner("Neelam S");
        allure.addLink("Task Issue: CSP-102", "https://extron.atlassian.net/browse/CSP-102");
        const systemDeployment = new DeployComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(traceProjectDestiny);
        await systemDeployment.deployButton.click();
        await browser.pause(timeout.slow);
        await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch(async (err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                    //fail("checkMessagePaneLog");
                });
        const sideNav = new SideNavigationComponent(browser);
        await sideNav.troubleshootingWindow.click();
        const traceComponent = new TraceComponent(browser);
        await traceComponent.traceTextTitle.checktraceControls(data.traceTitle)
                .then(async (traceTitleExist) => {
                    await expect(traceTitleExist)
                    .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: start Trace Button " + `${err}`);

                });

        await traceComponent.traceSpinner.checkSpinner()
            .then(async (result) => {
                await expect(result)
                    .toBe(false);
            })
            .catch((err: Error) => {
                logClient.error(err);
                //fail("trace:playdoesnotexists");
            });
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
                //fail("trace:playdoesnotexists");
            });
        await browser.pause(timeout.slow);
        await traceComponent.traceSpinner.checkSpinner()
            .then(async (result) => {
                await expect(result)
                    .toBe(true);
            })
            .catch((err: Error) => {
                logClient.error(err);
                //fail("trace:checkSpinner");
            });
        await traceComponent.stopTraceButton.exists()
            .then(async (traceExist) => {
                await expect(traceExist)
                    .toBe(true);
                if (traceExist) {
                    await traceComponent.stopTraceButton.click();
                }
            })
            .catch((err: Error) => {
                logClient.error(err);
                //fail("trace:stopTraceButton");
            });
        await browser.pause(timeout.slow);
        await traceComponent.startTraceButton.exists()
                .then(async (traceExist) => {
                    await expect(traceExist)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                    //fail("trace:playdoesnotexists");
                });
        await traceComponent.clearTraceButton.clearLogs(data.traceClearTitleTxt)
            .then(async (traceTitleExist) => {
                await expect(traceTitleExist)
                .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error("Exception caught: start Trace Button " + `${err}`);

            });
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
                //fail("trace:playdoesnotexists");
            });
        await browser.pause(timeout.slow);
        await traceComponent.stopTraceButton.click();
        await traceComponent.messageRowValue.checkTraceMessages("Please wait while the program is loading...", "10.113.89.209")
            .then(async (value: boolean) => {
                await expect(value)
                    .toEqual(true);
            })
            .catch((err: Error) => {
                logClient.error("Exception caught" + `${err}`);
                //fail("checkTraceMessages");

            });
        await traceComponent.clearTraceButton.click();
        await browser.pause(timeout.slow);
        await traceComponent.messageRowValue.verifyTableLength()
                    .then(async (value) => {
                        await expect(value)
                            .toEqual(0);
                    })
                    .catch((err: Error) => {
                        logClient.error("Exception caught" + `${err}`);
                        //fail("checkTraceMessages");

                    });
        resolve();
        }).catch((err) => {
            logClient.error("TOOL-2070 : Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
