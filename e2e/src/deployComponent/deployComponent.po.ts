/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { BrowseButton } from '../deployment/browseButton.po';
import { DestinyInputField } from '../deployment/destinyInputField.po';
import { DeployButton } from '../deployment/deployButton.po';
import { EndorseButton } from '../deployment/endorseButton.po';
import { ErrorMessage } from '../deployment/errorMessage.po';
import { ProjectTitleTextField } from '../deployment/projectDeploymentTitle.po';
import { SelectDestinyTextField } from '../deployment/selectDestinyText.po';
import { MessagesLog } from '../deployment/messageLog.po';
import { Element } from "../lib/element";
import { UserSettingsButton } from '../deployment/userSettingsButton.po';
import { OpenMessagePane } from '../messagePane/openMessagePane.po';
import { LogClient } from '@extron/winston-logger';
import {  GmObject} from '../deployment/GmObject.po';
import { ProgressBar } from '../deployment/progessBar.po';
// import { ValidateDestinyButton, IgnoreVerificationSwitch, VerifySwitch, MessageLogs } from '../deployment';
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const messagePaneLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));

/**
	* @Author `Oybek.T-Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-29`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-18`
	* @Description `Deployment Page`
	* @Date `09/12/2019`
*/

/**
	* @Author `Oybek.T Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/NEATPL-162`
	* @Description `Refactor Deployment Component and using new locators`
	* @Date `12/11/2019`
*/

export class DeployComponent extends Element  {
    private static messagesLogTitleElem: string = deploymentLocators.messagesLogTitle;
    private static systemTxtElem: string = deploymentLocators.systemTxt;
    private static statusTxtElem: string = deploymentLocators.statusTxt;
    private static errorMsgElem: string = deploymentLocators.errorMsg;
    private static browseButtonElem: string = deploymentLocators.browseBtn;
    private static destinyInputFieldElem: string = locators.chooseFileBtn;
    private static destinyInputPathFieldElem: string = locators.destinyFilePath;
    private static deployButtonElem: string = locators.deployBtn;
    private static endorseButtonElem: string = deploymentLocators.endorseBtn;
    private static endorsedAlertElem: string = deploymentLocators.endorsedAlert;
    private static lastEndorsedTimeElem: string = deploymentLocators.lastEndorsedTime;
    private static ignoreVerificationSwitchElem: string = "";
    private static verifyAllSwitchElem: string = "";
    private static messageLogTableElem: string = locators.messageStatus;
    private static userSettingsButtonDisableElem: string = locators.KevinDisable; // Kevin Setting disable button
    private static userSettingsButtonenableElem: string = locators.KevinEnable; // Kevin Setting enable button
    private static closeKevinElem: string = locators.closeKevin;
    private static kevinTableEntriesElem: string = locators.kevinTableEntries;
    private static kevinTableElem: string = locators.kevinTable;
    private static kevinWindowDrawerElemOpen: string = locators.kevinWindowDrawerOpen;
    private static deviceNameElem: string = locators.deviceNameColumn;
    private static ipAddressElem: string = locators.ipAddressColumn;
    private static userNameElem: string = locators.userNameColumn;
    private static passwordElem: string = locators.passwordColumn;
    private static primaryUserNameValueElem: string = locators.primaryUserNameValue;
    private static primaryPasswordValueElem: string = locators.primaryPasswordValue;
    private static secondaryUserNameValueElem: string = locators.secondaryUserNameValue;
    private static secondaryPasswordValueElem: string = locators.secondaryPasswordValue;
    private static tlpUserNameValueElem: string = locators.tlpUserNameValue;
    private static tlpPasswordValueElem: string = locators.tlpPasswordValue;
    private static tlpEmptyUserNameValueElem: string = locators.tlpEmptyUserNameValue;
    private static tlpEmptyPasswordValueElem: string = locators.tlpEmptyPasswordValue;
    private static missingPrimaryUserNameElem: string = locators.missingPrimaryUserName;
    private static missingPrimaryPasswordElem: string = locators.missingPrimaryPassword;
    private static missingSecondaryUserNameElem: string = locators.missingSecondaryUserName;
    private static missingSecondaryPasswordElem: string = locators.missingSecondaryPassword;
    private static missingTlpUserNameElem: string = locators.missingTlpUserName;
    private static missingTlpPasswordElem: string = locators.missingTlpPassword;
    private static primaryUserNameEditFieldElem: string = locators.primaryUserNameEditField;
    private static primaryPasswordEditFieldElem: string = locators.primaryPasswordEditField;
    private static secondaryUserNameEditFieldElem: string = locators.secondaryUserNameEditField;
    private static secondaryPasswordEditFieldElem: string = locators.secondaryPasswordEditField;
    private static tlpPasswordEditFieldElem: string = locators.tlpPasswordEditField;
    private static carriedForwardInformationElem: string = locators.carriedForwardInformation;
    private static openMessagePane:string = locators.openMessagePaneButton
    private static progressBar:string = locators.progressBar;
    private static deployCodeOnlyButtonElem:string = locators.deployCodeOnlyButtonElem;
    private static validateDestinyButtonElem: string = "";
    private static progressBarStatus: string = deploymentLocators.progressBar;
    public logClient: LogClient;

