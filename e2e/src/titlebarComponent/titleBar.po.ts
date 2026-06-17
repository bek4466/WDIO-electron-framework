import { MatButton } from "../matButton";


export class TitleBar extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "title");
    }

    public async click(): Promise<void> {
        await super.click()
        .then(async () => {
            const a = await this.app.$(this.selector).waitForExist({timeout:2000, timeoutMsg: "wait for titlebar timed out"});
            return a;
        });
    }
}
