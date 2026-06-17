/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from 'q';

import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { LogClient } from '@extron/winston-logger';
import { CommonMethods } from "../../tests/commonMethods.po";
const logClient = new LogClient("e2e:OK Button POM");
const common = new CommonMethods();
const foreignDates = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "foreignDates.json"));
export class ProfilePage extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "profilePage selector");
    }

    public async click(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }


    public async isClickable(): Promise<boolean> {
        let elementState: boolean = false;
        await allure.step(`Set the value of ${this.name} input to`, async () => {
            await allure.screenshot(this.app, "Before");
            elementState = await this.app.$(this.selector).isEnabled();
            await console.log(await this.app.$(this.selector).getAttribute('style'));
            elementState = true;
        }).catch((err: Error) => {
            logClient.error("Exception caught: " + `${err}`);
        });
        await allure.screenshot(this.app, "After");
        return elementState;
    };


    public async buttonText(): Promise<void> {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    await expect(text).toContain("Ok button Text")
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + this.buttonText() + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
    }

    public async checkUserName(userName: string): Promise<boolean> {
        let userNameMatched: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    if (text === userName) {
                        userNameMatched = true;
                    }
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
        return userNameMatched;
    }

    public async checkExpiredDate(userName: string): Promise<boolean> {
        let userNameMatched: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    if (text.includes(userName)) {
                        userNameMatched = true;
                    }
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
        return userNameMatched;

    }
    public async checkText(text: string): Promise<boolean> {
        let textMatched: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text1: string) => {
                    console.log("text1" + text1);
                    if (text1.includes(text)) {
                        textMatched = true;
                    }
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
        return textMatched;
    }

    public async compareValue() {
        let newDate;
        await this.app
            .$(this.selector)
            .getText()
            .then(async (text1: string) => {
                const date1 = text1.substring(12, 38);
                newDate = new Date(date1).valueOf();
            }).catch((err: Error) => {
                logClient.error("Exception Caught: " + `${err}`);
            });
        return newDate;
    }
    public async checkLastRenewed(date: string): Promise<boolean> {
        let userNameMatched: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app
                .$(this.selector)
                .getText()
                .then(async (text: string) => {
                    var renewedString = text.substring(
                        text.lastIndexOf("Renewed: ", text.indexOf("RENEW")))
                    if (text.includes(date), 8) {
                        userNameMatched = true;
                    }
                }).catch((err: Error) => {
                    logClient.error("Exception Caught: " + `${err}`);
                });
        });
        await allure.screenshot(this.app, "After");
        return userNameMatched;
    }

    /**
     * 
     * @param monthOffset Set to 1 for Expiration Month. 0 for current Month
     * @returns T/F if Foreign date has correct value and format
     */
    public async hasCorrectForeignDate(monthOffset: number): Promise<boolean> {
        let expDate = await this.getText();
        let sysLang = common.getEnvLocale().split('.')[0];
        let date = new Date();

        if (sysLang.match(/de_DE/)) {
            if (expDate.includes(`${date.getDate()}. ${foreignDates[sysLang].Months[date.getMonth() + monthOffset % 12]} ${date.getFullYear()}`))
                return true;
        }
        console.log("This is the exp date" + expDate)
        console.log("The comparison" +expDate.includes(`${foreignDates[sysLang].Days[date.getDay()]}, ${foreignDates[sysLang].Months[date.getMonth() + monthOffset % 12]} ${date.getDate()}, ${date.getFullYear()}`))
        if (sysLang.match(/en_US/)) {
            if (expDate.includes(`${foreignDates[sysLang].Months[date.getMonth() + monthOffset % 12]} ${date.getDate()}, ${date.getFullYear()}`))
                return true;
        }

        if (sysLang.match(/zh_CN/)) {
            if (expDate.includes(`${date.getFullYear()}年${foreignDates[sysLang].Months[date.getMonth() + monthOffset % 12]}${date.getDate()}日`))
                return true;
        }
        // +1%12  to date adds one and loops back to January if Current Month is December
        if (expDate.includes(`${date.getDate()} ${foreignDates[sysLang].Months[date.getMonth() + monthOffset % 12]} ${date.getFullYear()}`))
            return true;

        return false;
    }

}
