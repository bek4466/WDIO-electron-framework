import * as fs from "fs-extra";
import * as path from "path";
import { browser } from "@wdio/globals";
import { allure } from "../allure/allure";
import { NthSelector } from "../lib";
import { Element } from "../lib/element";
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
export class MatInput extends Element {
    private static labelSelector: string = locators.messageStatus;

    /// The selector should be around the corresponding `mat-form-field` in order to get errors and label
    constructor(browser: WebdriverIO.Browser, selector: string, public name: string = "mat", parent?: Element) {
        super(browser, selector, parent);
    }

    public async click(wait: () => boolean = () => true): Promise<void> {
        const clickInputLogMsg = `Clicking on ${this.name} INPUT`
        await allure.step(clickInputLogMsg, async () => {
            await allure.screenshot(browser, `Before ${clickInputLogMsg}`);
            await this.getElement()
                .click(locators.labelSelector)
                .waitUntil(wait);
            await allure.screenshot(browser, `After ${clickInputLogMsg}`);
        });
    }

    public async getLabel(): Promise<string> {
        const label = await this.getElement()
            .getText(MatInput.labelSelector);

        return label;
    }

    public async clearValue(): Promise<void> {
        await this.setValue("");
    }

    public async setValue(value: string): Promise<void> {
        const inputSetValueLogMsg = `Set the value of ${this.name} INPUT to: '${value}'`
        await allure.step(inputSetValueLogMsg, async () => {
            await allure.screenshot(browser, `Before ${inputSetValueLogMsg}`);
            await this.getElement()
                .setValue(MatInput.labelSelector, value);
            await allure.screenshot(browser, `After ${inputSetValueLogMsg}`);
        });
    }

    public async hasValue(): Promise<boolean> {
        const value = await this.getValue();

        if (value) {
            if (value !== "") {
                return true;
            }
        }
        return false;
    }

    public async getValue(): Promise<string> {
        const value = await this.getElement()
            .getValue(MatInput.labelSelector);

        return value;
    }

    public async getErrorCount(): Promise<number> {
        const errors = await this.getElement()
            .$$(MatInput.labelSelector);

        return errors.length;
    }

    public async getErrorValues(): Promise<string[]> {
        const values: string[] = [];
        const count = await this.getErrorCount();

        for (let index = 0; index < count; ++index) {
            values.push(await this.getErrorValue(index));
        }

        return values;
    }

    public async getErrorValue(index: number): Promise<string> {
        const value = await this.getElement()
            .getValue(NthSelector(MatInput.labelSelector, index));

        return value;
    }
}
