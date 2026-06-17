/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import {MatButton} from "../matButton";
import {allure} from '../allure/allure';
import {reject} from 'q';
import {MessagePaneComponent} from '../messagePaneComponent/messagePaneComponent.po';
// import {error} from '@angular/compiler/src/util';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
export class MessagesLog extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Message logs table");
    }

    public async click(): Promise < void > {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await super.click();
        });
        await allure.screenshot(this.app, "After");
    }

    public async commandClick(wait: () => Promise < boolean > = async () => true): Promise < any > {
        browser.addCommand("waitAndClick", async function (timeout) {
            await browser.waitUntil(deploymentLocators.statusTxt);
            return browser.waitUntil(wait);
        }, true)
    }


    public async verifyLogsMessages(wait: () => Promise < boolean > = async () => true): Promise < boolean > {
        let flag: boolean = false;
        let statusCompleted: string = "Status: ";
        await this.commandClick().catch((err: Error) => {
            console.debug("Exception caught: " + `${this.verifyLogsMessages}` + `${err}`);
            // reject(err);
        })
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.getElement().waitUntil(deploymentLocators.statusTxt).getText(deploymentLocators.statusTxt).waitUntil(wait).then(async (text: any) => {
                await expect(text).toMatch(statusCompleted);
                flag = true;
            }).catch((err: Error) => {
                console.debug("Exception caught: " + `${this.verifyLogsMessages}` + `${err}`);
                // reject(err);
            });
        });
        await allure.screenshot(this.app, "After");
        return flag;
    }


    public async verifyStatusText(): Promise < boolean > {
        let res: boolean = false;
        browser.$("#deploy-log-status")
        .getText()
        .then(async (text) => {
            await expect(text).toContain("completed Upload successfully completed");
            res = true;
        })
        return res;
    }

    /**
     * should be used with statusTxt object created from deployment
     */
    public async verifyMessageLogs(): Promise < boolean > {
        await allure.screenshot(this.app, "Verify Upload success");
        //return this.verifyUploadSuccessOnly();
        let res: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            let statusStart, statusProgress, progText;
            try {
                statusStart = await browser.waitUntil(async () => {
                    await browser.$(this.selector).waitForExist()
                        .then(async val => {
                            if (val) {
                                //if true then get the text
                                await browser.$(this.selector).getText().then(valText => {
                                    progText = valText;
                                }).catch(e => {
                                    progText = '';
                                });
                            }
                        });
                    return progText.includes("Upload Progress") ? true : false;
                }, {
                    timeout: 50000
                });
            } catch (err) {
                // reject(err);
                console.log("Error CaughtA:verifyMessageLogs " + `${err}`);
                return false;
            }
            try {
                statusProgress = await browser.waitUntil(async () => {
                    await browser.$(this.selector).waitForExist()
                        .then(async val => {
                            if (val) {
                                //if true then get the text
                                await this.getElement().getText().then(valText => {
                                    progText = valText;
                                }).catch(e => {
                                    progText = '';
                                });
                            }
                        });
                    return progText.includes("completed Upload successfully completed") ?
                        true :
                        false;
                }, {
                    timeout: 50000
                });
            } catch (err) {
                // reject(err);
                console.log("Error CaughtB: " + `${err}`);
                return false;
            }
            if (statusStart && statusProgress) {
                res = true;
                return true;
            } else {
                res = false;
            }
        });
        await allure.screenshot(this.app, "After");
        return res;
    }



    public async verifyMessageLogsSpecific(message: string): Promise < boolean > {
        let messageToVerify: string = message;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            let statusStart, progText;
            try {
                statusStart = await browser.waitUntil(async () => {
                    await browser.getElementText(this.selector)
                        .then(async (val) => {
                            if (await val.includes(message)) {
                                console.log("VALUE:  " + `${val}`);
                                //if true then get the text
                                await this.getElement().getText().then(async (valText: string) => {
                                    console.log("VALUE TEXT: " + `${valText}`);
                                    progText = valText;
                                }).catch((err: Error) => {
                                    progText = '';
                                    console.log(err);
                                    reject(err);
                                });
                            }
                        });
                    return progText.includes(messageToVerify.trim()) ? true : false;
                }, {
                    timeout: 10000
                });
            } catch (err) {
                // reject(err);
                console.log("Error CaughtA:verifyMessageLogsSpecific " + `${err}`);
                return false;
            }
        });
        await allure.screenshot(this.app, "After");
        return true
    }

    public async verifyMessageLogsNegative(): Promise < boolean > {
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            try {
                let statusComplete = await browser.waitUntil(
                    async () => {
                        const progText = await browser
                            .$(deploymentLocators.errorMsg)
                            .getText();
                        await allure.screenshot(this.app, "After");
                        return progText.includes("Invalid file") ? true : false;
                    }, {
                        timeout: 5000,
                        timeoutMsg: "Text is not present"
                    }
                );
                return statusComplete;
            } catch (err) {
                // reject(err);
                console.log(err);
                return false;
            }
        });
        await allure.screenshot(this.app, "After");
        return false;
    }

    /**
     * Only if the checkme string is present in the message log this function returns true
     * @param checkme :string
     */
    public async checkMessageLog(checkme: string): Promise < boolean > {
        let message: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await allure.step(`Set the value of ${this.name} input to ${checkme}`, async () => {
                await allure.screenshot(this.app, "Before");
                await browser.pause(timeout.slow);
                const a = await browser
                    .$(locators.uploadMsg).waitForExist().then(async () => {
                        return a;
                    }).catch((err: Error) => {
                        console.log("From checkMessageLog: " + `${err}`);
                        // reject(err);
                    });
                await browser
                    .$(deploymentLocators.statusTxt).waitForExist().catch((err) => {
                        console.info("From checkMessageLog: " + `${err}`);
                    });
                await browser
                    .$(deploymentLocators.statusTxt)
                    .getText()
                    .then(async (text: any) => {
                        console.log(text);
                        await browser.pause(timeout.fast);
                        if (text.includes(checkme)) {
                            //pass string from test
                            message = true;
                        }
                        await allure.screenshot(this.app, "After");
                    }).catch((err: Error) => {
                        console.log('checkProgramLog:' + `${err}`);
                        // reject(err);
                    });
            });
        });
        await allure.screenshot(this.app, "After");
        return message;
    }



    /**
     * should be used with failure statusTxt object created from deployment
     */
    public async verifyFailureMessageLogs(): Promise < boolean > {

        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            let statusStart, statusProgress, progText;
            try {
                statusStart = await browser.waitUntil(async () => {
                    await browser.$(this.selector).waitForExist()
                        .then(async val => {
                            if (val) {
                                //if true then get the text
                                await this.getElement().getText().then(valText => {
                                    progText = valText;
                                }).catch(e => {
                                    progText = '';
                                });
                            }
                        });
                    return progText.includes("Upload Progress") ? true : false;
                }, {
                    timeout: 15000
                });
            } catch (err) {
                // reject(err);
                console.log("Error CaughtA:verifyFailureMessageLogs " + `${err}`);
                return false;
            }
            try {
                statusProgress = await browser.waitUntil(async () => {
                    await browser.$(this.selector).waitForExist()
                        .then(async val => {
                            if (val) {
                                //if true then get the text
                                await this.getElement().getText().then(valText => {
                                    progText = valText;
                                }).catch(e => {
                                    progText = '';
                                });
                            }
                        });
                    return progText.includes("failed Upload failed") ?
                        true :
                        false;
                }, {
                    timeout: 80000
                });
            } catch (err) {
                // reject(err);
                console.log("Error CaughtB: " + `${err}`);
                return false;
            }
            if (statusStart && statusProgress) {
                return true;
            }
        });
        await allure.screenshot(this.app, "After");
        return true
    }


    public async checkMessageLog2(checkme: string): Promise < boolean > {
        let message: boolean = false;
        await browser.$(deploymentLocators.statusTxt).waitForExist().then(async () => {}).catch((err: Error) => {
            console.log("checkProgramLog2: " + `${err}`);
            // reject(err);
        });
        await browser
        .$(deploymentLocators.statusTxt)
        .getText()
        .then(async (text: string) => {
            await browser.pause(timeout.medium);
            if (text.includes(checkme)) {
                //pass string from test
                message = true;
            }
        }).catch((err: Error) => {
            console.log('checkProgramLog2:' + `${err}`);
            // reject(err);
        });
        return message;
    }

    /**
     * use this only with statusTxt and only when looking for the Upload successful message
     */
    public async verifyUploadSuccessOnly(): Promise < boolean > {
        let checkme: string, severityType: string;
        let flag: boolean = false
        const MessageColumns = new MessagePaneComponent(this.app);
        MessageColumns.messageColumn.checkMessagePaneLogs(checkme, severityType)
        .then(async (value: boolean) => {
            flag = value;
        })
        .catch((err: Error) => {
            console.log(err);
        });
        return flag;
    }


    /**
     * should be used with failure statusTxt object created from deployment
     */
    public async verifySuccessMessagesLogs(): Promise < boolean > {
        // await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
        await allure.screenshot(this.app, "Before");
        let statusProgress = false;
        let valText1;
        try {
            // await browser.waitUntil(this.selector).then(async()=>{
            statusProgress = await browser.waitUntil(async () => {
                await browser.$(this.selector).waitForExist()
                    .then(async val => {
                        if (val) {
                            //if true then get the text
                            await this.getElement().getText().then(valText => {
                                valText1 = valText.replace('%', '').trim();
                                console.log("valText1" + valText1);
                                if (Number(valText) >= 1 && Number(valText) <= 150) {
                                    statusProgress = true;
                                }
                            }).catch(e => {
                                valText1 = '';
                            });
                        }
                    });
                return statusProgress
            }, {
                timeout: 20000
            });
        } catch (err) {
            //reject(err);
            console.log("Error CaughtB: " + `${err}`);
            //statusProgress =  false;
        }
        return statusProgress
    }
}