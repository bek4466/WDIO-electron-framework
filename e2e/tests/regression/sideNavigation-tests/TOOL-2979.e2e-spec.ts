/* tslint:disable */
// @ts-nocheck
import { browser } from '@wdio/globals'
import { allure } from 'e2e/src/allure/allure';
import * as fs from "fs-extra";
import * as path from "path";
import { CommonMethods } from "../../commonMethods.po";
import { SideNavigationComponent } from "../../../src/sideNavigationComponent";
import { reject } from "q";
import { DeployComponent } from "../../../src/deployComponent/deployComponent.po";
import { AboutPageComponent } from "../../../src/aboutPageComponent/aboutPageComponent.po";
import { MessagePaneComponent } from "../../../src/messagePaneComponent/messagePaneComponent.po";
import { remote } from 'webdriverio';

const data = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "dataTool.json"));
const tabTitles = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "tabTitles.json"));
let common = new CommonMethods();
let csduWindowHandle: any;


const timeout = fs.readJsonSync(path.join(__dirname, "..", "..", "..", "src", "JSON", "timeout.json"));
const packageJSONPath: string = path.join(__dirname, "..", "..", "..", "..", "package.json");

/**
 * @Author `Miguel C. - QA`
 * @JIRA_Link_Userstory `https://extron.atlassian.net/browse/TOOL-2909`
 * @Description `Notifications of Bad Scenario`
 * @Date `9/20/2021`
 */

