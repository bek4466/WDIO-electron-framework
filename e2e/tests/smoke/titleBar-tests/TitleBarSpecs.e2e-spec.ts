/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../../src/allure/allure";
import { CommonMethods } from "../../commonMethods.po";
import { TitleBarMenu } from '../../../src/titleBarMenu/titleBarMenu.po';
let app: WebdriverIO.Browser;
let common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname,"..", "..", "..", "src", "JSON", "tabTitles.json"));

xdescribe(`${tabTitles.SMOKE} TOOL-03:(Title Bar: Suite)`, () => {
    beforeEach(async () => {
        allure.addOwner("Oybek T");
        allure.story("TOOL-03");
        allure.addLink("User Story: TOOL-03", "https://extron.atlassian.net/browse/TOOL-3");
        allure.addLink("Task Issue: TOOL-97","https://extron.atlassian.net/browse/TOOL-97");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWin(app, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
            await allure.screenshot(app, "Before");
           resolve();
       }).catch((err) => {
           console.log(err);
       });
    });

    afterEach(async ()=> {
        if (app && app.isRunning()) {
            await allure.screenshot(app, "After");
        }
        await common.stopApp(app);
    });

    it('Tool-8: Minimize Button', async () =>{
        return new Promise<void>(async (resolve) => {
        const titleBar = new TitleBarMenu(app);
        await titleBar.minimizeButton.getText().then(async (text)=>{
            await expect(text).toEqual(data.minimizeBtnText);
            await titleBar.minimizeButton.click();
        });
        resolve();
        }).catch((err) => {
            console.log("TOOL-03: Exception Error: " + `${err}`);
            return Promise.resolve(err +'Should have thrown');
        });
    });

    it('Tool-9: Maximize Button', async () =>{
        return new Promise<void>(async (resolve) => {
        const titleBar = new TitleBarMenu(app);
        await titleBar.maximizeButton.getText().then(async (text)=>{
            expect(text).toEqual(data.maximizeBtnText);
            await titleBar.maximizeButton.click();
        });
        resolve();
        }).catch((err) => {
            console.log("TOOL-03: Exception Error: " + `${err}`);
            return Promise.resolve(err +'Should have thrown');
        });
    });

    it('TOOl-10: Close Button', async () =>{
        return new Promise<void>(async (resolve) => {
        const titleBar = new TitleBarMenu(app);
        expect(await titleBar.closeButton.exists())
            .toBe(true);

        titleBar.closeButton.getAttribute("[id='closeBtn']", "ng-reflect-message").then(async (text)=>{
            await expect(text).toEqual(data.closeBtnText);
        });
        await titleBar.closeButton.click();
        resolve();
        }).catch((err) => {
            console.log("TOOL-03: Exception Error: " + `${err}`);
            return Promise.resolve(err +'Should have thrown');
        });
    });

    xit("Debug REPL", async () =>{
        debugger;
        await app.client.debug();
    });

});
