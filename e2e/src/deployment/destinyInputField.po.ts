
/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { MatButton } from "../matButton";
import { allure } from '../allure/allure';
import { reject } from 'q';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
import { LogClient } from '@extron/winston-logger';
import { Key } from "webdriverio";
const logClient = new LogClient("e2e:destinyInputField");
export class DestinyInputField extends MatButton {

    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Destiny input field");
    }
    public async click(): Promise<void> {
        await super.click();
    }
   
    public async clearDestinyPath(): Promise<boolean> {
        let valueIsVisible: boolean = true;
            const clear = await this.getElement()
            .clearElement().then(async ()=>{
                valueIsVisible = false
              }).catch((err: Error)=>{
                  logClient.error("Exception caught: "+ `${err}`);
              });
            
        return valueIsVisible
    }
    public async clearDestinyFilePath(): Promise<boolean> {
        let clearPath: boolean = false;
        await browser
        .elementClear(this.selector).then(async ()=>{
                clearPath = true;
              }).catch((err: Error)=>{
                  logClient.error("Exception caught: "+ `${err}`);
              });
            
        return clearPath
    }
    public async ChangeFile(fpath: string): Promise<void> {
        await allure.step(`Create the project file from following master project file ${fpath}`, async () => {
            const a = path.resolve(fpath);
            const systemInfo = fs.readJsonSync(a);
            //no longer project_root_folder now its project_root_folder_path
            systemInfo.system.project_root_folder_path = path.dirname(a);
            await fs.writeJSONSync(a, systemInfo);
        });
    }

    public async ChangeFile2(fpath: string): Promise<void> {
        await allure.step(`Set the value of ${this.app} input to ${fpath}`, async () => {
            await allure.screenshot(this.app, "Before");
            const a = path.resolve(fpath);
            const systemInfo = fs.readJsonSync(a);
            //no longer project_root_folder now its project_root_folder_path
            systemInfo.system.project_root_folder_path = path.dirname(a);
            delete systemInfo.system.project_root_folder_path;
            await fs.writeJSONSync(a, systemInfo);
        });
        await allure.screenshot(this.app, "After");
    }

    public async verifyContent(fpath: string): Promise<void> {
        const content = await browser.$(locators.inputField).getValue();
        await expect(content.toLowerCase()).toBe(fpath.toLowerCase());
        return;
    }

    /**
     * please use this function to set the path
     * @param fpath
     */
    public async setDestinyFileToUpload(fpath: string): Promise<boolean> {
        const b = path.resolve(fpath);
        let systemInfo;
        //if invalid json, read as file
        try {
            systemInfo = await fs.readJsonSync(b);
        } catch (error) {
            systemInfo = await fs.readFileSync(b);
        }
        await allure.projectAttachment(this.app, systemInfo);
        await browser.pause(5000);
        await allure.step(`Set the value of ${fpath} input to`, async () => {
            const exists = await this.getElement()
                .isExisting(locators.chooseFileBtn).catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                    reject(err).catch((err: Error) => {
                        console.log("Exeption inside the catch FPATH: " + `${err}`);
                    });
                });
            this.ChangeFile(fpath).then(async () => {
                await browser.execute(function () {
                    document.getElementById('deploy-input-file-disabled').style.display = 'block';
                });
                await browser.pause(3000);
                await browser.$("#deploy-input-file-disabled").setValue(fpath);
                await browser.execute(function () {
                    document.getElementById('deploy-input-file-disabled').style.display = 'none';
                });
            }).catch((err: Error) => {
                console.log("Exception caught: " + `${err}`);
                reject(err).catch((err: Error) => {
                    console.log("Exeption inside the catch: " + `${err}`);
                });
            });
            return exists;
        });
        await allure.screenshot(this.app, "After: setDestinyFileToUpload");
        return Promise.resolve(true);
    }
    public async setDestinyFileToUploadNoPath(fpath: string): Promise<boolean> {
        const b = path.resolve(fpath);
        let systemInfo;
        //if invalid json, read as file
        try {
            systemInfo = await fs.readJsonSync(b);
        } catch (error) {
            systemInfo = await fs.readFileSync(b);
        }
        await allure.projectAttachment(this.app, systemInfo);
        await browser.pause(5000);
        await allure.step(`Set the value of ${fpath} input to`, async () => {
            const exists = await this.getElement()
                .isExisting(locators.chooseFileBtn).catch((err: Error) => {
                    console.log("Exception caught: " + `${err}`);
                    reject(err).catch((err: Error) => {
                        console.log("Exeption inside the catch FPATH: " + `${err}`);
                    });
                });
            this.ChangeFile2(fpath).then(async () => {
                await browser.execute(function () {
                    document.getElementById('deploy-input-file-disabled').style.display = 'block';
                });
                await browser.pause(3000);
                await browser.$("#deploy-input-file-disabled").setValue(fpath);
                await browser.execute(function () {
                    document.getElementById('deploy-input-file-disabled').style.display = 'none';
                });
            }).catch((err: Error) => {
                console.log("Exception caught: " + `${err}`);
                reject(err).catch((err: Error) => {
                    console.log("Exeption inside the catch: " + `${err}`);
                });
            });
            return exists;
        });
        await allure.screenshot(this.app, "After: setDestinyFileToUpload");
        return;
    }

    public async copyFolder(source: string, destination: string): Promise<boolean> {
        var copyFolderFiles: boolean = false;
        await fs.copy(source, destination)
            .then(async () => {
                console.log('Copy completed!')
                copyFolderFiles = true;
            })
            .catch(err => {
                console.log('An error occured while copying the folder.')
                return console.error(err)
            })

        return copyFolderFiles;
    }

    public async inputFilePathEditable(destinyFilePathInput: string): Promise<boolean> {
        let a;
        await browser.$("#deploy-input-file-disabled").waitForExist({ timeout: 1000 }).then(async (val) => {
            a = val;
            await browser.execute(function () {
                document.getElementById('deploy-input-file-disabled').style.display = 'block';
            });
            await browser.pause(5000);
            await browser.$("#deploy-input-file-disabled").setValue(destinyFilePathInput);
            await browser.execute(function () {
                document.getElementById('deploy-input-file-disabled').style.display = 'none';
            });
        }).catch((err: Error) => {
            console.log("From inputFilePathEditable: " + `${err}`);
            a = false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }

    public async copyFilesTolocation(fpath: string): Promise<boolean> {
        let msg: boolean = false;
        await browser.$(this.selector).waitForExist()
            .then(async val => {
                if (val) {
                    //if true then get the text
                    const files = await browser.$(this.selector).getAttribute('title');
                    const dPath = path.dirname(files);
                    await this.copyFolder(fpath, dPath);
                    msg = true;
                }

            });
        return msg;
    }

    public async verifyDestinyKey(destinyFileKey: string, fpath: string): Promise<boolean> {
        let key: boolean = false;
        const a = path.resolve(fpath);
        const systemInfo = fs.readJsonSync(a);
        await allure.step(`Set the value of ${destinyFileKey} input to`, async () => {
            await browser.$(locators.destinyFilePath).waitForExist({timeout: 1000}).then(async (val) => {
                key = val;
                if (destinyFileKey in systemInfo) {
                    key = true;

                }
            }).catch((err: Error) => {
                console.log("From inputFilePathEditable: " + `${err}`);
                key = false;
            });
        });
        return key;
    }

    public async verifyDestinyKeyType(destinyFileKey: string, fpath: string, type: string): Promise<boolean> {
        var key: boolean = false;
        const a = path.resolve(fpath);
        const systemInfo = fs.readJsonSync(a);
        await allure.step(`Set the value of ${type} input to`, async () => {
            await browser.$(locators.destinyFilePath).waitForExist({timeout: 1000}).then(async (val) => {
                key = val;
                if (typeof systemInfo.destinyKey == type) {
                    key = true;

                }
            }).catch((err: Error) => {
                console.log("From inputFilePathEditable: " + `${err}`);
                key = false;
            });
        });
        return key;
    }

    public async verifyBrowseLabelNotTypeable(): Promise<boolean> {
        let isTypeable = true;
        const browseLabel = await browser.$(locators.destinyFilePath)

        // get the text currently displayed in the browse label
        const originalTextInBrowseLabel = await browseLabel.getText()

        // put browseLabel in focus then try to type 'test' into it.
        await browseLabel.click();
        await browser.action('key')
            .down('t').up('t')
            .down('e').up('e')
            .down('s').up('s')
            .down('t').up('t')
            .perform()

        // get text after typing and compare to orignal
        const textInBrowseLabelAfterTyping = await browseLabel.getText()
        if(originalTextInBrowseLabel.match(textInBrowseLabelAfterTyping)) isTypeable = false;

        return isTypeable;
    }

    public async verifyBrowseLabelNotPasteable(): Promise < boolean > {
    let isTypeable = true;
    const browseLabel = await browser.$(locators.destinyFilePath)
    const downloadInputBox = await browser.$(locators.downloadInputAddressText)

    // get the text currently displayed in the browse label
    const originalTextInBrowseLabel = await browseLabel.getText()


    // put downloadInputBox in focus then try to type 'test' into it.
    await downloadInputBox.click();
    await browser.action('key')
        .down('t').up('t')
        .down('e').up('e')
        .down('s').up('s')
        .down('t').up('t')
        .perform()

    // put downloadInputBox in focus then copy the current input
    await downloadInputBox.click();
    await browser.action('key')
    .down(Key.Ctrl).down('c')
    .pause(10)
    .up(Key.Ctrl).up('c')
    .perform()

    // put browserLabel into focus and try to paste the 'test' text that was copied from downloadInputBox.
    await browseLabel.click();
    await browser.action('key')
        .down(Key.Ctrl).down('v')
        .pause(10)
        .up(Key.Ctrl).up('v')
        .perform()

    // get text after typing and compare to orignal
    const textInBrowseLabelAfterTyping = await browseLabel.getText()
    if(originalTextInBrowseLabel.match(textInBrowseLabelAfterTyping)) isTypeable = false;

    return isTypeable;
}

    public async isEmpty(): Promise<boolean> {
        const browseInputPathField = await browser.$(this.selector)
        let text = await browseInputPathField.getText()
        let result = text.match("Browse A Project File")
        return result != null
    }
};