    public browseButton: BrowseButton;
    public destinyInputField: DestinyInputField;
    public destinyInputPathField: DestinyInputField;
    public deployCodeOnlyBtn:DeployButton;
    public deployButton: DeployButton;
    public endorseButton: EndorseButton;
    public endorsedAlertMessage: EndorseButton;
    public lastEndorsedTimestamp: EndorseButton;
    public errorMessage: ErrorMessage;
    public projectDeploymentTitle: ProjectTitleTextField;
    public selectDestiny: SelectDestinyTextField;
    public messagesLog: MessagesLog;
    public systemText: MessagesLog;
    public statusText: MessagesLog;
    // public ignoreVerificationSwitch: IgnoreVerificationSwitch;
    // public verifyAllSwitch: VerifySwitch;
     public messageLogTable: MessagesLog;
    // public validateDestinyButton: ValidateDestinyButton;
    public userSettingsButtonDisable: UserSettingsButton;
    public userSettingsButtonEnable: UserSettingsButton;
    public closeKevinButton: UserSettingsButton;
    public kevinTableEntries: UserSettingsButton;
    public kevinTable: UserSettingsButton;
    public kevinWindowOpen: UserSettingsButton;
    public deviceName: UserSettingsButton;
    public ipAddress: UserSettingsButton;
    public userName: UserSettingsButton;
    public password: UserSettingsButton;
    public primaryUserName: UserSettingsButton;
    public primaryPassword: UserSettingsButton;
    public secondaryUserName: UserSettingsButton;
    public secondaryPassword: UserSettingsButton;
    public tlpUserName: UserSettingsButton;
    public tlpPassword: UserSettingsButton;
    public tlpEmptyUserName: UserSettingsButton;
    public tlpEmptyPassword: UserSettingsButton;
    public missingPrimaryUserName: UserSettingsButton;
    public missingPrimaryPassword: UserSettingsButton;
    public missingSecondaryUserName: UserSettingsButton;
    public missingSecondaryPassword: UserSettingsButton;
    public missingTlpUserName: UserSettingsButton;
    public missingTlpPassword: UserSettingsButton;
    public primaryUserNameEditField: UserSettingsButton;
    public primaryPasswordEditField: UserSettingsButton;
    public secondaryUserNameEditField: UserSettingsButton;
    public secondaryPasswordEditField: UserSettingsButton;
    public tlpPasswordEditField: UserSettingsButton;
    public carriedForwardInformation:UserSettingsButton;
    public progressBar:MessagesLog;
    public messagesTab:OpenMessagePane;
    public progressBar1:ProgressBar;

