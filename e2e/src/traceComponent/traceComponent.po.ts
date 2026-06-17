/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
// import { Application } from 'spectron';
import { StartTraceButton } from '../trace/startTraceButton.po';
import { StopTraceButton } from '../trace/stopTraceButton.po';
import { ClearTraceButton } from '../trace/clearTraceButton.po';
import { TraceSpinner } from '../trace/traceSpinner.po';
import { Element } from "../lib/element";
import { IpAddressField } from '../trace/ipAddressField.po';
import { TimeField } from '../trace/timeField.po';
import { MessageField } from '../trace/messageField.po';
import { TraceTable } from '../trace/traceTable.po';
import { ExportTraceButton } from "../trace/exportTraceButton.po";
import { TraceCounter } from "../trace/traceCounter.po";
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const traceLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "traceLocators.json"));

/**
	* @Author `Oybek.T-Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-46`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-25`
	* @Description `Trace Component`
	* @Date `10/01/2019`
*/


export class TraceComponent extends Element {
    public static rootSelector: string = locators.tableRootSelector;
    public static startTraceButtonElem: string = traceLocators.startTraceBtn;
    public static stopTraceButtonElem: string = traceLocators.stopTraceBtn;
    public static traceTitleElem: string = traceLocators.traceTextTitle;
    public static clearTraceButtonElem: string = traceLocators.clearTraceBtn;
    public static traceSpinnerElem: string = traceLocators.traceSpinnerIcon;
    public static ipAddressElem: string = traceLocators.traceIPaddressHeader;
    public static timeElem: string = traceLocators.traceTimeHeader;
    public static messageElem: string = traceLocators.traceMessageHeader;
    public static exportTraceButtonElem: string = traceLocators.exportTraceButton;
    public static traceCounterElem: string = traceLocators.traceCounter;

    public static IPaddressRow1Elem: string = traceLocators.IPaddressCol.row1IPaddress;
    public static IPaddressRow2Elem: string = traceLocators.IPaddressCol.row2IPaddress;
    public static IPaddressRow3Elem: string = traceLocators.IPaddressCol.row3IPaddress;
    public static IPaddressRow4Elem: string = traceLocators.IPaddressCol.row4IPaddress;

    public static messageRow1Elem: string = traceLocators.MessageCol.row1Message;
    public static messageRow2Elem: string = traceLocators.MessageCol.row2Message;
    public static messageRow3Elem: string = traceLocators.MessageCol.row3Message;
    public static messageRow4Elem: string = traceLocators.MessageCol.row4Message;

    public static timeRow1Elem: string = traceLocators.TimeCol.row1Time;
    public static timeRow2Elem: string = traceLocators.TimeCol.row2Time;
    public static timeRow3Elem: string = traceLocators.TimeCol.row3Time;
    public static timeRow4Elem: string = traceLocators.TimeCol.row4Time;
    public static traceTableElem: string = traceLocators.traceTable;
    public static traceColumnElem: string = traceLocators.tracecolumns;
    public static traceRowElem: string = traceLocators.tracerows;
    public static traceCellElem: string = traceLocators.tracecell;

    public static ipRowValueElem: string = traceLocators.IPaddressCol.row1IPaddress;
    public static timeRowValueElem: string = traceLocators.TimeCol.row1Time;
    public static messageRowValueElem: string = traceLocators.MessageCol.row1Message;
    
    public startTraceButton: StartTraceButton;
    public traceTextTitle: StartTraceButton;
    public stopTraceButton: StopTraceButton;
    public clearTraceButton: ClearTraceButton;
    public traceSpinner: TraceSpinner;
    public ipAddressField: IpAddressField;
    public timeField: TimeField;
    public messageField: MessageField;
    public exportTraceButton: ExportTraceButton;
    public traceCounter: TraceCounter;

    public IPaddressRow1: IpAddressField;
    public IPaddressRow2: IpAddressField;
    public IPaddressRow3: IpAddressField;
    public IPaddressRow4: IpAddressField;
    public messageRow1: MessageField;
    public messageRow2: MessageField;
    public messageRow3: MessageField;
    public messageRow4: MessageField;
    public timeRow1: TimeField;
    public timeRow2: TimeField;
    public timeRow3: TimeField;
    public timeRow4: TimeField;
    public traceTable: TraceTable;

    public ipRowValue: MessageField;
    public timeRowValue: MessageField;
    public messageRowValue: MessageField;

    constructor(app: WebdriverIO.Browser, selector: string = TraceComponent.rootSelector) {
        super(app, selector);
        this.startTraceButton = new StartTraceButton(app, TraceComponent.startTraceButtonElem);
        this.traceTextTitle = new StartTraceButton(app, TraceComponent.traceTitleElem);
        this.stopTraceButton = new StopTraceButton(app, TraceComponent.stopTraceButtonElem);
        this.clearTraceButton = new ClearTraceButton(app, TraceComponent.clearTraceButtonElem);
        this.traceSpinner = new TraceSpinner(app, TraceComponent.traceSpinnerElem);
        this.ipAddressField = new IpAddressField(app, TraceComponent.ipAddressElem);
        this.timeField = new TimeField(app, TraceComponent.timeElem);
        this.messageField = new MessageField(app, TraceComponent.messageElem);
        this.exportTraceButton = new ExportTraceButton(app, TraceComponent.exportTraceButtonElem);
        this.traceCounter = new TraceCounter(app, TraceComponent.traceCounterElem);

        this.ipRowValue = new MessageField(app, TraceComponent.ipRowValueElem);
        this.timeRowValue = new MessageField(app, TraceComponent.timeRowValueElem);
        this.messageRowValue = new MessageField(app, TraceComponent.messageRowValueElem);

        this.IPaddressRow1 = new IpAddressField(app, TraceComponent.IPaddressRow1Elem);
        this.IPaddressRow2 = new IpAddressField(app, TraceComponent.IPaddressRow2Elem);
        this.IPaddressRow3 = new IpAddressField(app, TraceComponent.IPaddressRow3Elem);
        this.IPaddressRow4 = new IpAddressField(app, TraceComponent.IPaddressRow4Elem);
        this.messageRow1 = new MessageField(app, TraceComponent.messageRow1Elem);
        this.messageRow2 = new MessageField(app, TraceComponent.messageRow2Elem);
        this.messageRow3 = new MessageField(app, TraceComponent.messageRow3Elem);
        this.messageRow4 = new MessageField(app, TraceComponent.messageRow4Elem);
        this.timeRow1 = new TimeField(app, TraceComponent.timeRow1Elem);
        this.timeRow2 = new TimeField(app, TraceComponent.timeRow2Elem);
        this.timeRow3 = new TimeField(app, TraceComponent.timeRow3Elem);
        this.timeRow4 = new TimeField(app, TraceComponent.timeRow4Elem);
        this.traceTable = new TraceTable(app,TraceComponent.traceTableElem,TraceComponent.traceColumnElem,TraceComponent.traceRowElem,TraceComponent.traceCellElem);
    }
}
