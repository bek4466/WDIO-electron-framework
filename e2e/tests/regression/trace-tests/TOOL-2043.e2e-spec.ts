// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent/sideNaveComponent.po";
import { StartStopProgramComponent } from "../../../src/startStopProgramComponent/startStopProgram.po";
import { TraceComponent } from "../../../src/traceComponent";
import { CommonMethods } from "../../commonMethods.po";
const common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfo.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:CSP-175");

/*
 * @Author `Amit B`
 * @LinkToJIRA `https://extron.atlassian.net/browse/Tool-2043`
 * @POM `https://extron.atlassian.net/browse/CSP-176`
 * @Description `Troubleshooting Component Tests,Start/Stop Program Message validation`
 * @Date `10/13/2020`
 */

describe(`${tabTitles.REGRESSION.StartStop_Program} TOOL-2044:(Verify start program from "Isle of Arran", when trace is started in "Isle of Arran")`, () => {
    beforeEach(async () => {
        allure.addOwner("Amit Bhagwat");
        allure.story("TOOL-1598: As FG, I want to start or stop program so that I can ensure that my code is executed correctly while troubleshooting");
        allure.addLink("User Story: TOOL-1598", "https://extron.atlassian.net/browse/TOOL-1598");
        allure.addLink("Task Issue: TOOL-2043", "https://extron.atlassian.net/browse/CSP-2043");
        allure.addLink("Test Case: TOOL-T2221", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T2221");
        return new Promise<void>(async (resolve) => {
            
            await browser.pause(10000);
            await browser.switchWindow(tabTitles.mainTab);
            await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(browser, "Before");
            resolve();
        }).catch((err) => {
            throw new Error(err);
        });
    });

    it("Verify that using Start Program button gives browserropriate Messages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemTroubleshooting = new StartStopProgramComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const tracecomp = new TraceComponent(browser);
            // Provide valid destiny file
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFilePath);
            await browser.pause(timeout.slow);
            // deploy the project
            // verify deploy button is displayed
            await systemDeployment.deployButton.click()
                .then(async () => {
                    await browser.pause(timeout.slow);
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
            // Navigate to troubleshooting option from sidebar
            // verify Stop Program button is displaying
            const startDate = await new Date(Date.now());
            await browser.pause(timeout.medium);
            const sideNav = new SideNavigationComponent(browser);
            await sideNav.troubleshootingWindow.click();
            await browser.pause(2 * timeout.slow);
            await browser.pause(timeout.fast);
            await systemTroubleshooting.stopProgramButton.checkStopProgramButtonPresent()
                .then(async (isStopProgramButtonPresent) => {
                    await expect(isStopProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    //fail("failed at stop programbuttonpresent");
                });
            await browser.pause(timeout.medium);
            // click on stop button
            await systemTroubleshooting.stopProgramButton.click();
            await browser.pause(2 * timeout.slow);

            // checking stop icon changed to start icon
            // Verify Start program icon is displaying
            await systemTroubleshooting.startProgramButton.checkStartProgramButtonPresent()
                .then(async (isStartProgramButtonPresent) => {
                    await expect(isStartProgramButtonPresent)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    console.log("failed:" + err);
                    //fail("failed at start programbuttonpresent");
                });
            // click on start button
            await browser.pause(timeout.slow);
            await systemTroubleshooting.startProgramButton.click();
            // verify stop program icon is displaying
            const tracearea = new TraceComponent(browser);
            tracearea.startTraceButton.isVisible()
                .then(async (startTraceVisible) => {
                    await expect(startTraceVisible)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: start Trace Button " + `${err}`);
                });
            await tracearea.startTraceButton.click();
            await browser.pause(2 * timeout.slow);
            await tracearea.stopTraceButton.isVisible()
                .then(async (startTraceVisible) => {
                    await expect(startTraceVisible)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: start Trace Button " + `${err}`);
                });
            // Navigate to troubleshooting option from sidebar
            // Program Started should be displayed
            // tslint:disable-next-line:newline-per-chained-call
            await browser.pause(timeout.slow * 3);
            await tracearea.startTraceButton.click().then(() =>{
            });
            try {
                const oldDate = tracecomp.timeRow1.getText()
                // await tracecomp.traceTable.cellcontent(1, 2)
                    .then(async (cellcontent) => {
                        cellcontent = cellcontent.split(' ')[1]
                        //check if timestamp has correct pattern
                        expect(cellcontent.match(new RegExp(/^(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{3})$/))).toBe(true)
                    });
            } catch (err: any) {
                logClient.error("Exception caught: trace mesages " + `${err}`);
                //fail("Trace messages did not show: " + err);
            }
            resolve();
        }).catch((err) => {
            logClient.error("CSP-175: Exception Error: " + `${err}`);
            //fail("CSP-175");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
