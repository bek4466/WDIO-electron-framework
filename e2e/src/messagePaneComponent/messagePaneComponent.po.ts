/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { CloseMessagePane } from '../messagePane/closeMessagePane.po';
import { MessageColumns } from '../messagePane/messageColumns.po';
import { MessageTable } from '../messagePane/messageTable.po'
import { OpenMessagePane } from '../messagePane/openMessagePane.po';
import { Element } from "../lib/element";
import { DeviceTable } from '../messagePane/DeviceTable.po';
import { Grabber } from '../messagePane/grabber.po';
import { ClearAll } from '../messagePane/clearAllMessagePane.po';
import { FilterDropDownList } from '../messagePane/filterDropDownListButton.po';
import { SeverityDropDownButton } from '../messagePane/severityDropDown.po';
import { InfoCheckBox } from '../messagePane/infoCheckBox.po';
import { WarningCheckBox, ErrorCheckBox, ErrorSyncChipIcon, InfoSyncChipIcon, WarningSyncChipIcon, CloseSyncChipButton, ClearAllFilterOptions, FilterCountChanges, SeverityCountChanges } from '../messagePane';
import { SortIconTimeColumn } from '../messagePane/sortTimeColumnArrowIcon.po';
import { ExportMessageButton } from "../messagePane/exportMessageButton.po";
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const messagePaneLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));
/**
	* @Author `Neelam.S-QA`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-188`
	* @Description `Message Component`
	* @Date `11/08/2019`
*/

/**
	* @Author `Oybek.T Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/NEATPL-162`
	* @Description `Refactor Messaging Pane using new locators`
	* @Date `12/11/2019`
*/

export class MessagePaneComponent extends Element  {
    public static closeButtonElem: string = messagePaneLocators.messageHeaderCloseBtn
    public static messagePaneButtonElem: string = messagePaneLocators.messagesBtn;
    public static messagePageTableComponentElem: string = messagePaneLocators.messagePageTableComponent;

    public static timeHeaderElem: string = messagePaneLocators.timeHeader;
    public static severityHeaderElem: string = messagePaneLocators.severityHeader;
    public static messageHeaderElem: string = messagePaneLocators.messageHeader;

    public static timeRowValueElem: string = messagePaneLocators.TimeCol.row1Time;
    public static messageRowValueElem: string = messagePaneLocators.MessageCol.row1Message;
    public static severityRowValueElem: string = messagePaneLocators.SeverityCol.row1Severity;

    public static grabberElem: string = messagePaneLocators.grabber;

    public static messageTableElem:string = messagePaneLocators.messagePageTableComponent;
    public static messagePaneVisibleElem: string = messagePaneLocators.messagePaneVisible
    public static messagePaneHiddenElem: string = messagePaneLocators.messagePaneHidden;
    public static messageIconElem: string = messagePaneLocators.messageIcon;
    public static messagePaneColumnElem:string = messagePaneLocators.messagepanecolumns;
    public static messagePaneRowElem:string = messagePaneLocators.messagepanerows;
    public static messagePaneCellElem:string = messagePaneLocators.messagepanecell;

    public static deviceTableElem:string = locators.deviceTable;
    public static deviceTableColumnElem:string = locators.deviceTableColHeaders;
    public static deviceTableRowElem:string = locators.deviceTableRows;
    public static deviceTableCellElem:string = locators.deviceTableCols;

    public static clearAllElem: string = messagePaneLocators.clearAllBtn;
    public static exportElem: string = messagePaneLocators.exportMessageButton;
    public static filterDropDownListElem: string = messagePaneLocators.filterDropDownList;
    public static severityDropDownListButtonElem: string = messagePaneLocators.severityDropDownList;
    public static infoSeverityOptionCheckBoxElemUnchecked: string = messagePaneLocators.infoCheckBoxUnchecked;
    public static warningSeverityOptionCheckBoxElemUnchecked: string = messagePaneLocators.warningCheckBoxUnchecked;
    public static errorSeverityOptionCheckBoxElemUnchecked: string = messagePaneLocators.errorCheckBoxUnchecked;

