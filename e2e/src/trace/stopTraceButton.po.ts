/* tslint:disable */
import { MatButton } from '../matButton';

export class StopTraceButton extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Stop trace button");
    }
    public async exists(): Promise<boolean> {
        let traceParagraph = await browser.$("//*[@id='trace-header-bar']/div[2]/sync-icon-button/div/button/p")
        let traceText = await traceParagraph.getText()
        return traceText === "Stop"
    }
    public async click(): Promise<void> {
        await super.click();
    }
}
