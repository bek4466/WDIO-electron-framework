/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";

import { Element } from "../lib/element";
import { MatButton } from '../matButton';
import { allure } from '../allure/allure';
import { reject } from 'q';
import { ProfilePage } from '../profile/profilePage.po';
const profileLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "profileLocators.json"));
/**
	* @Author `Neelam S.`
	* @Description `Profile Page`
	* @Date `02/22/2021`
*/

export class ProfileComponent extends Element {

    private static profilePageElem: string = profileLocators.profilePage;
    private static profileElem: string = profileLocators.profile;
    private static titleTextElem: string = profileLocators.titleText;
    private static licenseTextElem: string = profileLocators.licenseText;
    private static statusTextElem: string = profileLocators.statusText;
    private static uncertifiedStatusTextElem: string = profileLocators.uncertifiedStatusText;
    private static expirationTextElem: string = profileLocators.expirationText;
    private static remainderDaysTextElem: string = profileLocators.remainderDaysText;
    private static remainderDaysValueElem: string = profileLocators.remainderDaysVal;
    private static renewBtnElem: string = profileLocators.renewBtn;
    private static lisenceCardElem: string = profileLocators.lisenceCard;
    private static ApplicationRenewAlertElem: string = profileLocators.ApplicationRenewAlert;
    private static lastRenewedElem: string = profileLocators.lastRenewed;

    public profileTab: ProfilePage;
    public profileLink: ProfilePage;
    public profileTitleText: ProfilePage;
    public licenseTitleText: ProfilePage;
    public licenseStatusText: ProfilePage;
    public unlicenseStatusText: ProfilePage;
    public expirationDateText: ProfilePage;
    public remainingDaysText: ProfilePage;
    public remainingDaysValue: ProfilePage;
    public renewButton: ProfilePage;
    public lisenceCardInfo: ProfilePage;
    public ApplicationRenewInfo: ProfilePage;
    public lastRenewedDate: ProfilePage;

    constructor(app: WebdriverIO.Browser, selector: string= "") {
        super(app, selector);
        this.profileTab = new ProfilePage(this.app, ProfileComponent.profilePageElem);
        this.profileLink = new ProfilePage(this.app, ProfileComponent.profileElem);
        this.profileTitleText = new ProfilePage(this.app, ProfileComponent.titleTextElem);
        this.licenseTitleText = new ProfilePage(this.app, ProfileComponent.licenseTextElem)
        this.licenseStatusText = new ProfilePage(this.app, ProfileComponent.statusTextElem);
        this.unlicenseStatusText = new ProfilePage(this.app, ProfileComponent.uncertifiedStatusTextElem);
        this.expirationDateText = new ProfilePage(this.app, ProfileComponent.expirationTextElem);
        this.remainingDaysText = new ProfilePage(this.app, ProfileComponent.remainderDaysTextElem)
        this.remainingDaysValue = new ProfilePage(this.app, ProfileComponent.remainderDaysValueElem)
        this.renewButton = new ProfilePage(this.app, ProfileComponent.renewBtnElem)
        this.lisenceCardInfo = new ProfilePage(this.app, ProfileComponent.lisenceCardElem)
        this.ApplicationRenewInfo = new ProfilePage(this.app, ProfileComponent.ApplicationRenewAlertElem)
        this.lastRenewedDate = new ProfilePage(this.app, ProfileComponent.lastRenewedElem)
        
    }

}
