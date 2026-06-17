/* tslint:disable */
// @ts-nocheck
//// ***************************************************************************
/// Use this template to create a new e2e testcase in a new file
/// In order for e2e tests to be run, they need to follow the naming convention
///                          <testcase>.e2e-spec.ts
//// ***************************************************************************

import { allure } from "../src/allure/allure";
import * as fs from "fs-extra";
import * as path from "path";
import { LogClient } from "@extron/winston-logger";
import { e2eLogServiceTag } from "../src/logger/loggerSpecTags";
import { CommunicationClient, EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
const logClient = new LogClient("e2e:CommonMethods", e2eLogServiceTag.smoke.smoke);
const device = fs.readJsonSync(path.join(__dirname, "..", "src", "JSON", "deviceData.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "src", "JSON", "timeout.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "src", "JSON", "tabTitles.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "src", "JSON", "locators.json"));
const ssoLocators = fs.readJsonSync(path.join(__dirname, "..", "src", "JSON", "accessControlLocators.json"));
const controllerLocators = fs.readJsonSync(path.join(__dirname, "..", "src", "JSON", "controllerLocators.json"));
const dataKeys = fs.readJsonSync(path.join(__dirname, "..", "src", "JSON", "accessKeysData.json"));

export class CommonMethods {    
    public static app: WebdriverIO.Browser;
    public static logClient: LogClient;
    constructor() { }
    public async stopApp() {
    }
    public async copyFolder(source: string, destination: string): Promise<boolean> {
        var copyFolderFiles: boolean = false;
        var copyCertificationFiles: boolean = false;
        let certOg = source.replace('.json', '-credential.dat');
        let certTmp = destination.replace('.json', '-credential.dat');

        await fs.copy(source, destination)
            .then(async () => {
                console.log('Copy completed!')
                copyFolderFiles = true;
            })
            .catch(err => {
                console.log('An error occured while copying the folder.')
                return console.log(err)
            })
        await fs.copy(certOg, certTmp)
            .then(async () => {
                console.log('Copy Credential completed!')
                copyCertificationFiles = true;
            })
            .catch(err => {
                console.log('An error occured while copying the folder.')
                return console.log(err)
            })
        return copyFolderFiles && copyCertificationFiles;
    }

    public async getFormattedDate(today) {
        var week = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        var day = week[today.getDay()];
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hour = today.getHours();
        var minu = today.getMinutes();

        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        if (minu < 10) { minu = '0' + minu }

        return day + ' - ' + dd + '/' + mm + '/' + yyyy + ' ' + hour + ':' + minu;
    }

    public async getCurrDateMDY(): Promise<string> {
        const date = new Date();
        const currDate = `${date.getMonth() + 1 <= 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}/${date.getDate() <= 9 ? "0" + date.getDate() : date.getDate()}/${date.getFullYear()}`;
        return currDate;
    }

    public async readFile(filepath: string): Promise<any> {
        // Replace the test1.log below with filepath
        const data = await fs.readFile(filepath, "utf-8");
        var marray = [];
        var array = data.toString().split("\n");
        if (data) {
            for (const i in array) {
                let item = array[i].split(/[\s]{7,7}/);
                marray.push(item);
            }
        }
        let temp = marray.pop();        // check and remove white space at EOF
        if (JSON.stringify(temp) !== '[""]') {
            marray.push(temp);
        }
        return marray;
    }

    public async compareFileContents(fileArray1: string, fileArray2: string) {
        return JSON.stringify(fileArray1) === JSON.stringify(fileArray2)
    }

    public async getCertificationFormattedDate() {
        const currentdate = await new Date();
        let hours: any = currentdate.getHours();
        let minutes: any = currentdate.getMinutes();
        let seconds: any = currentdate.getSeconds();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return await "Last Certified: " + (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear() + ", " + hours + ':' + minutes + ":" + seconds + " " + ampm;
    }

    public async getFolderFormattedDate(givenDate) {
        var dd = givenDate.getDate();
        var mm = givenDate.getMonth() + 1; //January is 0!
        var yyyy = givenDate.getFullYear();
        var hour = await givenDate.getHours();
        var ampm = (hour >= 12) ? "PM" : "AM";
        hour = hour % 12;
        hour = hour ? hour : 12;
        var minu = await givenDate.getMinutes();
        var seconds = givenDate.getSeconds();

        if (minu < 10) { minu = '0' + minu }
        if (seconds < 10) { seconds = '0' + seconds }

        return mm + '/' + dd + '/' + yyyy + ', ' + hour + ':' + minu + ':' + seconds + ' ' + ampm;
    }
    public async deleteFolderContents(destination: string): Promise<boolean> {
        var deleteFolderFiles: boolean = false;
        await fs.emptyDir(destination)
            .then(async () => {
                console.log('Deletion completed!')
                deleteFolderFiles = true;
            })
            .catch(err => {
                console.log('An error occured while deleting the folder contents.')
                return console.log(err)
            })
        return deleteFolderFiles;
    }
    public async deleteFile(destination: string): Promise<boolean> {
        try {
            await fs.unlink(destination)
            console.log('Deletion completed!')
            return true;
        } catch (error) {
            console.log('Deletion failed!')
            return false;
        }
    }
    public async deleteFolder(destination: string): Promise<boolean> {
        try {
            await fs.rmdir(destination)
            console.log('Deletion OF FOLDER: [' + destination + '] completed!')
            return true;
        } catch (error) {
            console.log('Deletion failed!')
            return false;
        }
    }

    public async renameFile(destination: string, target: string): Promise<boolean> {
        let fileRenamed: boolean = false;
        if (destination) {
            await fs.rename(destination, target)
                .then(async () => {
                    //console.log('File Renamed!')
                    fileRenamed = true;
                })
                .catch((err: Error) => {
                    console.log('An error occured while renaming the file.' + err)
                })
        }
        return fileRenamed;
    }

    public async removeCredentialFile(systemJsonFile: string): Promise<boolean> {
        let sysCredPath = systemJsonFile.replace('.json', '-credential.dat');
        if (fs.existsSync(sysCredPath)) {
            console.log(`DELETING THIS FILE : ${sysCredPath}`)
            return this.deleteFile(sysCredPath);
        }
        return false;
    }

    async switchToWindow(app: WebdriverIO.Browser, WindowName: string): Promise<any> {
        let winFound: boolean = false;
        await app.waitUntil(async () => {
            await app.getWindowHandles().then(async (allTabs: string[]) => {
                for (var tab = 0; tab < allTabs.length; tab++) {
                    await app.switchToWindow(allTabs[tab]);
                    await app.getTitle().then(async (title) => {
                        if (title === WindowName || title.indexOf(WindowName) >= 0) {
                            winFound = true;
                            await app.$(ssoLocators.signInBtn).click();
                            await app.pause(timeout.medium);
                            await app.switchToWindow(tabTitles. mainTab);
                            return;
                        }
                    });
                }
            }).catch((err: any) => {
                //fail("waitUntil switchToWindow " + err);
            });
            return winFound;
        }, {timeout: 10000 * 2, timeoutMsg: "Unable to find " + WindowName + " window."})
            .catch((err: any) => {
                console.log("Electron instance of the app does not exist... " + `${err}`);
            });
        await app.pause(timeout.fast);
        return this.switchToSSO(app, tabTitles.ExtronInsider)
            .then(async (value) => {
                await expect(value).toEqual(undefined);
            }).catch((err: Error) => {
                //fail(err + "Unexpected CheckLoginPage failed inside the switchWins()")
            });
    }
    async safeLogout(): Promise<any> {
        const logoutBtn = await browser.$("#logOut").isExisting()
        if(logoutBtn === true){
            //we see the logout button which means we are alreadey logged in.
            await browser.$("#logOut").click();
            await browser.pause(3000);
            const popUpSignOutBtn = await browser.$("//\*[@id='logoutConfirmationDialog']/sync-component-footer/div/div/div[1]/div/button[1]");
            await popUpSignOutBtn.click();
            await browser.pause(20000);
            await browser.pause(8000).then(() => {
                return
            });
        } else{
            console.error("Attempted to use commonMethod.safeLogout BUT logoutBtn could not be found.")
            return
        }
    }

    async ssoDefaultLogin(app: WebdriverIO.Browser) {
        await app.$(ssoLocators.emailInputField).setValue(dataKeys.ot);
        await app.$(ssoLocators.passwordInputField).setValue(dataKeys.pass);
        await app.$(ssoLocators.checkBox).click();
        await app.$(ssoLocators.loginBtn).click();
    }

    async ssoCustomLogin(app: WebdriverIO.Browser, username: string, password: string) {
        await app.$(ssoLocators.emailInputField).setValue(username);
        await app.$(ssoLocators.passwordInputField).setValue(password);
        await app.$(ssoLocators.checkBox).click();
        await app.$(ssoLocators.loginBtn).click();
    }

    async userProfileSwitch(app: WebdriverIO.Browser, username: string, password: string): Promise<any> {
        // switch from unlinsenced user to licensenced user.
        let profile: string = username;
        let code: string = password;
        console.log("PROFILE: " + profile + "\n" + "CODE : " + code);
        switch (profile && code) {
            case ((dataKeys.licensedUser1 = profile) && (dataKeys.licensedUser1pass = code)):
                return this.ssoCustomLogin(app, profile, code);
            case ((dataKeys.unLicensedUser1 = profile) && (dataKeys.unLicensedUser1pass = code)):
                return this.ssoCustomLogin(app, profile, code);
            case ((dataKeys.unLicensedUser2 = profile) && (dataKeys.unLicensedUser2pass = code)):
                return this.ssoCustomLogin(app, profile, code);
            case ((dataKeys.unlicensedUser4 = profile) && (dataKeys.unlicensedUser4pass = code)):
                return this.ssoCustomLogin(app, profile, code);
            default:
                console.log("Switch func using Default login");
                return this.ssoDefaultLogin(app);
        }
    }
    async switchToSSO(app: WebdriverIO.Browser, Win: string) {
        let user_lic1: string = dataKeys.licensedUser1;
        let user_lic1_pass: string = dataKeys.licensedUser1pass;
        let user_unlic1: string = dataKeys.unLicensedUser1;
        let user_unlic1_pass: string = dataKeys.unLicensedUser1pass;
        let user_unlic2: string = dataKeys.unLicensedUser2;
        let user_unlic2_pass: string = dataKeys.unLicensedUser2pass;
        let user_unlic4: string = dataKeys.unLicensedUser2;
        let user_unlic4_pass: string = dataKeys.unLicensedUser2pass;
        let winFound: boolean = false;
        await app.waitUntil(async () => {
            await app.getWindowHandles().then(async (allTabs: string[]) => {
                for (var tab = 0; tab < allTabs.length; tab++) {
                    await app.switchToWindow(allTabs[tab]);
                    await app.getTitle().then(async (title) => {
                        if (title === Win || title.indexOf(Win) >= 0) {
                            winFound = true;
                            await this.userProfileSwitch(app, user_lic1, user_lic1_pass);
                            await app.pause(timeout.fast);
                            await app.switchWindow(tabTitles.ExtronInsider);
                            await app.pause(timeout.fast);
                            return winFound;
                        }
                    });
                }
            }).catch((err: any) => {
                //fail("waitUntil switchToWindow " + err);
            });
            return winFound;
        }, {timeout: 10000 * 2, timeoutMsg: "Unable to find " + Win + " window."})
            .catch((err: any) => {
                console.log("Electron instance of the app does not exist... " + `${err}`);
            });
    }

    async switchToApp(browser: WebdriverIO.Browser, WindowName: string) {
        await browser.waitUntil(
            async () => {
                let winFound: boolean = false;
                await browser.getWindowHandles().then(async (allTabs: string[]) => {
                    for (var tab = 0; tab < allTabs.length; tab++) {
                        await browser.switchToWindow(allTabs[tab])
                        await browser.pause(2000);
                        await browser.getTitle().then(async (title) => {
                            if (
                                title == WindowName || title.indexOf(WindowName) >= 0
                            ) {
                                winFound = true;
                                return;
                            }
                        });
                        if (winFound) return;
                    }
                });
                return winFound;
            },
            {
            timeout:20000,
            timeoutMsg:"Unable to find " + WindowName + " window."
        }
        );
    }
    async switchToSSOWindow(browser: WebdriverIO.Browser, Win: string) {
        let winFound: boolean = false;
        await browser.pause(1000);
        await browser.waitUntil(async () => {
            await browser.getWindowHandles().then(async (allTabs: string[]) => {
                for (var tab = 0; tab < allTabs.length; tab++) {
                    await browser.switchToWindow(allTabs[tab])
                    console.warn("LINE 303  ======================= " + allTabs[tab]);
                    await browser.pause(100);
                    const title = await browser.getTitle()
                    if (title === Win || title.indexOf(Win) >= 0) {
                        console.warn("TITLE  ======================= " + title);
                        winFound = true;
                        return true;
                    }
                }
            });
            return winFound;
        }, {timeout:5000 * 2});
    }
    async generateRandomNumber(n: number) {
        return Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
    }
    public async ConnectPrimaryDevice(ipaddress: string): Promise<any> {
        console.log("We are in a class")
        console.log("This is the device pro" + device.Pro350__IPCP);
        const comClient = new CommunicationClient();
        let IPCP255: string;
        const ipcp255: IConnectionInfo = {
            auth_type: EAuthType.GENERIC,
            ip: ipaddress,
            password: "extron",
            port: 4503,
            protocol: EProtocol.GM,
            tunnel: false,
            username: "admin",
        };
        console.log("Now really connecting" + JSON.stringify(ipcp255));
        this.delay(10000)
        const response = await comClient.connectSession(ipcp255)
            .then(async (result) => {
                IPCP255 = await result;
                const response = await comClient.sendGlobalMessage(IPCP255, new GetBoxID());
                console.log("This is the first response" + JSON.stringify(response));
                await comClient.disconnectSession(IPCP255);
                return response.systemid.toString();
            })
            .catch((err: Error) => {
                //fail("System number1 match fail");
            });
        console.log("Returning this response" + response);
        return response;
    }
    public async ConnectPeripheralDevice(peripheralip: string, expectedsysid: string): Promise<any> {
        console.log("We are in a Peripherala class")
        console.log("This is the peripheral device pro" + peripheralip);
        const comClients = new CommunicationClient();
        let IPERIPHERAL: string;
        const ipcp255: IConnectionInfo = {
            auth_type: EAuthType.GENERIC,
            ip: peripheralip,
            password: "extron",
            port: 4503,
            protocol: EProtocol.GM,
            tunnel: false,
            username: "admin",
        };
        console.log("Now Peripheral really connecting" + JSON.stringify(ipcp255));
        this.delay(10000)
        await comClients.connectSession(ipcp255)
            .then(async (result) => {
                IPERIPHERAL = await result;
                const response = await comClients.sendGlobalMessage(IPERIPHERAL, new GetBoxID());
                await expect(response.systemid.toString())
                    .toEqual(expectedsysid);
                console.log("This is the second  response" + JSON.stringify(response));
                await comClients.disconnectSession(IPERIPHERAL);
            })
            .catch((err: Error) => {
                //fail("System number1 match fail");
            });
    }
    public async UpdateExternalFiles(): Promise<void> {
        const filesToCopy: string = path.join(__dirname, "..", "resources", "externalFiles");
        const executableDirectoryAbsolutePath: string = path.join(__dirname, "..", "..", "node_modules", "electron", "dist");
        console.log(executableDirectoryAbsolutePath);
        try {
            fs.copySync(filesToCopy, executableDirectoryAbsolutePath, { overwrite: true });
        }
        catch (err) {
            //fail("cipy external files failure");
        }
    }

    public delay(ms: number) {
        // tslint:disable-next-line:arrow-parens
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }

    async standardStartApp(app: WebdriverIO.Browser, userName: string, password: string, logout?: boolean): Promise<any> {
        
        await common.switchToWin(app, tabTitles.mainTab, userName, password);
        await allure.screenshot(app, "Before");
    }

    async switchToWin(browser: WebdriverIO.Browser, WindowName: string, userName: string, password: string, performLogout?: boolean): Promise<any> {
        let loggedin = false;
        await browser.pause(timeout.medium);
        await browser.waitUntil(async () => {
            const list = await browser.getWindowHandles();
            console.warn("LINE 408 : TITLE " + await browser.getTitle());
            await browser.switchWindow("ControlScript Deployment Utility")
            const logoutBtn = await browser.$("#logOut").isExisting()
            if(logoutBtn === true){
                //we see the logout button which means we are alreadey logged in.
                if (performLogout === true){
                    await browser.$("#logOut").click();
                    await browser.pause(3000);
                    const popUpSignOutBtn = await browser.$("//\*[@id='logoutConfirmationDialog']/sync-component-footer/div/div/div[1]/div/button[1]");
                    await popUpSignOutBtn.click();
                    await browser.pause(8000);
                    return await this.switchToWin(browser, WindowName, userName, password);
                }
                else{
                    return Promise.resolve(true);
                }
                
            } else {
                await browser.switchWindow(tabTitles.mainTab);
                let inSignInMainPage = await (await browser.$(ssoLocators.signInBtn)).isExisting()
                if(inSignInMainPage === true){
                    await browser.$(ssoLocators.signInBtn).click();
                    await this.switchToSSOWindow(browser, tabTitles.ExtronInsider);
                    await browser.pause(timeout.fast);
                   
                    await browser.pause(timeout.fast);
                    await browser.$(ssoLocators.emailInputField).setValue(userName);
                    await browser.pause(timeout.fast);
                    await browser.$(ssoLocators.passwordInputField).setValue(password);
                    // await app.$(ssoLocators.checkBox).click();
                    await browser.$(ssoLocators.loginBtn).click();
                    loggedin = true;
                }else{
                    return Promise.resolve(true);
                }
            }
        },{timeout:30000});
        return loggedin;
    }
    
    public async loginToSSO(browser: WebdriverIO.Browser, username: string, password: string): Promise<boolean> {
        let flag: boolean = false;
        // give little time to load the DOM
        const value = browser.waitUntil(() =>{
            browser.$(ssoLocators.emailInputField).waitForExist(timeout.medium);
        }, timeout.medium);
        if (value) {
            await (await browser.$(ssoLocators.emailInputField)).setValue(username);
            await (await browser.$(ssoLocators.passwordInputField)).setValue(password);
            // await app.$(ssoLocators.checkBox).click();
            await browser.$(ssoLocators.loginBtn).click();
            // in the case that cookies are not present and we go into personal information window
            // simply click Yes, Allow in this case.
            // await (await app.$(ssoLocators.yesAllowButton)).waitForExist(timeout.medium)
            //     .then(async (value) => {
            //         await app.$(ssoLocators.yesAllowButton).click();
            //     }).catch(async (err) => {
            //         logClient.error("special login case button not found, no need for further action");
            //         reject(err);
            //     });
        }
        return flag;
    }

    public async getLastRevisionDate(filepath): Promise<string> {
        let result = "";
        await fs.stat(filepath)
            .then(async (stats) => {
                result = await this.getFolderFormattedDate(stats.mtime);
            }).catch(async (err: Error) => {
                console.log("Get file stats error: " + err);
            });
        return result;
    }
    public async getCreationDate(filepath): Promise<string> {
        let result = "";
        await fs.stat(filepath)
            .then(async (stats) => {
                result = await this.getFolderFormattedDate(stats.birthtime);
            }).catch(async (err: Error) => {
                console.log("Get file stats error: " + err);
            });
        return result;
    }
    public async checkECW(app: WebdriverIO.Browser, ipAddress: any, userName: any, password: any,): Promise<boolean> {
        let message: boolean = false;
        await app.newWindow("https://" + ipAddress, {windowName:"ECWWindow", windowFeatures:"width=1024,height=770,resizable,scrollbars=yes,status=1"});
        await app.pause(timeout.medium);
        await app.$(controllerLocators.userName).setValue(userName);
        await app.$(controllerLocators.password).setValue(password);
        await app.$(controllerLocators.signIn).click();
        await app.pause(timeout.medium);
        return message;
    }

    public async getLoginMessage(app: WebdriverIO.Browser, expectedResult: String): Promise<void> {
        let flag: boolean = false;
        // give little time to load the DOM
        const value = await app.$(ssoLocators.emailInputField).waitForExist(timeout.medium);
        if (value) {

            await app.pause(3000)
            await app.$("//div[starts-with(@class,\"alert\")]").getText();
            const actualtext = await app.$("//div[@ng-show=\"model.errorMessage\"]").getText();
            expect(actualtext).toEqual(expectedResult)

        }
    }


    // public async osScreenCapture(): Promise<any> {
    //     return new Promise<void>((resolve, reject) => {
    //         const screenSize = robot.getScreenSize();
    //         const width = screenSize.width;
    //         const height = screenSize.height;
    //         const screenCapture = robot.screen.capture();
    //         var jimg = new Jimp(width, height);
    //         for (var x = 0; x < width; x++) {
    //             for (var y = 0; y < height; y++) {
    //                 var index = (y * screenCapture.byteWidth) + (x * screenCapture.bytesPerPixel);
    //                 var r = screenCapture.image[index];
    //                 var g = screenCapture.image[index + 1];
    //                 var b = screenCapture.image[index + 2];
    //                 var num = (r * 256) + (g * 256 * 256) + (b * 256 * 256 * 256) + 255;
    //                 jimg.setPixelColor(num, x, y);
    //             }
    //         }
    //         jimg.getBufferAsync(Jimp.MIME_PNG)
    //             .then(img => {
    //                 resolve(img);
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }

    /**
     * 
     * @param ogDate Date in format(28/03/2022, 14:14:013:13)
     * @param foreignLang string that indicates foreign language to convert from
     * @returns A date that has been converted to USA format
     */
    public async convertForeignDateToUsa(ogDate: string): Promise<string> {
        let [date, time] = ogDate.split(',');

        if (this.getEnvLocale().match(/fr_FR/)) { //french uses 'à' to split instead of comma
            [date, time] = ogDate.split('à');
        }

        if (this.getEnvLocale().match(/nl_NL/) || this.getEnvLocale().match(/zh_CN/)) {
            [date, time] = ogDate.split(" ");
        }

        let [day, month, year] = date.split('/');
        if (this.getEnvLocale().match(/de_DE/) || this.getEnvLocale().match(/he_IL/)) { //dutch & hebrew uses '.' to split dmy
            [day, month, year] = date.split('.');
        }
        if (this.getEnvLocale().match(/en_US/)) { //usa uses mdy instead of dmy
            [month, day, year] = date.split('/');
        }
        if (this.getEnvLocale().match(/nl_NL/)) {
            [day, month, year] = date.split('-');
        }
        if (this.getEnvLocale().match(/zh_CN/)) {  //chinese lang day and year are flipped   
            [year, month, day] = date.split('/');
        }

        //remove spaces
        day = day.replace(/ /g, "")
        month = month.replace(/ /g, "")
        year = year.replace(/ /g, "")
        return `${month.length === 1 ? "0" + month : month}/${day.length === 1 ? "0" + day : day}/${year}`;
    }

    public async hasCorrectTimeFormatting(inputDate): Promise<boolean> {
        let date = new Date();

        if (this.getEnvLocale().match(/en_US/)) {
            if (inputDate.match(/\d?\d:\d\d:\d\d AM/) || inputDate.match(/\d?\d:\d\d:\d\d PM/)) {
                return true;
            }
        }

        if (inputDate.match(/\d\d:\d\d:\d\d/) || inputDate.match(/\d\d:\d\d:\d\d/)) {
            return true;
        }

        return false;
    }

    public getEnvLocale(env = undefined) {
        env = env || process.env;
        return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
    }

    //Add this check right after app.start() call.
    public async checkSplashScreen(app: WebdriverIO.Browser): Promise<any> {
        const list = await app.getWindowHandles();
        await app.switchToWindow(list[1]);
        await app.$(locators.splashScreenBody).isClickable().then(async (value: boolean) => {
            await expect(value).toBe(true);
        }).catch((err) => {
            console.log(err);
            //fail(err);
        })
    }

    public insertText(buffer: Buffer, text: string, offset: string): Buffer {
        const textBuffer = Buffer.from(text, 'utf8');
       let offSetNum = 0;
       if (offset == 'append') { return Buffer.concat([buffer, textBuffer])}
       if (offset == 'middle') { 
            offSetNum = buffer.length / 2
       }
        const before = buffer.subarray(0, offSetNum);
        const after = buffer.subarray(offSetNum);
       
        return Buffer.concat([before, textBuffer, after]);
    }
}
export const common: CommonMethods = new CommonMethods();