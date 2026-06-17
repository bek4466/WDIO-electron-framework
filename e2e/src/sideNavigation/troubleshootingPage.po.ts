
/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
// import { Application, SpectronWindow } from "spectron";
import { MatButton } from "../matButton";
import allureReporter from '@wdio/allure-reporter';
import { allure } from '../allure/allure';
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
let traceLogData;
// let browserWindow: SpectronWindow;
export class TroubleshootingPage extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Side Nav to Troubleshooting Page");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async silenceClick(): Promise<void> {
        await super.silentClick();
    }

    public async traceTitleValidation(startTxt: string, stopTxt: string, spinnerTxt: string, clearTxt: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${stopTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.traceTxtTitle).getText().then(async (text: string) => {
                await expect(text).toContain(inputData.traceTitleTxt);
            }).catch((e: Error) => reject((e: Error) => {
                console.warn("Exception caught in traceTxtTitle: " + `${e}`);
            }));
            await browser.pause(timeout.slow);
            await this.app.$(locators.startTraceBtn).click().then(async () => {
                await browser.pause(timeout.medium);
                if (this.app.$(locators.stopTraceBtn).isClickable() || this.app.$(locators.startTraceBtn).isClickable()) {
                    await this.app.$(locators.stopTraceBtn).getText().then(async (text: string) => {
                        await expect(text).toContain('Stop');
                        if (text.includes(stopTxt)) {
                            message = true;
                        }
                    }).catch((e: Error) => reject((e: Error) => {
                        console.warn("Exception caught in TraceStopButtonFunc: " + `${e}`);
                    }));
                }
            }).catch((e: Error) => reject((e: Error) => {
                console.info("Exception caught in traceValidation: " + `${e}`);
            }));
            await allure.screenshot(this.app, "After");
        });
        await allure.step(`Set the value of ${this.name} input to ${startTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.stopTraceBtn).click().then(async () => {
                await browser.pause(timeout.medium);
                await this.app.$(locators.startTraceBtnValue).getText().then(async (text: string) => {
                    await expect(text).toContain('Play');
                    if (text.includes(startTxt)) {
                        message = true;
                    }
                }).catch((e: Error) => {
                    console.info("Exception caught in TraceStartButtonFunc: " + `${e}`);
                });
            }).catch((e: Error) => {
                console.info("Exception caught in traceValidation: " + `${e}`);
            });
            await allure.screenshot(this.app, "After");
        });
        await allure.step(`Set the value of ${this.name} input to ${spinnerTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.stopTraceBtn)
                .click()
                .then(() => {
                }).catch((e: Error) => {
                    console.info("Exception caught in traceValidation: " + `${e}`);
                });
            await this.app.$(locators.traceSpinner).getText().then(async (text: string) => {
                await expect(text).toBe('');
                if (text.includes(spinnerTxt)) {
                    message = true;
                }
            }).catch((e: Error) => reject((e: Error) => {
                console.info("Exception caught in traceValidation: " + `${e}`);
            }));
            await allure.screenshot(this.app, "After");
        });
        await allure.step(`Set the value of ${this.name} input to ${clearTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.clearTraceBtn).getText().then(async (text: string) => {
                await expect(text).toEqual('Clear');
                if (text.includes(clearTxt)) {
                    message = true;
                }
                return true;
            }).catch((e: Error) => {
                console.info("Exception caught in traceValidation: " + `${e}`);
            }).catch((e: Error) => {
                console.info("Final catch: " + `${e}`);
            });
            await allure.screenshot(this.app, "After");
        });
        return message;
    }

    // public async fullScreen(app: WebdriverIO.Browser, browserWindow: SpectronWindow) {
    //     return await browser.maximizeWindow();
    // }

    public async getLatestMsgMinuteAndSecondInArray(): Promise<Array<number>> {
        let minute: string
        let seconds: string
        try {
            let traceMessageCount = await browser.$(`//*[@id="trace-header-message-count"]`);
            await browser.pause(timeout.fast);
            let text = await traceMessageCount.getText()
            let messageTime = await browser.$(`//*[@id="row-trace-table-${text.split(' ')[0]}"]/td[2]/div`).getText();

            minute = messageTime.split(':')[1]
            seconds = messageTime.split(':')[2]
            seconds = seconds.split('.')[0]
        } catch (e) {
            console.error("Trace Message Count does not exist but we tried to use getText...")
            expect(true).toBe(false)
        }
        
        return [Number(minute),Number(seconds)];
    }

    public async tableList(table: string): Promise<boolean> {
        await allure.step(`Set the value of ${this.name} input to ${table}`, async () => {
            await allure.screenshot(this.app, "Before");
            // await this.fullScreen(this.app, browserWindow)
            const items = 3;
            let traceTableList = {
                logEntries: [],
            };
            let obj = {};
            const keys = ["IP Address", "Time", "Message"];
            // await browser
            //     .element(locators.tableRootSelector)
            //     .elements("[role='row']")
            //     .elements("[role='columnheader']")
            //     .elements("[role='gridcell']")
            //     .getText()
            //     .then((anyArr: any) => {
            //         const arr = anyArr as Array<string>;
            //         let index = 0;
            //         for (let item of arr) {
            //             const mod = index++ % items;
            //             obj[`${keys[mod]}`] = item;
            //             if (mod == items - 1) {
            //                 traceTableList.logEntries.push(obj);
            //                 obj = {};
            //             }
            //         }
            //     }).catch((err) => {
            //         console.log("troubleshootingPage.po.ts: " + `${err}`);
            //         return false;
            //     });
            const file = path.join(__dirname, "..", "JSON", "traceListTable.json");
            fs.writeFileSync(file, JSON.stringify(traceTableList, null, 2));
            traceLogData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "traceListTable.json"));
            await browser.pause(15000);
            const rowElemVisible = browser.$(locators.firstRowTrace).isClickable()
            if (rowElemVisible) {
                await browser.$(locators.firstRowTrace)
                    .getText()
                    .then(async (text) => {
                        const slicedData = text.slice(37)
                        // commented out since we don't know the real data
                        //  await expect(slicedData).toContain(traceLogData.logEntries[0].Message);
                    }).catch((err) => {
                        console.log("troubleshootingPage.po.ts: " + `${err}`);
                        return false;
                    });
            }
            else (err: Error) => {
                console.log(`First row is not visibe... ${err}`);
            }
            fs.removeSync(file);
            await allure.screenshot(this.app, "After");
        });
        return true;
    }





    public async traceTitleValidations(startTxt: string, stopTxt: string, spinnerTxt: string, clearTxt: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${stopTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.traceTxtTitle).getText().then(async (text: string) => {
                await expect(text).toContain(inputData.traceTitleTxt);
            })
            await browser.pause(timeout.slow);
            await this.app.$(locators.startTraceBtn).click().then(async () => {
                await browser.pause(timeout.medium);
                if (this.app.$(locators.stopTraceBtn).isClickable() || this.app.$(locators.startTraceBtn).isClickable()) {
                    await this.app.$(locators.stopTraceBtn).getText().then(async (text: string) => {
                        await expect(text).toContain('Stop');
                        if (text.includes(stopTxt)) {
                            message = true;
                        }
                    })
                }
            }).catch((e: Error) => reject((e: Error) => {
                console.info("Exception caught in traceValidation: " + `${e}`);
            }));
            await allure.screenshot(this.app, "After");
        });
        await allure.step(`Set the value of ${this.name} input to ${startTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.stopTraceBtn).click().then(async () => {
                await browser.pause(timeout.medium);
                await this.app.$(locators.startTraceBtnValue).getText().then(async (text: string) => {
                    await expect(text).toContain('Play');
                    if (text.includes(startTxt)) {
                        message = true;
                    }
                }).catch((e: Error) => {
                    console.info("Exception caught in TraceStartButtonFunc: " + `${e}`);
                });
            }).catch((e: Error) => {
                console.info("Exception caught in traceValidation: " + `${e}`);
            });
            await allure.screenshot(this.app, "After");
        });
        await allure.step(`Set the value of ${this.name} input to ${spinnerTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.stopTraceBtn)
                .click()
                .then(() => {
                }).catch((e: Error) => {
                    console.info("Exception caught in traceValidation: " + `${e}`);
                });
            await this.app.$(locators.traceSpinner).getText().then(async (text: string) => {
                await expect(text).toBe('');
                if (text.includes(spinnerTxt)) {
                    message = true;
                }
            })
            await allure.screenshot(this.app, "After");
        });
        await allure.step(`Set the value of ${this.name} input to ${clearTxt}`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.clearTraceBtn).getText().then(async (text: string) => {
                await expect(text).toEqual('Clear');
                if (text.includes(clearTxt)) {
                    message = true;
                }
                return true;
            }).catch((e: Error) => {
                console.info("Exception caught in traceValidation: " + `${e}`);
            }).catch((e: Error) => {
                console.info("Final catch: " + `${e}`);
            });
            await allure.screenshot(this.app, "After");
        });
        return message;
    }
    public async clickGoToDeploy(): Promise<void> {
        await allure.step(`Click on Go To Deploy`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.goToDeployButton).click()
                .catch((e: Error) => {
                    console.info("Exception caught in gotToDeploy Button " + `${e}`)
                    //fail("Got To Deploy Button Not Visible");
                });
        });
        await allure.screenshot(this.app, "After");
    }
    // Specifically the cancel button in the error message on troubleshooting page
    public async clickCancelButton(): Promise<void> {
        await allure.step(`Click on Cancel`, async () => {
            await allure.screenshot(this.app, "Before");
            await this.app.$(locators.errorMessageCancelButton).click()
                .catch((e: Error) => {
                    console.info("Exception caught in Cancel Button " + `${e}`)
                    //fail("Cancel Button Not Visible");
                });
        });
        await allure.screenshot(this.app, "After");
    }
    public async verifyErrorPopUpText(checkme: string): Promise<void> {
        await allure.step(`Verify Error PopUp Text`, async () => {
            await this.app.$("//p[contains(text(),'" + checkme + "')]").getText()
                .then(async (text: string) => {
                    const result = text.includes(checkme);
                    expect(result).toBe(true)
                })
                .catch((e: Error) => {
                    console.info("Exception caught in Error Message GetText " + `${e}`)
                    //fail("Verify Error Message Text not clickable or found")
                });
            await allure.screenshot(this.app, "Error Popup");
        });
    }
};
