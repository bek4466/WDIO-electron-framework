/* tslint:disable */
// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";


import { allure } from "../../src/allure/allure";
import { CommonMethods } from "../commonMethods.po";
import { DeployComponent } from '../../src/deployComponent/deployComponent.po';
import { SideNavigationComponent } from '../../src/sideNavigationComponent/sideNaveComponent.po';
import { TraceComponent } from '../../src/traceComponent';
import { MessagePaneComponent } from '../../src/messagePaneComponent/messagePaneComponent.po';
import { LogClient } from '@extron/winston-logger';
import { CredsComponent } from '../../src/credentialsComponent/credentialsComponent.po';
import { StartStopProgramComponent } from '../../src/startStopProgramComponent/startStopProgram.po';
import { ProgramLogComponent } from '../../src/programLogComponent/programLog.po';
import { LoginComponent } from '../../src/accessControlComponent/loginComponent.po';
const logClient = new LogClient("e2e:SMOKE TEST");
let app: WebdriverIO.Browser;
let common = new CommonMethods();
const data = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "tabTitles.json"));
const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "src", "JSON", "timeout.json"));
/**
	* @Author `Oybek.T-Eng`
	* @Description `LOGIN SETUP`
	* @Date `02/20/2020`
*/

describe(`${tabTitles.REGRESSION.Login} LOGIN`, ()=> {
    beforeEach(async () => {
        allure.addOwner("Oybek T");
        allure.story("Setup Spec for all other Tests");
        return new Promise<void>(async (resolve) => {
            
            
            await common.switchToWindow2(app, tabTitles.mainTab);
            await app.browserWindow.setFullScreen(false);
            await allure.screenshot(app, "Before");
            resolve();
        }).catch((err) => {
            logClient.error(err);
        });
    });

    afterEach(async () => {
        if (app && app.isRunning()) {
            await allure.screenshot(app, "After");
        }
        await common.stopApp(app);
    });

it("LOGIN", async () =>{
    await app.client.pause(timeout.medium);
    const login = new LoginComponent(app);
    await login.logoutBtn.loginApp().then(async (value)=>{
        await expect(value).toEqual(true);
    }).catch((err: Error)=>{
        logClient.warn(`${err}`);
    });
});

});
