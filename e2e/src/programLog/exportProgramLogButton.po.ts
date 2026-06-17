/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";

export class ExportProgramLogButton extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "export Program Log button");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async isEnabled(): Promise<boolean> {
        const state = await browser.$(this.selector).getAttribute('ng-reflect-disabled');
        if(state === "true")
            return false;
        else
            return true;
    }
}
