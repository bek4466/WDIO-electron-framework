// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { TroubleshootingPage } from "../../../src/sideNavigation/troubleshootingPage.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";


import { reject } from "q";
const common = new CommonMethods();
const traceProjectDestiny = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfo.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-1306");

 /**
  * @Author `Neelam S-QA`
  * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/CSP-546`
  * @Description `Trace Component Tests`
  * @Date `4/24/2020`
  */

describe(`${tabTitles.REGRESSION.Trace} CSP-546:(Trace Component: suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Neelam S");
        allure.story("CSP-546: State Management - Trace Status & Content to Remain Consistent");
        allure.addLink("Task Issue: TOOL-1306", "https://extron.atlassian.net/browse/TOOL-1306");
        allure.addLink("Test Case Link: TOOL-T2798", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2798");
        return new Promise<void>(async (resolve) => {
        
        await browser.pause(10000);
        await browser.switchWindow(tabTitles.mainTab);
        await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
        await browser.maximizeWindow();
        await allure.screenshot(browser, "Before");
        resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    it("Verify that Trace Session stopped remains persistent when switching views", async () => {
        return new Promise<void>(async (resolve) => {
        const systemDeployment = new DeployComponent(browser);
        const messageComponent = new MessagePaneComponent(browser);
        await systemDeployment.destinyInputField.setDestinyFileToUpload(traceProjectDestiny);
        await systemDeployment.deployButton.click()
        .then(async () => {
            await browser.pause(timeout.fast);
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
        await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
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
        await traceComponent.startTraceButton.isVisible()
        .then(async (startTraceVisible) => {
            await expect(startTraceVisible)
            .toEqual(true);
        })
        .catch((err: Error) => {
            logClient.error("Exception caught: start Trace Button " + `${err}`);

        });

        await sideNav.deployWindow.click();
        await browser.pause(timeout.fast);
        await sideNav.troubleshootingWindow.click();
        await traceComponent.traceTextTitle.checktraceControls(data.traceTitle)
        .then(async (traceTitleExist) => {
            await expect(traceTitleExist)
            .toEqual(true);
        })
        .catch((err: Error) => {
            logClient.error("Exception caught: start Trace Button " + `${err}`);

        });
        await traceComponent.startTraceButton.isVisible()
        .then(async (startTraceVisible) => {
            await expect(startTraceVisible)
            .toEqual(true);
        })
        .catch((err: Error) => {
            logClient.error("Exception caught: start Trace Button " + `${err}`);

        });
        resolve();
        }).catch((err) => {
            console.log("TOOL-1306: Exception Error: " + `${err}`);
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
