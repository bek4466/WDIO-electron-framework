/* tslint:disable */
// @ts-nocheck
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

export class ActivationKey extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "ActivationKey");
    }

    public async click(): Promise<void> {
        await super.click();
    }


    public async inputKeys() {
        await this.app.$(accessLocators.activationKeyField)
            .click();
        await (await this.app.$(accessLocators.activationKeyField))
            .setValue(accessKeys.activationKey)
            .catch(async (err: Error) => {
                logClient.error(`${err}`);
                await reject("Rejected Error:InputKeys " + err)
                //fail("keys failed during the input")
            });
    }

    public async enterCredentials(username: string) {
        await this.app.$(accessLocators.activationKeyField)
            .click();
        await (await this.app.$(accessLocators.activationKeyField))
            .setValue(username)
            .catch(async (err: Error) => {
                logClient.error(`${err}`);
                await reject("Rejected Error:InputKeys " + err)
                //fail("keys failed during the input")
            });
    }


    public async invalidInputKey(): Promise<boolean> {
        let flag: boolean = false;
        await (await this.app.$(accessLocators.activationKeyField))
            .setValue(accessKeys.invalidKey)
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("keys failed during the input")
            });
        await this.app.pause(timeout.fast);
        await this.app
            .$(accessLocators.activationKeyField) // accessLocators.activationKeyField
            .getValue()
            .then(async (text: any) => {
                await expect(text).toContain(accessKeys.invalidKey);
                flag = true;
            }).catch((err: Error) => {
                logClient.error("Exception Caught: " + this.inputKeys() + `${err}`);
            });
        return flag;
    }
}
