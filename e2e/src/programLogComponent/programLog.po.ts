/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { RefreshProgramLogButton } from '../programLog/refreshProgramLogButton.po';
import { ClearProgramLogButton } from "../programLog/clearProgramLogButton.po";
//import { StartProgramButton } from "../programLog/startProgramButton.po";
//import { StopProgramButton } from "../programLog/stopProgramButton.po";
import { UpdatedTimeStampText } from "../programLog/updatedTimeStamp.po";
import { ProgramLogTextAreaField } from "../programLog/programLogTextAreaField.po";
import { ProgramLogContent } from "../programLog/programLogContent.po";
import { NoProgramLogTextField } from "../programLog/noProgramLogTextField.po";
import { Element } from "../lib/element";
import { ExportProgramLogButton } from "../programLog/exportProgramLogButton.po";
const programLogLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "programLogLocators.json"));
/**
	* @Author `Oybek.T-Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-26`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-27`
	* @Description `Troubleshooting Page`
	* @Date `09/16/2019`
*/

/**
	* @Author `Oybek.T-Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/NEATPL-162`
	* @Description `Program Log Component POM refactor`
	* @Date `12/11/19`
*/


export class ProgramLogComponent extends Element {
    private static programLogComponentElem: string = programLogLocators.programLogComponent;
    private static refreshBtnElem: string = programLogLocators.refreshBtn;
    private static clearBtnElem: string = programLogLocators.clearBtn;
    private static programLogTextAreaElem: string = programLogLocators.actualLogText;
    private static noProgramLogTextElem: string = programLogLocators.noLogsText;
    private static updatedTimeStampElem: string = programLogLocators.updatedTimeStampText;
    private static startProgramElem: string = programLogLocators.StartProgramBtn;
    private static stopProgramElem: string = programLogLocators.StopProgramBtn;
    private static programLogTitleElem: string = programLogLocators.programLogText;
    private static exportProgramLogButtonElem: string = programLogLocators.exportProgramLogButton;


    public programLogRefreshButton: RefreshProgramLogButton;
    public programLogContent: ProgramLogContent;
    public programLogText: ProgramLogContent;
    public clearProgramLogButton: ClearProgramLogButton;
    public programLogTextAreaField: ProgramLogTextAreaField;
    public noProgramLogTextField: NoProgramLogTextField;
    public lastUpdatedProgramLogText: UpdatedTimeStampText;
    public exportProgramLogButton: ExportProgramLogButton;
    //public startProgramButton: StartProgramButton;
    //public stopProgramButton: StopProgramButton;

    constructor(app: WebdriverIO.Browser, selector: string = "") {
        super(app, selector);
        this.programLogRefreshButton = new RefreshProgramLogButton(browser, ProgramLogComponent.refreshBtnElem);
        this.programLogContent = new ProgramLogContent(this.app, ProgramLogComponent.programLogComponentElem);
        this.programLogText = new ProgramLogContent(this.app, ProgramLogComponent.programLogTitleElem);
        this.clearProgramLogButton = new ClearProgramLogButton(this.app, ProgramLogComponent.clearBtnElem);
        this.programLogTextAreaField = new ProgramLogTextAreaField(this.app, ProgramLogComponent.programLogTextAreaElem);
        this.noProgramLogTextField = new NoProgramLogTextField(this.app, ProgramLogComponent.noProgramLogTextElem);
        this.lastUpdatedProgramLogText = new UpdatedTimeStampText(this.app, ProgramLogComponent.updatedTimeStampElem);
        //this.startProgramButton = new StartProgramButton(this.app, ProgramLogComponent.startProgramElem);
        //this.stopProgramButton = new StopProgramButton(this.app, ProgramLogComponent.stopProgramElem);
        this.exportProgramLogButton = new ExportProgramLogButton(this.app, ProgramLogComponent.exportProgramLogButtonElem);
    }
}
