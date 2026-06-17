// @ts-nocheck
import { CommunicationClient } from "@extron/communication";
import { EAuthType, EProtocol, IConnectionInfo } from "@extron/communication/release/index";
import { GetBoxID } from "@extron/communication/release/lib/models/globalMessages/getBoxID";
import { GetPortExpPrimaryAddressList } from "@extron/communication/release/lib/models/globalMessages/getPortExpPrimaryAddressList";
import { delay } from "q";

export class GmObject {

    public primarydevice: IConnectionInfo;
    public secondarydevice: IConnectionInfo;
    public connectObject: IConnectionInfo;
    constructor(ipaddress: string) {
        this.connectObject = {
            auth_type: EAuthType.GENERIC,
            ip: ipaddress,
            password: "extron",
            port: 4503,
            protocol: EProtocol.GM,
            tunnel: false,
            username: "admin",
        };
    }

    public async CreatePrimaryGMObject(ipaddress: string): Promise<void> {
        this.primarydevice = {
            auth_type: EAuthType.GENERIC,
            ip: ipaddress,
            password: "extron",
            port: 4503,
            protocol: EProtocol.GM,
            tunnel: false,
            username: "admin",
        };
    }

    public async CreateSecondaryGMObject(ipaddress: string): Promise<void> {
        console.log("This is the secondary IP address" + ipaddress);
        this.secondarydevice = {
            auth_type: EAuthType.GENERIC,
            ip: ipaddress,
            password: "extron",
            port: 4503,
            protocol: EProtocol.GM,
            tunnel: false,
            username: "admin",
        };
    }

    public async ConnectPrimaryDevice(ipaddress: string, systemid?: string): Promise<string> {
        const comClient = new CommunicationClient();
        let device: string;
        console.log("Beforep: " + new Date().toString());
        // Sleep thread for 3 seconds
        console.log("Afterp:  " + new Date().toString());
        console.log("Now connecting" + JSON.stringify(this.connectObject));
        const ipcp255: IConnectionInfo = {
            auth_type: EAuthType.GENERIC,
            ip: ipaddress,
            password: "extron",
            port: 4503,
            protocol: EProtocol.GM,
            tunnel: false,
            username: "admin",
        };
        await this.delay(15000);
        const responsestring = await comClient.connectSession(ipcp255)
            .then(async (result) => {
                console.log("This is the result " + result);
                device = result;
                const response = await comClient.sendGlobalMessage(device, new GetBoxID());
                console.log("In class ============== " + JSON.stringify(response));
                await comClient.disconnectSession(device);
                console.log("This is the system id " + response.systemid.toString());
                if(response.systemid.toString() != systemid) console.log(`PRIMARY SYSTEM ID FAILURE: responseID(${response.systemid.toString()}) === primaryControllerSysID(${systemid})`)
                await expect(response.systemid.toString())
                    .toBe(systemid);
                return response.systemid.toString();
            })
            .catch((err: Error) => {
                console.log("This is reason for failure" + err.stack);
            })
            .catch((err: Error) => {
                console.log("This is reason for failure" + err.stack);
            });
        console.log("This is the response string " + responsestring);
        return responsestring;
    }

    public async ConnectDevice(expectedresult: string): Promise<void> {
        const comClients = new CommunicationClient();
        let device: string;
        // Sleep thread for 3 seconds
        await this.delay(10000);
        await comClients.connectSession(this.connectObject)
            .then(async (result) => {
                device = result;
                const response = await comClients.sendGlobalMessage(device, new GetBoxID());
                if(response.systemid.toString() != expectedresult) console.log(`PAIRING FAILURE: responseID(${response.systemid.toString()}) === primaryControllerSysID(${expectedresult})`)
                await expect(response.systemid.toString())
                    .toEqual(expectedresult);
                await comClients.disconnectSession(device);
            })
            .catch((err: Error) => {
            });
    }

    public async ConnectNAVDevice(expectedresult: string): Promise<void> {
        const comClients = new CommunicationClient();
        let device: string;
        // Sleep thread for 3 seconds
        await this.delay(10000);
        await comClients.connectSession(this.connectObject)
            .then(async (result) => {
                const response = await comClients.sendGlobalMessage(result, new GetPortExpPrimaryAddressList());
                const deviceStringArray = JSON.stringify(response);
                const obj = JSON.parse(deviceStringArray);
                let systemidMatched = false;
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < obj.length; i++) {
                    // tslint:disable-next-line:triple-equals
                    if (obj[i].system_id === Number(expectedresult)) {
                        systemidMatched = true;
                    }
                }
                if(systemidMatched == false) console.log(`PAIRING FAILURE: primaryControllerSysID(${expectedresult}) not found in NAV Device.`)

                await expect(systemidMatched)
                    .toBe(true);
                await comClients.disconnectSession(result);
            })
            .catch((err: Error) => {
            });
    }
    // await comClient.connectSession(nav)
    // .then(async (result) => {
    //     Nav = await result;
    //     const response = await comClient.sendGlobalMessage(Nav, new GetPortExpPrimaryAddressList());
    //     const deviceStringArray = JSON.stringify(response);
    //     const obj = JSON.parse(deviceStringArray);
    //     let systemidMatched = false;
    //     // tslint:disable-next-line:prefer-for-of
    //     for (let i = 0; i < obj.length; i++) {
    //         // tslint:disable-next-line:triple-equals
    //         if (obj[i].system_id === Number(sysID)) {
    //             systemidMatched = true;

    //         }
    //     }
    //     await expect(systemidMatched)
    //         .toBe(true);
    //     await comClient.disconnectSession(Nav);
    // })
    // .catch((err: Error) => {
    //     fail("System number match fail");
    // });

    // tslint:disable-next-line:typedef
    private delay(ms: number){
    // tslint:disable-next-line:arrow-parens
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}
}
