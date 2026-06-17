
// @ts-nocheck
import { MatButton } from "../matButton";


export class LoggingPage extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "LoggingPage");
    }

    public async click2(): Promise<boolean> {
        let flag: boolean;
        const a = await browser.$(this.selector)
                .isVisible(this.selector)
                .catch((err: any) => {
                    flag = false;
                    console.log(err);
                    return a;
                });
        if (a === true){
            flag = true;
            await super.click();
        } else{
           await browser.$("#logOut")
           .click();
        }
        return flag;
    }

    public async click(): Promise<void> {
        await super.click();
    }
}
