

import { MatButton } from "../matButton";


export class DeployPage extends MatButton{
    constructor(app: WebdriverIO.Browser, selector: string) {
        super(app, selector, "Side Nav to Deploy Page");
    }

    public async click(): Promise<void> {
        await super.click();
    }
}
