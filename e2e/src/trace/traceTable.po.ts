/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { BaseTable } from '../BaseTable';
import { allure } from "../allure/allure";
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const traceLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "traceLocators.json"));

export class TraceTable extends BaseTable {
    public tableselector: string;
    public tablerowselector: string;
    public colselector:string;
    public cellselector:string;

    constructor(browser: WebdriverIO.Browser , selector: string,col:string,row:string,cell:string) {
        super(browser, selector, col,row,cell);
        this.tableselector = selector;
        this.tablerowselector = "//tr[contains(@id,'row-trace-table')]";
        this.colselector = "//th";
        this.cellselector = "//td";
    }

    public async getTraceMessages(): Promise<any> {
        /* return array of arrays. 
           Outer array is a line in the trace messages
           Inner array contains each field (IP, date/time, message) as a string
        */
        let result: [string[]] = [[]];

        const rows = await browser.$$(
            this.selector + this.tablerowselector
        );
        const cols = await browser.$$(
            this.selector + this.colselector
        );
        //console.log("ROW LEN: ", rows.length);
        //console.log("COL LEN: ", cols.length);

        for (let i = 1; i <= rows.length; i++) {
            let lineContents: string[] = [];
            for (let j = 1; j <= cols.length; j++) {
                browser.pause(5000);
                const cellstring = await browser
                    .$(this.selector+this.tablerowselector+"["+i+"]"+this.cellselector+"["+j+"]")
                    .getText();
                lineContents.push(cellstring);
            }
            result.push(lineContents);
            lineContents = [];
        }
        result.shift(); // remove initial empty inner array
        return result;
    }

    public async checkEmptyRecordsHeader(): Promise<boolean> {
        let found: boolean = false;
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.slow);
        await browser
            .$(traceLocators.recordsHeader)
            .getText()
            .then(async (text: any) => {
                if (text.match("No Records Found")) {
                    found = true;
                }
            })
            .catch((err: any) => {
            });
        return found;
    }
    public async formatTraceMessageArray(arr: [string[]]) : Promise<void> {
        /* formats the array so that the inner array is in the order of:
           [date/time, IP,  message] */
        arr.forEach(element => {
            [element[0], element[1]] = [element[1], element[0]];
        });
    }
}
