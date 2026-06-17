/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

import { MatButton } from '../matButton';
import { allure } from "../../src/allure/allure";
const timeout = fs.readJsonSync(
    path.join(__dirname, "..", "JSON", "timeout.json")
);
const locators = fs.readJsonSync(
    path.join(__dirname, "..", "JSON", "locators.json")
);

export class BaseTable   {
    public tableselector: string;
    public tablerowselector: string;
    public colselector:string;
    public cellselector:string;
    public selector : string;
    public app: WebdriverIO.Browser;
    constructor(app: WebdriverIO.Browser, selector: string,col:string,row:string,cell:string) {
        this.app = app;
        this.selector = selector;
        this.tablerowselector = row;
        this.colselector = col;
        this.cellselector = cell;
    }

    // pass column names with th tag eg (//table)
     public async checkColumnExists(columnname: string): Promise<boolean> {
        let resultString: string;
        let status: boolean;
        const cols = await browser.$$(
            this.selector + this.colselector
        );
        for (let i = 1; i <= cols.length; i++) {
            resultString = await browser
                .$(this.selector + this.colselector+"["+i+"]")
                .getText();
            if (resultString === columnname) {
                status = true;
                return status;
            }
        }
        return false;
    }

    //check the table exist
    public async checkTableExists(): Promise<boolean> {
        await allure.screenshot(this.app, "Before");
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.error("From checkTableExists: " + `${err}`);
            a = false;
        });
        await allure.screenshot(this.app, "After");
        return a;


    }
    public async checkRowIsVisible(): Promise<boolean> {
        await browser.pause(timeout.medium);
        let a;
        await browser.$(this.selector).waitForExist()
        .then(async (val) => {
            a = val;
        }).catch((err: Error) => {
            console.error("From checkRowIsVisible: " + `${err}`);
            a = false;
        });
        await allure.screenshot(this.app, "After");
        return a;
    }


   
    public async tableContents(): Promise<string[]> {
        const arr = [];

        const rows = await browser.$$(
            this.selector + this.tablerowselector
        );

        const cols = await browser.$$(
            this.selector + this.colselector
        );
        for (let i = 1; i <= rows.length; i++) {
            for (let j = 1; j <= cols.length; j++) {
                browser.pause(5000);
                const cellstring = await browser
                    .$(this.selector+this.tablerowselector+"["+i+"]"+this.cellselector+"["+j+"]")
                    .getText();
                arr.push(cellstring);
            }
        }
        return arr;
    }

    public async getMessagesContents(): Promise<string[]> {
        const arr = [];

        const rows = await browser.$$(
            this.selector + this.tablerowselector
        );

        const cols = await browser.$$(
            this.selector + this.colselector
        );
        for (let i = 1; i <= rows.length; i++) {
            let temparr = []
               
                browser.pause(5000);
                const j = 1;
                const y = 3
                const cellstring_1 = await browser
                    .$(this.selector+this.tablerowselector+"["+i+"]"+this.cellselector+"["+j+"]")
                    .getText();
                const cellstring_2 = await browser
                    .$(this.selector+this.tablerowselector+"["+i+"]"+this.cellselector+"["+y+"]")
                    .getText();
                temparr.push(cellstring_1)
                temparr.push(cellstring_2)
          
            arr.push(temparr);
            temparr = undefined;
        }

        console.log("This is the arr " + arr.toString())
        return arr;
    }

    public async getTimeStampsRows(columnname: number): Promise<string[]> {
        const arr = [];
        const colname = columnname;
        const rows = await browser.$$(this.selector  + this.tablerowselector);
        const cols = await browser.$$(this.selector  + this.colselector);
        for (let i = 1; i <= rows.length; i++) {
                const cellstring = await browser
                    .$(this.selector + this.tablerowselector+"["+i+"]"+this.cellselector+"["+colname+"]")
                    .getText();
                arr.push(cellstring);
        }
        return arr;
    }


    public async cellcontent(rowdata: number, columndata: number): Promise<any> {
        let cellstring: string;
        cellstring = await browser
        .$(this.selector + this.tablerowselector + "[" + rowdata + "]" + this.cellselector + "[" + columndata + "]")
        .getText();
        try {
            cellstring = await browser
                .$(this.selector + this.tablerowselector + "[" + rowdata+ "]" + this.cellselector + "[" + columndata + "]")
                .getText();
        } catch (err) {
            return false;
        }
        return cellstring;
    }

    public async getTablerow(celldata:string):Promise<number>
    {
     const tablecelldata:string = celldata;

     await browser.pause(3000);
     const rows = await browser.$$(
        this.selector +  this.tablerowselector
     );
     const cols = await browser.$$(
        this.selector +this.colselector
     );
     for (let i = 1; i <= rows.length; i++) {
         for (let j = 1; j <= cols.length; j++) {
             const cellstring = await browser
                 .$(
                    this.selector +
                       this.tablerowselector+"["+i+"]"+this.cellselector+"["+j+"]"
                 )
                 .getText();
             if(cellstring === tablecelldata)
             {
                 return i;
             }
         }
     }
     return null;

    }

    public async getMessageCount(celldata:string):Promise<number>
    {
        let messagecnt = 0;
        await this.tableContents().then(async (tablecontents) => {
                        for (let i of tablecontents) {

                           if (i.includes(celldata)) {
                               messagecnt++;
                          }
                        }
                        return messagecnt;
                    })
        return messagecnt

    }
}
