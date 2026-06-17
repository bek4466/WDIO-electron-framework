/* tslint:disable */
import { MatButton } from '../matButton';
import * as fs from "fs-extra";
import * as path from "path";
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const programLogLocs = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const programLogLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));

export class UpdatedTimeStampText extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Program Log Updated time stamp");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checkLastUpdatedProgramLogTextPresent(): Promise<boolean> {
        const textArea = await browser.$(programLogLocs.updatedTimeStampText).waitForExist();
        return textArea;
    }

    public async verifyLastUpdatedProgramLogText(): Promise<boolean> {
        let message: boolean = false;
        await browser.$(programLogLocs.updatedTimeStampText).waitForExist();
        await browser.pause(timeout.medium)
        await browser.$(programLogLocs.updatedTimeStampText)
            .getText()
            .then(async (text: string) => {
                await browser.pause(timeout.medium);
                var data: any = await this.getDate();
                var newData: any = "Last updated at " + data;
                var messageType:any="ERROR"
                if (text.substring(newData)&&text.substring(messageType)) {
                    message = true;
                }
            })
        return message;
    }

    public async verifyLastUpdatedProgramLogMessage(messageType:any): Promise<boolean> {
        let message: boolean = false;
        await browser.$(programLogLocs.updatedTimeStampText).waitForExist();
        await browser.pause(timeout.medium)
        await browser.$(programLogLocs.updatedTimeStampText)
            .getText()
            .then(async (text: string) => {
                await browser.pause(timeout.medium);
                var data: any = await this.getDate();
                var newData: any = "Last updated at " + data;
                if (text.substring(newData)&&text.substring(messageType)) {
                    message = true;
                }
            })
        return message;
    }


    public async getProgLogDate(): Promise<string> {
        let text: any;
        await browser.pause(timeout.medium);
        text = browser.$(programLogLocs.updatedTimeStampText)
            .getText();
        return text;
    }

    public async getDate() {
        var today = new Date();
        var date = today.toString();
        var day: any = (today.getDate());
        var year: any = today.getFullYear();
        var hour: any = today.getHours();
        var date1 = date.slice(4, 7);
        var newDate = date1 + ' ' + day + ', ' + year + ', ' + hour + ':';
        return newDate;
    }
}
