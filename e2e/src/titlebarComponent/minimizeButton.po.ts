
import { MatButton } from "../matButton";


export class MinimizeButton extends MatButton{
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "minimize");
    }

    public async click(): Promise<void> {
        await super.click()
        .then(async () => {
            const a = await browser.$(this.selector).waitForExist({timeout:2000, timeoutMsg: "wait for titlebar Minimize button timed out"});
            return a;
        });
    }
}
