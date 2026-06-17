// @ts-nocheck
import { IPAddress } from "@extron/communication";
import * as fs from "fs-extra";
import * as path from "path";
import { reject } from "q";
import { allure } from "../allure/allure";
import { MatButton } from "../matButton";

const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
// const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const locators2 = fs.readJsonSync(path.join(__dirname, "..", "JSON", "traceLocators.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));

export class MessageField extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "MessageField");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    /**
     * Only if the checkme string and severityType string is present in the message log this function returns true
     * @param checkme :string
     * @param ipAddress :string
     */
    public async checkTraceMessages(checkme: string, ipAddress: string): Promise<boolean> {
        let message: boolean = false;
        let tracestatus: boolean = false;
        ipAddress = ipAddress || 'Not provided';
        await allure.step(`Check for trace, or fail if trace message not found`, async () => {
            await allure.screenshot(this.app, "Before");
            await browser.waitUntil(async () => {
                let list = await browser.$$(locators2.rootTraceTable);
                for (let i = 1; i <= list.length; i++) {
                    await browser.$("//div[@id='trace-table']//tr[" + i + "]//td[3]")
                        .getText()
                        .then(async (text: any) => {
                            if (await text === checkme || await text.match(checkme) || await text.match(new RegExp(checkme)) != undefined) {
                                // pass string from test
                                const b = await browser.$("//div[@id='trace-table']//tr[" + i + "]//td[1]")
                                    .getText()
                                    .then(async (text1: any) => {

                                        if (text1 === ipAddress || ipAddress === 'Not provided') {
                                            // pass string from test
                                            message = true;
                                            tracestatus = true;
                                        }
                                    })
                                    .catch((err: Error) => {
                                        console.error("checkMessagePaneLog:" + `${err}`);

                                    });
                            }
                        })
                        .catch((err: Error) => {

                            // We don't need this message everytime
                            // console.error("checkMessagePaneLog:" + `${err}`);
                        });
                }
                return tracestatus;
            }, { 
                timeout: 160000 
            })
                .then(async () => { })
                .catch(async (err: Error) => {
                    await allure.screenshot(this.app, " After message Check Timeout");
                    console.log("Exception caught bval " + err);
                });
        });
        await allure.screenshot(this.app, " After message Check");
        return message;
    }

    //alternate version of checkTraceMessages that better takes care of large message numbers
    public async checkSpecificTraceMessage(checkme: string): Promise<boolean> {
        await allure.step(`Check for trace, or fail if trace message not found`, async () => {
            await allure.screenshot(this.app, "Before");
            // const locatorToCheck: string = "//span[contains(text(),'" + checkme + "')]"; 
            let messageCount = await browser.$(`//*[@id="trace-header-message-count"]`)
            await browser.$(`//*[@id='row-trace-table-1']/td[3]`).waitForExist({timeout:20000, timeoutMsg: "Waiting for first trace message to appear."}).catch(err => {
                console.log(err)
                return false;
            })
            await browser.pause(10000);
            let messageAmount = await messageCount.getText();
            console.log(`MessageAMOUNT = ${messageAmount}`)
            console.log(typeof messageAmount)
            console.log(typeof Number(messageAmount))
            messageAmount = messageAmount.split(' ')[0]
            for(let i = 0; i < Number(messageAmount); i++){
                let traceMessageRowLocator = await browser.$(`//*[@id='row-trace-table-${i}']/td[3]`)
                let traceMessage = await traceMessageRowLocator.getText()
                console.log(i);
                console.log(`MESSAGE==== ${traceMessage}`)
                if (checkme.match(traceMessage)){
                    await allure.screenshot(this.app, " After message Check");
                    return true;
                }
            }
            
            // console.log("Checking for the existance of: " + locatorToCheck);
            // let gottenText = await (await browser.$(locatorToCheck)).getText()
            // console.log(gottenText)
            // console.log(gottenText)
            // console.log(gottenText)
            // console.log(gottenText)
            // console.log(gottenText)
            // console.log(gottenText)
            // console.log(gottenText)
            // console.log(gottenText)
            // console.log(gottenText)
            // await browser.$(locatorToCheck).waitForExist({ timeout: 160000 })
            //     .catch(async (err: Error) => {
            //         await allure.screenshot(this.app, " After message Check Timeout");
            //         console.log("Could not find: " + checkme);
            //         message = false;
            //     });
        });
        await allure.screenshot(this.app, " After message Check");
        return false;
    }//span[contains(text(),'')]

    /**
     * Only if the checkme string and severityType string is present in the message log this function returns true
     * @param checkme :string
     * @param ipAddress :string
     * @param timeStamp :string
     */
    public async checkTraceMessageTimeStamp(checkme: string, ipAddress: string, timeStamp: string): Promise<boolean> {
        let message: boolean = false;
        let tracestatus: boolean = false;
        await allure.step(`Check for trace, or fail if trace message not found`, async () => {
            await allure.screenshot(this.app, "Before");
            await browser.waitUntil(async () => {
                const list = await browser.$$(locators2.tracerows1);
                for (let i = 1; i <= list.length; i++) {
                    await browser.$("//div[@id='trace-table']//tr[" + i + "]//td[3]")
                        .getText()
                        .then(async (text: any) => {
                            if (await text === checkme || await text.match(checkme) || await text.match(new RegExp(checkme)) != undefined) {
                                // pass string from test
                                const b = await browser.$("//div[@id='trace-table']//tr[" + i + "]//td[1]")
                                    .getText()
                                    .then(async (text1: any) => {
                                        if (text1.match(ipAddress)) {
                                            const c = await browser.$("//div[@id='trace-table']//tr[" + i + "]//td[2]")
                                                .getText()
                                                .then(async (text2: any) => {
                                                    if (text2 === timeStamp) {
                                                        // pass string from test
                                                        message = true;
                                                        tracestatus = true;
                                                    }
                                                })
                                                .catch((err: Error) => {
                                                    console.error("checkMessageTimeLog:" + `${err}`);
                                                });
                                        }
                                    })
                                    .catch((err: Error) => {
                                        console.error("checkMessageIPLog:" + `${err}`);
                                    });
                            }
                        })
                        .catch((err: Error) => {
                            console.error("checkMessageLog:" + `${err}`);
                        });
                }
                return tracestatus;
            }
                , {
                    timeout: 160000 
                })
                .then(async () => {
                })
                .catch(async (err: Error) => {
                    await allure.screenshot(this.app, " After message Check Timeout");
                    console.log("Exception caught bval " + err);
                });
        });
        await allure.screenshot(this.app, " After message Check");
        return message;
    }

    /**
     * Check to see if the difference between the timestap of trace and time in trace message is in an acceptable range.
     * 
     * @param acceptableRange 0 for exact match, else will check +-input
     * @returns true if all times are in acceptable range, false otherwise
     */
    public async checkSendVsRecievedTimeDiff(acceptableRange: number): Promise<boolean> {
        let boolFlag : boolean = true;
        await browser.waitUntil(async () => {
            let list = await browser.$$(locators2.rootTraceTable);
            for (let i = 1; i <= list.length; i++) {
                let traceMessage = await browser.$("//div[@id='trace-table']//tr[" + i + "]//td[3]").getText();
                let traceTime = await browser.$("//div[@id='trace-table']//tr[" + i + "]//td[2]").getText()

                await this.secondIsInRange(traceTime, traceMessage, acceptableRange).then((res) =>{
                    if ( res == false){
                        boolFlag = false;
                    } 
                })

            }
            return boolFlag;
        }, {
            timeout: 160000
        })
        .then(async () => { })
        .catch(async (err: Error) => {
            await allure.screenshot(this.app, " After message Check Timeout");
            console.log("Exception caught bval " + err);
        });
        await allure.screenshot(this.app, " After message Check");
        return boolFlag;
    }

    // tslint:disable-next-line:typedef
    public async verifyTableLength() {
        const list = await browser.$$(locators2.tracerows1);
        return list.length;
    }

    /**
     * Check if traceMsg's time is within the acceptable range based on traceTime as origin.
     * @param traceTime second from time
     * @param traceMsg second from msg
     * @param acceptableRange + and - acceptable range that traceMsgSecond can be in between
     */
    async secondIsInRange(traceTime: string, traceMsg: string, acceptableRange: number): Promise<boolean> {
        let [traceMsgHour, traceMsgMinute, traceMsgSecond] = traceMsg.split(" ")[1].split(":");
        let [traceTimeHour, traceTimeMinute, traceTimeSecond] = traceTime.split(" ")[1].split(":");

        let traceMsgInSeconds = (Number(traceMsgHour) * 60 * 60) + (Number(traceMsgMinute) * 60) + (Number(traceMsgSecond));
        let traceTimeInSeconds = (Number(traceTimeHour) * 60 * 60) + (Number(traceTimeMinute) * 60) + (Number(traceTimeSecond));
        let lowerLimit = traceTimeInSeconds - acceptableRange;
        let upperLimit = traceTimeInSeconds + acceptableRange;

        if (traceMsgInSeconds > lowerLimit && traceMsgInSeconds < upperLimit) return true;
        return false;
    }
}
