/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { Element } from "../lib/element";
import { LogClient } from '@extron/winston-logger';
import {  GmObject} from '../deployment/GmObject.po';
import { ExtractProjectButton } from "../extractProject/extractProjectButton.po";
import { ExtractProjectPasswordField } from "../extractProject/extractProjectPasswordField.po";
import { ExtractProjectPasswordError } from "../extractProject/extractProjectPasswordError.po";
import { ExtractProjectSelectLocationButton } from "../extractProject/extractProjectSelectLocationButton.po";
import { ExtractProjectPathLabel } from '../extractProject/extractProjectPathLabel.po';
import { ExtractProjectPopUpButton } from "../extractProject/extractProjectPopUpButton.po";
import { ExtractProjectCancelButton } from "../extractProject/extractProjectCancelButton.po";
import { ExtractProjectPopUpCloseButton } from "../extractProject/extractProjectPopUpCloseButton.po";
import { ExtractProjectSuccessMessageBanner } from "../extractProject/extractProjectSuccessMessageBanner.po";
import { ExtractProjectPasswordErrorMessage } from "../extractProject/extractProjectPasswordErrorMessage.po";
import { ExtractProjectFailedMessageBanner } from "../extractProject/extractProjectFailedMessageBanner.po";
import { MatButton } from "../matButton";
import { MatText } from "../matText";
const extractProjectLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "extractProject.json"));

/**
	* @Author `Oybek.T Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/TOOL-5397`
	* @Description `Extract Project Component page object model`
	* @Date `06/12/2024`
*/
export class ExtractProjectComponent extends Element  {
    private static extractProjectButtonElem: string = extractProjectLocators.extractProjectButton;
    private static extractProjectPasswordFieldElem: string = extractProjectLocators.extractProjectPasswordField;
    private static extractProjectPasswordErrorElem: string = extractProjectLocators.extractProjectPasswordError;
    private static extractProjectSelectLocationElem: string = extractProjectLocators.extractProjectSelectLocation;
    private static extractProjectPathElem: string = extractProjectLocators.extractProjectPath;
    private static extractProjectPopUpButtonElem: string = extractProjectLocators.extractButtonPopUp;
    private static extractProjectCancelButtonElem: string = extractProjectLocators.extractProjectCancelButton;
    private static extractProjectPopUpCloseButtonElem: string = extractProjectLocators.extractProjectPopUpCloseButton;
    private static extractProjectSuccessMessageBannerElem: string = extractProjectLocators.extractProjectSuccessMessageBanner;
    private static extractProjectErrorMessageElem: string = extractProjectLocators.extractProjectErrorMessage;
    private static extractProjectFailedMessageBannerElem: string = extractProjectLocators.extractProjectErrorMessage;
    
    public logClient: LogClient;
    public extractProjectButton: ExtractProjectButton;
    public extractProjectPasswordField: ExtractProjectPasswordField;
    public extractProjectPasswordError: ExtractProjectPasswordError;
    public extractProjectSelectLocation: ExtractProjectSelectLocationButton;
    public extractProjectPath: ExtractProjectPathLabel;
    public extractProjectPopUpButton: ExtractProjectPopUpButton;
    public extractProjectCancelButton: ExtractProjectCancelButton;
    public extractProjectPopUpCloseButton: ExtractProjectPopUpCloseButton;
    public extractProjectSuccessMessageBanner: ExtractProjectSuccessMessageBanner;
    public extractProjectErrorMessage: ExtractProjectPasswordErrorMessage;
    public extractProjectFailedMessageBanner: ExtractProjectFailedMessageBanner;


    //Extract CORRUPT Project Pop Up SELECTORS
    private static extractProjectCorruptPopUpDismissButtonElem: string = extractProjectLocators.corruptExtractPopUpDismissButton;
    private static extractProjectCorruptPopUpMainMessageElem: string = extractProjectLocators.corruptExtracttPopUpMainMessage;
    private static extractProjectCorruptPopUpTitleElem: string = extractProjectLocators.corruptExtractPopUpTitle;
    private static extractProjectCorruptPopUpWarningIconElem: string = extractProjectLocators.corruptExtractWarningIcon;
    private static extractProjectCorruptPopUpXButtonElem: string = extractProjectLocators.corruptExtractXIcon;


