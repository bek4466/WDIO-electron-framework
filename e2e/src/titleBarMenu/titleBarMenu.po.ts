/* tslint:disable */
import * as fs from "fs-extra";
import * as path from "path";
import { Element } from "../lib/element";
import { CloseButton, MaximizeButton, MinimizeButton,TitleBar } from '../titlebarComponent';
const locators = fs.readJsonSync(path.join(__dirname, "..", "JSON", "locators.json"));

export class TitleBarMenu extends Element {
    private static rootTitleBarElem: string = locators.titleBar;
    private static minimizeButtonElem: string = locators.minimizeBtn;
    private static maximizeButtonElem: string = locators.maximizeBtn;
    private static closeButtonElem: string = locators.closeBtnText;

    public minimizeButton: MinimizeButton;
    public maximizeButton: MaximizeButton;
    public closeButton: CloseButton;
    public titleBar: TitleBar;

    constructor(browser: WebdriverIO.Browser, selector: string = "") {
        super(browser, selector);
        this.minimizeButton = new MinimizeButton(browser, TitleBarMenu.minimizeButtonElem);
        this.maximizeButton = new MaximizeButton(browser, TitleBarMenu.maximizeButtonElem);
        this.closeButton = new CloseButton(browser, selector, TitleBarMenu.closeButtonElem);
        this.titleBar = new TitleBar(browser, TitleBarMenu.rootTitleBarElem);
    };
};
