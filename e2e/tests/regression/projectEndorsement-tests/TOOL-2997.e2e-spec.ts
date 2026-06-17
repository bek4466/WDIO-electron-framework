import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { LoginComponent } from '../../../src/accessControlComponent/loginComponent.po';
import { CommonMethods } from "../../commonMethods.po";
import { reject } from "q";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systemInfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "ProjectEndorsementProject", "systeminfoTmp.json");
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2997");


/**
 * @Author `Miguel Cruz - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2515`
 * @Description `Certified users have access to features (Project certification, Deploy code only) for UI.`
 * @Date `11/2/2021`
 */

describe(`${tabTitles.REGRESSION.Message_Pane} TOOL-2997:(Certified users have access to features (Project certification, Deploy code only))`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2515: Certified users have access to features (Project certification, Deploy code only)");
        allure.addLink("User Story: TOOL-2515", "https://extron.atlassian.net/browse/TOOL-2515");
        allure.addLink("Task Issue: TOOL-2997", "https://extron.atlassian.net/browse/TOOL-2997");
        allure.addLink("Test Case: TOOL-T560", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T560");
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

    afterEach(async () => {
        await browser.reloadSession();
        await browser.pause(3000);
        await browser.switchWindow("ControlScript Deployment Utility");
    });

    it("Verify that Uncertified Users cannot access the Deploy Code Only", async () => {
        return new Promise<void>(async (resolve) => {
            var systemDeployment = new DeployComponent(browser);
            // copying systemInfoFile -> systemInfoFileTemp
            await common.copyFolder(systemInfoFile, systemInfoFileTemp);
            const a = path.resolve(systemInfoFile);
            const a1 = path.resolve(systemInfoFileTemp);
            // systemInfo1 read into memory
            const systemInfo1 = fs.readJsonSync(a1);
            await systemDeployment.destinyInputField.setDestinyFileToUploadNoPath(systemInfoFileTemp);
            systemInfo1.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a1, systemInfo1);
            await browser.pause(timeout.fast);
            await systemDeployment.deployCodeOnlyBtn.isClickable()
                .then(async (status) => {
                    await expect(status)
                        .toEqual(false);
                })
                .catch(async (err: Error) => {
                    logClient.error(err);
                    await reject(err);
                    //fail("deploybuttonisEnabled");
                });
            resolve();
        }).catch((err) => {
            console.log("TOOL-2997: Exception Error: " + `${err}`);
            //fail("TOOL-2997 failed ");
            return Promise.resolve(err + "Should have thrown");
        });
    });
});