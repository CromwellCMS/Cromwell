import { getStoreItem, setStoreItem, TCmsConfig, isServer } from "@cromwell/core";
import fs from 'fs';
import requireFromString from "require-from-string";

export const checkCMSConfig = (cmsConfig: TCmsConfig): void => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.themeName) {
        setStoreItem('cmsconfig', cmsConfig);
    }
}

export const fsRequire = (path: string, json?: boolean) => {
    if (!isServer()) return undefined;

    if (fs.existsSync(path)) {
        const str = fs.readFileSync(path).toString();
        if (json) return JSON.parse(str);
        return requireFromString(str);
    }
}