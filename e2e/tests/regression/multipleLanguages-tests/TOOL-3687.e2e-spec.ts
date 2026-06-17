import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { WinExplorer } from "../../../src/WindowsExplorer/WindowsExplorer.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent";
import { CommonMethods } from "../../commonMethods.po";

import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminforT578.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfotemp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const defaultMessageLogSavePath = path.resolve("C:\\Users\\Public\\Documents\\Extron\\csdu\\log\\Message Log");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-3687");

/**
 * @Author `Austin L QA
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-3687`
 * @Date `04/22/2022`
 */
describe(`Regression Multiple Languages: TOOL-2908:(Implementing Message consistency on a Localized system after switching pages: suite)`, () => {
    before(async () => {
        allure.addOwner("Austin Lee");
        allure.story("TOOL-2908: Implementing Message consistency on a Localized system after switching pages");
        allure.addLink("User Story: TOOL-2908", "https://extron.atlassian.net/browse/TOOL-2908");
        allure.addLink("Task Issue: TOOL-3687", "https://extron.atlassian.net/browse/TOOL-3687");
        allure.addLink("Test Case: TOOL-T4496", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T4496");
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

    it("Verify that message order persists when switching between pages", async () => {
        return new Promise<void>(async (resolve) => {
            const systemDeployment = new DeployComponent(browser);
            const messageComponent = new MessagePaneComponent(browser);
            const winExplorer = new WinExplorer(browser);
            const sideNav = new SideNavigationComponent(browser);

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

            // save message logs to compare later
            let filename: string;
            await winExplorer.clickCenter().then();
            await browser.pause(timeout.fast);
            await messageComponent.exportMessageButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);  
                    filename = await winExplorer.getFileNameBeforeSave().then();
                    await winExplorer.saveFile();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            // switch tabs
            await sideNav.troubleshootingWindow.click();
            await browser.pause(timeout.superFast);
            await sideNav.deployWindow.click();

            // compare message logs after switching tabs
            let filename2: string;
            await browser.maximizeWindow();    // bring browser to foreground. increases reliability of toast page object and robotjs methods
            await winExplorer.clickCenter().then();
            await browser.pause(timeout.fast);
            await messageComponent.exportMessageButton.click()
                .then(async () => {
                    await browser.pause(timeout.fast);
                    filename2 = await winExplorer.getFileNameBeforeSave().then();
                    await winExplorer.saveFile();
                    await browser.pause(timeout.superFast);
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });
            console.log(`filename: ${filename}`);
            console.log(`filename2: ${filename2}`)
            let fs1 = await common.readFile(path.join(defaultMessageLogSavePath, filename));
            await common.readFile(path.join(defaultMessageLogSavePath, filename2))
                .then(async (messages) => {
                    await expect(messages.toString())
                        .toEqual(fs1.toString());
                })
                .catch((err: Error) => {
                    logClient.error(err);
                });

            resolve();
        })
            .catch((err: Error) => {
                console.log("TOOL-3687: Exception Error: " + `${err}`);
                return Promise.resolve(err + "Should have thrown");
            });
    });
});