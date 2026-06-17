/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { MatButton } from '../../matButton';
const locators = fs.readJsonSync(path.join(__dirname, "..", "..","JSON", "locators.json"));
const credsLocators = fs.readJsonSync(path.join(__dirname, "..", "..","JSON", "userSettingsCredsLocators.json"));

export class DeviceNameColumn extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "Kevin Settings Table");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async verifyDeviceNameColumnTitleExist(): Promise<boolean> {
        let deviceNameColumnExist: boolean = false;
        const a = await browser.$(credsLocators.deviceNameHeader).waitForExist();
        if (a) {
            deviceNameColumnExist = true;
        }
        return deviceNameColumnExist
    }

    public async verifyDeviceInfo(deviceName: string, rowNumber): Promise<boolean> {
        const dynamicLocator = "//*[@id='deploy-creds-table-deviceName-row-"+ rowNumber +"']";
        let deviceInfoMathces = false;
        await browser.$(dynamicLocator).waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await browser.$(dynamicLocator).click().catch((err: Error) => { });
        await browser.$(dynamicLocator).getText().then(async (text:string) => {
            if(text == deviceName || text.match(deviceName)) deviceInfoMathces = true
        }).catch((err: Error) => { });  
            return deviceInfoMathces
    }

    public async verifyDeviceInfoDoesNotMatch(deviceName: string, rowNumber): Promise<void> {
        const dynamicLocator = "//*[@id='deploy-creds-table-deviceName-row-"+ rowNumber +"']";
        await browser.$(dynamicLocator).waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await browser.$(dynamicLocator).click().catch((err: Error) => { });
        await browser.$(dynamicLocator).getText().then(async (text:string) => {
            expect(text)
                .not.toBe(deviceName);
        }).catch((err: Error) => { });        
    }

    public async verifyNodeviceOnRow( rowNumber): Promise<boolean> {
        const dynamicLocator = "//*[@id='deploy-creds-table-deviceName-row-"+ rowNumber +"']";
        let res = false
        await browser.$(dynamicLocator).waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await browser.$(dynamicLocator).click().catch((err: Error) => { });
        await browser.$(dynamicLocator).isClickable().then(async (result:boolean) => {
            res = result
        }).catch((err: Error) => { });        
        return res
    }

    public async verifydeviceExistOnRow( rowNumber ): Promise<boolean> {
        const dynamicLocator = "//*[@id='deploy-creds-table-deviceName-row-"+ rowNumber +"']";
        let deviceNameRow = await browser.$(dynamicLocator)
        let isExisting = false;
        await deviceNameRow.waitForExist({ timeout: 2500 }).catch((err: Error) => { });
        await deviceNameRow.click().catch((err: Error) => { });
        await deviceNameRow.isClickable().then(async (result:boolean) => {
            isExisting = result
        }).catch((err: Error) => { });     
        return isExisting   
    }
};
