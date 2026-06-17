/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";

import { Element } from '../lib/element';
import { allure } from '../allure/allure';
import { reject } from 'q';
import { ActivationKey } from '../accessControl/activationKeyField.po';
import { SignInButton } from '../accessControl/signInButton.po';
import { WarningMessagePopUp } from '../accessControl/warningMessagePopUp.po';
import { OkButton } from '../accessControl/okButton.po';
import { OfflineSignin } from '../accessControl/offlineSignin.po';
import { LogOutButton } from '../accessControl/logoutButton.po';
import { SsoLoginPage } from "../accessControl/ssoLogin.po";
import { PasswordField } from "../accessControl/passwordField.po";
import { CredentialsCheckBox } from "../accessControl/checkBox.po";
import { RetrievePasswordField } from "../accessControl/retrievePass.po";
import { SignUpButton } from "../accessControl/signUpBtn.po";
import { RetrievePasswordButton } from "../accessControl/retrievePassBtn.po";
import { RetrievePasswordMessage } from "../accessControl/retrievePassMsg.po";
import { UsernameField } from "../accessControl/usernameField.po";
import { LogClient } from '@extron/winston-logger';
const accessControlLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "accessControlLocators.json"));
/**
	* @Author `Oybek.T-Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-396`
    * @LinkToPOM `https://extron.atlassian.net/browse/CSP-426`
	* @Description `Access Control Page`
	* @Date `02/07/2020`
*/

export class LoginComponent extends Element {

    private static activationKeyFieldElem: string = accessControlLocators.activationKeyField;
    private static signinBtnElem: string = accessControlLocators.signInBtn;
    private static okBtnElem: string = accessControlLocators.okBtn;
    private static errorWarningMsgElem: string = accessControlLocators.error.warningMsg;
    private static logoutBtnElem: string = accessControlLocators.logOutBtn;

    private static emailInputFieldElem: string = accessControlLocators.emailInputField;
    private static passwordInputFieldElem: string = accessControlLocators.passwordInputField;
    private static loginBtnElem: string = accessControlLocators.loginBtn;
    private static checkBoxElem: string = accessControlLocators.checkBox;
    private static retrievePassBtnElem: string = accessControlLocators.forgotPassword.retrievePasswordBtn;
    private static forgotPassEmailRetrieveElem: string = accessControlLocators.forgotPassword.inputField;
    private static retrievePassSuccessMsg: string = accessControlLocators.forgotPassword.successText;
    private static retrievePassErrorMsg: string = accessControlLocators.forgotPassword.errorText;
    private static signUpBtnElem: string = accessControlLocators.signUpBtn;

    
    private static offlineresponseKeyInputFieldElem: string = accessControlLocators.offlineResponseKeyInputField;
    private static offlineverifyBtnElem: string = accessControlLocators.offlineVerifyBtn;
    private static contactinfoMessageElem: string = accessControlLocators.contactInfoMessage;
    private static requestkeyElem: string = accessControlLocators.requestKey;
    private static dialogboxElem: string = accessControlLocators.dialogBox;
    private static overlayElem: string = accessControlLocators.overlay;
    private static invalidactivationHeaderElem: string = accessControlLocators.invalidActivationHeader;
    private static invalidactivationMessageElem: string = accessControlLocators.invalidActivationMessage;
    private static okbuttonElem: string = accessControlLocators.okButton;
    private static closebuttonElem: string = accessControlLocators.closeButton;
    private static warningiconElem: string = accessControlLocators.warningIcon;
    private static backtoSigninElem: string = accessControlLocators.backToSignin;
    private static offlineSigninBtnElem: string = accessControlLocators.offlineSignInBtn;

    public userNameField: UsernameField;
    public passwordField: PasswordField;
    public loginBtn: SsoLoginPage;
    public checkBox: CredentialsCheckBox;
    public retrievePassBtn: RetrievePasswordButton;
    public forgotPassEmailRetrieve: RetrievePasswordField;
    public retrievePassSuccessMsg: RetrievePasswordMessage;
    public retrievePassErrorMsg: RetrievePasswordMessage;
    public signUpBtn: SignUpButton;