    //Extract CORRUPT Project Pop Up ELEMENTS
    public extractProjectCorruptPopUpDismissButton : MatButton
    public extractProjectCorruptPopUpMainMessage: MatText 
    public extractProjectCorruptPopUpTitle: MatText
    public extractProjectCorruptPopUpWarningIcon: MatText
    public extractProjectCorruptPopUpXButton: MatButton;

    constructor(app: WebdriverIO.Browser, selector: string= "") {
        super(app, selector);
        this.logClient = new LogClient("e2e:Project Extract Project Component");
        this.extractProjectButton = new ExtractProjectButton(this.app, ExtractProjectComponent.extractProjectButtonElem,"extractProjectButtonElem");
        this.extractProjectPasswordField = new ExtractProjectPasswordField(this.app, ExtractProjectComponent.extractProjectPasswordFieldElem,"extractProjectPasswordFieldElem");
        this.extractProjectPasswordError = new ExtractProjectPasswordError(this.app, ExtractProjectComponent.extractProjectPasswordErrorElem,"extractProjectPasswordErrorElem");
        this.extractProjectSelectLocation = new ExtractProjectSelectLocationButton(this.app, ExtractProjectComponent.extractProjectSelectLocationElem,"extractProjectSelectLocationElem");
        this.extractProjectPath = new ExtractProjectPathLabel(this.app, ExtractProjectComponent.extractProjectPathElem, "extractProjectPathElem");
        this.extractProjectPopUpButton = new ExtractProjectPopUpButton(this.app, ExtractProjectComponent.extractProjectPopUpButtonElem,"extractProjectPopUpButtonElem");
        this.extractProjectCancelButton = new ExtractProjectCancelButton(this.app, ExtractProjectComponent.extractProjectCancelButtonElem,"extractProjectCancelButtonElem");
        this.extractProjectPopUpCloseButton = new ExtractProjectPopUpCloseButton(this.app, ExtractProjectComponent.extractProjectPopUpCloseButtonElem,"extractProjectPopUpCloseButtonElem");
        this.extractProjectSuccessMessageBanner = new ExtractProjectSuccessMessageBanner(this.app, ExtractProjectComponent.extractProjectSuccessMessageBannerElem,"extractProjectSuccessMessageBannerElem");
        this.extractProjectErrorMessage = new ExtractProjectPasswordErrorMessage(this.app, ExtractProjectComponent.extractProjectErrorMessageElem,"extractProjectErrorMessageElem");
        this.extractProjectFailedMessageBanner = new ExtractProjectFailedMessageBanner(this.app, ExtractProjectComponent.extractProjectFailedMessageBannerElem,"extractProjectFailedMessageBannerElem");

        //CORRUPT POP UP
        this.extractProjectCorruptPopUpDismissButton = new MatButton(this.app, ExtractProjectComponent.extractProjectCorruptPopUpDismissButtonElem, "extractProjectCorruptPopUpDismissButtonElem");
        this.extractProjectCorruptPopUpMainMessage = new MatText(this.app, ExtractProjectComponent.extractProjectCorruptPopUpMainMessageElem, "extractProjectCorruptPopUpMainMessageElem");
        this.extractProjectCorruptPopUpTitle = new MatText(this.app, ExtractProjectComponent.extractProjectCorruptPopUpTitleElem, "extractProjectCorruptPopUpTitleElem");
        this.extractProjectCorruptPopUpWarningIcon = new MatText(this.app, ExtractProjectComponent.extractProjectCorruptPopUpWarningIconElem, "extractProjectCorruptPopUpWarningIconElem");
        this.extractProjectCorruptPopUpXButton = new MatButton(this.app, ExtractProjectComponent.extractProjectCorruptPopUpXButtonElem, "extractProjectCorruptPopUpXButtonElem");
    };
};
