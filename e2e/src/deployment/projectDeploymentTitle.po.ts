
/* tslint:disable */
// @ts-nocheck
import { MatButton } from "../matButton";

export class ProjectTitleTextField extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string, private dialogSelector: string) {
        super(app, selector, "Error Message");
    }

    public async click(): Promise<void> {
        await super.click().then(async () => {
            const a = await browser
            .$(this.dialogSelector).waitForExist();
            return a;
        });
    };

};
