// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
// tslint:disable-next-line:prefer-const
import { browser } from "@wdio/globals";
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "NBPProject", "systeminfoTmp.json");
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "NBPProject", "systeminfo.json");
const configfile = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "tests", "smoke", "CLI_Smoke", "dataJson", "filesSmokeCLI.json"));


/**
 * @Author `Miguel Cruz`
 * @Description `CLI Smoke Tests `
 * @Date `04/26/2021`
 */
// tslint:disable-next-line:forin
describe("CLI Smoke_Tests: Running Test Suite", () => {
    const messageComponent = new MessagePaneComponent(browser);
    for (const filekey in configfile) {
        const datajson = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "tests", "smoke", "CLI_Smoke", "dataJson", configfile[filekey]));
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
