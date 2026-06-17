/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";

import { CredentialsBanner } from "../credentials/credentialsBanner.po";
import { UserSettingsButton } from "../credentials/userSettingsButton.po";
import { CredentialsTable } from "../credentials/credentialsTable/credentialsTable.po";
import { UsernameColumn } from "../credentials/credentialsTable/userName.po";
import { PasswordColumn } from "../credentials/credentialsTable/password.po";
import { Grabber } from '../messagePane/grabber.po';
import { DeviceNameColumn } from "../credentials/credentialsTable/deviceName.po";
import { IPaddressColumn } from "../credentials/credentialsTable/IPaddress.po";
import { CredentialsContainer } from "../credentials/credentialsContainer.po";
import { CredentialsCloseButton } from "../credentials/credentialsCloseButton.po";
import { Element } from "../lib/element";
import { OpenHelpButton } from "../credentials/bannerOpenHelp.po";
import { BannerText } from "../credentials/bannerText.po";
import { BannerOverwriteButton } from "../credentials/bannerOverwriteButton.po";
import { BannerExitButton } from "../credentials/bannerExitButton.po";
import { NoDeviceText } from "../credentials/noDeviceText.po";
import { NoRetrieveText } from "../credentials/noRetrieveText.po";
import { InfoIcon } from "../credentials/infoIcon.po";
const kevinSettingsLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "userSettingsCredsLocators.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));

/**
* @Author `Oybek.T Eng`
* @LinkToJIRA `https://extron.atlassian.net/browse/NEATPL-162`
* @Description `Refactor Kevin Settings Component POM and using new locators`
* @Date `12/11/2019`
*/

