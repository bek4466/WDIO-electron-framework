

import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";


export class AboutButton extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "button to open about Page");
    }

    public async click(): Promise<void> {
        await super.click();
    }
    
}
