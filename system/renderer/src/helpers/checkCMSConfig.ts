import { getStoreItem, setStoreItem, TCmsConfig, isServer } from "@cromwell/core";

export const checkCMSConfig = (cmsConfig: TCmsConfig): void => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.themeName) {
        setStoreItem('cmsconfig', cmsConfig);

        // setStoreItem('importPlugin', importPlugin as any);
        // setStoreItem('importDynamicPlugin', importDynamicPlugin as any);
    }
}