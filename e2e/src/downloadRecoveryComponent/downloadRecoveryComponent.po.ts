/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { CancelButton } from '../downloadRecovery/cancelButton.po';
import { ForgotPasswordButton } from '../downloadRecovery/forgotPasswordButton.po';
import { ForgotPasswordPopUP } from '../downloadRecovery/forgotPasswordPopUP.po';
import { MessagesLog } from '../deployment/messageLog.po';
import { Element } from "../lib/element";
import { UserSettingsButton } from '../deployment/userSettingsButton.po';
import { OpenMessagePane } from '../messagePane/openMessagePane.po';
import { LogClient } from '@extron/winston-logger';
import {  GmObject} from '../deployment/GmObject.po';
import { ProgressBar } from '../deployment/progessBar.po';
import { DownloadField } from "../downloadRecovery/DownloadField.po";
import { UsernameField } from "../downloadRecovery/UsernameField.po";
import { PasswordField } from "../downloadRecovery/PasswordField.po";
import { DownloadButton } from "../downloadRecovery/DownloadButton.po";
import { DownloadShowInFolderButton } from "../downloadRecovery/DownloadShowInFolderButton.po";
import { SidePanelDownloadButton } from "../downloadRecovery/sidePanelDownloadButton.po";
import { DownloadCompletePopup } from "../downloadRecovery/downloadCompletePopup.po";
import { CloseSidePanelButton } from "../downloadRecovery/closeSidePanelButton.po";
import { SidePanelAddressField } from "../downloadRecovery/SidePanelAddressField.po";
import { EditIPButton } from "../downloadRecovery/editIPButton.po";
import { DownloadProjectPanelError } from "../downloadRecovery/DownloadProjectPanelError";
import { CredErrorMessage } from "../downloadRecovery/credErrorMessage.po";
import { EditPopUpIpError } from "../downloadRecovery/editPopUpIpError.po";
import { editPopUpIpInput } from "../downloadRecovery/editPopUpIpInput.po";
import { editPopUpSaveBtn } from "../downloadRecovery/editPopUpSaveBtn.po";
import { editPopUpCancelBtn } from "../downloadRecovery/editPopUpCancelBtn.po";
import { sidePanelEditBtn } from "../downloadRecovery/sidePanelEditBtn.po";


// import { ValidateDestinyButton, IgnoreVerificationSwitch, VerifySwitch, MessageLogs } from '../deployment';
const downloadRecoveryLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "downloadRecoveryLocators.json"));

/**
	* @Author `Miguel.C-QA`
    * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-2713`
	* @Description `Deployment Page`
	* @Date `06/17/2021`
*/

export class DownloadRecoveryComponent extends Element  {
    private static cancelButtonElem: string = downloadRecoveryLocators.cancelBtn;
    private static forgotCredButtonElem: string = downloadRecoveryLocators.forgotCredsBtn;
    private static forgotCredPopUpElem: string = downloadRecoveryLocators.forgotCredsPopUp;
    public logClient: LogClient;
    private static noProjectExistsErrorElem:string = downloadRecoveryLocators.noProjectExists;
    private static offlineDeviceErrorElem:string = downloadRecoveryLocators.offlineDeviceError;
    public projectAbsenceError:DownloadProjectPanelError;
    public deviceOfflineError:DownloadProjectPanelError;
    public cancelButton: CancelButton;
    public closeSidePanelBtn: CloseSidePanelButton;
    public forgotCredsButton: ForgotPasswordButton;
    public forgotCredsPopUp: ForgotPasswordPopUP;
    public editIPButton: EditIPButton;
    public credErrorText: CredErrorMessage;
    private static credErrorElem: string = downloadRecoveryLocators.credError
    private static editIPButtonElem: string = downloadRecoveryLocators.editIPBtn
    private static downloadUsernameElem: string = downloadRecoveryLocators.downloadUsernameText
    private static downloadPasswordElem: string = downloadRecoveryLocators.downloadPasswordText
    private static downloadButtonElem: string = downloadRecoveryLocators.downloadBtn
    private static sidePanelAddressElem: string = downloadRecoveryLocators.sidePanelAddressText
    private static closeSidePanelBtnElem: string = downloadRecoveryLocators.closeSidePanelBtn
    private static sidePanelDownloadButtonElem: string = downloadRecoveryLocators.sidePanelDownloadBtn
    private static downloadInputAddressElem: string = downloadRecoveryLocators.downloadInputAddressText
    private static downloadCompletePopUpElem: string = downloadRecoveryLocators.downloadCompletePopUp
    private static downloadShowInFolderElem: string = downloadRecoveryLocators.downloadShowInFolderBtn
    private static editPopUpIpInput: string = downloadRecoveryLocators.editPopUpIpInput
    private static editPopUpIpError: string = downloadRecoveryLocators.editPopUpIpError
    private static editPopUpSaveBtn: string = downloadRecoveryLocators.editPopUpSaveBtn
    private static editPopUpCancelBtn: string = downloadRecoveryLocators.editPopUpCancelBtn
    private static sidePanelEditBtn: string = downloadRecoveryLocators.sidePanelEditBtn