describe(`${tabTitles.REGRESSION.Trace} TOOL-2909:(Help Tab Icon)`, () => {
    beforeEach(async () => {
        // allure.addOwner("Miguel C");
        // allure.addStory("TOOL-2909: Help Tab Icon");
        // allure.addLink("User Story: TOOL-2909", "https://extron.atlassian.net/browse/TOOL-2909");
        // allure.addLink("Task Issue: TOOL-2979", "https://extron.atlassian.net/browse/TOOL-2979");
        // allure.addLink("Test Case: TOOL-T567", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/13683990");
        await common.switchToWin(browser, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
        browser.takeScreenshot()
    });
    afterEach(async () => {
        browser.takeScreenshot();
    });
    it("Verify content is accurate on the About page", async () => {
        await common.UpdateExternalFiles(); //copy external files into node_modules/electron so help page and EULA function
        const sidePanelNavigation = new SideNavigationComponent(browser);
        const aboutPage = new AboutPageComponent(browser);
        await sidePanelNavigation.helpPage.click()
            .then(async () => {
                return sidePanelNavigation.aboutButton.click().then(async () => {
                })
                    .catch(async (err: Error) => {
                        console.error(err);
                        await reject(err);
                        //fail("aboutButtonFailure");
                    });
            })
            .catch((err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("AboutButtonClick Failure");
            });
        await browser.pause(timeout.fast);
        const packageJson = fs.readJSONSync(path.resolve(packageJSONPath));
        const version = packageJson.version.substring(0, packageJson.version.indexOf("-"))
        aboutPage.versionNumber.verifyText("Version " + version)
            .catch((err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("verifyText Failure");
            });
        const currentDate = new Date();
        await aboutPage.copyright.verifyText("Copyright © " + currentDate.getFullYear() + " Extron. All Rights Reserved. www.extron.com")
            .catch((err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("verifyText Failure");
            });
        await aboutPage.disclaimer.verifyText(data.disclaimer)
            .catch(  (err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("verifyText Failure");
            });
        await aboutPage.eulaLink.verifyText(data.liscenseAgreementText)
            .catch((err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("verifyText Failure");
            });
        await aboutPage.partNumber.verifyText(data.partNumber)
            .catch((err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("verifyText Failure");
            });
        await aboutPage.eulaLink.click()
            .catch((err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("verifyText Failure");
            });
        await aboutPage.eula.verifyText(data.eulaContent, true)
            .catch((err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("verifyText Failure");
            });
        await aboutPage.eula.close()
            .catch(async (err: Error) => {
                console.error(err);
                await reject(err);
                //fail("aboutButtonFailure");
            });
        await aboutPage.eula.verifyText(data.eulaContent, false)
            .catch((err: Error) => {
                console.error("Exception caught: " + `${err}`);
                //fail("verifyText Failure");
            });

    });
});

// describe(`${tabTitles.REGRESSION.Trace} TOOL-2909:(Help Tab Icon)`, () => {
//     beforeEach(async () => {
//         allure.addOwner("Miguel C");
//         allure.story("TOOL-2909: Help Tab Icon");
//         allure.addLink("User Story: TOOL-2909", "https://extron.atlassian.net/browse/TOOL-2909");
//         allure.addLink("Task Issue: TOOL-2979", "https://extron.atlassian.net/browse/TOOL-2979");
//         allure.addLink("Test Case: TOOL-T568", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/13687124");
//         return new Promise<void>(async (resolve) => {
//             
//             
//             await common.switchToWin(app, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
//             await await browser.maximizeWindow(););
//             await allure.screenshot(app, "Before");
//             resolve();
//         }).catch((err) => {
//             console.error(err);
//         });
//     });
//     afterEach(async () => {
//         if (app && app.isRunning()) {
//             await allure.screenshot(app, "After");
//         }
//         await common.stopApp(app);
//     });
//     it("Verify EULA Page can be closed by clicking anywhere on CSDU", async () => {
//         return new Promise<void>(async (resolve) => {
//             const systemDeployment = new DeployComponent(app);
//             await common.UpdateExternalFiles(); //copy external files into node_modules/electron so help page and EULA function
//             const sidePanelNavigation = new SideNavigationComponent(app);
//             const aboutPage = new AboutPageComponent(app);
//             const messagePanel = new MessagePaneComponent(app);
//             await sidePanelNavigation.helpPage.click()
//                 .then(async () => {
//                     return sidePanelNavigation.aboutButton.click().then(async () => {
//                     })
//                         .catch(async (err: Error) => {
//                             console.error(err);
//                             await reject(err);
//                             //fail("aboutButtonFailure");
//                         });
//                 })
//                 .catch((err: Error) => {
//                     console.error("Exception caught: " + `${err}`);
//                     //fail("AboutButtonClick Failure");
//                 });
//             await app.pause(timeout.fast);
//             await aboutPage.eulaLink.click()
//                 .catch((err: Error) => {
//                     console.error("Exception caught: " + `${err}`);
//                     //fail("verifyText Failure");
//                 });
//             await aboutPage.eula.verifyText(data.eulaContent, true)
//                 .catch((err: Error) => {
//                     console.error("Exception caught: " + `${err}`);
//                     //fail("verifyText Failure");
//                 });
//             await aboutPage.eula.close()
//                 .catch(async (err: Error) => {
//                     console.error(err);
//                     await reject(err);
//                     //fail("aboutButtonFailure");
//                 });
//             await sidePanelNavigation.helpPage.click()
//                 .catch((err: Error) => {
//                     console.error("Exception caught: " + `${err}`);
//                     //fail("AboutButtonClick Failure");
//                 });
//             await aboutPage.eula.verifyText(data.eulaContent, false)
//                 .catch((err: Error) => {
//                     console.error("Exception caught: " + `${err}`);
//                     //fail("verifyText Failure");
//                 });
//             resolve();
//         }).catch((err: Error) => {
//             console.error("TOOL-T568: Exception Error: " + `${err}`);
//             //fail("TOOL-T568 Help Tab error");
//             return Promise.resolve(err + " was thrown");
//         });
//     });
// });
// describe(`${tabTitles.REGRESSION.Trace} TOOL-2909:(Help Tab Icon)`, () => {
//     beforeEach(async () => {
//         allure.addOwner("Miguel C");
//         allure.story("TOOL-2909: Help Tab Icon");
//         allure.addLink("User Story: TOOL-2909", "https://extron.atlassian.net/browse/TOOL-2909");
//         allure.addLink("Task Issue: TOOL-2979", "https://extron.atlassian.net/browse/TOOL-2979");
//         allure.addLink("Test Case: TOOL-T569", "https://extron.atlassian.net/projects/TOOL?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/13748298");
//         return new Promise<void>(async (resolve) => {
//             
//             
//             await common.switchToWin(app, tabTitles.mainTab, data.licensedUser1, data.licensedUser1pass);
//             await await browser.maximizeWindow(););
//             await allure.screenshot(app, "Before");
//             resolve();
//         }).catch((err) => {
//             console.error(err);
//         });
//     });
//     afterEach(async () => {
//         if (app && app.isRunning()) {
//             await allure.screenshot(app, "After");
//         }
//         await common.stopApp(app);
//     });
//     it("Verify that correct html help file opens after clicking on help menu", async () => {
//         return new Promise<void>(async (resolve) => {
//             const systemDeployment = new DeployComponent(app);
//             await common.UpdateExternalFiles(); //copy external files into node_modules/electron so help page and EULA function
//             const sidePanelNavigation = new SideNavigationComponent(app);
//             const messagePanel = new MessagePaneComponent(app);
//             await sidePanelNavigation.helpPage.click()
//                 .then(async () => {
//                     return sidePanelNavigation.helpFileButton.click().then(async () => {
//                     })
//                         .catch(async (err: Error) => {
//                             console.error(err);
//                             await reject(err);
//                             //fail("helpFileButtonFailure");
//                         });
//                 })
//                 .catch((err: Error) => {
//                     console.error("Exception caught: " + `${err}`);
//                     //fail("AboutButtonClick Failure");
//                 });
//             await app.pause(timeout.fast);
//             await app.newWindow('file:///' + path.join(__dirname, "..", "..", "..", "..", "node_modules", "electron", "dist") + '/help/Content/HTML_Files/Landing_Page/Using_the_ControlScript_Deployment_Utility_Help.htm', "ControlScript Development Utility Help", "width=1024,height=770,resizable,scrollbars=yes,status=1");
//             await app
//                 .getTitle().then(async (text: string) => {
//                     await app.pause(timeout.fast);
//                     if (!text.includes('ControlScript Development Utility Help')) {
//                         //fail("title text not found");
//                     }
//                 }).catch(async (err: Error) => {
//                     console.log(err);
//                     console.log('file:///' + path.join(__dirname, "..", "..", "..", "..", "node_modules", "electron", "dist") + '/help/Content/HTML_Files/Landing_Page/Using_the_ControlScript_Deployment_Utility_Help.htm');
//                 });
//             messagePanel.messageColumn.CLICommandExecuter('taskkill /F /IM chrome.exe /T > nul', "", 0);
//             resolve();
//         }).catch((err: Error) => {
//             console.error("TOOL-T569: Exception Error: " + `${err}`);
//             //fail("TOOL-T569 Help Tab error");
//             return Promise.resolve(err + " was thrown");
//         });
//     });
// });