
import { MatButton } from "../matButton";


export class MaximizeButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "maximize");
    }

    public async click(): Promise<void> {
        await super.click()
        .then(async () => {
            const a = await this.app.$(this.selector).waitForExist({timeout:2000, timeoutMsg: "wait for titlebar Maximize button timed out"});
            return a;
        });
    }
}
