// @ts-nocheck
import * as fs from "fs-extra";
import * as path from "path";

export class Jsonparser {

    public jsonobject: any;
    constructor() {
    }

    public async setVrealalue(object: any, robjpath: any, value: any): Promise<any> {
        const objpath = robjpath.replace(/[\\[]/gm, ".")
            .replace(/[\]]/gm, " "); // to accept [index]
        const keys = objpath.split(".");
        const last = keys.pop();
        keys.reduce((o: any, k: any): object => o[k] = o[k] || {}, object)[last] = value;
        return object;
    }

    public async GetData(jsonobj: any, jsonkey: any): Promise<any> {
        let modjsonkey = jsonkey;
        let modjsonobj = jsonobj;
        modjsonkey = modjsonkey.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
        modjsonkey = modjsonkey.replace(/^\./, "");           // strip a leading dot
        const a = modjsonkey.split(".");
        for (let i = 0, n = a.length; i < n; ++i) {
            const k = a[i];
            if (k in modjsonobj) {
                modjsonobj = modjsonobj[k];
            } else {
                return;
            }
        }
        return modjsonobj;
    }

    public async set(setpath: any, key: any, value: any): Promise<any> {
        const obj = {};
        let schema = await obj;  // a moving reference to internal objects within obj
        const pList = await key.split(".");
        const len = await pList.length;
        for (let i = 0; i < len - 1; i++) {
            const elem = pList[i];
            if (!schema[elem]) schema[elem] = {};
            schema = await schema[elem];
        }
        schema[pList[len - 1]] = await value;
        return obj;
    }

    public async setValue(jsonobj: any, access: any, value: string): Promise<any> {
        let objaccess = access;
        if (typeof (objaccess) === "string") {
            objaccess = await access.split(".");
        }
        if (objaccess.length > 1) {
            await this.setValue(jsonobj[objaccess.shift()], objaccess, value);
        } else {
            if(typeof access === 'string') {
                jsonobj[access] = await value;
            }

            jsonobj[access[0]] = await value;
        }
        return jsonobj;

    }

    public async deleteKey(obj: any, jsonpath: string): Promise<any> {
        const ReturnObj = await JSON.parse(JSON.stringify(obj));
        const keys = await jsonpath.split(".");
        keys.reduce((acc, key, index) => {
            if (index === keys.length - 1) {
                if (Array.isArray(acc)) {
                    acc.splice(Number(key), 1);
                } else {
                    delete acc[key];
                }
                return true;
            }
            return acc[key];
        }, ReturnObj);
        return ReturnObj;
    }

    public async CreateTempFile(fileobj: any): Promise<any> {
        let tempobj: any;
        try {
            fs.writeJsonSync(path.join(__dirname, fileobj, "temp.json"), fileobj);
        } catch (Exception) {
            throw new Error("Error Creating Temp Data File");
        }
        try {

            tempobj = fs.readJsonSync(path.join(__dirname, fileobj, "temp.json"));
        } catch (Exception) {
            throw new Error("Error returning the Data file");
        }

        return tempobj;
    }

    public async ProcessJson(sysinfoobj: object, jsonarr: object): Promise<any> {
        let modobject = sysinfoobj;
        // tslint:disable-next-line:forin
        for (const key in jsonarr) {
            if (jsonarr.hasOwnProperty(key)) {
                if (key === "DeleteData") {
                    for (var i = 0; i < jsonarr[key].length; i++) {
                        var mystring = jsonarr[key][i];
                        modobject = await this.deleteKey(modobject, mystring);
                    }
                }
                if (key === "GetData") {
                    const mystring = await jsonarr[key].toString();
                    const keywithme = await this.GetData(modobject, mystring);
                }
                if (typeof (jsonarr[key]) === "object") {
                    if (key === "ModifyTestData") {
                        for (const innerkey in jsonarr[key]) {
                            if (jsonarr[key].hasOwnProperty(innerkey)) {
                                modobject = await this.setValue(modobject, innerkey, jsonarr[key][innerkey]);
                            }
                        }
                    }
                    if (key === "InsertTestData") {
                        for (const innerkey in jsonarr[key]) {
                            if (jsonarr[key].hasOwnProperty(innerkey)) {
                                modobject = await this.setVrealalue(modobject, innerkey, jsonarr[key][innerkey]);
                            }
                        }
                    }
                    if (key === "DeleteData") {
                        for (const innerkey in jsonarr[key]) {
                            if (jsonarr[key].hasOwnProperty(innerkey)) {
                                modobject = await this.setVrealalue(modobject, innerkey, jsonarr[key][innerkey]);
                            }
                        }
                    }
                } else {
                }
            }
        }
        return modobject;
    }

}
