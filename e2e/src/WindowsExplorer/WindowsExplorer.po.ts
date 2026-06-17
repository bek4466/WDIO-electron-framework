// import * as robot from "@jitsi/robotjs";
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { LogClient } from "@extron/winston-logger";
// import { Application } from 'spectron';
import { allure } from '../allure/allure';
import { CommonMethods } from "../../tests/commonMethods.po";

const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const common = new CommonMethods();

export class WinExplorer 
{
    // private robot;
    private app;
    private logClient: LogClient;

    constructor(app: WebdriverIO.Browser) {
        // this.robot = robot;
        this.app = app;
        this.logClient = new LogClient("WinExplorer");
       // this.robot.setKeyboardDelay(400);
    }

    public async setFolderPath(folderpath:string) : Promise<void>
    {
        /* Change path in file explorer */
        await allure.step("Set folder path to " + folderpath, async () => {
          //  await allure.attachCustomScreenshot(this.app, await (common.osScreenCapture()), "Before");
            await this.app.electron.clipboard.writeText(folderpath);
            // await this.robot.keyTap("f4");
            // await this.robot.keyTap("a", "control");
            // await this.robot.keyTap("v", "control");
            // await this.robot.keyTap('enter');
          //  await allure.attachCustomScreenshot(this.app, await (common.osScreenCapture()), "After");
        });
    }

    public async getFolderPath() : Promise<string>
    {
        let p;
        await allure.step("Copy the folder path to the clipboard", async () => {
            // await this.robot.keyTap("f4");
            // await this.robot.keyTap("a", "control");
            // await this.robot.keyTap("c", "control");
            let p = await this.app.electron.clipboard.readText();
            // await this.robot.keyTap("enter");
        });
        return p;
    }

    public async verifyFolderPath(folderPath: string) : Promise<boolean> {
        /* Verify if the current folder path in file explorer matches the given parameter */
        let p;
        await allure.step("Verify the folder path by copying it to the clipboard", async () => {
            // await this.robot.keyTap("f4");
            // await this.robot.keyTap("a", "control");
            // await this.robot.keyTap("c", "control");
            // p = await this.app.electron.clipboard.readText();
        });
        return p === folderPath;
    }

    public async setFileName(fileName: string) : Promise<void> {
        /* Change file name to save in file explorer */
        await allure.step("Set filename to " + fileName, async () => {
            // await this.robot.keyTap("f4");
            // await this.robot.keyTap("enter");
            for(let i = 0; i < 6; i++) {
                browser.sendKeyEvent("tab");
            }
            // await this.robot.typeString(fileName);
        });
    }

    public async getFileNameBeforeSave() : Promise<string> {
        /* Return the name of the file to be saved.
           Intended to be used before file is saved */
        await allure.step("Copy the filename to the clipboard", async () => {
            await this.app.electron.clipboard.clear();
            // await this.robot.keyTap("f4");
            // await this.robot.keyTap("enter");
            // for(let i = 0; i < 6; i++) {
                // await this.robot.keyTap("tab");
            // }
            // await this.robot.keyTap("a", "control");
            // await this.robot.keyTap("c", "control");
        });
        return await this.app.electron.clipboard.readText();
    }

    public async saveFile() : Promise<void> {
        /* press save button using keyboard commands */
        await allure.step("Save the file", async () => {
            // await this.robot.keyTap("f4");
            // await this.robot.keyTap("enter");
            // await this.robot.keyTap("enter");
        });
    }

    public async cancelSave() : Promise<void> {
        /* cancel save using keyboard commands */
        // await this.robot.keyTap("esc");
    }

    public async closeExplorer() : Promise<void> {
        /* close file explorer */
        /* not intended for the save file window */
        await allure.step("Save the file", async () => {
            // await this.robot.keyTap("w", "control");
        });
    }

    public async ClickApplication():Promise<void>{
        // await this.robot.setMouseDelay(2);
        // const screenSize = this.robot.getScreenSize();
        // await this.robot.moveMouse(screenSize.width * .9, screenSize.height * .1)
        await browser.pause(2000);
        // await this.robot.mouseClick();
    }

    public async clickCenter(): Promise<void> {
        // const screenSize = this.robot.getScreenSize();
        // await this.robot.moveMouse(screenSize.width * .5, screenSize.height * .5);
        // await this.robot.mouseClick();
    }

    public async openFileExplorer() : Promise<void> {
        /* Open windows file explorer using keyboard */
        // await this.robot.keyTap("command");
        // await this.robot.typeString("file explorer");
        // await this.robot.keyTap("enter");
    }
}