    public static infoSeverityOptionCheckBoxElemChecked: string = messagePaneLocators.infoCheckBoxChecked;
    public static warningSeverityOptionCheckBoxElemChecked: string = messagePaneLocators.warningCheckBoxChecked;
    public static errorSeverityOptionCheckBoxElemChecked: string = messagePaneLocators.errorCheckBoxChecked;z

    public static infoSyncChipFilterElem: string = messagePaneLocators.infoChipText;
    public static warningSyncChipFilterElem: string = messagePaneLocators.warningChipText;
    public static errorSyncChipFilterElem: string = messagePaneLocators.errorChipText;

    public static infoSyncChipCloseElem: string = messagePaneLocators.infoCloseChipIcon;
    public static warningSyncChipCloseElem: string = messagePaneLocators.warningCloseChipIcon;
    public static errorSyncChipCloseElem: string = messagePaneLocators.errorCloseChipIcon;
    public static clearAllFilterOptsElem: string = messagePaneLocators.clearAllFilterOpts;

    public static filterCountChangeElem: string = messagePaneLocators.filterCountChange;
    public static severityCountChangeElem: string = messagePaneLocators.severityCountChange;
    public static sortTimeColumnIconElem: string = messagePaneLocators.sortTimeColumnIcon;
    public static sortTimeDownArrowElem: string = messagePaneLocators.sortTimeDownArrow;
    public static sortTimeUpArrowElem: string = messagePaneLocators.sortTimeUpArrow;

    public closeMessagePaneButton: CloseMessagePane;
    public openMessagePaneButton: OpenMessagePane;
    public sortTimeColumn: SortIconTimeColumn;
    public sortTimeupIcon: SortIconTimeColumn;
    public sortTimedownIcon: SortIconTimeColumn;
    public filterCountChange: FilterCountChanges;
    public severityCountChange: SeverityCountChanges;

    public clearAllButton: ClearAll;
    public exportMessageButton: ExportMessageButton;
    public filterDropDownListButton: FilterDropDownList;
    public severityDropDownListButton: SeverityDropDownButton;

    public infoFilterOptionCheckBoxUnchecked: InfoCheckBox;
    public warningFilterOptionCheckBoxUnchecked: WarningCheckBox;
    public errorFilterOptionCheckBoxUnchecked: ErrorCheckBox;

    public infoFilterOptionCheckBoxChecked: InfoCheckBox;
    public warningFilterOptionCheckBoxChecked: WarningCheckBox;
    public errorFilterOptionCheckBoxChecked: ErrorCheckBox;

    public infoSyncChipFilter: InfoSyncChipIcon;
    public warningSyncChipFilter: WarningSyncChipIcon;
    public errorSyncChipFilter: ErrorSyncChipIcon;

    public infoSyncChipCloseBtn: CloseSyncChipButton;
    public warningSyncChipCloseBtn: CloseSyncChipButton;
    public errorSyncChipCloseBtn: CloseSyncChipButton;

    public clearAllFilterOptsBtn: ClearAllFilterOptions;
    public grabber: Grabber;

    public timeColumn: MessageColumns;
    public severityColumn: MessageColumns;
    public messageColumn: MessageColumns;
    public messageIcon: CloseMessagePane;

    public timeRowValue: MessageColumns;
    public messageRowValue: MessageColumns;
    public severityRowValue: MessageColumns;

    public messageTable: MessageTable;
    public messagePageTable: OpenMessagePane;
    public deviceTable: DeviceTable;
    public messagePaneHidden: CloseMessagePane;
    public messagePaneVisible: OpenMessagePane;


