import { getStoreItem, setStoreItem } from "@cromwell/core";
//@ts-ignore
import { importCMSConfig, importPlugin, importDynamicPlugin } from 'imports/imports.gen';
export const checkCMSConfig = (): void => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.themeName) {
        setStoreItem('cmsconfig', importCMSConfig());

        setStoreItem('importPlugin', importPlugin as any);
        setStoreItem('importDynamicPlugin', importDynamicPlugin as any);
    }
}