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
const logClient = new LogClient("e2e:CSP-193");
import { browser } from "@wdio/globals";
const common = new CommonMethods();
const systemInfoFile = path.join(__dirname, "..", "..", "..", "resources", "DeployProject", "systeminfoT908.json");
const systemInfoFileTemp = path.join(__dirname, "..", "..", "..", "resources", "EbusProject", "systeminfoTmp.json");
const systemInfoFilePath = path.join(__dirname, "..", "..", "..", "resources", "EbusProject", "systeminfo.json");
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const exitCodesJsonFile = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "exitCodes.json"));
const datajsonfile = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "tests", "regression", "CLI", "datajson", "filesEBUSCLI.json"));
const device = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "deviceData.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
/**
 * @Author `Amit B.QA`
 * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2199`
 * @POM `https://extron.atlassian.net/browse/CSP-20`
 * @Description `CLI Tests `
 * @Date `12/10/2020`
 */
// tslint:disable-next-line:forin
describe("CLI_EBUS: Running Test Suite", () => {


    async function runTest(datajson: any): Promise<void> {

        describe(`${datajson.SuiteType}":"${datajson.UserStory}`, async () => {
            before(async () => {

                let myjson = await JSON.stringify(datajson);
                // tslint:disable-next-line:forin
                for (const key in device) {

                    const re = new RegExp("\\b" + key + "\\b", 'g');
                    myjson = await myjson.replace(re, device[key]);
                }
                try {
                    // 
                    // tslint:disable-next-line:no-parameter-reassignment
                    datajson = await JSON.parse(myjson);
                } catch (err) {
                    console.log(err);
                }
            });
            let jparser;
            beforeEach(async () => {
                // tslint:disable-next-line:forin
                const UserStoryLink = await datajson.UserStoryLink.split(",");
                const TaskLink = await datajson.TaskLink.split(",");
                const TestCaseLink = await datajson.TestCaseLink.split(",");
                await allure.addOwner(datajson.Owner);
                await allure.story(datajson.UserStory);
                await allure.addLink(UserStoryLink[0], UserStoryLink[1]);
                await allure.addLink(TaskLink[0], TaskLink[1]);
                await allure.addLink(TestCaseLink[0], TestCaseLink[1]);
                return new Promise<void>(async (resolve) => {
                    
                    resolve();
                }).catch((err) => {

                });
            });

            // tslint:disable-next-line:cyclomatic-complexity
            it(`${datajson.TestDescription}`, async () => {
                await allure.step(`Set the value of ${datajson.TestDescription} input to`, async () => {
                    jparser = new Jsonparser();
                    const messageComponent = new MessagePaneComponent(browser);
                    const systemDeployment = new DeployComponent(browser);
                    await systemDeployment.destinyInputField.ChangeFile(systemInfoFilePath);
                    await common.copyFolder(systemInfoFilePath, systemInfoFileTemp);
                    const a = path.resolve(systemInfoFile);
                    const a1 = await path.resolve(systemInfoFileTemp);
                    const systemInfo1 = await fs.readJsonSync(a1);
                    const modifiedObj = await jparser.ProcessJson(systemInfo1, datajson.Preconditions);
                    await fs.writeJSONSync(a1, modifiedObj);
                    const fname = "Filelog" + Date.now();
                    // tslint:disable-next-line:forin
                    for (const innerkey in datajson) {
                        if (innerkey === "Preconditions") {
                        }
                        if (innerkey === "Steps") {
                            let stdoutData;
                            // tslint:disable-next-line:forin
                            for (const realinnerkey in datajson[innerkey]) {
                                if (realinnerkey === "CommandLineParams") {
                                    await allure.step(`Set the value of ${datajson[innerkey]} input to`, async () => {
                                        // maintenence for CLI commands can be handled in ProcessCommandCLI function
                                        const command: string = await messageComponent.messageRowValue.ProcessCommandCLI(datajson[innerkey][realinnerkey], systemInfoFileTemp);
                                        await allure.stdOutputAttachment(command, "CLICommand");
                                        await allure.stdOutputAttachmentJson(modifiedObj);
                                        const exitCodeKey: string = 'VerifyExitCode';
                                        const expectedExitCode = exitCodesJsonFile[datajson[innerkey][exitCodeKey]];
                                        stdoutData = await messageComponent.messageRowValue.CLICommandExecuter(command, fname, expectedExitCode);
                                    });
                                }
                                if (realinnerkey === "VerifyCLIMessage") {
                                    for (const iteminnerkey in datajson[innerkey][realinnerkey]) {
                                        if (datajson[innerkey][realinnerkey].hasOwnProperty(iteminnerkey)) {
                                            await allure.step(`Set the value of ${datajson[innerkey]} input to`, async () => {
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
                                        let sysid;
                                        for (const iteminnerkey in datajson[innerkey][realinnerkey]) {
                                            if (datajson[innerkey][realinnerkey].hasOwnProperty(iteminnerkey)) {
                                                if (iteminnerkey === "Primary_Controller") {

                                            const primarydevice = new GmObject(datajson[innerkey][realinnerkey][iteminnerkey]);
                                            sysid = await primarydevice.ConnectPrimaryDevice(datajson[innerkey][realinnerkey][iteminnerkey]);
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
            });

            afterEach(async () => {
            });
        });
    }

    // tslint:disable-next-line:forin
    for (const filekey in datajsonfile) {
        const datajson = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "tests", "regression", "CLI", "datajson", datajsonfile[filekey]));
        // look at the keys
        for (const key in datajson) {

            if (datajson[key].Execute === "True") {

                runTest(datajson[key])
                    .catch((err) => console.log(err));
            }
        }
    }
});

