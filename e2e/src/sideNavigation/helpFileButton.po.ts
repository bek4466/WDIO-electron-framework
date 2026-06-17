

import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";


export class HelpFileButton extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "button to launch help file in Browser");
    }

    public async click(): Promise<void> {
        await super.click();
    }
    
}
