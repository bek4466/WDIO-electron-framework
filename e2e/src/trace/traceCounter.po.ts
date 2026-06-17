/* tslint:disable */
// @ts-nocheck
import { Sleep } from "@extron/contracts-central-deployment";
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
const traceLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "traceLocators.json"));
const delay = ms => new Promise(res => setTimeout(res, ms));

export class TraceCounter extends MatButton{
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, " Trace Counter");
    }

    public async Present(): Promise<boolean> {
        let flag: any = true;
        await browser.$(traceLocators.traceCounter).waitForExist({ timeout: 500 })
                .catch(async (err: Error) => {
                    console.log("Counter not displayed");
                    flag = false;
                });
                return flag;
        }

    public async functional(): Promise<boolean> {
        
        const counter = await browser.$(traceLocators.traceCounter).isClickable();
        if ( counter){
            let countMessage = await browser.$(traceLocators.traceCounter).getText();
            let count1 = parseInt(countMessage.split(' ')[0]);
            await delay(10000);
            countMessage =  await browser.$(traceLocators.traceCounter).getText();
            let count2 = parseInt(countMessage.split(' ')[0]);
            if(count2 - count1 > 0){
                return true
            }
            return false
        }
        return false
    }

   
       
        
}
