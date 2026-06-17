// @ts-nocheck
import { resolve } from "dns";
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../allure/allure";
import { MatButton } from "../matButton";
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const locators2 = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));
export class Grabber extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "open message pane");
    }

    public async grabber() : Promise<number> {
        const coord = browser.$(this.selector);
        return coord.getLocation("x");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    /**
     * Returns true if message pane moves as expected
     * Positive values move the grabber to the right, Negative to the left
     * @param movement : number
     */
    public async clickAndDragHorizontally(movement : number): Promise<boolean> {
        if (movement === 0) return true;
        let result : boolean = false;
        await allure.step(`Move Grabber and check if it moved`, async () => {
            await allure.screenshot(this.app, "Before");
            await browser.pause(timeout.fast);
            const location : any = await browser.$(this.selector)
                .getLocation()
                .valueOf();
            // await browser.$(this.selector)
            //     .moveToObject()
            //     .click(this.selector)
            //     .buttonDown("LEFT");
            // await browser.$(this.selector)
            //     .moveToObject(movement, 0);
            const destination : any = await browser.$(this.selector)
                .getLocation()
                .valueOf();
            if (movement < 0){
                if (location.x > destination.x){
                    result = true;
                }
            }else {
                if (location.x < destination.x){
                    result = true;
                }
            }
            await browser.pause(timeout.fast);
            await allure.screenshot(this.app, "After");
            // return to original state
            // await browser.$(this.selector)
            //     .moveToObject(movement, 0)
            //     .click(this.selector)
            //     .buttonUp("LEFT");
            await browser.pause(timeout.fast);
        });
        return result;
    }

    public async grabberIsVisible(): Promise<boolean> {
        await browser.pause(timeout.medium);
        const a =  await browser.$(this.selector)
        .waitForExist()
        .then(async () => {
            return a;
        })
        .catch((err: Error) => {
            console.log("From messagePaneIsVisible: " + `${err}`);
            return false;
        });
        return a;
    }
}
