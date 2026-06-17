/* tslint:disable */
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import { reject } from 'q';
import * as fs from "fs-extra";
import * as path from "path";


const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));

export class StartTraceButton extends MatButton  {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Start Trace button");
    }

    public async exists(): Promise<boolean> {
        let traceParagraph = await browser.$("//*[@id='trace-header-bar']/div[2]/sync-icon-button/div/button/p")  
        let traceText = await traceParagraph.getText()
        return traceText === "Start"
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checktraceControls(myText: string): Promise<boolean> {
        let message: boolean = false;
        await browser.$(this.selector).waitForExist();
        await browser.getElementText(this.selector)
            .then(async (text: any) => {
                await browser.pause(timeout.fast);
                if (text.includes(myText)) {
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

    public async isDisabled():Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            elementState = await (await browser.$(this.selector)).isEnabled()
        }).catch((err: Error)=>{
            console.log("Exception caught: " + `${this.isEnabled}` + `${err}`);
            reject(err);
            throw err;
        });
        return elementState == false;
    };
}
