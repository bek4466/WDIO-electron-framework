

import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";


export class HelpPage extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Side Nav to Help Page");
    }

    public async click(): Promise<void> {
        await super.click();
    }
    
}
