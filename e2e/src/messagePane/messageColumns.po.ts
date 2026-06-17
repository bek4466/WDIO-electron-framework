// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import * as cp from "child_process";
import { allure } from "../allure/allure";
import { LogClient } from "@extron/winston-logger";
import { MatButton } from "../matButton";
import { environment } from '../../../electron/src/environment';
import { reject } from "q";

// tslint:disable-next-line:no-duplicate-imports
import { Jsonparser } from "../deployment/JsonParser.po";
import { GmObject } from "../deployment/GmObject.po";
import { MessagePaneComponent } from "../messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../tests/commonMethods.po";
import { DeployComponent } from "../deployComponent/deployComponent.po";
// const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const logClient = new LogClient("e2e:MessageColumns.po");
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
// const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const locators2 = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deviceData.json"));
const exitCodesJsonFile = fs.readJsonSync(path.join(__dirname, "..", "JSON", "exitCodes.json"));
const time: Date = new Date();

export class MessageColumns extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "message pane columns");
        let common = new CommonMethods();
    }

    public async click(): Promise<void> {
        await super.click();
    }
    public async timeStampColumnIsVisible(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector)
            .waitForExist()
            .then(async (val) => {
                a = val;
            })
            .catch((err: any) => {
                logClient.error("From timeStampColumnIsVisible: " + `${err}`);
                a = false;
            });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async timeStampColumnIncludesText(myText: string): Promise<boolean> {
        let columnText: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${myText}`,
                    async () => {
                        await allure.screenshot(this.app, "Before");
                        await browser.pause(timeout.slow);
                        const a = await browser.$(this.selector)
                            .waitForExist()
                            .then(async () => {
                                return a;
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "From timeStampColumnIncludesText: " +
                                    `${err}`
                                );
                                // reject(err);
                            });
                        await browser.$(this.selector)
                            .getText()
                            .then(async (text: any) => {
                                await browser.pause(timeout.fast);
                                if (text.includes(myText)) {
                                    // pass string from test
                                    columnText = true;
                                }
                                await allure.screenshot(this.app, "After");
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "timeStampColumnIncludesText:" + `${err}`
                                );
                                // reject(err);
                            });
                    }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return columnText;
    }

    public async severityColumnIsVisible(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector)
            .waitForExist()
            .then(async (val) => {
                a = val;
            })
            .catch((err: any) => {
                logClient.error("From severityColumnIsVisible: " + `${err}`);
                a = false;
            });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async severityColumnIncludesText(myText: string): Promise<boolean> {
        let columnText: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${myText}`,
                    async () => {
                        await allure.screenshot(this.app, "Before");
                        await browser.pause(timeout.medium);
                        const a = await browser.$(this.selector)
                            .waitForExist()
                            .then(async () => {
                                return a;
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "From severityColumnIncludesText: " +
                                    `${err}`
                                );
                                // reject(err);
                            });
                        await browser.getElementText(this.selector)
                            .then(async (text: any) => {
                                await browser.pause(timeout.fast);
                                if (text.includes(myText)) {
                                    // pass string from test
                                    columnText = true;
                                }
                                await allure.screenshot(this.app, "After");
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "severityColumnIncludesText:" + `${err}`
                                );
                                // reject(err);
                            });
                    }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return columnText;
    }

    public async messageColumnIsVisible(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector).waitForExist()
            .then(async (val) => {
                a = val;
            })
            .catch((err: any) => {
                logClient.error("From messageColumnIsVisible: " + `${err}`);
                a = false;
            });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async messageColumnIncludesText(myText: string): Promise<boolean> {
        let columnText: boolean = false;
        await browser.pause(timeout.medium);
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${myText}`,
                    async () => {
                        await allure.screenshot(this.app, "Before");
                        await browser.pause(timeout.slow);
                        const a = await browser.$(this.selector)
                            .waitForExist()
                            .then(async () => {
                                return a;
                            })
                            .catch((err: any) => {
                                console.log(
                                    "From messageColumnIncludesText: " +
                                    `${err}`
                                );
                                // reject(err);
                            });
                        await browser.$(this.selector)
                            .getText()
                            .then(async (text: any) => {
                                await browser.pause(timeout.fast);
                                if (text.includes(myText)) {
                                    // pass string from test
                                    columnText = true;
                                }
                                await allure.screenshot(this.app, "After");
                            })
                            .catch((err: any) => {
                                console.log(
                                    "messageColumnIncludesText:" + `${err}`
                                );
                                // reject(err);
                            });
                    }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return columnText;
    }

    public async checkStampColumnValueIsVisible(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector)
            .waitForExist()
            .then(async (val) => {
                a = val;
            })
            .catch((err: any) => {
                logClient.error(
                    "From checkTimeStampColumnValueIsVisible: " + `${err}`
                );
                a = false;
            });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async foreignTimeStampColumnIncludesValue(): Promise<boolean> {

        const common = new CommonMethods();
        let columnValue: boolean = false;
        await browser.$(this.selector)
            .getText()
            .then(async (text: any) => {
                common.convertForeignDateToUsa(text).then(async res => {
                    await common.getCurrDateMDY().then(date => {
                        if (res === date) {
                            columnValue = true;
                        }
                    })

                })
            }
            );

        return columnValue;
    }

    public async timeStampColumnIncludesvalue(
        myText: string
    ): Promise<boolean> {
        let columnValue: boolean = false;
        await browser.pause(timeout.medium);
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${myText}`,
                    async () => {
                        await allure.screenshot(this.app, "Before");
                        await browser.pause(timeout.slow);
                        const a = await browser.$(this.selector)
                            .waitForExist()
                            .then(async () => {
                                return a;
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "From timeStampColumnIncludesvalue: " +
                                    `${err}`
                                );
                                // reject(err);
                            });
                        await browser.$(this.selector)
                            .getText()
                            .then(async (text: any) => {
                                await browser.pause(timeout.fast);
                                if (text.includes(myText)) {
                                    // pass string from test
                                    columnValue = true;
                                }
                                await allure.screenshot(this.app, "After");
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "timeStampColumnIncludesvalue:" + `${err}`
                                );
                                // reject(err);
                            });
                    }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return columnValue;
    }

    public async checkEmptyRecordsHeader(): Promise<boolean> {
        let found: boolean = false;
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.slow);
        await browser
            .$(locators2.recordsHeader)
            .getText()
            .then(async (text: any) => {
                if (text.match("No Records Found")) {
                    found = true;
                }
            })
            .catch((err: any) => {
                logClient.error("From checkEmptyRecordsHeader: " + `${err}`);
            });
        return found;
    }

    public async checkMessageColumnValueIsVisible(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector)
            .then(async (val) => {
                a = val;
            })
            .catch((err: any) => {
                logClient.error(
                    "From checkMessageColumnValueIsVisible: " + `${err}`
                );
                a = false;
            });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async CheckSTDOut(stdOut: string, checkme: string, severityType: string, status: boolean): Promise<boolean> {
        let deploystatus: boolean = false;
        const expected: string = checkme.toString()
            .replace(/\n|\r/g, "");
        const result: string = stdOut.toString()
            .replace(/\n|\r/g, "");

        //DEBUG CONSOLE LOG HERE
        // console.log("MESSAGE from CheckSTDOut expected:  " + expected);
        // console.log("========================");
        // console.log("MESSAGE from CheckSTDOut result:  " + result);   
        let regex = new RegExp(expected);

        //  console.log("THIS IS THE RESULT"+regex.test(result)); // outputs: true
        if (result.includes(expected) || regex.test(result)) {
            deploystatus = true;
            return deploystatus;

        } else {
            deploystatus = false;
        }
        return deploystatus;
    }


    public async getexitCode(code: any): Promise<any> {
        return (parseInt(code, 10) > parseInt("7FFFFFFF", 16)) ? code - (parseInt("0xFFFFFFFF", 16) + 1) : code;
    }

    public async CLICommandExecuter(commandargs: string, filename: string, exitCode: any): Promise<any> {
        return new Promise<void>((resolve, rej) => {
            let output: any;
            const expectedExitCode = exitCode === undefined ? 0 : exitCode;
            cp.exec(commandargs, async (err, stdout, stderr) => {
                /* if (err) {
                     console.log("Error " + err);
                     rej(err);
                 }*/
                output = stdout.toString() + "\n---\n" + stderr.toString();
                await allure.stdOutputAttachment(output, "stdOutput");
                resolve(output);
            })
                .on('exit', async (code) => {
                    const signedInt = await this.getexitCode(code);
                    await allure.stdOutputAttachment('child process exited with code ' + signedInt, "Exit Code");
                    await expect(signedInt)
                        .toBe(expectedExitCode);
                });
            return output;
        });
    }

    public async CLICommandExecuterSync(commandargs: string, filename: string, exitCode: any): Promise<any> {

        const execSync = await require('child_process').execSync;
        const code = await execSync(commandargs);
        return code;
    }
    public async ProcessCommandCLI(commandargs: string, sysinfoPath: string): Promise<string> {
        console.log("This is the sysinfpath" + sysinfoPath);
        let result: string = "";
        const CSDU_INSTALLER_PATH: string = environment.isDevelopment() ? path.resolve(__dirname, "..", "..", "..", "dist", "electron-builder", "win-unpacked", "bin") : "C:\\Program Files (x86)\\Extron\\ControlScript Deployment Utility";
        const NONJSONFILEPATH: string = path.resolve(__dirname, "..", "..", "resources", "NotGoodProject", "invalidsysteminfo.txt");
        const NODESTINYPATH: string = path.resolve(__dirname, "..", "..", "resources", "NotGoodProject", "nothing.json");
        const CORRUPTDESTINYPATH: string = path.resolve(__dirname, "..", "..", "resources", "NotGoodProject", "systeminfoInvalid.json");
        const NONJSONFILEPS: string = path.resolve(__dirname, "..", "..", "resources", "ProtectingSecretsProject", "DataFile", "DataFile.xls");
        const NOTFOUNDJSONFILEPS: string = path.resolve(__dirname, "..", "..", "resources", "ProtectingSecretsProject", "DataFile.xls");
        const SYSTEMDATAFILE: string = path.resolve(__dirname, "..", "..", "resources", "DeployProject", "SystemDataFile.json");
        const basicCommand = "CD /D \"" + CSDU_INSTALLER_PATH + "\" && \"csdu.cmd\"";
        // replace keywords in commandargs with their proper string
        // if command changes replace it here.
        let parsedCommandArgs: string = commandargs.replace(/systemInfoFilePath/g, sysinfoPath);
        parsedCommandArgs = parsedCommandArgs.replace(/deploy/g, "deploy");
        parsedCommandArgs = parsedCommandArgs.replace(/nonJsonSysInfo/g, NONJSONFILEPATH);
        parsedCommandArgs = parsedCommandArgs.replace(/noDestinyFile/g, NODESTINYPATH);
        parsedCommandArgs = parsedCommandArgs.replace(/CorruptDestinyFile/g, CORRUPTDESTINYPATH);
        parsedCommandArgs = parsedCommandArgs.replace(/NonJsonFileps/g, NONJSONFILEPS);
        parsedCommandArgs = parsedCommandArgs.replace(/NotFoundJsonFileps/g, NOTFOUNDJSONFILEPS);
        parsedCommandArgs = parsedCommandArgs.replace(/InvalidDataFilePath/g, SYSTEMDATAFILE);
        // generic happy path deploy if input is cliCommand keyword
        // otherwise append commandarg to basicCommand
        result = parsedCommandArgs === "cliCommand" ? basicCommand + " deploy -f \"" + sysinfoPath + "\"" : basicCommand + " " + parsedCommandArgs;
        return result;
    }


    public async jsonParsor(datajson: any, systemInfoFile: any, systemInfoFileTemp: any): Promise<void> {
        // async function runTest(datajson: any): Promise<void> {
        describe(`${datajson.TestCaseInfo.SuiteType}":"${datajson.TestCaseInfo.UserStory}`, async () => {
            before(async () => {
                let myjson = await JSON.stringify(datajson);
                // tslint:disable-next-line:forin
                for (const key in device) {
                    const re = new RegExp("\\b" + key + "\\b", 'g');
                    myjson = await myjson.replace(re, device[key]);
                }
                try {
                    // tslint:disable-next-line:no-parameter-reassignment
                    datajson = await JSON.parse(myjson);
                } catch (err) {
                    console.log(err);
                }
            });
            let jparser;
            beforeEach(async () => {
                // tslint:disable-next-line:forin
                const UserStoryLink = await datajson.TestCaseInfo.UserStoryLink.split(",");
                const TaskLink = await datajson.TestCaseInfo.TaskLink.split(",");
                const TestCaseLink = await datajson.TestCaseInfo.TestCaseLink.split(",");
                await allure.addOwner(datajson.TestCaseInfo.Owner);
                await allure.story(datajson.TestCaseInfo.UserStory);
                await allure.addLink(UserStoryLink[0], UserStoryLink[1]);
                await allure.addLink(TaskLink[0], TaskLink[1]);
                await allure.addLink(TestCaseLink[0], TestCaseLink[1]);
                await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + ` Starting the execution of ${JSON.stringify(TestCaseLink[0])} test case`, async () => {
                });
                await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + " Initializing the Application", async () => {
                    return new Promise<void>(async (resolve) => {
                        let app: WebdriverIO.Browser;

                        resolve();
                    }).catch((err) => {
                    });
                });
            });
            const messageComponent = new MessagePaneComponent(this.app);
            const systemDeployment = new DeployComponent(this.app);
            const common = new CommonMethods();
            let a: string;
            let a1: string;
            const fname = "Filelog" + Date.now();
            // tslint:disable-next-line:cyclomatic-complexity
            it(`${datajson.TestCaseInfo.TestDescription}`, async () => {
                await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + ` Creating project file to be used in project`, async () => {
                    jparser = new Jsonparser();
                    await systemDeployment.destinyInputField.ChangeFile(systemInfoFile);
                    await common.copyFolder(systemInfoFile, systemInfoFileTemp);
                    // await app.pause(timeout.slow);
                    a = path.resolve(systemInfoFile);
                    a1 = await path.resolve(systemInfoFileTemp);
                    await allure.stdOutputAttachment("This is the project file location " + `${systemInfoFileTemp}`, "Project File Location");
                });
                let modifiedObj: any;
                // tslint:disable-next-line:forin
                for (const innerkey in datajson) {
                    if (innerkey === "Preconditions") {
                        await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + ` Modify the temp file as per following keywords to meet preconditions ${JSON.stringify(datajson.Preconditions)} `, async () => {
                            const systemInfo1 = await fs.readJsonSync(a1);
                            modifiedObj = await jparser.ProcessJson(systemInfo1, datajson.Preconditions);
                            await fs.writeJSONSync(a1, modifiedObj);
                            // await allure.stdOutputAttachmentJSON("Contents of Project File to be deployed " + jsonformat);
                            await allure.stdOutputAttachmentJSON(modifiedObj);
                        });
                    }
                    if (innerkey === "Steps") {
                        let stdoutData;
                        // tslint:disable-next-line:forin
                        for (const realinnerkey in datajson[innerkey]) {
                            if (realinnerkey === "CommandLineParams") {
                                // maintenence for CLI commands can be handled in ProcessCommandCLI function
                                const command: string = await messageComponent.messageRowValue.ProcessCommandCLI(datajson[innerkey][realinnerkey], systemInfoFileTemp);
                                await allure.stdOutputAttachment(command, "CLICommand");
                                await allure.stdOutputAttachmentJson(modifiedObj);
                                const exitCodeKey: string = 'VerifyExitCode';
                                const expectedExitCode = exitCodesJsonFile[datajson[innerkey][exitCodeKey]];
                                stdoutData = await messageComponent.messageRowValue.CLICommandExecuter(command, fname, expectedExitCode);
                            }
                            if (realinnerkey === "VerifyCLIMessage") {
                                for (const iteminnerkey in datajson[innerkey][realinnerkey]) {
                                    if (datajson[innerkey][realinnerkey].hasOwnProperty(iteminnerkey)) {
                                        await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + ` Checking the presence of message \"${datajson[innerkey][realinnerkey][iteminnerkey].MessageText}\" in cli output`, async () => {
                                            const lbl = await messageComponent.messageRowValue.CheckSTDOut(stdoutData, datajson[innerkey][realinnerkey][iteminnerkey].MessageText, datajson[innerkey][realinnerkey][iteminnerkey].MessageType, datajson[innerkey][realinnerkey][iteminnerkey].Exists);
                                            console.log("ACTUAL MESSAGE : " + lbl);
                                            console.log("Expected MESSAGE : " + datajson[innerkey][realinnerkey][iteminnerkey].Exist);
                                            await expect(lbl)
                                                .toEqual(datajson[innerkey][realinnerkey][iteminnerkey].Exist);
                                        });
                                    }
                                }
                                stdoutData = "";
                            }
                            if (realinnerkey === "GmCommands") {
                                await allure.step(`Set the value of ${datajson[innerkey]} input to`, async () => {
                                    let sysid;
                                    for (const iteminnerkey in datajson[innerkey][realinnerkey]) {
                                        if (datajson[innerkey][realinnerkey].hasOwnProperty(iteminnerkey)) {
                                            if (iteminnerkey === "Primary_Controller") {
                                                const primarydevice = new GmObject(datajson[innerkey][realinnerkey][iteminnerkey]);
                                                const systemInfo1 = await fs.readJsonSync(a1);
                                                const systemid = await systemInfo1.system.system_id;
                                                sysid = await primarydevice.ConnectPrimaryDevice(datajson[innerkey][realinnerkey][iteminnerkey], systemid);
                                            }
                                            if (iteminnerkey === "Peripheral_Devices") {
                                                for (const innerobjectkey in datajson[innerkey][realinnerkey][iteminnerkey]) {
                                                    if (datajson[innerkey][realinnerkey][iteminnerkey].hasOwnProperty(innerobjectkey)) {
                                                        const peripheraldevice = new GmObject(datajson[innerkey][realinnerkey][iteminnerkey][innerobjectkey]);
                                                        await peripheraldevice.ConnectDevice(sysid);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            });
            afterEach(async () => {
            });
        });
    }

    // deprecated function, always returns a true value during failure
    // public async messageColumnIncludesValue(myText: string): Promise<boolean> {
    //     let columnValue: boolean = false;
    //     await browser.pause(timeout.medium);
    //     await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
    //         await allure.screenshot(this.app, "Before");
    //         await allure.step(`Set the value of ${this.name} input to ${myText}`, async () => {
    //         await allure.screenshot(this.app, "Before");
    //         await browser.pause(timeout.medium);
    //         await browser
    //         .waitForExist(this.selector).then(async (val)=>{
    //             columnValue=val;
    //             return columnValue;
    //         }).catch((err: any) =>{
    //             logClient.error("From messageColumnIncludesValue: " + `${err}`);
    //            // reject(err);
    //         });
    //         await browser
    //             .element(this.selector)
    //             .getText()
    //             .then(async (text: any) => {
    //                 await browser.pause(timeout.fast);
    //                 if (text.includes(myText)) {
    //                     //pass string from test
    //                     columnValue = true;
    //                 }
    //                 await allure.screenshot(this.app, "After");
    //             }).catch((err: any)=> {
    //                 logClient.error('messageColumnIncludesValue:'+ `${err}`);
    //                // reject(err);
    //             });
    //         });
    //     });
    //     await allure.screenshot(this.app, "After");
    //     return columnValue;
    // }

    public async messageColumnIncludesValue(myText: string): Promise<boolean> {
        let columnValue: boolean = false;
        await browser.pause(timeout.medium);
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${myText}`,
                    async () => {
                        await allure.screenshot(this.app, "Before");
                        await browser.pause(timeout.medium);
                        await browser.$(this.selector)
                            .waitForExist()
                            .then(async () => {
                                // columnValue=val;
                                // return columnValue;
                                await browser.$(this.selector)
                                    .getText()
                                    .then(async (text: any) => {
                                        await browser.pause(
                                            timeout.medium
                                        );
                                        if (text.includes(myText)) {
                                            // pass string from test
                                            columnValue = true;
                                        }
                                        await allure.screenshot(
                                            this.app,
                                            "After"
                                        );
                                    })
                                    .catch((err: any) => {
                                        logClient.error(
                                            "messageColumnIncludesValue:" +
                                            `${err}`
                                        );
                                        // reject(err);
                                    });
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "From messageColumnIncludesValue: " +
                                    `${err}`
                                );
                                // reject(err);
                            });
                    }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return columnValue;
    }

    /**
     * Only if the checkme string is present in the message log this function returns true
     * @param checkme :string
     */
    public async checkMessagePaneLog(checkme: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${checkme}`,
                    async () => {
                        await allure.screenshot(this.app, "Before");
                        await browser.pause(timeout.slow);
                        const a = await browser.$(this.selector)
                            .waitForExist()
                            .then(async () => {
                                return a;
                            })
                            .catch((err: any) => {
                                console.log(
                                    "From checkMessagePaneLog: " + `${err}`
                                );
                            });
                        await browser.getElementText(this.selector)
                            .then(async (text: any) => {
                                await browser.pause(timeout.medium);
                                if (text.includes(checkme)) {
                                    // pass string from test
                                    message = true;
                                }
                                await allure.screenshot(this.app, "After");
                            })
                            .catch((err: any) => {
                                console.log(
                                    "checkMessagePaneLog:" + `${err}`
                                );
                            });
                    }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return message;
    }

    public async checkMessagePaneLogs(checkme: string, severityType: string): Promise<boolean> {
        let message: boolean = false;
        let deploystatus: boolean = true;
        await allure.step(`Checking mesagepane for message: '${checkme}' | Type: '${severityType}'. `, async () => {
            //deployment fails
            //deployment is good/still running
            let inTroubleshootingPage = await browser.$('#trace-header-title').isClickable();
            let systemDeployment = new DeployComponent(browser);
            let errorMsgElement = await browser.$(deploymentLocators.errorMsg)
            let errorMessageVisible = await errorMsgElement.isDisplayed()
            if (!inTroubleshootingPage && errorMessageVisible === false) {
                await browser.waitUntil(async () => {
                    return await (await browser.$('#deploy-deploy-btn')).isClickable();
                }, { timeout: 400000 }).catch(async (err: any) => {
                    console.warn("ERROR thrown in Line 809: CheckMessageLogs() " + err);
                    reject(err);
                })
            }
            await browser.pause(2000);
            const list = await browser.$$(
                locators2.messagepanerows
            );
            for (let i = 1; i <= list.length; i++) {
                await browser.$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[3]")
                    .getText()
                    .then(async (text: any) => {
                        if (await text === checkme || await text.match(checkme) || await text.match(new RegExp(checkme)) != undefined || await text.includes(checkme)) {
                            // pass string from test
                            const b = await browser.$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[2]")
                                .getText()
                                .then(async (text1: any) => {
                                    if (await text1.match(severityType)) {
                                        // pass string from test
                                        message = true;
                                        deploystatus = true;
                                    } else {
                                        console.log(
                                            "Match for Severity failed..."
                                        );
                                    }
                                })
                                .catch((err: any) => {
                                    console.log(
                                        "checkMessagePaneLog: 1st if: " +
                                        `${err}`
                                    );
                                });
                        }
                    })
                    .catch(async (err: any) => {
                        console.log("checkMessagePaneLog:" + `${err}`);
                        await reject(err);
                    });
            }
            await allure.screenshot(this.app, `After checking messagepane for: '${checkme}'`);
            //     return deploystatus;
            // }, { timeout : 30000 })
            // .then(async () => { })
            // .catch(async (err: any) => {
            //     console.log("Exception caught bval " + err);
            // });
            // Promise.resolve()
        });
        return Promise.resolve(message);
    }

    public async checkProgramMessages(checkme: string, severityType: string): Promise<boolean> {
        let message: boolean = false;
        let deploystatus: boolean = true;
        await allure.step(`Check for message, or fail if deployment failure message found`, async () => {
            try {
                await browser.waitUntil(async () => {
                    return await (await browser.$('#deploy-deploy-btn')).isClickable()
                }, { timeout: 120000 })
            } catch (err) {
                console.warn(err);
            }
            await browser
                .waitUntil(async () => {
                    const list = await browser.$$(
                        locators2.messagepanerows
                    );
                    for (let i = 1; i <= list.length; i++) {
                        await browser.$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[3]")
                            .getText()
                            .then(async (text: any) => {
                                if (await text === checkme) {
                                    // pass string from test
                                    const b = await browser.$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[2]")
                                        .getText()
                                        .then(async (text1: any) => {
                                            if (await text1.match(severityType)) {
                                                // pass string from test
                                                message = true;
                                                deploystatus = true;
                                            } else {
                                                console.log("Match for Severity failed...");
                                            }
                                        })
                                        .catch((err: any) => {
                                            console.log("checkMessagePaneLog: 1st if: " + `${err}`);
                                        });
                                } else if (await text.match(new RegExp("Project deployment failed"))) {
                                    message = false;
                                    deploystatus = false;
                                }
                            })
                            .catch(async (err: any) => {
                                console.log("checkMessagePaneLog:" + `${err}`);
                                await reject(err);
                            });
                    }
                    await allure.screenshot(this.app, " After message Check");
                    return deploystatus;
                }, { timeout: 160000 })
                .then(async () => { })
                .catch(async (err: any) => {
                    console.log("Exception caught bval " + err);
                });
        });
        return message;
    }


    /**
     * Only if the checkme string and severityType string is present in the message log this function returns true
     * @param checkme :string
     * @param severityType :string
     * owner Neelam
     */
    public async checkTroublrshootingMessagePaneLogs(
        checkme: string,
        severityType: string
    ): Promise<boolean> {
        let message: boolean = false;
        let deploystatus: boolean = false;
        await allure.step(
            `Check for message, or fail if deployment failure message found`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await browser
                    .waitUntil(async () => {
                        const list = await browser.$$(
                            locators2.messagepanerows
                        );
                        for (let i = 1; i <= list.length; i++) {
                            await browser.$("//table//tr[" + i + "]//td[3]")
                                .getText()
                                .then(async (text: any) => {
                                    if (
                                        (await text) === checkme ||
                                        (await text.match(checkme)) ||
                                        (await text.match(
                                            new RegExp(checkme)
                                        )) != undefined
                                    ) {
                                        // pass string from test
                                        const b = await browser.$("//table//tr[" + i + "]//td[2]")
                                            .getText()
                                            .then(async (text1: any) => {
                                                if (text1.match(severityType)) {
                                                    // pass string from test
                                                    message = true;
                                                    deploystatus = true;
                                                }
                                            })
                                            .catch((err: any) => {
                                                logClient.error("checkMessagePaneLog:" + `${err}`
                                                );
                                            });
                                    }
                                })
                                .catch((err: any) => {
                                    console.log("checkMessagePaneLog:" + `${err}`);
                                });
                        }
                        return deploystatus;
                    }, { timeout: 80000 })
                    .then(async () => { })
                    .catch(async (err: any) => {
                        console.log("Exception caught bval " + err);
                    });
            }
        );
        await allure.screenshot(this.app, " After message Check");
        return message;
    }


    /**
     * Only if the checkme string and severityType string and count is present in the message log this function returns true
     * @param checkme :string
     * @param severityType :string
     * @param count :any
     */
    public async checkMessagePaneLogswithCount(
        checkme: string,
        severityType: string,
        count: any
    ): Promise<boolean> {
        let message: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${checkme}`,
                    async () => {
                        await allure.screenshot(this.app, "Before");
                        const list = await browser.$$(
                            locators2.messagepanerows
                        );
                        for (let i = 1; i <= (list.length); i++) {
                            await browser
                                .$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[3]")
                                .getText()
                                .then(async (text: any) => {
                                    logClient.error(
                                        "Message Pane Message" + `${text}`
                                    );
                                    const messages = await browser.$$(
                                        "//table[@class='sync-data-table sync-data-table-fixed']//span[contains(text(),'" + checkme + "')]");
                                    const messagesCount = messages.length;
                                    if (
                                        text.includes(checkme) &&
                                        messagesCount === count
                                    ) {
                                        // pass string from test
                                        await browser
                                            .$(
                                                "//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[2]"
                                            )
                                            .getText()
                                            .then(async (text1: any) => {
                                                logClient.error(
                                                    "Message Pane Message" +
                                                    `${text1}`
                                                );
                                                if (
                                                    text1.includes(severityType)
                                                ) {
                                                    // pass string from test
                                                    message = true;
                                                }
                                                await allure.screenshot(
                                                    this.app,
                                                    "After"
                                                );
                                            })
                                            .catch((err: any) => {
                                                logClient.error(
                                                    "checkMessagePaneLog:" +
                                                    `${err}`
                                                );
                                            });

                                        await allure.screenshot(
                                            this.app,
                                            "After"
                                        );
                                    }
                                })
                                .catch((err: any) => {
                                    logClient.error(
                                        "checkMessagePaneLog:" + `${err}`
                                    );
                                });
                        }
                    }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return message;
    }

    public async checkMessagePaneLogsNotIncluded(
        checkme: string,
        severityType: string
    ): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await allure.step(`Set the value of ${this.name} input to ${checkme}`, async () => {
                await allure.screenshot(this.app, "Before");
                await browser.$("#deploy-progress-percent")
                    .waitForExist({ timeout: 150000 })
                    .then(async (value) => {
                        console.log("Deployment SUCCESS: " + value);
                    })
                    .catch((err: any) => {
                        console.log(err);
                        reject(err)
                            .catch((err1: any) => {
                                console.log(err1);
                            });
                    });
                const list = await browser.$$(locators2.messagepanerows);
                for (let i = 1; i <= list.length; i++) {
                    await browser.$(locators2.messagepanerows + "[" + i + "]//td[3]")
                        .getText()
                        .then(async (text: any) => {
                            if (!(text === checkme || text.match(checkme))) {
                                // pass string from test
                                await browser.$(locators2.messagepanerows + "[" + i + "]//td[2]")
                                    .getText()
                                    .then(async (text1: any) => {
                                        if (!text1.includes(severityType)) {
                                            // pass string from test
                                            message = true;
                                        }
                                        await allure.screenshot(this.app, "After");
                                    })
                                    .catch((err: any) => {
                                        logClient.error("checkMessagePaneLogsNotIncluded:" + `${err}`);
                                    });
                                await allure.screenshot(this.app, "After");
                            }
                        })
                        .catch((err: any) => {
                            logClient.error("checkMessagePaneLogsNotIncluded:" + `${err}`);
                        });
                }
            });
        });
        await allure.screenshot(this.app, "After");
        return message;
    }

    public async checkMessagePaneLogsNotIncluded2(
        checkme: string,
        severityType: string
    ): Promise<boolean> {
        let message: boolean = true;
        await allure.step(`Set the value of ${this.name} input to ${this.app}`, async () => {
            await allure.screenshot(this.app, "Before");
            await allure.step(`Set the value of ${this.name} input to ${checkme}`, async () => {
                await allure.screenshot(this.app, "Before");
                const list = await browser.$$(locators2.messagepanerows);
                for (let i = 1; i <= list.length; i++) {
                    await browser
                        .$("//mat-table//mat-row[" + i + "]//mat-cell[3]")
                        .getText()
                        .then(async (text: any) => {
                            if (text === checkme || text.match(checkme)) {
                                // pass string from test
                                await browser
                                    .$("//mat-table//mat-row[" + i + "]//mat-cell[2]")
                                    .getText()
                                    .then(async (text1: any) => {
                                        if (text1.includes(severityType)) {
                                            // pass string from test
                                            message = false;
                                        }
                                        await allure.screenshot(this.app, "After");
                                    })
                                    .catch((err: any) => {
                                        logClient.error("checkMessagePaneLog:" + `${err}`);
                                    });
                                await allure.screenshot(this.app, "After");
                            }
                        })
                        .catch((err: any) => {
                            logClient.error("checkMessagePaneLog:" + `${err}`);
                        });
                }
            });
        });
        await allure.screenshot(this.app, "After");
        return message;
    }

    public async checkMessageLen(checkme: string): Promise<number> {
        const messages = await browser.$$("//mat-table//mat-row//mat-cell//div[contains(text(),'" + checkme + "')]");
        const messagesCount = messages.length;
        return messagesCount;
    }

    public async checkSeverityColumnValueIsVisible(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector)
            .waitForExist()
            .then(async (val) => {
                a = val;
            })
            .catch((err: any) => {
                logClient.error("From checkSeverityColumnValueIsVisible: " + `${err}`);
                a = false;
            });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async severityColumnIncludesValue(myText: string): Promise<boolean> {
        let columnValue: boolean = false;
        await browser.pause(timeout.medium);
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(`Set the value of ${this.name} input to ${myText}`, async () => {
                    await allure.screenshot(this.app, "Before");
                    await browser.pause(timeout.slow);
                    const a = await browser.$(this.selector)
                        .waitForExist()
                        .then(async () => {
                            return a;
                        })
                        .catch((err: any) => {
                            logClient.error(
                                "From severityColumnIncludesValue: " +
                                `${err}`
                            );
                        });
                    await browser.$(this.selector)
                        .getText()
                        .then(async (text: any) => {
                            await browser.pause(timeout.fast);
                            if (text.includes(myText)) {
                                // pass string from test
                                columnValue = true;
                            }
                            await allure.screenshot(this.app, "After");
                        })
                        .catch((err: any) => {
                            logClient.error(
                                "severityColumnIncludesValue:" + `${err}`
                            );
                        });
                }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return columnValue;
    }

    /**
     *
     * @param: severityType
     */
    public async checkMessagePaneLogsSeverity(severityType: string
    ): Promise<boolean> {
        let message: boolean = false;
        await allure.step(
            `Check for severity, or fail if deployment failure message found`,
            async () => {
                await allure.screenshot(this.app, "Before");
                let inTroubleshootingPage = await browser.$('#trace-header-title').isClickable();
                let systemDeployment = new DeployComponent(browser);
                let errorMsgElement = await browser.$(deploymentLocators.errorMsg)
                let errorMessageVisible = await errorMsgElement.isDisplayed()
                if (!inTroubleshootingPage && errorMessageVisible === false) {
                    await browser.waitUntil(async () => {
                        return await (await browser.$('#deploy-deploy-btn')).isClickable();
                    }, { timeout: 120000 }).catch(async (err: any) => {
                        console.warn("ERROR thrown in Line 809: CheckMessageLogs() " + err);
                        reject(err);
                    })
                }
                const list = await browser.$$(
                    locators2.messagepanerows
                );
                for (let i = 1; i <= (list.length); i++) {
                    // pass string from test
                    const b = await browser.$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[2]")
                        .getText()
                        .then(async (text1: any) => {
                            // tslint:disable-next-line:prefer-conditional-expression
                            if (text1.match(severityType)) {
                                // pass string from test
                                message = true;
                            } else {
                                message = false;
                            }
                        })
                        .catch((err: any) => {
                            console.log("checkMessagePaneLog: 1st if: " + `${err}`);
                        });
                }

            }
        );
        await allure.screenshot(this.app, " After message Check");
        return message;
    }

    /**
     *
     * @param: severityType
     */
    public async checkMessagePaneLogsSeverityNotIncluded(severityType: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(
            `Check for severity, or fail if deployment failure message found`,
            async () => {
                await allure.screenshot(this.app, "Before");
                let inTroubleshootingPage = await browser.$('#trace-header-title').isClickable();
                let systemDeployment = new DeployComponent(browser);
                let errorMsgElement = await browser.$(deploymentLocators.errorMsg)
                let errorMessageVisible = await errorMsgElement.isDisplayed()
                if (!inTroubleshootingPage && errorMessageVisible === false) {
                    await browser.waitUntil(async () => {
                        return await (await browser.$('#deploy-deploy-btn')).isClickable();
                    }, { timeout: 120000 }).catch(async (err: any) => {
                        console.warn("ERROR thrown in Line 809: CheckMessageLogs() " + err);
                        reject(err);
                    })
                }
                const list = await browser.$$(
                    locators2.messagepanerows
                );
                for (let i = 1; i <= (list.length); i++) {
                    // pass string from test
                    const b = await browser
                        .$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[2]")
                        .getText()
                        .then(async (text1: any) => {
                            // tslint:disable-next-line:prefer-conditional-expression
                            if (!text1.match(severityType)) {
                                // pass string from test
                                message = true;
                            } else {
                                message = false;
                            }
                        })
                        .catch((err: any) => {
                            console.log("checkMessagePaneLogsSeverityNotIncluded: 1st if: " + `${err}`);
                        });
                }
                return message;

            }
        );
        await allure.screenshot(this.app, " After message Check");
        return message;
    }

    public async selectSeverityType(severityType: string): Promise<boolean> {
        let clickAction: boolean = false;
        await allure.step(
            `Set the value of ${this.name} input to ${this.app}`,
            async () => {
                await allure.screenshot(this.app, "Before");
                await allure.step(
                    `Set the value of ${this.name} input to ${severityType}`,
                    async () => {
                        await allure.screenshot(this.app, "Before");
                        // await browser.$(locators2.severityFilter).click();
                        await browser
                            .$("//div[@class='label-wrapper' and contains(text(),'" + severityType + "')]")
                            .click()
                            .then(async () => {
                                clickAction = true;
                            })
                            .catch((err: any) => {
                                logClient.error(
                                    "selectSeverityType:" + `${err}`
                                );
                            });

                        await allure.screenshot(this.app, "After");
                    }
                );
            }
        );
        await allure.screenshot(this.app, "After");
        return clickAction;
    }

    public async getMessagesFromMessagePane(): Promise<{ text: string; type: string }[]> {
        //Wait Until Deployment is complete. (Check if Deploy btn is enabled again. Should be greyed out during deployment)
        const inTroubleshootingPage = await browser.$('#trace-header-title').isClickable();
        const errorMsgElement = await browser.$(deploymentLocators.errorMsg)
        const errorMessageVisible = await errorMsgElement.isDisplayed()
        if (!inTroubleshootingPage && errorMessageVisible === false) {
            await browser.waitUntil(async () => {
                return await (await browser.$('#deploy-deploy-btn')).isClickable();
            }, { timeout: 400000 }).catch(async (err: any) => {
                console.warn("ERROR thrown in Line 809: CheckMessageLogs() " + err);
                reject(err);
            })
        }
        await browser.pause(2000);


        //Deploy is complete. Grab all Messages in message pane in format {text: "Deploy complete", type: "Info"}. Put into array and return it.
        //Checks happen in UpdatedMaster
        const rows = await browser.$$(locators2.messagepanerows);
        const messages: { text: string; type: string }[] = [];

        for (let i = 1; i <= rows.length; i++) {
            try {
                const textEl = await browser.$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[3]");
                const typeEl = await browser.$("//table[@class='sync-data-table sync-data-table-fixed']//tr[" + i + "]//td[2]");

                const text = await textEl.getText();
                const type = await typeEl.getText();

                messages.push({ text, type });
            } catch (err) {
                console.error("Error scraping a message row:", err);
            }
        }

        return messages;
    }
}
