

/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "downloadRecoveryLocators.json"));


export class DownloadField extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Error Message");
    }

    public async click(): Promise<void> {
        await super.click().then(async () => {
            const a = await browser.$(this.dialogSelector)
            .waitForExist();
            return a;
        });
    };

    public async setDownload(downloadcontrollerIP: string): Promise<void> {
        await browser.$(locators.downloadInputAddressText).setValue(downloadcontrollerIP);
        return Promise.resolve()
    }

    public async clearValue(): Promise<void> {
        await browser.$(locators.downloadInputAddressText).clearValue()
        return Promise.resolve()
    }

    public async VerifyIpError(expectedResult:string):Promise<Boolean>
    {
            let gottenText = await browser.$(locators.downloadInputErrorMessage).getText() 
           if(gottenText.match(expectedResult))
                return true;
            else
                return false;
    }

   public async VerifyErrorExists():Promise<Boolean>
   {
    const existing = await browser.$(locators.downloadInputErrorMessage).isExisting()
                
     return existing;           
   }

};