export class CredsComponent extends Element {

private static credsTableElem: string = kevinSettingsLocators.table
private static deviceWarningIconElem: string = kevinSettingsLocators.deviceWarningIcon
private static warningIconsElem: string = kevinSettingsLocators.warningIcons
private static saveConnectionManagerButtonElem: string = kevinSettingsLocators.saveConnectionManagerButton
private static cancelConnectionManagerButtonElem: string = kevinSettingsLocators.cancelConnectionManagerButton
private static closeConnectionManagerIconElem: string = kevinSettingsLocators.closeConnectionManagerIcon
private static openHelpButtonElem: string = kevinSettingsLocators.openFileHelp
private static bannerTextElem: string = kevinSettingsLocators.bannerText
private static noDeviceTextElem: string = kevinSettingsLocators.noDeviceText
private static infoIconElem: string = kevinSettingsLocators.infoIcon
private static noRetrieveTextElem: string = kevinSettingsLocators.noRetrieveText
private static bannerOverwriteButtonElem: string = kevinSettingsLocators.overWriteCredentials
private static bannerExitButton: string = kevinSettingsLocators.bannerExitButton

private static credsComponentElem: string = kevinSettingsLocators.credsComponent;
private static userNameColumnHeaderElem: string = kevinSettingsLocators.usernameHeader;
private static passwordColumnHeaderElem: string = kevinSettingsLocators.passwordHeader;
private static deviceNameColumnHeaderElem: string = kevinSettingsLocators.deviceNameHeader;
private static IPaddressColumnHeaderElem: string = kevinSettingsLocators.IPaddressHeader;
private static credsCloseButtonElem: string = kevinSettingsLocators.closeConnectionManagerIcon;
private static KevinSettingsButtonElem: string = kevinSettingsLocators.userSettingsBtn;
private static KevinSettingsDisabledStateElem: string = kevinSettingsLocators.userSettingsDisabledBtn;
private static KevinSettingsDisabledElem: string = kevinSettingsLocators.kevinButtonDisable;
private static wholeTableElem: string = kevinSettingsLocators.wholeTable;

private static bannerTitle: string = locators.bannerTitle;
private static bannerMessage: string = locators.bannerMessage;
private static bannerOverwriteBtn: string = locators.bannerOverwriteBtn;
private static bannerHelpFileBtn: string = locators.bannerHelpFileBtn;
private static bannerCloseBtn: string = locators.bannerCloseBtn;

private static deviceNameRow1Elem: string = kevinSettingsLocators.DeviceNameCol.row1DeviceName;
private static deviceNameRow2Elem: string = kevinSettingsLocators.DeviceNameCol.row2DeviceName;
private static deviceNameRow3Elem: string = kevinSettingsLocators.DeviceNameCol.row3DeviceName;
private static deviceNameRow4Elem: string = kevinSettingsLocators.DeviceNameCol.row4DeviceName;
private static deviceNameRow5Elem: string = kevinSettingsLocators.DeviceNameCol.row5DeviceName;

private static IPaddressRow1Elem: string = kevinSettingsLocators.IPaddressCol.row1IPaddress;
private static IPaddressRow2Elem: string = kevinSettingsLocators.IPaddressCol.row2IPaddress;
private static IPaddressRow3Elem: string = kevinSettingsLocators.IPaddressCol.row3IPaddress;
private static IPaddressRow4Elem: string = kevinSettingsLocators.IPaddressCol.row4IPaddress;
private static IPaddressRow5Elem: string = kevinSettingsLocators.IPaddressCol.row5IPaddress;

private static usernameRow1Elem: string = kevinSettingsLocators.UserNameCol.row1UserName;
private static usernameRow2Elem: string = kevinSettingsLocators.UserNameCol.row2UserName;
private static usernameRow3Elem: string = kevinSettingsLocators.UserNameCol.row3UserName;
private static usernameRow4Elem: string = kevinSettingsLocators.UserNameCol.row4UserName;
private static usernameRow5Elem: string = kevinSettingsLocators.UserNameCol.row5UserName;

private static passwordRow1Elem: string = kevinSettingsLocators.PasswordCol.row1Password;
private static passwordRow2Elem: string = kevinSettingsLocators.PasswordCol.row2Password;
private static passwordRow3Elem: string = kevinSettingsLocators.PasswordCol.row3Password;
private static passwordRow4Elem: string = kevinSettingsLocators.PasswordCol.row4Password;
private static passwordRow5Elem: string = kevinSettingsLocators.PasswordCol.row5Password;

public static grabberElem: string = kevinSettingsLocators.grabber;

private static firstPageElem: string = kevinSettingsLocators.firstPage;
private static previousPageElem: string = kevinSettingsLocators.previousPage;
private static defaultPageElem: string = kevinSettingsLocators.defaultPage;
private static secondPageElem: string = kevinSettingsLocators.secondPage;
private static nextPageElem: string = kevinSettingsLocators.nextPage;
private static lastPageElem: string = kevinSettingsLocators.lastPage;
private static footerElem: string = kevinSettingsLocators.footer;

private static leftPageElem: string = kevinSettingsLocators.leftPage;
private static rightPageElem: string = kevinSettingsLocators.rightPage;
private static stepForwardElem: string = kevinSettingsLocators.stepForward;
private static stepBackwardElem: string = kevinSettingsLocators.stepBackward;

public bannerTitle: CredentialsBanner;
public bannerMessage: CredentialsBanner;
public bannerOverwriteBtn: CredentialsBanner;
public bannerHelpFileBtn: CredentialsBanner;
public bannerCloseBtn: CredentialsBanner;

public firstPage: CredentialsContainer;
public previousPage: CredentialsContainer;
public defaultPage: CredentialsContainer;
public secondPage: CredentialsContainer;
public nextPage: CredentialsContainer;
public lastPage: CredentialsContainer;
public footer: CredentialsContainer;


public leftPage: CredentialsContainer;
public rightPage: CredentialsContainer;
public stepForward: CredentialsContainer;
public stepBackward: CredentialsContainer;

public credsTable: CredentialsTable;
public deviceWarningIcon:CredentialsTable;
public warningIcons:CredentialsTable;
public saveConnectionManagerButton:CredentialsTable;
public cancelConnectionManagerButton:CredentialsTable;
public closeConnectionManagerIcon:CredentialsTable;
public credsComponent: CredentialsContainer;
public KEVIN_SETTING_BUTTON: UserSettingsButton;
public KEVIN_SETTING_DISABLE_BUTTON: UserSettingsButton;
public KEVIN_SETTING_DISABLE: UserSettingsButton;
public credsCloseButton: CredentialsCloseButton;
public wholeTable: CredentialsTable;

public userNameCol: UsernameColumn;
public passwordCol: PasswordColumn;
public deviceNameCol: DeviceNameColumn;
public IPaddressCol: IPaddressColumn;

public usernameRow1: UsernameColumn
public usernameRow2: UsernameColumn;
public usernameRow3: UsernameColumn;

public passwordRow1: PasswordColumn
public passwordRow2: PasswordColumn;
public passwordRow3: PasswordColumn;

public deviceNameRow1: DeviceNameColumn
public deviceNameRow2: DeviceNameColumn
public deviceNameRow3: DeviceNameColumn

public IPaddressRow1: IPaddressColumn
public IPaddressRow2: IPaddressColumn
public IPaddressRow3: IPaddressColumn

public openHelpButton: OpenHelpButton;
public bannerText: BannerText;
public noDeviceText: NoDeviceText;
public noRetrieveText: NoRetrieveText;
public infoIcon: InfoIcon;
public bannerOverwriteButton: BannerOverwriteButton;
public bannerExitButton: BannerExitButton;

public grabber: Grabber;

constructor(app: WebdriverIO.Browser, selector: string = CredsComponent.credsTableElem) {
    super(app, selector);
    this.credsTable = new CredentialsTable(this.app,CredsComponent.credsTableElem);
    this.deviceWarningIcon = new CredentialsTable(this.app,CredsComponent.deviceWarningIconElem);
    this.warningIcons = new CredentialsTable(this.app,CredsComponent.warningIconsElem);
    this.saveConnectionManagerButton = new CredentialsTable(this.app,CredsComponent.saveConnectionManagerButtonElem);
    this.cancelConnectionManagerButton = new CredentialsTable(this.app,CredsComponent.cancelConnectionManagerButtonElem);
    this.closeConnectionManagerIcon = new CredentialsTable(this.app,CredsComponent.closeConnectionManagerIconElem);
    this.KEVIN_SETTING_BUTTON = new UserSettingsButton(this.app, CredsComponent.KevinSettingsButtonElem);
    this.credsComponent = new CredentialsContainer(this.app, CredsComponent.credsComponentElem);
    this.credsCloseButton = new CredentialsCloseButton(this.app, CredsComponent.credsCloseButtonElem);
    this.wholeTable = new CredentialsTable(this.app, CredsComponent.wholeTableElem);
    this.KEVIN_SETTING_DISABLE_BUTTON = new UserSettingsButton(this.app, CredsComponent.KevinSettingsDisabledStateElem);
    this.KEVIN_SETTING_DISABLE = new UserSettingsButton(this.app, CredsComponent.KevinSettingsDisabledElem);
    this.userNameCol = new UsernameColumn(this.app, CredsComponent.userNameColumnHeaderElem);
    this.passwordCol = new PasswordColumn(this.app, CredsComponent.passwordColumnHeaderElem);
    this.deviceNameCol = new DeviceNameColumn(this.app, CredsComponent.deviceNameColumnHeaderElem);
    this.IPaddressCol = new IPaddressColumn(this.app, CredsComponent.IPaddressColumnHeaderElem);

    this.deviceNameRow1 = new DeviceNameColumn(this.app, CredsComponent.deviceNameRow1Elem);
    this.deviceNameRow2 = new DeviceNameColumn(this.app, CredsComponent.deviceNameRow2Elem);
    this.deviceNameRow3 = new DeviceNameColumn(this.app, CredsComponent.deviceNameRow3Elem);

    this.IPaddressRow1 = new IPaddressColumn(this.app, CredsComponent.IPaddressRow1Elem);
    this.IPaddressRow2 = new IPaddressColumn(this.app, CredsComponent.IPaddressRow2Elem);
    this.IPaddressRow3 = new IPaddressColumn(this.app, CredsComponent.IPaddressRow3Elem);

    this.usernameRow1 = new UsernameColumn(this.app, CredsComponent.usernameRow1Elem);
    this.usernameRow2 = new UsernameColumn(this.app, CredsComponent.usernameRow2Elem);
    this.usernameRow3 = new UsernameColumn(this.app, CredsComponent.usernameRow3Elem);

    this.passwordRow1 = new PasswordColumn(this.app, CredsComponent.passwordRow1Elem);
    this.passwordRow2 = new PasswordColumn(this.app, CredsComponent.passwordRow2Elem);
    this.passwordRow3 = new PasswordColumn(this.app, CredsComponent.passwordRow3Elem);

    this.bannerTitle = new CredentialsBanner(this.app, CredsComponent.bannerTitle);
    this.bannerMessage = new CredentialsBanner(this.app, CredsComponent.bannerMessage);
    this.bannerOverwriteBtn = new CredentialsBanner(this.app, CredsComponent.bannerOverwriteBtn);
    this.bannerHelpFileBtn = new CredentialsBanner(this.app, CredsComponent.bannerHelpFileBtn);
    this.bannerCloseBtn = new CredentialsBanner(this.app, CredsComponent.bannerCloseBtn);

    this.firstPage = new CredentialsContainer(this.app, CredsComponent.firstPageElem);
    this.previousPage = new CredentialsContainer(this.app, CredsComponent.previousPageElem);
    this.defaultPage = new CredentialsContainer(this.app, CredsComponent.defaultPageElem);
    this.secondPage = new CredentialsContainer(this.app, CredsComponent.secondPageElem);
    this.nextPage = new CredentialsContainer(this.app, CredsComponent.nextPageElem);
    this.lastPage = new CredentialsContainer(this.app, CredsComponent.lastPageElem);
    this.footer = new CredentialsContainer(this.app, CredsComponent.footerElem);

    this.leftPage = new CredentialsContainer(this.app, CredsComponent.leftPageElem);
    this.rightPage = new CredentialsContainer(this.app, CredsComponent.rightPageElem);
    this.stepForward = new CredentialsContainer(this.app, CredsComponent.stepForwardElem);
    this.stepBackward = new CredentialsContainer(this.app, CredsComponent.stepBackwardElem);

    this.openHelpButton = new OpenHelpButton(this.app, CredsComponent.openHelpButtonElem);
    this.bannerText = new BannerText(this.app, CredsComponent.bannerTextElem);
    this.noDeviceText = new NoDeviceText(this.app, CredsComponent.noDeviceTextElem);
    this.infoIcon = new InfoIcon(this.app, CredsComponent.infoIconElem);
    this.noRetrieveText = new NoRetrieveText(this.app, CredsComponent.noRetrieveTextElem);
    this.bannerExitButton = new BannerExitButton(this.app, CredsComponent.bannerExitButton);
    this.bannerOverwriteButton = new BannerOverwriteButton(this.app, CredsComponent.bannerOverwriteButtonElem);
    this.grabber = new Grabber(this.app, CredsComponent.grabberElem);
}
}
