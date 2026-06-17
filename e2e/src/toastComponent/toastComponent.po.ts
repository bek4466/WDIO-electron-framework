/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
// import { Application } from 'spectron';
import { Toast } from '../toast/toast.po';
import { Element } from "../lib/element";
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));
const toastLocators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "toastLocators.json"));

/**
	* @Author `Oybek.T-Eng`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-46`
    * @LinkToJIRA `https://extron.atlassian.net/browse/CSP-25`
	* @Description `Trace Component`
	* @Date `10/01/2019`
*/


export class ToastComponent extends Element {
    private static rootContainerElem = toastLocators.rootContainer;
    private static titleElem = toastLocators.toastTitle;
    private static iconElem = toastLocators.toastIcon;
    private static linkElem = toastLocators.toastLink;
    private static textElem = toastLocators.toastText;

    public rootContainer: Toast;
    public toastTitle: Toast;
    public toastIcon: Toast;
    public toastLink: Toast;
    public toastText: Toast;

    constructor(app: WebdriverIO.Browser, selector: string= "") {
        super(app, selector);
        this.rootContainer = new Toast(this.app, ToastComponent.rootContainerElem);
        this.toastTitle = new Toast(this.app, ToastComponent.titleElem);
        this.toastIcon = new Toast(this.app, ToastComponent.iconElem);
        this.toastLink = new Toast(this.app, ToastComponent.linkElem);
        this.toastText = new Toast(this.app, ToastComponent.textElem)
    }
}