    constructor(app: WebdriverIO.Browser, selector: string = "") {
        super(app, selector)
        this.closeMessagePaneButton = new CloseMessagePane(app, MessagePaneComponent.messagePaneButtonElem);
        this.openMessagePaneButton = new OpenMessagePane(app, MessagePaneComponent.messagePaneButtonElem);
        this.filterCountChange = new FilterCountChanges(app, MessagePaneComponent.filterCountChangeElem);
        this.severityCountChange = new SeverityCountChanges(app, MessagePaneComponent.severityCountChangeElem);
        this.clearAllButton = new ClearAll(app, MessagePaneComponent.clearAllElem);
        this.exportMessageButton = new ExportMessageButton(app, MessagePaneComponent.exportElem);
        this.filterDropDownListButton = new FilterDropDownList(app, MessagePaneComponent.filterDropDownListElem);
        this.severityDropDownListButton = new SeverityDropDownButton(app, MessagePaneComponent.severityDropDownListButtonElem);
        this.infoFilterOptionCheckBoxUnchecked = new InfoCheckBox(app, MessagePaneComponent.infoSeverityOptionCheckBoxElemUnchecked);
        this.warningFilterOptionCheckBoxUnchecked = new WarningCheckBox(app, MessagePaneComponent.warningSeverityOptionCheckBoxElemUnchecked);
        this.errorFilterOptionCheckBoxUnchecked = new ErrorCheckBox(app, MessagePaneComponent.errorSeverityOptionCheckBoxElemUnchecked);

        this.infoFilterOptionCheckBoxChecked = new InfoCheckBox(app, MessagePaneComponent.infoSeverityOptionCheckBoxElemChecked);
        this.warningFilterOptionCheckBoxChecked = new WarningCheckBox(app, MessagePaneComponent.warningSeverityOptionCheckBoxElemChecked);
        this.errorFilterOptionCheckBoxChecked = new ErrorCheckBox(app, MessagePaneComponent.errorSeverityOptionCheckBoxElemChecked);
        this.sortTimeColumn = new SortIconTimeColumn(app, MessagePaneComponent.sortTimeColumnIconElem);
        this.sortTimeupIcon= new SortIconTimeColumn(app, MessagePaneComponent.sortTimeUpArrowElem);
        this.sortTimedownIcon = new SortIconTimeColumn(app, MessagePaneComponent.sortTimeDownArrowElem);
        this.infoSyncChipFilter = new InfoSyncChipIcon(app, MessagePaneComponent.infoSyncChipFilterElem);
        this.warningSyncChipFilter = new WarningSyncChipIcon(app, MessagePaneComponent.warningSyncChipFilterElem);
        this.errorSyncChipFilter = new ErrorSyncChipIcon(app, MessagePaneComponent.errorSyncChipFilterElem);

        this.infoSyncChipCloseBtn = new CloseSyncChipButton(app, MessagePaneComponent.infoSyncChipCloseElem);
        this.warningSyncChipCloseBtn = new CloseSyncChipButton(app, MessagePaneComponent.warningSyncChipCloseElem);
        this.errorSyncChipCloseBtn = new CloseSyncChipButton(app, MessagePaneComponent.errorSyncChipCloseElem);
        this.clearAllFilterOptsBtn =new ClearAllFilterOptions(app, MessagePaneComponent.clearAllFilterOptsElem);
        this.deviceTable = new DeviceTable(app, MessagePaneComponent.deviceTableElem,MessagePaneComponent.deviceTableColumnElem,MessagePaneComponent.deviceTableRowElem,MessagePaneComponent.deviceTableCellElem);
        this.grabber = new Grabber(app, MessagePaneComponent.grabberElem);
        this.timeColumn = new MessageColumns(app, MessagePaneComponent.timeHeaderElem);
        this.severityColumn = new MessageColumns(app, MessagePaneComponent.severityHeaderElem);
        this.messageColumn = new MessageColumns(app, MessagePaneComponent.messageHeaderElem);
        this.messageIcon=new CloseMessagePane(app,MessagePaneComponent.messageIconElem);
        this.timeRowValue = new MessageColumns(app, MessagePaneComponent.timeRowValueElem);
        this.messageRowValue = new MessageColumns(app, MessagePaneComponent.messageRowValueElem);
        this.severityRowValue = new MessageColumns(app, MessagePaneComponent.severityRowValueElem);

        this.messageTable = new MessageTable(app,MessagePaneComponent.messageTableElem,MessagePaneComponent.messagePaneColumnElem,MessagePaneComponent.messagePaneRowElem,MessagePaneComponent.messagePaneCellElem);
        this.messagePaneHidden = new CloseMessagePane(app,MessagePaneComponent.messagePaneHiddenElem);
        this.messagePaneVisible = new OpenMessagePane(app,MessagePaneComponent.messagePaneVisibleElem)
        this.messageIcon=new CloseMessagePane(app,MessagePaneComponent.messageIconElem);
        this.messagePageTable = new OpenMessagePane(app,MessagePaneComponent.messagePageTableComponentElem);
    }

}
