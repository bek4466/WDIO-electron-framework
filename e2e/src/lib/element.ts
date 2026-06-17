
import { WebdriverQuery } from "./webdriverQuery";

export class Element {
    constructor(public app: WebdriverIO.Browser, public selector: string, public parent?: Element) {}

    public async exists(): Promise<boolean> {
        const exists = await (await browser.$(this.selector)).isExisting();
        return exists;
    }

    public async isVisible(): Promise<boolean> {
        //OLD const exists = await browser.client.isVisible(this.selector);
        const exists = await browser.$(this.selector).isClickable();
        return Promise.resolve(exists);
    }

    public async getText(): Promise<string> {
        const text = await this.getElement()
            .getText();
        return text;
    }

    public async getAttribute(selector: string, attribute: string = ""):  Promise<string> {
        //OLD const text =  browser.client.getAttribute(selector, attribute);
        const text =  browser.getElementAttribute(selector, attribute);

        return text;
    }


    public getElement(): WebdriverQuery {
        if (this.parent) {
            return this.parent.getElement()
                .$(this.selector);
        } else {
            //OLD return browser.client.$(this.selector);
            return browser.$(this.selector);
        }
    }
}
