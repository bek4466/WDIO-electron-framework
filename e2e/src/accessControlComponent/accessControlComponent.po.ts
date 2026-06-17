/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";

import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import { reject } from 'q';
import { ActivationKey } from '../accessControl/activationKeyField.po';
import { UsernameField } from '../accessControl/usernameField.po';
import { SignInButton } from '../accessControl/signInButton.po';
import { WarningMessagePopUp } from '../accessControl/warningMessagePopUp.po';
import { OkButton } from '../accessControl/okButton.po';
import { LogOutButton } from '../accessControl/logoutButton.po';
import { TextElement } from '../accessControl/textElement.po';
const accessControlLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "accessControlLocators.json"));
/**
	* @Author `Oybek.T-Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-396`
    * @LinkToPOM `https://extron.atlassian.net/browse/CSP-426`
	* @Description `Access Control Page`
	* @Date `02/07/2020`
*/

export class AccessControlComponent extends MatButton {

    private static activationKeyFieldElem: string = accessControlLocators.activationKeyField;
    private static signinBtnElem: string = accessControlLocators.signInBtn;
    private static okBtnElem: string = accessControlLocators.okBtn;
    private static errorWarningMsgElem: string = accessControlLocators.error.warningMsg;
    private static logoutBtnElem: string = accessControlLocators.logOutBtn;
    private static versionInfoElem: string = accessControlLocators.versionInformation;
    private static popUpSignOutTitleElem = accessControlLocators.popUpSignOutTitle;
    private static popUpSignOutText1Elem = accessControlLocators.popUpSignOutText1;
    private static popUpSignOutText2Elem = accessControlLocators.popUpSignOutText2;
    private static popUpSignOutBtnElem = accessControlLocators.popUpSignOutBtn;
    private static popUpSignOutCancelBtnElem = accessControlLocators.popUpSignOutCancelBtn;
    private static popUpSignOutXBtnElem = accessControlLocators.popUpSignOutXBtn;
    public activationKey: ActivationKey;
    public signinBtn: SignInButton;
    public okBtn: OkButton;
    public errorWarningMsg: WarningMessagePopUp;
    public logoutBtn: LogOutButton;
    public popUpSignoutTitle: TextElement;
    public popUpSignoutText1: TextElement;
    public popUpSignoutText2: TextElement;
    public popUpSignOutBtn: LogOutButton;
    public popUpSignOutCancelBtn: LogOutButton;
    public popUpSignOutXBtn: LogOutButton;
    public versionInfo: SignInButton;

    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "AccessControlComponent");
        this.activationKey = new ActivationKey(this.app, AccessControlComponent.activationKeyFieldElem);
        this.signinBtn = new SignInButton(this.app, AccessControlComponent.signinBtnElem, "");
        this.errorWarningMsg = new WarningMessagePopUp(this.app, AccessControlComponent.errorWarningMsgElem, "");
        this.okBtn = new OkButton(this.app, AccessControlComponent.okBtnElem, "");
        this.logoutBtn = new LogOutButton(this.app, AccessControlComponent.logoutBtnElem);
        this.popUpSignoutText1 = new TextElement(this.app, AccessControlComponent.popUpSignOutText1Elem);
        this.popUpSignoutText2 = new TextElement(this.app, AccessControlComponent.popUpSignOutText2Elem);
        this.popUpSignoutTitle = new TextElement(this.app, AccessControlComponent.popUpSignOutTitleElem);
        this.popUpSignOutBtn = new LogOutButton(this.app, AccessControlComponent.popUpSignOutBtnElem);
        this.popUpSignOutCancelBtn = new LogOutButton(this.app, AccessControlComponent.popUpSignOutCancelBtnElem);
        this.popUpSignOutXBtn = new LogOutButton(this.app, AccessControlComponent.popUpSignOutXBtnElem);
        this.versionInfo = new SignInButton(this.app, AccessControlComponent.versionInfoElem, "");
    }

}
