/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { StartProgramButton } from "../startStopProgram/startProgramButton.po";
import { StopProgramButton } from "../startStopProgram/stopProgramButton.po";
import { Element } from "../lib/element";
const startStopProgramLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "startStopProgramLocators.json"));
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

/**
	* @Author `Neelam.s-QA`
    * @LinkToJIRA `https://extron.atlassian.net/browse/NEATPL-177`
	* @Description `Start Stop Program Component POM refactor`
	* @Date `12/20/19`
*/


export class StartStopProgramComponent extends Element {
    private static stratStopProgramComponentElem: string = startStopProgramLocators.startStopProgramComponent;
    private static startProgramElem: string = startStopProgramLocators.startProgramButton;
    private static stopProgramElem: string = startStopProgramLocators.stopProgramButton;
    private static startProgramBtnTxtElem: string = startStopProgramLocators.startProgramBtnTxt;
    private static stopProgramBtnTxtElem: string = startStopProgramLocators.stopProgramBtnTxt;


    public startProgramButton: StartProgramButton;
    public startProgramBtnTxt: StartProgramButton;
    public stopProgramButton: StopProgramButton;
    public stopProgramBtnTxt: StopProgramButton;

    constructor(app: WebdriverIO.Browser, selector: string = "") {
        super(app, selector);
        this.startProgramButton = new StartProgramButton(this.app, StartStopProgramComponent.startProgramElem);
        this.startProgramBtnTxt = new StartProgramButton(this.app, StartStopProgramComponent.startProgramBtnTxtElem);
        this.stopProgramButton = new StopProgramButton(this.app, StartStopProgramComponent.stopProgramElem);
        this.stopProgramBtnTxt = new StopProgramButton(this.app, StartStopProgramComponent.stopProgramBtnTxtElem);
    }
}
