
/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';
import { MatButton } from "../matButton";
import { allure } from '../allure/allure';


export class DownloadProjectPanelError extends MatButton{

constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
    super(app, selector, "Download Project Panel Error");
}

public async VerifyErrorMessage(expectedstring:string):Promise<boolean>
{
    const existing = await browser.waitUntil(async () => {
        return await browser.$(this.selector).getText() === expectedstring
      }, {timeout: 25000, timeoutMsg: 'expected text to be different after 5s'});

      return existing;

}








}
