import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { TraceComponent } from "../../../src/traceComponent/traceComponent.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent";
import { CommonMethods } from "../../commonMethods.po";
import { browser } from "@wdio/globals";

const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfoT592.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "TraceProject", "systeminfotemp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3690");

/**
 * @Author `Austin L QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3690`
 * @Date `04/25/2022`
 */
describe(`Regression Multiple Languages: TOOL-3645:(Implementing International Date and Time formatting on the Troubleshooting page: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-3645: Implementing Message consistency on a Localized system after switching pages");
        allure.addLink("User Story: TOOL-3645", "https://extron.atlassian.net/browse/TOOL-3645");
        allure.addLink("Task Issue: TOOL-3690", "https://extron.atlassian.net/browse/TOOL-3690");
        allure.addLink("Test Case: TOOL-T4495", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T4495");
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

    it("Verify that correct date/time regional formatting is seen in the Troubleshooting page", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const sideNav = new SideNavigationComponent(browser);
            const trace = new TraceComponent(browser);

            // deploy to populate message pane
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFileTemp);
            const systemInfo = fs.readJsonSync(a);
            const sysID = "1396";
            systemInfo.system.system_id = sysID;
            await fs.writeJSONSync(a, systemInfo);
            await systemDeployment.destinyInputField.setDestinyFileToUpload(systemInfoFileTemp);
            await systemDeployment.deployButton.click();
            await messageComponent.messageRowValue.checkMessagePaneLogs(data.deploySuccessMsg, data.infoSeverity)
                .then(async (value: boolean) => {
                    await expect(value)
                        .toEqual(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });

            // switch tabs and start trace
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.superFast);
            await trace.startTraceButton.click();

            await browser.$(trace.IPaddressRow4.selector).waitForExist({timeout: 20000})
                .then(async () => {
                    await trace.stopTraceButton.click();
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });

            // check that sorting by time is not allowed
            let latestMessageDateTime = await trace.timeRow1.getText();
            await trace.timeField.click();
            await trace.timeRow1.getText()
                .then(async (value: string) => {
                    await expect(value)
                        .toEqual(latestMessageDateTime);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught: " + `${err}`);
                });

            // check that milliseconds are not visible in the time & check date/time formatting
            await common.hasCorrectTimeFormatting(latestMessageDateTime.split(' ').splice(1).join(' '))
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });
                
            await trace.timeRow1.foreignTimeStampColumnIncludesValue()
                .then(async (value: boolean) => {
                    await expect(value)
                        .toBe(true);
                })
                .catch((err: Error) => {
                    logClient.error("Exception caught" + `${err}`);
                });


            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3690: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});