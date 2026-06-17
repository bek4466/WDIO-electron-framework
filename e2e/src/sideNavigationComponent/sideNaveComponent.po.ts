/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";

import { CommLogging } from '../logger';
import { GeneralLogging } from '../logger/generalLogging.po';
import { AboutButton } from "../sideNavigation/aboutButton.po";
import { DeployPage } from '../sideNavigation/deployPage.po';
import { HelpFileButton } from "../sideNavigation/helpFileButton.po";
import { HelpPage } from "../sideNavigation/helpPage.po";
import { LoggingPage } from '../sideNavigation/loggingPage.po';
import { TroubleshootingPage } from '../sideNavigation/troubleshootingPage.po';
import { MatButton } from "../matButton";
const sideNavLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "deploymentLocators.json"));

export class SideNavigationComponent {
    private static deployPageElem: string = sideNavLocators.sideNavigationElems.deploymentPage;
    private static troubleshootingPageElem: string = sideNavLocators.sideNavigationElems.troubleshootingPage;
    private static loggingPageElem: string = sideNavLocators.sideNavigationElems.loggingPage;
    private static genLogsElem: string = sideNavLocators.sideNavigationElems.genLogSwitch;
    private static commLogsElem: string = sideNavLocators.sideNavigationElems.commLogSwitch;
    private static helpPageElem: string = sideNavLocators.sideNavigationElems.helpNavigation;
    private static helpFileButtonElem: string = sideNavLocators.sideNavigationElems.helpFile;
    private static csDocButtonElem: string = sideNavLocators.sideNavigationElems.csDocBtn;
    private static aboutButtonElem: string = sideNavLocators.sideNavigationElems.aboutPage;

    public deployWindow: DeployPage;
    public troubleshootingWindow: TroubleshootingPage;
    public loggingWindow: LoggingPage;
    public genLogsSwitch: GeneralLogging;
    public commLogsSwitch: CommLogging;
    public helpPage: HelpPage;
    public helpFileButton: HelpFileButton;
    public csDocButton: MatButton;
    public aboutButton: AboutButton;

    constructor(private app: WebdriverIO.Browser, public selector: string = "") {
        this.deployWindow = new DeployPage(this.app, SideNavigationComponent.deployPageElem);
        this.troubleshootingWindow = new TroubleshootingPage(this.app, SideNavigationComponent.troubleshootingPageElem);
        // this.loggingWindow = new LoggingPage(this.app, SideNavigationComponent.loggingPageElem);
        // this.genLogsSwitch = new GeneralLogging(this.app, SideNavigationComponent.genLogsElem);
        // this.commLogsSwitch = new CommLogging(this.app, SideNavigationComponent.commLogsElem);
        this.helpPage = new HelpPage(this.app, SideNavigationComponent.helpPageElem);
        this.helpFileButton = new HelpFileButton(this.app, SideNavigationComponent.helpFileButtonElem);
        this.csDocButton = new MatButton(this.app, SideNavigationComponent.csDocButtonElem, "ControlScript Documentation submenu button");
        this.aboutButton = new AboutButton(this.app, SideNavigationComponent.aboutButtonElem);
    }
}
