/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from '../allure/allure';
import { MatButton } from '../matButton';
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const controllerLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "controllerLocators.json"));


export class StartProgramButton extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Destiny InputPath Field");
    }

    public async click(): Promise<void> {
        await super.click();
    }
    public async checkStartProgramButtonPresent1(): Promise<boolean> {
        await browser.pause(timeout.medium);
        const startProgramButton = await browser.$(locators.startProgramButton).waitForExist();


        return startProgramButton;
    }
     /**
     * use this
     */
    public async checkStartProgramButtonPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From checkStartProgramButtonPresent: " + `${err}`);
            a = false;

        });
        await allure.screenshot(this.app, "After");
        return a;
    }


    public async checkProgramIsRunning(ipAddress: any, userName: any, password: any, vtlpGui?: any, vtlplabel?: any, vtlplabel1?: any, vtlplabel2?: any, vtlplabel3?: any): Promise<boolean> {
        let message: boolean = false;
        await browser.pause(timeout.medium);
        const url = "https://" + ipAddress + "/web/vtlp/" + vtlpGui + "/index.html#/main";
        await browser.newWindow(url);
        await browser.$(controllerLocators.userName).setValue(userName);
        await browser.$(controllerLocators.password).setValue(password);
        await browser.$(controllerLocators.signIn).click();
        await browser.pause(timeout.slow);
        await browser.$(controllerLocators.testingCsp)
            .getText().then(async (text: string) => {
                await browser.pause(timeout.medium);
                if (text.includes(vtlplabel)) {
                    await browser.$(controllerLocators.csp1)
                        .getText().then(async (text1: string) => {
                            await browser.pause(timeout.medium);
                            if (text1.includes(vtlplabel1)) {

                                await browser.$(controllerLocators.csp2)
                                    .getText().then(async (text2: string) => {
                                        await browser.pause(timeout.medium);
                                        if (text2.includes(vtlplabel2)) {
                                            await browser.$(controllerLocators.toggle)
                                                .getText().then(async (text3: string) => {
                                                    await browser.pause(timeout.medium);
                                                    if (text3.includes(vtlplabel3)) {
                                                        message = true;
                                                    }
                                                }).catch(async (err:Error) => {
                                                    console.log(err);
                                                });
                                        }
                                    }).catch(async (err:Error) => {
                                        console.log(err);
                                    });
                            }
                        }).catch(async (err:Error) => {
                            console.log(err);
                        });
                }
            }).catch(async (err:Error) => {
                console.log(err);
            });
        return message;
    }

    public async checkStartProgramTextPresent1(): Promise<boolean> {
        await browser.pause(timeout.medium);
        const startProgramText = await browser.$(locators.startProgramText).waitForExist();


        return startProgramText;
    }

    public async checkStartProgramTextPresent(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.log("From checkStartProgramTextPresent: " + `${err}`);
            a = false;

        });
        await allure.screenshot(this.app, "After");
        return a;
    }
    


    public async checkNBPIsRunning(ipAddress: any, userName: any, password: any, ebpGUI: any,ebpLabel:any): Promise<boolean> {
        let message: boolean = false;
        await browser.pause(timeout.medium);
        await browser.$(controllerLocators.userName).setValue(userName);
        await browser.$(controllerLocators.password).setValue(password);
        await browser.$(controllerLocators.signIn).click();
        await browser.pause(timeout.slow);
        await browser.$("//button/div[contains(text(),\"ON\")]")
            .getText().then(async (text: string) => {
                await browser.pause(timeout.medium);
                if (text.includes(ebpLabel)) {
                  
                                    message = true;
                                                    }
                                    }).catch(async (err:Error) => {
                                                    console.log(err);
                                                });
                                       
        return message;
    }


    public async checkEBPIsRunning(ipAddress: any, userName: any, password: any, ebpGUI: any,ebpLabel:any): Promise<boolean> {
        let message: boolean = false;
        await browser.pause(timeout.medium);
        await browser.$(controllerLocators.userName).setValue(userName);
        await browser.$(controllerLocators.password).setValue(password);
        await browser.$(controllerLocators.signIn).click();
        await browser.pause(timeout.slow);
        await browser.$("//button/div[contains(text(),\"ON\")]")
            .getText().then(async (text: string) => {
                await browser.pause(timeout.medium);
                if (text.includes(ebpLabel)) {
                  
                                    message = true;
                                                    }
                                    }).catch(async (err:Error) => {
                                                    console.log(err);
                                                });
                                       
        return message;
    }

    public async matchStartProgramText(myStartProgramText: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await allure.step(`Set the value of ${this.name} input to ${myStartProgramText}`, async () => {
                await allure.screenshot(this.app, "Before");
                await browser.pause(timeout.slow);
                const a = await browser.$( this.selector).waitForExist()
                .then(async () => {
                    return a;
                }).catch((err: Error) => {
                    console.log("From matchStartProgramText: " + `${err}`);
                    // reject(err);
                });
                await browser.$(this.selector)
                    .getText()
                    .then(async (text: string) => {
                        await browser.pause(timeout.medium);
                        if (text.includes(myStartProgramText)) {

                            message = true;
                        }
                        await allure.screenshot(this.app, "After");

                    }).catch((err: Error) => {
                        console.log('matchStartProgramText:' + `${err}`);
                        // reject(err);
                    });
            });
        });
        await allure.screenshot(this.app, "After");
        return message;
    }

    public async isDisabled():Promise<boolean> {
        let elementState: boolean = false;
        elementState = await (await browser.$(this.selector)).isEnabled()
        return elementState == false;
    };

public async checkUserCanControlNavigatorEndpoints(ipAddress: any, userName: any, password: any): Promise<boolean> {
    //let message: boolean = false;
    await browser.pause(timeout.medium);
    let a;
    await browser.$(controllerLocators.userName).setValue(userName);
    await browser.$(controllerLocators.password).setValue(password);
    await browser.$(controllerLocators.signIn).click();
    await browser.pause(timeout.slow);
    await browser.pause(timeout.slow);
    await browser.$(controllerLocators.ties)
        .click().then(async () => {
            await browser.pause(timeout.fast);
                await browser.$(controllerLocators.audioVideoTieButton)
                    .click().then(async () => {
                        await browser.pause(timeout.fast);
                            await browser.$(controllerLocators.audioVideoTieOption)
                                .click().then(async () => {
                                    await browser.pause(timeout.fast);
                                    await browser.$(controllerLocators.tieVideoIcon).waitForExist()
                                    .then(async (val) => {
                                        if (val===true) {
                                        await browser.$(controllerLocators.tieAudioIcon).waitForExist()
                                        .then(async (val1) => {
                                            a = val1;  
                                            await browser.$(controllerLocators.tieVideoIcon)
                                                .click()
                                                .then(async () => {
                                                })
                                                .catch((err: Error) => {
                                                    console.log("Exception caught: " + `${err}`);
                                                });
                                        }).catch((err: Error) => {
                                            console.log("From tieaudio Present: " + `${err}`);
                                            a = false;
                                        });
                                    }
                                   // });  
                                    }).catch((err: Error) => {
                                        console.log("From tievideopresent: " + `${err}`);
                                        a = false;
                                    });
                                });
                        })
                    }).catch(async (err:Error) => {
                        console.log(err);
                    });
    return a;
}

}