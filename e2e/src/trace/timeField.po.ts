/* tslint:disable */
import { MatButton } from '../matButton';
import { CommonMethods } from "../../tests/commonMethods.po";

export class TimeField extends MatButton {
    constructor(browser: WebdriverIO.Browser, selector: string) {
        super(browser, selector, "TimeField");
    }

    public async click(): Promise<void> {
        await super.click();
    }

    public async foreignTimeStampColumnIncludesValue(): Promise<boolean> {
        const common = new CommonMethods();
            let columnValue: boolean = false;
            await browser.getElementText(this.selector)
                .then(async (text: any) => {
                    common.convertForeignDateToUsa(text).then(async res => {
                        await common.getCurrDateMDY().then(date => {
                            if (res === date) {
                                columnValue = true;
                            }
                        })
    
                    })
                }
                );
    
            return columnValue;
        }
}
