/* tslint:disable */
// @ts-nocheck
import { MatButton } from '../matButton';
import * as fs from "fs-extra";
import * as path from "path";
import { SignInButton } from "./signInButton.po";
import { LogClient } from '@extron/winston-logger';
import { ActivationKey } from './activationKeyField.po';
import { app } from 'electron';
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const accessKeys = fs.readJsonSync(path.join(__dirname, "..", "JSON", "keys.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const accessLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "accessControlLocators.json"));
const logClient = new LogClient("e2e:Logout Button POM");

export class LogOutButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Logout");
    }

    public async click(): Promise<void> {
        await super.click();
    }


    public async performLogout(): Promise<any> {
        let flag: boolean = false;
        const logoutBtn = await this.app.$(accessLocators.logOutBtn)
            .getAttribute('id');
        await expect(logoutBtn).toContain("logOut")
        if (logoutBtn === "logOut") {
            await this.app
                .$(accessLocators.logOutBtn)
                .click()
                .then(async () => {
                    await this.app.pause(timeout.fast)
                    await this.app.$(accessLocators.popUpLogOutBtn).click().catch((err: Error) => {
                        logClient.error(err);
                    });
                }).catch((err: Error) => {
                    logClient.error(err);
                });
            flag = true;
        } else {
            flag = false
        }
        return flag;
    }


    // Purpose of this function to login if you are logged out and vice versa
    public async loginApp(): Promise<boolean> { //
        const signIn = new SignInButton(this.app, accessLocators.signInBtn, "");
        const keys = new ActivationKey(this.app, accessLocators.activationKeyField);
        let flag: any = true;
        await (await this.app.$("body > progcomp-root > neat-title-bar-window")).waitForExist({ timeout: 8000 })
            .then((value: boolean) => {
                expect(value).toBe(true);
            }).catch(async (err: Error) => {
                console.log(`DOM does not exist... ` + `${err}`);
                logClient.error(`DOM does not exist... ` + `${err}`);
                await reject(`${err}`);
                flag = false;
                //fail("LOGOUT");
            });
        // give little time to load the DOM
        await (await this.app.$(accessLocators.activationKeyField)).waitForExist({ timeout: timeout.slow })
            .then(async (value: boolean) => {
                console.log("KEYS EXIST? :" + `${value}`);
                if (value) {
                    await this.app.$(accessLocators.activationKeyField).click().then(async () => {
                        await keys.inputKeys().catch((err: Error) => {
                            console.log("Error caught in input keys " + err);
                            //fail("INPUT KEYS");
                        });
                        await signIn.signInClick().then(async () => {
                        }).catch((err: Error) => {
                            logClient.error(`${err}`);
                            //fail("Inside the logout Conditional function");
                        });
                    });

                }
            });
        return flag;
    }
    // Purpose of this function to login if you are logged out and vice versa
    public async loginToApp(username: string): Promise<boolean> { //
        const signIn = new SignInButton(this.app, accessLocators.signInBtn, "");
        const keys = new ActivationKey(this.app, accessLocators.activationKeyField);
        let flag: any = true;
        (await this.app.$("body > progcomp-root > neat-title-bar-window")).waitForExist({ timeout: 8000 })
            .then((value: boolean) => {
                expect(value).toBe(true);
            }).catch(async (err: Error) => {
                console.log(`DOM does not exist... ` + `${err}`);
                logClient.error(`DOM does not exist... ` + `${err}`);
                await reject(`${err}`);
                flag = false;
                //fail("LOGOUT");
            });
        // give little time to load the DOM
        await (await this.app.$(accessLocators.activationKeyField)).waitForExist({ timeout: 8000 })
            .then(async (value: boolean) => {
                console.log("KEYS EXIST? :" + `${value}`);
                if (value) {
                    await this.app.$(accessLocators.activationKeyField).click().then(async () => {
                        await keys.enterCredentials(username).catch((err: Error) => {
                            console.log("Error caught in input keys " + err);
                            //fail("INPUT KEYS");
                        });
                        await signIn.signInClick().then(async () => {
                        }).catch((err: Error) => {
                            logClient.error(`${err}`);
                            //fail("Inside the logout Conditional function");
                        });
                    });

                }
            });
        return flag;
    }
};