    constructor(app: WebdriverIO.Browser, selector: string= "") {
        super(app, selector);
        this.logClient = new LogClient("e2e:Deployment Component");
        this.browseButton = new BrowseButton(this.app, DeployComponent.browseButtonElem,"");
        this.destinyInputField = new DestinyInputField(this.app, DeployComponent.destinyInputFieldElem);
        this.destinyInputPathField = new DestinyInputField(this.app, DeployComponent.destinyInputPathFieldElem);
        this.deployButton = new DeployButton(this.app, DeployComponent.deployButtonElem, "");
        this.endorseButton = new EndorseButton(this.app, DeployComponent.endorseButtonElem, "");
        this.endorsedAlertMessage = new EndorseButton(this.app, DeployComponent.endorsedAlertElem, "");
        this.lastEndorsedTimestamp = new EndorseButton(this.app, DeployComponent.lastEndorsedTimeElem, "");
        this.errorMessage = new ErrorMessage(this.app, DeployComponent.errorMsgElem, "");
        // this.projectDeploymentTitle = new ProjectTitleTextField(this.app, DeployComponent.projectDeploymentTextElem, "");
        // this.selectDestiny = new SelectDestinyTextField(this.app, DeployComponent.selectDestinyTxtElem, "");
        this.messagesLog = new MessagesLog(this.app, DeployComponent.messagesLogTitleElem);
        this.systemText = new MessagesLog(this.app, DeployComponent.systemTxtElem);
        this.statusText = new MessagesLog(this.app, DeployComponent.statusTxtElem);
        this.progressBar = new MessagesLog(this.app,DeployComponent.progressBar)
        // this.ignoreVerificationSwitch = new IgnoreVerificationSwitch(this.app, DeployComponent.ignoreVerificationSwitchElem);
        // this.verifyAllSwitch = new VerifySwitch(this.app, DeployComponent.verifyAllSwitchElem);
       // this.messageLogTable = new MessagesLogs(this.app, DeployComponent.messageLogTableElem);
        this.userSettingsButtonDisable = new UserSettingsButton(this.app, DeployComponent.userSettingsButtonDisableElem);
        this.userSettingsButtonEnable = new UserSettingsButton(this.app, DeployComponent.userSettingsButtonenableElem);
        this.closeKevinButton = new UserSettingsButton(this.app, DeployComponent.closeKevinElem);
        this.kevinTableEntries = new UserSettingsButton(this.app, DeployComponent.kevinTableEntriesElem);
        this.kevinTable = new UserSettingsButton(this.app, DeployComponent.kevinTableElem);
        this.kevinWindowOpen = new UserSettingsButton(this.app, DeployComponent.kevinWindowDrawerElemOpen);
        this.deviceName = new UserSettingsButton(this.app, DeployComponent.deviceNameElem);
        this.ipAddress = new UserSettingsButton(this.app, DeployComponent.ipAddressElem);
        this.userName = new UserSettingsButton(this.app, DeployComponent.userNameElem);
        this.password = new UserSettingsButton(this.app, DeployComponent.passwordElem);
        this.primaryUserName = new UserSettingsButton(this.app, DeployComponent.primaryUserNameValueElem);
        this.primaryPassword = new UserSettingsButton(this.app, DeployComponent.primaryPasswordValueElem);
        this.secondaryUserName = new UserSettingsButton(this.app, DeployComponent.secondaryUserNameValueElem);
        this.secondaryPassword = new UserSettingsButton(this.app, DeployComponent.secondaryPasswordValueElem);
        this.tlpUserName = new UserSettingsButton(this.app, DeployComponent.tlpUserNameValueElem);
        this.tlpPassword = new UserSettingsButton(this.app, DeployComponent.tlpPasswordValueElem);
        this.tlpEmptyUserName = new UserSettingsButton(this.app, DeployComponent.tlpEmptyUserNameValueElem);
        this.tlpEmptyPassword = new UserSettingsButton(this.app, DeployComponent.tlpEmptyPasswordValueElem);
        this.missingPrimaryUserName = new UserSettingsButton(this.app, DeployComponent.missingPrimaryUserNameElem);
        this.missingPrimaryPassword = new UserSettingsButton(this.app, DeployComponent.missingPrimaryPasswordElem);
        this.missingSecondaryUserName = new UserSettingsButton(this.app, DeployComponent.missingSecondaryUserNameElem);
        this.missingSecondaryPassword = new UserSettingsButton(this.app, DeployComponent.missingSecondaryPasswordElem);
        this.missingTlpUserName = new UserSettingsButton(this.app, DeployComponent.missingTlpUserNameElem);
        this.missingTlpPassword = new UserSettingsButton(this.app, DeployComponent.missingTlpPasswordElem);
        this.primaryUserNameEditField = new UserSettingsButton(this.app, DeployComponent.primaryUserNameEditFieldElem);
        this.primaryPasswordEditField = new UserSettingsButton(this.app, DeployComponent.primaryPasswordEditFieldElem);
        this.secondaryUserNameEditField = new UserSettingsButton(this.app, DeployComponent.secondaryUserNameEditFieldElem);
        this.secondaryPasswordEditField = new UserSettingsButton(this.app, DeployComponent.secondaryPasswordEditFieldElem);
        this.tlpPasswordEditField = new UserSettingsButton(this.app, DeployComponent.tlpPasswordEditFieldElem);
        // this.validateDestinyButton = new ValidateDestinyButton(this.app, DeployComponent.validateDestinyButtonElem);
        this.carriedForwardInformation =  new UserSettingsButton(this.app, DeployComponent.carriedForwardInformationElem);
        this.messagesTab = new OpenMessagePane(this.app,DeployComponent.openMessagePane);
        this.progressBar1 = new ProgressBar(this.app, DeployComponent.progressBarStatus);
        this.deployCodeOnlyBtn = new DeployButton(this.app, DeployComponent.deployCodeOnlyButtonElem, "");
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