     public messageLogTable: MessagesLog;
    // public validateDestinyButton: ValidateDestinyButton;
    public downloadCompletePopup:DownloadCompletePopup;
    public downloadInputAddress:DownloadField;
    public sidePanelAddressField:SidePanelAddressField;
    public downloadUserName:UsernameField;
    public downloadPassword:PasswordField;
    public credentials : PasswordField;
    public downloadBtn:DownloadButton;
    public sidePanelDownloadBtn:SidePanelDownloadButton;
    public progressBar:MessagesLog;
    public messagesTab:OpenMessagePane;
    public progressBar1:ProgressBar;
    public downloadShowInFolderBtn:DownloadShowInFolderButton;
    public editPopUpIpInput: editPopUpIpInput;
    public editPopUpSaveBtn: editPopUpSaveBtn;
    public editPopUpCancelBtn: editPopUpCancelBtn;
    public editPopUpIpError: EditPopUpIpError;
    public sidePanelEditBtn: sidePanelEditBtn;

    constructor(app: WebdriverIO.Browser, selector: string= "") {
        super(app, selector);
        this.logClient = new LogClient("e2e:DownloadRecovery Component");
        this.credErrorText = new CredErrorMessage(browser, DownloadRecoveryComponent.credErrorElem,"");
        this.cancelButton = new CancelButton(browser, DownloadRecoveryComponent.cancelButtonElem,"");
        this.editIPButton = new EditIPButton(browser, DownloadRecoveryComponent.editIPButtonElem,"");
        this.closeSidePanelBtn = new CloseSidePanelButton(browser, DownloadRecoveryComponent.closeSidePanelBtnElem,"");
        this.forgotCredsButton = new ForgotPasswordButton(browser, DownloadRecoveryComponent.forgotCredButtonElem,"");
        this.forgotCredsPopUp = new ForgotPasswordPopUP(browser, DownloadRecoveryComponent.forgotCredPopUpElem);
        this.downloadUserName = new UsernameField(browser, DownloadRecoveryComponent.downloadUsernameElem,""); 
        this.downloadPassword = new PasswordField(browser, DownloadRecoveryComponent.downloadPasswordElem,"");
        this.downloadBtn = new DownloadButton(browser, DownloadRecoveryComponent.downloadButtonElem,"");
        this.sidePanelDownloadBtn = new SidePanelDownloadButton(browser, DownloadRecoveryComponent.sidePanelDownloadButtonElem,"");
        this.sidePanelAddressField = new SidePanelAddressField(browser, DownloadRecoveryComponent.sidePanelAddressElem,"");
        this.downloadInputAddress = new DownloadField(browser, DownloadRecoveryComponent.downloadInputAddressElem,"");
        this.downloadCompletePopup = new DownloadCompletePopup(browser, DownloadRecoveryComponent.downloadCompletePopUpElem,""); 
        this.projectAbsenceError= new DownloadProjectPanelError(browser,DownloadRecoveryComponent.noProjectExistsErrorElem,"");
        this.deviceOfflineError = new DownloadProjectPanelError(browser,DownloadRecoveryComponent.offlineDeviceErrorElem,"");
        this.downloadShowInFolderBtn = new DownloadShowInFolderButton(browser, DownloadRecoveryComponent.downloadShowInFolderElem,"");
        this.editPopUpIpInput = new editPopUpIpInput(browser, DownloadRecoveryComponent.editPopUpIpInput, "");
        this.editPopUpSaveBtn = new editPopUpSaveBtn(browser, DownloadRecoveryComponent.editPopUpSaveBtn, "");
        this.editPopUpCancelBtn = new editPopUpCancelBtn(browser, DownloadRecoveryComponent.editPopUpCancelBtn, "");
        this.editPopUpIpError = new EditPopUpIpError(browser, DownloadRecoveryComponent.editPopUpIpError,"");
        this.sidePanelEditBtn = new sidePanelEditBtn(browser, DownloadRecoveryComponent.sidePanelEditBtn, "");
    };

}
