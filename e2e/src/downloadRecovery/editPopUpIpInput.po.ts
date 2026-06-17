

/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { MatInput } from "../matInput";
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "downloadRecoveryLocators.json"));


export class editPopUpIpInput extends MatInput {
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Edit Pop Up Ip Input");
    }

    public async click(): Promise<void> {
        await super.click().then(async () => {
            const a = await browser.$(this.dialogSelector)
                .waitForExist();
            return a;
        });
    };

};