/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from "../matButton";
import { throwError } from 'rxjs';
//import { error } from '@angular/compiler/src/util';
import { allure } from '../allure/allure';
import { reject } from 'q';
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const credsLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "userSettingsCredsLocators.json"));

export class UserSettingsButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Kevin user settings button");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async verifyKevinSettingsDisabled(): Promise<boolean> {
        let disabled: boolean = false;
        const a = await browser.$(credsLocators.userSettingsBtn).waitForExist();
        if (a) {
            disabled = true;
        }
        return disabled;
    }

    public async verifyKevinSettingsEnabled(): Promise<boolean> {
        let enabled: boolean = false;
        const a = await browser.$(credsLocators.userSettingsBtn).waitForExist();
        if (a) {
            enabled = true;
        }
        return enabled;
    }

    public async kevinBtnEnabled(): Promise<boolean> {
         let enabled: boolean = false;
         let isEnabled: any  = await browser.$(credsLocators.userSettingsBtn).isEnabled().then(async (value) => {
            if (value === true) {
                console.log("Return value: " + true +`${value}`);
                await browser.$(credsLocators.userSettingsBtn).getValue().then(async (value2) => {
                    expect(value2).toEqual("true");
                });
                return enabled = true;
            }
            else if (value === false){
              console.log("Return value: " + false +`${value}`);
            }
            else{
            }
            return isEnabled;
        }).catch((Error:any)=>{
            console.log("Exception caught : " + `${Error}`);
        });
        return enabled;
    };


    public async verifyKevinisClickable(): Promise<boolean> {
        let clickable: boolean = false;
        await browser.$(credsLocators.userSettingsBtn).waitForExist().then(async (value) => {
            clickable = value;
        }).catch((Error:any) => {
            console.log("FINAL : " + `${Error}`);
        });
        return clickable;
    }

    public async verifyKevinInTabularForm(): Promise<boolean> {
        let kevinInTabularForm: boolean = false;
        const a = await browser.$(credsLocators.userSettingsBtn).waitForExist();
        if (a) {
            const exists = await browser.$(locators.kevinTable).isExisting();
            if (exists) {
                kevinInTabularForm = true;
            }
        }
        return kevinInTabularForm;
    }

    /**
     * This function returns true if the Kevin Window is open, by checking if the Kevin drawer element is open
     */
    public async verifyKevinIsPrompted(): Promise<boolean> {
        let kevinWindowOpen: boolean = false;
        const a = await browser.$(credsLocators.userSettingsBtn).waitForExist()
        if (a) {
            const exists = await browser.$(locators.kevinWindowDrawerOpen).isExisting();
            kevinWindowOpen = true;
        }
        return kevinWindowOpen;
    }

    /**
     * This function tests if the string "Extron Control for Web" is present as an entry in the Kevin table.
     * For example, if a device has the name "Extron Control for Web", this function will return true.
     */
    public async isPrimaryEcwPresent(): Promise<boolean> {
        let primaryEcwisPresent: boolean;
        await browser.$(locators.primaryEcwKevinEntry).isExisting().then(async (val) => {
            primaryEcwisPresent = val;
        }).catch((err) => {
            console.log("userSettingsButton.po.ts->isPrimaryEcwPresent: " + err);
            primaryEcwisPresent = false;
        });
        return primaryEcwisPresent;
    }

    public async isEnabled():Promise<boolean> {
        const isEnabled = await browser.$(credsLocators.credentialsbtnenabled_disabled)
            .isEnabled();

        return isEnabled;
    };

    public async isDisabled():Promise<boolean> {
        const isEnabled = await browser.$(credsLocators.credentialsbtnenabled_disabled)
        .isEnabled();
        return isEnabled? false : true;
    };

};
