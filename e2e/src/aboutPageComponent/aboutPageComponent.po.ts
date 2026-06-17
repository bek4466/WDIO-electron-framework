/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { CommLogging } from '../logger';
import { GeneralLogging } from '../logger/generalLogging.po';
import { AboutButton } from "../aboutPage/aboutButton.po";
import { VersionNumber } from "../aboutPage/versionNumber.po";
import { Copyright } from "../aboutPage/copyright.po";
import { Disclaimer } from "../aboutPage/disclaimer.po";
import { EULA } from "../aboutPage/eula.po";
import { EULALink } from "../aboutPage/eulaLink.po";
import { PartNumber } from "../aboutPage/partNumber.po";
import { MatText } from "../matText";
const aboutLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "aboutLocators.json"));

export class AboutPageComponent {
    private static aboutButtonElem: string = aboutLocators.aboutPage;
    private static aboutTitleElem: string = aboutLocators.aboutTitle;
    private static versionNumberElem: string = aboutLocators.versionNumber;
    private static copyrightElem: string = aboutLocators.copyright;
    private static disclaimerElem: string = aboutLocators.disclaimer;
    private static eulaElem: string = aboutLocators.eula;
    private static eulaLinkElem: string = aboutLocators.eulaLink;
    private static partNumberElem: string = aboutLocators.partNumber;

    public aboutButton: AboutButton;
    public aboutTitle: MatText;
    public versionNumber: VersionNumber;
    public copyright: Copyright;
    public disclaimer: Disclaimer;
    public eula: EULA;
    public eulaLink: EULALink;
    public partNumber: PartNumber;

    constructor(private app: WebdriverIO.Browser, public selector: string = "") {
        this.aboutButton = new AboutButton(this.app, AboutPageComponent.aboutButtonElem);
        this.aboutTitle = new MatText(this.app, AboutPageComponent.aboutTitleElem, "About title");
        this.versionNumber = new VersionNumber(this.app, AboutPageComponent.versionNumberElem);
        this.copyright = new Copyright(this.app, AboutPageComponent.copyrightElem);
        this.disclaimer = new Disclaimer(this.app, AboutPageComponent.disclaimerElem);
        this.eula = new EULA(this.app, AboutPageComponent.eulaElem);
        this.eulaLink = new EULALink(this.app, AboutPageComponent.eulaLinkElem);
        this.partNumber = new PartNumber(this.app, AboutPageComponent.partNumberElem);
    }
}
