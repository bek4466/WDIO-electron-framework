/* tslint:disable */
import { MatButton } from '../matButton';
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from "q";
const accessKeys = fs.readJsonSync(path.join(__dirname, "..", "JSON", "keys.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const accessLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "accessControlLocators.json"));
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:activationKey>POM");

export class RetrievePasswordMessage extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string, name: string = "") {
        super(app, selector, name);
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async verifyMessage(message: string): Promise<boolean> {
        var res = false;
        await this.app.$(this.selector).getText()
            .then(async (text) => {
                res = message == text;
            })
            .catch((err) => {
                console.log(err);
            });
        return res;
    }
}
