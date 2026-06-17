// @ts-nocheck
import { LogClient } from "@extron/winston-logger";
import { GmObject } from "../../../../src/deployment/GmObject.po";
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../../src/allure/allure";
import { DeployComponent } from "../../../../src/deployComponent/deployComponent.po";
import { Jsonparser } from "../../../../src/deployment/Jsonparser.po";
import { MessagePaneComponent } from "../../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../../commonMethods.po";
import { environment } from '../../../../../electron/src/environment/environment';
const logClient = new LogClient("e2e:TOOL-2418");
// tslint:disable-next-line:prefer-const
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "..", "resources", "ProtectingSecretsProject", "systeminfo.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "..", "resources", "ProtectingSecretsProject", "systeminfoTmp.json");
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "..", "src", "JSON", "timeout.json"));
const configfile = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "..", "tests", "regression", "CLI", "protectingSecrets", "dataJson", "protectingSecretsConfigFile.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "..", "src", "JSON", "deviceData.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "..", "src", "JSON", "dataTool.json"));
const time: Date = new Date();


/**
 * @Author `Neelam S.`
 * @Description `CLI protecting secrets Tests `
 * @Date `03/26/2020`
 */
// tslint:disable-next-line:forin
describe("CLI protecting secrets: Running Test Suite", () => {
    const messageComponent = new MessagePaneComponent(browser);
    for (const filekey in configfile) {
        const datajson = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "..", "tests", "regression", "CLI", "protectingSecrets", "dataJson", configfile[filekey]));
        // look at the keys
        // tslint:disable-next-line:forin
        for (const key in datajson) {
            if (datajson[key].Execute === "True") {
                messageComponent.messageColumn.jsonParsor(datajson[key], systemInfoFile, systemInfoFileTemp)
                    .catch((err) => console.log(err));
    }
}
    }

});
