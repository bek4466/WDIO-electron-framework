/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { CloseButton } from '../closeControl/closeButton.po';
import { Element } from "../lib/element";
import { LogClient } from '@extron/winston-logger';
import { PopUpCloseButton } from "../closeControl/popUpCloseButton.po";
import { PopUpCancelButton } from "../closeControl";
// import { ValidateDestinyButton, IgnoreVerificationSwitch, VerifySwitch, MessageLogs } from '../deployment';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "accessControlLocators.json"));
import { browser } from "@wdio/globals";
/**
	* @Author `Miguel QA`
	* @Description `Deployment Page`
	* @Date `11/5/2021`
*/

export class CloseControlComponent extends Element  {
    private static closeButtonElem: string = locators.xButton;
    private static popUpCloseButtonElem: string = locators.popUpCloseBtn;
    private static popUpCancelButtonElem: string = locators.popUpCancelBtn;
    public logClient: LogClient;
    public popUpCloseButton: PopUpCloseButton;
    public popUpCancelButton: PopUpCancelButton;
    public closeButton: CloseButton;

    constructor(browser: WebdriverIO.Browser, selector: string= "") {
        super(browser, selector);
        this.logClient = new LogClient("e2e:Deployment Component");
        this.closeButton = new CloseButton(browser, CloseControlComponent.closeButtonElem, "");
        this.popUpCloseButton = new PopUpCloseButton(browser, CloseControlComponent.popUpCloseButtonElem, "");
        this.popUpCancelButton = new PopUpCancelButton(browser, CloseControlComponent.popUpCancelButtonElem, "");
    };


    public async getObjects(obj:any, key:any, val:any, newVal:any) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjects(obj[i], key, val, newValue));
            } else if (i == key && obj[key] == val) {
                obj[key] = 'qwe';
            }
        }
        return obj;
    }
    
    public async setValue(jsonobj:any,access:any,value:String):Promise<any>
    {
        if (typeof(access)=='string') {
            access = await access.split('.');
            console.log("Coming here first"+access);
        }
        if (access.length > 1){
            console.log("How go sit with")
            await this.setValue(jsonobj[access.shift()],access,value);
            console.log("Coming here fisecrst"+JSON.stringify(jsonobj[access.shift()]));
        }
        else{
            console.log("Coming here else loop"+jsonobj[access[0]]);
            jsonobj[access[0]] = await value;
            console.log("Coming here third"+jsonobj[access[0]]);
            
        }
        console.log("Returning the stringify"+JSON.stringify(jsonobj));
        return JSON.stringify(jsonobj);
        
    }

    public async deletevalue(jsonobj:any,access:any,value:String):Promise<any>
    {
        if (typeof(access)=='string') {
            access = await access.split('.');
            console.log("Coming here first"+access);
        }
        if (access.length > 1){
            console.log("How go sit with")
            await this.setValue(jsonobj[access.shift()],access,value);
            console.log("Coming here fisecrst"+JSON.stringify(jsonobj[access.shift()]));
        }
        else{
            console.log("After deletionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"+jsonobj[access[0]])
            console.log("Coming here else loop"+jsonobj[access[0]]);
            delete jsonobj[access];
           
        }
        console.log("Returning the stringify"+JSON.stringify(jsonobj));
        return JSON.stringify(jsonobj);
        
    }

}
