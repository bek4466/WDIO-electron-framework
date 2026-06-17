/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";

import { ProtectProjectButton } from '../protectProject/protectProjectButton.po';
import { ProtectProjectIcon } from '../protectProject/protectProjectIcon.po';
import { ProtectProjectPasswordField } from '../protectProject/protectProjectPasswordField.po';
import { ProtectProjectPasswordFieldConfirm } from '../protectProject/protectProjectPasswordFieldConfirm.po';
import { ProtectProjectSelectLocationButton } from '../protectProject/protectProjectSelectButton.po';
import { ProtectProjectPathLabel } from '../protectProject/protectProjectPathLabel.po';
import { ProtectProjectCheckAllowDeployTroubleshooting } from '../protectProject/protectProjectCheckAllowDeploy.po';
import { ProtectProjectCancelButton } from '../protectProject/protectProjectCancelButton.po';
import { ProtectCreateButton } from '../protectProject/protectCreateButton.po';
import { ProtectProjectErrorMessage } from "../protectProject/protectProjectErrorMessage.po";
import { ProtectProjectPopUpCloseToggle } from "../protectProject/protectProjectPopUpCloseToggle.po";
import { ProtectProjectSuccessBanner } from "../protectProject/protectProjectSuccessBanner.po";
import { ProtectProjectFailedMessage } from "../protectProject/protectProjectFailedMessage.po";
import { Element } from "../lib/element";
import { LogClient } from '@extron/winston-logger';
import {  GmObject} from '../deployment/GmObject.po';
const deploymentLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));
const protectProjectLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "protectProject.json"));
const messagePaneLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));

/**
	* @Author `Oybek.T Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-5396`
	* @Description `Protect Project Component page object model`
	* @Date `06/06/2024`
*/
export class ProtectProjectComponent extends Element  {
    private static protectProjectElem: string = protectProjectLocators.protectProjectButton;
    private static protectProjectIconElem: string = protectProjectLocators.protectProjectIcon;
    private static passwordFieldElem: string = protectProjectLocators.passwordField;
    private static passwordFieldConfirmElem: string = protectProjectLocators.passwordFieldConfirm;
    private static checkAllowDeployTroubleshootingElem: string = protectProjectLocators.checkAllowDeployTroubleshooting;
    private static selectLocationBtnElem: string = protectProjectLocators.selectLocationBtn;
    private static protectProjectPathElem : string = protectProjectLocators.protectProjectPath;
    private static protectCreateBtnElem: string = protectProjectLocators.protectCreateBtn;
    private static cancelBtnElem: string = protectProjectLocators.cancelBtn;
    private static protectProjectPopUpCloseToggleElem: string = protectProjectLocators.protectProjectPopUpCloseToggle;
    private static errorMessageElem: string = protectProjectLocators.errorMessage;
    private static successMessageWithLinkElem: string = protectProjectLocators.successMessageWithLink;
    private static failedToProtectMessageBannerElem: string = protectProjectLocators.failedToProtectMessageBanner;
    
    
    public logClient: LogClient;
    public protectProjectButton: ProtectProjectButton;
    public protectProjectIcon: ProtectProjectIcon;
    public passwordField: ProtectProjectPasswordField;
    public passwordFieldConfirm: ProtectProjectPasswordFieldConfirm;
    public selectLocationBtn: ProtectProjectSelectLocationButton;
    public protectProjectPath: ProtectProjectPathLabel;
    public protectCreateBtn: ProtectCreateButton;
    public checkAllowDeployTroubleshooting: ProtectProjectCheckAllowDeployTroubleshooting;
    public cancelBtn: ProtectProjectCancelButton;
    public protectProjectPopUpCloseToggle: ProtectProjectPopUpCloseToggle;
    public errorMessage: ProtectProjectErrorMessage;
    public successMessageWithLink: ProtectProjectSuccessBanner;
    public failedToProtectMessageBanner: ProtectProjectFailedMessage;

    constructor(app: WebdriverIO.Browser, selector: string= "") {
        super(app, selector);
        this.logClient = new LogClient("e2e:Project Protect Secrets Component");
        this.protectProjectButton = new ProtectProjectButton(this.app, ProtectProjectComponent.protectProjectElem,"");
        this.protectProjectIcon = new ProtectProjectIcon(this.app, ProtectProjectComponent.protectProjectIconElem,"");
        this.passwordField = new ProtectProjectPasswordField(this.app, ProtectProjectComponent.passwordFieldElem,"");
        this.passwordFieldConfirm = new ProtectProjectPasswordFieldConfirm(this.app, ProtectProjectComponent.passwordFieldConfirmElem,"");
        this.selectLocationBtn = new ProtectProjectSelectLocationButton(this.app, ProtectProjectComponent.selectLocationBtnElem, "");
        this.protectProjectPath = new ProtectProjectPathLabel(this.app, ProtectProjectComponent.protectProjectPathElem,"");
        this.protectCreateBtn = new ProtectCreateButton(this.app, ProtectProjectComponent.protectCreateBtnElem,"");
        this.checkAllowDeployTroubleshooting = new ProtectProjectCheckAllowDeployTroubleshooting(this.app, ProtectProjectComponent.checkAllowDeployTroubleshootingElem,"");
        this.cancelBtn = new ProtectProjectCancelButton(this.app, ProtectProjectComponent.cancelBtnElem,"");
        this.errorMessage = new ProtectProjectErrorMessage(this.app, ProtectProjectComponent.errorMessageElem,"");
        this.protectProjectPopUpCloseToggle = new ProtectProjectPopUpCloseToggle(this.app, ProtectProjectComponent.protectProjectPopUpCloseToggleElem,"");
        this.successMessageWithLink = new ProtectProjectSuccessBanner(this.app, ProtectProjectComponent.successMessageWithLinkElem,"");
        this.failedToProtectMessageBanner = new ProtectProjectFailedMessage(this.app, ProtectProjectComponent.failedToProtectMessageBannerElem,"");
    };

}
