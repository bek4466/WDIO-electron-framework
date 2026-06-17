/* tslint:disable */
import { MatButton } from '../matButton';
import * as fs from "fs-extra";
import * as path from "path";
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const programLogLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));

export class NoProgramLogTextField extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "No Program Log Text");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checkNoProgramLogTextPresent(): Promise<boolean> {
        return await browser.$("span*=No logs found. Please check your device credentials or try again.").waitForExist().then(async(val)=>{
            return val;
        }).catch((err) => {
            console.log("CSP-48: Exception Error: " + `${err}`);
            return true;
        });
    }

    public async checkNoProgramLogText(Text: string): Promise<boolean> {
        let message: boolean = false;
        await browser.$(programLogLocators.noLogsText).waitForExist();
        await browser.$(locators.noLogsText)
            .getText()
            .then(async (text: string) => {
                await browser.pause(timeout.medium);
                if (text.includes(Text)) {
                    message = true;
                }
            })
        return message;
    }
}
