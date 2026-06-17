import { allure } from "../allure/allure";
import { Element } from "../lib/element";
import { browser } from "@wdio/globals";
export class MatSelect extends Element {
    constructor(browser: WebdriverIO.Browser, selector: string, private name: string, parent?: Element) {
        super(browser, selector, parent);
    }

    public optionSelector(index: number): string {
        return `mat-option:nth-child(${index + 1})`;
    }

    public async getValues(): Promise<string[]> {
        const values: string[] = [];
        const optionCount = await this.getValueCount();

        for (let i = 0; i < optionCount; ++i) {
            values.push(await this.getValueByIndex(i));
        }

        return values;
    }

    public async getValueByIndex(index: number): Promise<string> {
        const value = await browser
            .$(this.optionSelector(index))
            .getText();

        browser.keys("\uE00C");
        await browser.$("mat-option").waitForExist({timeout: 10000, timeoutMsg: "getValueByIndex"});

        return value;
    }

    public async hasSelectedValue(): Promise<boolean> {
        const exists = await browser.$(".mat-selected")
            .isExisting();

        browser.keys("\uE00C");
        await browser.$("mat-option").waitForExist({timeout: 10000, timeoutMsg: "hasSelectedValue"});

        return exists;
    }

    public async getSelectedValue(): Promise<string> {
        const value = await browser
            .$(".mat-selected")
            .getText();

        browser.keys("\uE00C");
        await browser.$("mat-option").waitForExist({timeout: 10000, timeoutMsg: "getSelectedValue"});

        return value;
    }

    public async getSelectedIndex(): Promise<number> {
        const value = await this.getSelectedValue();

        return this.getIndexByValue(value);
    }

    public async selectValue(value: string): Promise<number> {
        const optionCount = await this.getValueCount();

        for (let i = 0; i < optionCount; ++i) {
            if (await this.getValueByIndex(i) === value) {
                await this.selectValueByIndex(i);
                return i;
            }
        }

        /// object not found
        return -1;
    }

    public async selectValueByIndex(index: number): Promise<void> {
        const selectValueByIndexLogMsg = `Selecting the value with index ${index} for ${this.name} select`
        await allure.step(selectValueByIndexLogMsg, async () => {
            await allure.screenshot(this.app, `Before ${selectValueByIndexLogMsg}`);
            await browser
                .$(this.optionSelector(index))
                .click();
            await allure.screenshot(this.app, `After ${selectValueByIndexLogMsg}`);
        });
    }

    public async getIndexByValue(value: string): Promise<number> {
        const optionCount = await this.getValueCount();

        for (let i = 0; i < optionCount; ++i) {
            if (await this.getValueByIndex(i) === value) {
                return i;
            }
        }

        /// object not found
        return -1;
    }

    public async getValueCount(): Promise<number> {
        const options = await browser.$$("mat-option")

        browser.keys("\uE00C");
        await browser.$("mat-option").waitForExist({timeout: 10000, timeoutMsg: "getValueCount"});

        return options.length;
    }
}
