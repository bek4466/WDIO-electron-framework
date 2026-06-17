
import { MatButton } from "../matButton";


export class CloseButton extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string, closeButtonElem: string) {
        super(app, selector, "close button");
    }

    public async click(): Promise<void> {
        await super.click()
        .then(async () => {
            const a = (await this.app.$(this.selector)).waitForExist({timeout: 2000, timeoutMsg: "wait for titlebar close button timed out after 2 seconds."})
            return a;
        });
    }
}
