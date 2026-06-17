/* tslint:disable */
import { MatButton } from '../matButton';
import { TraceComponent } from '../traceComponent/traceComponent.po';

export class IpAddressField extends MatButton {
public _devices: TraceComponent[] = [];
constructor(app: WebdriverIO.Browser, selector: string) {
    super(app, selector, "IpAddressField");
}

public async click(): Promise<void> {
    await super.click();
    }
}
