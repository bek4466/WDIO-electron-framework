/* tslint:disable */
import * as fs from "fs-extra";
import * as robot from "@jitsi/robotjs";
import * as path from "path";
import { MatButton } from "../matButton";
import { WinExplorer } from "../../src/WindowsExplorer/WindowsExplorer.po";
const traceLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "traceLocators.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
// const downloadPath = path.join(__dirname, "..", "..", "resources", "TmpDownloadProject");
const downloadPath = path.join(__dirname, "..", "..", "resources", "TmpDownloadProject");

export class ExportTraceButton extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "export Trace button");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async isEnabled(): Promise<boolean> {
        const state = await browser.$(traceLocators.exportTraceButton).getAttribute('class');
        if(state == "disabled")
            return false;
        else
            return true;
    }

    public async exportToTmpDownloadProject() : Promise<void> {
        await super.click();
        await browser.pause(timeout.fast);
        // const winExplorer = new WinExplorer(this.app);
        // await browser.pause(timeout.fast);
        // await winExplorer.clickCenter();
        // await super.click();
        robot.typeString(downloadPath);
        await browser.pause(timeout.fast);
        robot.keyTap('enter');
        await browser.pause(timeout.fast);
        robot.keyTap('tab');
        await browser.pause(timeout.fast);
        robot.keyTap('enter');
        return Promise.resolve()
        
    }
}
