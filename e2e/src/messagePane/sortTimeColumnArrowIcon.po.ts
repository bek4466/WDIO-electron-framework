// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";
import { allure } from '../allure/allure';
import { MatButton } from "../matButton";
import { reject } from 'q';
const timeout = fs.readJsonSync(path.join(__dirname, "..", "JSON", "timeout.json"));
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const locators2 = fs.readJsonSync(path.join(__dirname, "..", "JSON", "messagePaneLocators.json"));
const data = fs.readJsonSync(path.join(__dirname, "..", "JSON", "dataTool.json"));

export class SortIconTimeColumn extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "SortIconTimeColumn");

    }
    public async click(): Promise<void> {
        await super.click();
    }

    /**
     * owner Neelam
     */
    public async sortTimeColumnAscendingOrder(): Promise<boolean> {
        let sorted: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            const unsortedarray = [];
            const sortedarray = [];
            for (let i = 1; i <= (list.length) ; i++) {
                    await browser.$("//table//tr[" + i + "]//td[1]")
                        .getText()
                        .then(async (text: any) => {
                        unsortedarray[i] = text;
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
            await browser.$(locators2.sortTimeDownArrow)
            .click();
            await browser.pause(timeout.slow);
            for (let i = 1; i <= (list.length); i++) {
                await browser.$("//table//tr[" + i + "]//td[1]")
                    .getText()
                    .then(async (text: any) => {
                        sortedarray[i] = text;
                    })
                    .catch((err: any) => {
                        console.warn('checkMessagePaneLog:' + `${err}`);
                    });
        }
            if (await unsortedarray > await sortedarray){
                sorted = true;
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return sorted;
    }
    /**
     * owner Neelam
     */
    public async sortTimeColumnDescendingOrder(): Promise<boolean> {
        let sorted: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            const unsortedarray = [];
            const sortedarray = [];
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[1]")
                        .getText()
                        .then(async (text: any) => {
                        unsortedarray[i] = text;
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
            await browser.$(locators2.sortTimeDownArrow)
            .click();
            await browser.pause(timeout.slow);
            for (let i = 1; i <= (list.length) ; i++) {
                await browser.$("//table//tr[" + i + "]//td[1]")
                    .getText()
                    .then(async (text: any) => {
                        sortedarray[i] = text;
                    })
                    .catch((err: any) => {
                        console.warn('checkMessagePaneLog:' + `${err}`);
                    });
        }
            if (await unsortedarray < await sortedarray){
                sorted = true;
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return sorted;
    }


    /**
     * owner Neelam
     */
    public async checkTimeColumnDescendingSorting(): Promise<boolean> {
        let sorted: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            const unsortedarray = [];
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[1]")
                        .getText()
                        .then(async (text: any) => {
                        unsortedarray[i] = text;
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
            if (await unsortedarray[1] > await unsortedarray[2]){
                sorted = true;
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return sorted;
    }
    /**
     * owner Neelam
     */
    public async checkAscendingTimeColumnSorting(): Promise<boolean> {
        let sorted: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            const unsortedarray = [];
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[1]")
                        .getText()
                        .then(async (text: any) => {
                        unsortedarray[i] = text;
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
            if (await unsortedarray[1] < await unsortedarray[2]){
                sorted = true;
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return sorted;
    }
    /**
     * owner Neelam
     */
    public async checkSeverityFilters(severityType: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            for (let i = 1; i <= (list.length) ; i++) {
                    await browser.$("//table//tr[" + i + "]//td[2]")
                        .getText()
                        .then(async (text: any) => {
                            if (text.includes(severityType)) {
                                // pass string from test
                                message = true;
                            }
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return message;
    }

    /**
     * owner Neelam
     */
    public async checkMultiSeverityFilters(severityType: string, severityType1: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            for (let i = 1; i <= (list.length) ; i++) {
                    await browser.$("//table//tr[" + i + "]//td[2]")
                        .getText()
                        .then(async (text: any) => {
                            if (text.includes(severityType) || text.includes(severityType)) {
                                // pass string from test
                                message = true;
                            }
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return message;
    }


    // tslint:disable-next-line:typedef
    public async verifyMessagePaneTableLength() {
            const list = await browser.$$(locators2.messagepanerows);
            return list.length;
    }
    /**
     * owner Neelam
     */
    public async checkAllSeverityFilters(severityType: string, severityType1: string, severityType2: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[2]")
                        .getText()
                        .then(async (text: any) => {
                            if (text.includes(severityType) || text.includes(severityType1) || text.includes(severityType2)) {
                                // pass string from test
                                message = true;
                            }
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return message;
    }

    /**
     * owner Neelam
     */
    public async sortTimeColumnAscendingOrderTroubleshooting(): Promise<boolean> {
        let sorted: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            const unsortedarray = [];
            const sortedarray = [];
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[1]")
                        .getText()
                        .then(async (text: any) => {
                        unsortedarray[i] = text;
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
            await browser.$(locators2.sortTimeDownArrow)
            .click();
            await browser.pause(timeout.slow);
            for (let i = 1; i <= (list.length); i++) {
                await browser.$("//table//tr[" + i + "]//td[1]")
                    .getText()
                    .then(async (text: any) => {
                        sortedarray[i] = text;
                    })
                    .catch((err: any) => {
                        console.warn('checkMessagePaneLog:' + `${err}`);
                    });
        }
            if (await unsortedarray > await sortedarray){
                sorted = true;
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return sorted;
    }
    /**
     * owner Neelam
     */
    public async sortTimeColumnDescendingOrderTroubleshooting(): Promise<boolean> {
        let sorted: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            const unsortedarray = [];
            const sortedarray = [];
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[1]")
                        .getText()
                        .then(async (text: any) => {
                        unsortedarray[i] = text;
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
            await browser.$(locators2.sortTimeDownArrow)
            .click();
            await browser.pause(timeout.slow);
            for (let i = 1; i <= (list.length) - 1; i++) {
                await browser.$("//table//tr[" + i + "]//td[1]")
                    .getText()
                    .then(async (text: any) => {
                        sortedarray[i] = text;
                    })
                    .catch((err: any) => {
                        console.warn('checkMessagePaneLog:' + `${err}`);
                    });
        }
            if (await unsortedarray < await sortedarray){
                sorted = true;
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return sorted;
    }


    /**
     * owner Neelam
     */
    public async checkTimeColumnDescendingSortingTroubleshooting(): Promise<boolean> {
        let sorted: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            const unsortedarray = [];
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[1]")
                        .getText()
                        .then(async (text: any) => {
                        unsortedarray[i] = text;
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
            if (await unsortedarray[1] > await unsortedarray[2]){
                sorted = true;
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return sorted;
    }
    /**
     * owner Neelam
     */
    public async checkAscendingTimeColumnSortingTroubleshooting(): Promise<boolean> {
        let sorted: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            const unsortedarray = [];
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[1]")
                        .getText()
                        .then(async (text: any) => {
                        unsortedarray[i] = text;
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
            if (await unsortedarray[1] < await unsortedarray[2]){
                sorted = true;
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return sorted;
    }
    /**
     * owner Neelam
     */
    public async checkSeverityFiltersTroubleshooting(severityType: string): Promise<boolean> {
        let message: boolean = false;
        await allure.step(`Check for time sorting, or fail if not sorted`, async () => {
            await allure.screenshot(this.app, "Before");
            const list = await browser.$$(locators2.messagepanerows);
            for (let i = 1; i <= (list.length); i++) {
                    await browser.$("//table//tr[" + i + "]//td[2]")
                        .getText()
                        .then(async (text: any) => {
                            if (text.includes(severityType)) {
                                // pass string from test
                                message = true;
                            }
                        })
                        .catch((err: any) => {
                            console.warn('checkMessagePaneLog:' + `${err}`);
                        });
            }
        });
        await allure.screenshot(this.app, " After sorted Check");
        return message;
    }

}
