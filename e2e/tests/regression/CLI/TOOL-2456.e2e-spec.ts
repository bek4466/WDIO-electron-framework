// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { CredsComponent } from "../../../src/credentialsComponent/credentialsComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "NBPProject", "systeminfoTmp.json");
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT908.json");
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "NBPProject", "systeminfo.json");
import { LogClient } from "@extron/winston-logger";
const logClient = new LogClient("e2e:TOOL-2186");
const pathToScript: any = path.join(__dirname, "..", "..", "..", "..", "dist", "electron-builder", "win-unpacked", "bin");


/**
 * @Author `Miguel Cruz, Amit  QA`s
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2456`
 * @Date `3/8/2021`
 */

describe(`${tabTitles.REGRESSION.Deployment} TOOL-2186:(TroubleShooting)`, () => {
    beforeEach(async () => {
        allure.addOwner("Miguel Cruz");
        allure.story("TOOL-2170: Ability to run multiple commands serially");
        allure.addLink("User Story: TOOL-2170", "https://extron.atlassian.net/browse/TOOL-2170");
        allure.addLink("Task Issue: TOOL-2456", "https://extron.atlassian.net/browse/TOOL-2456");
        allure.addLink("Test Case: TOOL-T380", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/TOOL-T380");
        return new Promise<void>(async (resolve) => {
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    });

    afterEach(async () => {
    });

    it("Verify that CLI Deploy Command Works Serially", async () => {
        const fname = "Filelog" + Date.now();
        return new Promise<void>(async (resolve) => {
            const messageComponent = new MessagePaneComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            let a : string;
            let a1 : string;
            await systemDeployment.destinyInputField.ChangeFile(systemInfoFilePath);
            await common.copyFolder(systemInfoFilePath, systemInfoFileTemp);
            a = path.resolve(systemInfoFile);
            a1 = await path.resolve(systemInfoFileTemp);
            await allure.stdOutputAttachment("This is the project file location " + `${systemInfoFileTemp}`, "ProjectFile Location");
            // const basicCommand = "CD /D \"" + pathToScript + "\" && \"main.bat\"";
            const command: string = await messageComponent.messageRowValue.ProcessCommandCLI("cliCommand", systemInfoFileTemp);
            const filename = "Filelog" + Date.now();
            const stdout: any = await messageComponent.messageRowValue.CLICommandExecuter(command + " && \"csdu.cmd\" --help && \"csdu.cmd\" deploy --help", filename, 0);
            const deployCommandStatus = await messageComponent.messageRowValue.CheckSTDOut(stdout, "Project deployment completed.", "NA", true);
            await expect(deployCommandStatus)
            .toBe(true);
            const helpCommandStatus = await messageComponent.messageRowValue.CheckSTDOut(stdout, "Usage: csdu.cmd [options] [command]", "NA", true);
            await expect(helpCommandStatus)
            .toBe(true);
            const dephelpCommandStatus = await messageComponent.messageRowValue.CheckSTDOut(stdout, "Usage: csdu.cmd deploy [options]", "NA", true);
            await expect(dephelpCommandStatus)
            .toBe(true);
            resolve();
        }).catch((err) => {
            logClient.error("TOOL-2425: Exception Error: " + `${err}`);
            //fail('TOOL-2425: "Troubleshooting"');
            return Promise.resolve(err + "Should have thrown");
        });
    });
});
