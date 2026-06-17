/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const programLogLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
export class ProgramLogContent extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "ProgramLog Component");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checkNotEmpty(): Promise<boolean> {
        let a:boolean = false;
        await browser.$(programLogLocators.actualLogText).waitForExist();
        const content = await browser.$(programLogLocators.actualLogText).getText();
        //console.log("This is the content"+content);
        if (content != "")
            a=true;
        return a;
    }
    public async checkProgramLogTitle(programLogTitle: string): Promise<boolean> {
        let message: boolean = false;
        await browser.$(this.selector).waitForExist();
        await browser.$(this.selector)
            .getText()
            .then(async (text: any) => {
                await browser.pause(timeout.fast);
                if (text.includes(programLogTitle)) {
                    //pass string from test
                    message = true;
                }
                await allure.screenshot(this.app, "After");
            }).catch((err: Error)=> {
                console.log('checkProgramLogTitle:'+ `${err}`);
                message = false;
            });
            return message;
    }
}