    public activationKey: ActivationKey;
    public signinBtn: SignInButton;
    public okBtn: OkButton;
    public errorWarningMsg: WarningMessagePopUp;
    public logoutBtn: LogOutButton;

    public offlineResponseKeyInput: OfflineSignin;
    public offlineVerify: OfflineSignin;
    public requestKeyBtn: OfflineSignin;
    public contactInfoMessageTxt: OfflineSignin;
    public dialogBoxPoup: OfflineSignin;
    public overlayPoup: OfflineSignin;
    public warningIconInfo: OfflineSignin;
    public invalidActivationHeadermsg: OfflineSignin;
    public invalidActivationMessageTxt: OfflineSignin;
    public okDialogBtn: OfflineSignin;
    public closeBtn: OfflineSignin;
    public backToSigninlink: OfflineSignin;
    public offlineSignInlink: OfflineSignin;
    public logClient: LogClient;
    constructor(app: WebdriverIO.Browser, selector: string= "") {
        super(app, selector);
        this.logClient = new LogClient("e2e:Deployment Component");
        this.activationKey = new ActivationKey(this.app, LoginComponent.activationKeyFieldElem);
        this.signinBtn = new SignInButton(this.app, LoginComponent.signinBtnElem, "");
        this.errorWarningMsg = new WarningMessagePopUp(this.app, LoginComponent.errorWarningMsgElem, "");
        this.okBtn = new OkButton(this.app, LoginComponent.okBtnElem, "");
        this.logoutBtn = new LogOutButton(this.app, LoginComponent.logoutBtnElem);
        this.userNameField = new UsernameField(this.app, LoginComponent.emailInputFieldElem);
        this.passwordField = new PasswordField(this.app, LoginComponent.passwordInputFieldElem);
        this.loginBtn = new SsoLoginPage(this.app, LoginComponent.loginBtnElem);
        this.checkBox = new CredentialsCheckBox(this.app, LoginComponent.checkBoxElem);
        this.retrievePassBtn = new RetrievePasswordButton(this.app, LoginComponent.retrievePassBtnElem);
        this.forgotPassEmailRetrieve = new RetrievePasswordField(this.app, LoginComponent.forgotPassEmailRetrieveElem);
        this.retrievePassSuccessMsg = new RetrievePasswordMessage(this.app, LoginComponent.retrievePassSuccessMsg, "Retrieve password success message");
        this.retrievePassErrorMsg = new RetrievePasswordMessage(this.app, LoginComponent.retrievePassErrorMsg, "Retrieve password error message");
        this.signUpBtn = new SignUpButton(this.app, LoginComponent.signUpBtnElem);
        this.offlineResponseKeyInput = new OfflineSignin(this.app, LoginComponent.offlineresponseKeyInputFieldElem,"");
        this.offlineVerify = new OfflineSignin(this.app, LoginComponent.offlineverifyBtnElem,"");
        this.requestKeyBtn = new OfflineSignin(this.app, LoginComponent.requestkeyElem,"");
        this.contactInfoMessageTxt = new OfflineSignin(this.app, LoginComponent.contactinfoMessageElem,"");
        this.dialogBoxPoup = new OfflineSignin(this.app, LoginComponent.dialogboxElem,"");
        this.overlayPoup = new OfflineSignin(this.app, LoginComponent.overlayElem,"");
        this.warningIconInfo = new OfflineSignin(this.app, LoginComponent.warningiconElem,"");
        this.invalidActivationHeadermsg = new OfflineSignin(this.app, LoginComponent.invalidactivationHeaderElem,"");
        this.invalidActivationMessageTxt = new OfflineSignin(this.app, LoginComponent.invalidactivationMessageElem,"");
        this.okDialogBtn = new OfflineSignin(this.app, LoginComponent.okbuttonElem,"");
        this.closeBtn = new OfflineSignin(this.app, LoginComponent.closebuttonElem,"");
        this.backToSigninlink = new OfflineSignin(this.app, LoginComponent.backtoSigninElem,"");
        this.offlineSignInlink = new OfflineSignin(this.app, LoginComponent.offlineSigninBtnElem,"");
    }

}
