/* tslint:disable */
// @ts-nocheck
import { BaseTable } from '../BaseTable';

export class MessageTable extends BaseTable {
    public tableselector: string;
    public tablerowselector: string;
    public colselector:string;
    public cellselector:string;

    constructor(app: WebdriverIO.Browser, selector: string,col:string,row:string,cell:string) {
        super(app, selector, col,row,cell);
    }
}
