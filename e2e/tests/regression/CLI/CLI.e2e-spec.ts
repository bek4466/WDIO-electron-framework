// @ts-nocheck
import { LogClient } from "@extron/winston-logger";
import { GmObject } from "../../../src/deployment/GmObject.po";
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from "../../../src/allure/allure";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { Jsonparser } from "../../../src/deployment/Jsonparser.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { CommonMethods } from "../../commonMethods.po";
import { environment } from '../../../../electron/src/environment/environment';
import { browser } from "@wdio/globals";
const logClient = new LogClient("e2e:CSP-193");
const common = new CommonMethods();
import { DebugSetupOptions, DefaultSetupOptions, ServicePoolManager } from "@extron/module-service-initializer";
const exitCodesJsonFile = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "exitCodes.json"));
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT908.json");
var systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "NBPProject", "systeminfoTmp.json");
var systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "NBPProject", "systeminfo.json");
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const datajsonfile = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "tests", "regression", "CLI", "datajson", "FilesCLI.json"));
const time: Date = new Date();
let dataFilePth;
let flag = false;
let prjName= "";
let prjchngName = "";
let target;

/**
 * @Author `Oybek, Miguel, Amit`
 * @LinkToEPIC `https://extron.atlassian.net/browse/TOOL-2111`
 * @LinkToEPIC `https://extron.atlassian.net/browse/TOOL-2055`
 * @Description `CLI Tests `
 * @Date `12/10/2020`
 */
// tslint:disable-next-line:forin
describe("CLI: Running Test Suite", () => {
    async function runTest(datajson: any): Promise<void> {
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
            }
            );
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
                await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + " Initializing the application", async () => {
                return new Promise<void>(async (resolve) => {
                    await browser.pause(10000);
                    await browser.switchWindow(tabTitles.mainTab);
                    await allure.screenshot(browser, "BeforeALL Hook");
                    await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
                    resolve();
                }).catch((err) => {

                });
            });
            });
            const messageComponent = new MessagePaneComponent(browser);
            const systemDeployment = new DeployComponent(browser);
            let a : string;
            let a1 : string;
            const fname = "Filelog" + Date.now();
            // tslint:disable-next-line:cyclomatic-complexity
            it(`${datajson.TestCaseInfo.TestDescription}`, async () => {
                const projectFile = await datajson.TestCaseInfo.ProjectFile;
                const projectCode = await datajson.TestCaseInfo.ProjectCode;
                await allure.step(time.toLocaleTimeString() + " " + time.toLocaleDateString() + ` Creating project file to be used in project`, async () => {
                    jparser = new Jsonparser();
                   
                    await systemDeployment.destinyInputField.ChangeFile(systemInfoFilePath);
                    await common.copyFolder(systemInfoFilePath, systemInfoFileTemp);
                    a = await path.resolve(systemInfoFile);
                    a1 = await path.resolve(systemInfoFileTemp);
                    await allure.stdOutputAttachment("This is the project file location " + `${systemInfoFileTemp}`, "Project File Location");
                });
                let modifiedObj:any;
                    // tslint:disable-next-line:forin
                for (const innerkey in datajson) {
                    for (const innerkey in datajson) {
                        // console.log("INSIDE THE LOOP INNERKEY =  " + innerkey)
                        if (innerkey === "ProjectName") {
                                 prjName = datajson.ProjectName;
                                 flag = true
                                 
                        }
                    }

                    if (projectFile != undefined) {
                        systemInfoFilePath = await path.join(__dirname, "..", "..", "..", "resources", projectFile);
                        if(flag){
                            systemInfoFileTemp = await path.join(__dirname, "..", "..", "..", "resources", projectFile, "..", prjName + ".json");
                        }
                        else{
                        
                            systemInfoFilePath = await path.join(__dirname, "..", "..", "..", "resources", projectFile, "..", "systeminfo.json")
                            systemInfoFileTemp = await path.join(__dirname, "..", "..", "..", "resources", projectFile, "..", "systeminfoTmp.json");
                            
                        }

                        await systemDeployment.destinyInputField.ChangeFile(systemInfoFilePath);
                        await common.copyFolder(systemInfoFilePath, systemInfoFileTemp);
                        a = await path.resolve(systemInfoFile);
                        a1 = await path.resolve(systemInfoFileTemp);
                       
                        
                    }
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
                                                await expect(lbl)
                                                    .toEqual(datajson[innerkey][realinnerkey][iteminnerkey].Exist);
                                            });
                                        }
                                    }
                                    stdoutData = "";
                                }
                                if (realinnerkey === "GmCommands") {
                                    await allure.step(`Set the value of ${datajson[innerkey]} input to`, async () => {
                                       /* 
                                        */
                                        const initializer = environment.isDevelopment() ? new ServicePoolManager(DebugSetupOptions) : new ServicePoolManager(DefaultSetupOptions);
                                        let sysid;
                                        // tslint:disable-next-line:forin
                                        for (const iteminnerkey in datajson[innerkey][realinnerkey]) {
                                            if (datajson[innerkey][realinnerkey].hasOwnProperty(iteminnerkey)) {
                                                if (iteminnerkey === "Primary_Controller") {

                                            const systemInfo1 = await fs.readJsonSync(a1);
                                            const systemid =  await systemInfo1.system.system_id;
                                            const primarydevice = new GmObject(datajson[innerkey][realinnerkey][iteminnerkey]);
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
                                            if (initializer){
                                            initializer.kill();
                                    }
                                }
                            });

                                }
                            }

                        }
                    }
            });

            after(async () => {
            });
        });
    }

    // tslint:disable-next-line:forin
    for (const filekey in datajsonfile) {
        const datajson = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "tests", "regression", "CLI", "datajson", datajsonfile[filekey]));
        // look at the keys
        // tslint:disable-next-line:forin
        for (const key in datajson) {
            if (datajson[key].Execute === "True") {
                runTest(datajson[key])
                    .catch((err) => console.log(err));
    }
}
    }
});
