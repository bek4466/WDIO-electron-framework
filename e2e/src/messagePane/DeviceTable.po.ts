/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { BaseTable } from '../BaseTable';
export class DeviceTable extends BaseTable {
           public tableselector: string;
           public tablerowselector: string;
           public app: WebdriverIO.Browser;
           public cols: number;

           constructor(app: WebdriverIO.Browser, selector: string,col:string,row:string,cell:string) {
            super(app, selector, col,row,cell);
        }


        public async cellisClickable(
            rowdata: number,
            columndata: number
        ): Promise<any> {
            let isClickable: boolean;
            try {
             let objClass:string =  await browser.$(this.selector  +
                this.tablerowselector+"["+rowdata+"]"+this.cellselector+"["+columndata+"]")
                    .getAttribute("class");
                return  objClass.includes("ui-editable-column")? true : false;

            } catch (err) {
                return false;
            }
            return false;
        }
        

        public async cellsetValue(
            rowdata: number,
            columndata: number,
            data:string
        ): Promise<void> {
            let isClickable: boolean;
            try {
                await browser
                    .$(
                        this.selector  +
                        this.tablerowselector+"["+rowdata+"]"+this.cellselector+"["+columndata+"]"
                    )
                    .click();

                    await browser
                    .$(
                        this.selector  +
                        this.tablerowselector+"["+rowdata+"]"+this.cellselector+"["+columndata+"]" + "//input"
                    )
                    .setValue(data);

            } catch (err) {
                console.log("Error while setting the value");
            }
            //after setting the value 
        }
        

        public async getTablerows():Promise<number>
        {
         const rows = await browser.$$(
            this.selector  +
            this.tablerowselector
         );
         return rows.length;

        }

        public async cellisVisible(
            rowdata: number,
            columndata: number,
            data:string
        ): Promise<boolean> {
            let isVisible: boolean;
            try {
                isVisible = await browser
                    .$(
                        this.selector  +
                        this.tablerowselector+"["+rowdata+"]"+this.cellselector+"["+columndata+"]"
                    )
                    .isClickable();
                    return isVisible;
            } catch (err) {
                console.log("Error while setting the value");
                return false;
            }
            return isVisible;
        }

       }
