/* tslint:disable */
import { MatButton } from '../matButton';
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from '../allure/allure';
import { TroubleshootingPage } from "../sideNavigation/troubleshootingPage.po"
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const proglocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));
const controllerLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "controllerLocators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const inputData = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const programLogLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));

export class ProgramLogTextAreaField extends MatButton {
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Program Log Text Area");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async checkProgramLogTextAreaPresent(): Promise<boolean> {
        let textAreaIsVisible: boolean = false;
        const textArea = await browser.$(proglocators.actualLogText).waitForExist();
            if (textArea) {
                textAreaIsVisible = true;
            }
        return textAreaIsVisible;
    }

    public async checkProgramLogTextAreaPresent2(): Promise<boolean> {
        let textAreaIsVisible: boolean = false;
        let programLogTextArea = await browser.$(proglocators.actualLogText);
        textAreaIsVisible = await programLogTextArea.isExisting();
        let actualText = await programLogTextArea.getText()
        if (actualText === "") textAreaIsVisible = false;

        return textAreaIsVisible;
    }

    public async checkProgramLogContent(logContent: string): Promise<boolean> {
        let message: boolean = false;
        await browser.$(proglocators.actualLogText).waitForExist();
        await browser.$(proglocators.actualLogText)
            .getText()
            .then(async (text: any) => {
                await browser.pause(timeout.fast);
                if (text.includes(logContent)) {
                    //pass string from test
                    message = true;
                }
                await allure.screenshot(this.app, "After");
            }).catch((err: Error)=> {
                console.log('checkProgramLogContent:'+ `${err}`);
                message = false;
            });
            return message;
    }

    public async checkNoProgramLog(logContent: string): Promise<boolean> {
        let message: boolean = false;
        await browser.$(proglocators.noLogsText).waitForExist();
        await browser.$(proglocators.noLogsText)
            .getText()
            .then(async (text: any) => {
                await browser.pause(timeout.fast);
                if (text.includes(logContent)) {
                    //pass string from test
                    message = true;
                }
                await allure.screenshot(this.app, "After");
            }).catch((err: Error)=> {
                console.log('checkProgramLogContent:'+ `${err}`);
                message = false;
            });
            return message;
    }

    public async checkProgramLogDateTimestamp(ipAddress:any,userName:any,password:any,messageType: any): Promise<boolean> {
        let newWin = new TroubleshootingPage(this.app, this.selector);
        let message: boolean = false;
        await browser.$(proglocators.actualLogText).waitForExist();
        await browser.$(proglocators.actualLogText)
            .getText()
            .then(async (text: string) => {
                await browser.newWindow("https://"+ipAddress+"/www/index.html", {windowName:"controllerWindow", windowFeatures:"width=1024,height=770,resizable,scrollbars=yes,status=1"});
                await browser.pause(timeout.medium);
                await browser.$(controllerLocators.userName).setValue(userName);
                await browser.$(controllerLocators.password).setValue(password);
                await browser.$(controllerLocators.signIn).click();
                await browser.pause(timeout.medium);
                await browser.pause(timeout.medium);
                await browser.pause(timeout.slow);
                await browser.$(controllerLocators.date2)
                    .getText().then(async (text: string) => {
                        await browser.pause(timeout.slow);
                        await browser.pause(timeout.medium);
                        var text2 = await browser.$(controllerLocators.time2)
                            .getText();
                        var mydate = new Date(text + " " + text2);
                        var MyDateString: any = '';
                        mydate.setDate(mydate.getDate());
                        var month: any = (mydate.getMonth() + 1);
                        var day: any = (mydate.getDate());
                        var hours: any = (mydate.getHours());
                        var minutes: any = (mydate.getMinutes());
                        if (month < 10)
                            month = '0' + month;
                        if (day < 10)
                            day = '0' + day;
                        if (hours < 10)
                            hours = '0' + hours;
                        if (minutes < 10)
                            minutes = '0' + minutes;
                        MyDateString = mydate.getFullYear() + '-' + month + '-' + day + " " + hours + ":";
                        if (text.substring(MyDateString)&&text.substring(messageType)) {
                            message = true;
                        }
                    }).catch(err=>{
                        console.log('programLogTextAreaField.checkProgramLogDateTimestamp:'+err)
                    });
            }).catch((err) => {
                console.log("CSP-96: Exception Error: " + `${err}`);
                return Promise.resolve(err +'Should have thrown');
            });
        return message;
    }

    public async checkProgramLogControllerDateTimestamp(ipAddress:any,userName:any,password:any): Promise<boolean> {
        let message: boolean = false;
        await browser.pause(timeout.medium);
        await browser.$(proglocators.actualLogText).waitForExist();
        await browser.$(proglocators.actualLogText)
            .getText()
            .then(async (text: string) => {
                await browser.newWindow("https://"+ipAddress+"/www/index.html", {windowName: "controllerWindow", windowFeatures:"width=1024,height=770,resizable,scrollbars=yes,status=1"});
                await browser.pause(timeout.medium);
                await browser.$(controllerLocators.userName).setValue(userName);
                await browser.$(controllerLocators.password).setValue(password);
                await browser.$(controllerLocators.signIn).click();
                await browser.pause(timeout.medium);
                await browser.pause(timeout.slow);
                await browser.$(controllerLocators.date2)
                    .getText().then(async (text: string) => {
                        await browser.pause(timeout.medium);
                        var text2 = await browser.$(controllerLocators.time2)
                            .getText();
                        var mydate = new Date(text + " " + text2);
                        var MyDateTimeString: any = '';
                        mydate.setDate(mydate.getDate());
                        var month: any = (mydate.getMonth() + 1);
                        var day: any = (mydate.getDate());
                        var hours: any = (mydate.getHours());
                        var minutes: any = (mydate.getMinutes());
                        if (month < 10)
                            month = '0' + month;
                        if (day < 10)
                            day = '0' + day;
                        if (hours < 10)
                            hours = '0' + hours;
                        if (minutes < 10)
                            minutes = '0' + minutes;
                        MyDateTimeString = mydate.getFullYear() + '-' + month + '-' + day + " " + hours + ":";

                        if (text.substring(MyDateTimeString)) {

                            message = true;
                        }
                    });
            })
        return message;
    }
}
