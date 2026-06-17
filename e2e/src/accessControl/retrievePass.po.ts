/* tslint:disable */
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import { CommonMethods } from "../../tests/commonMethods.po";
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from "q";
const accessKeys = fs.readJsonSync(path.join(__dirname, "..", "JSON", "keys.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const accessLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "accessControlLocators.json"));
import { LogClient } from '@extron/winston-logger';
const logClient = new LogClient("e2e:activationKey>POM");

export class RetrievePasswordField extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "RetrievePasswordField");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async inputKeys() {
        await (await this.app.$(accessLocators.forgotPassEmailRetrieve)).setValue(accessKeys.activationKey)
            .catch(async (err: Error) => {
                logClient.error(`${err}`);
                await reject("Rejected Error:InputKeys " + err)
                //fail("keys failed during the input")
            });
    }



    public async invalidInputKey(): Promise<boolean> {
        let flag: boolean = false;
        await (await this.app.$(accessLocators.forgotPassEmailRetrieve)).setValue(accessKeys.invalidKey)
            .catch((err: Error) => {
                logClient.error(`${err}`);
                //fail("keys failed during the input")
            });
        await this.app.pause(timeout.fast);
        await this.app
            .$(accessLocators.forgotPassEmailRetrieve) // accessLocators.activationKeyField
            .getValue()
            .then(async (text: any) => {
                await expect(text).toContain(accessKeys.invalidKey);
                flag = true;
            }).catch((err: Error) => {
                logClient.error("Exception Caught: " + this.inputKeys() + `${err}`);
            });
        return flag;
    }

    public async inputEmail(email: string): Promise<void> {
        let common = new CommonMethods();
        await allure.step("Input email into the Retrieve Password field", async () => {
            await this.app.$(this.selector).setValue(email);
        });
    }
}
