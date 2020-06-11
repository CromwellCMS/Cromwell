import { getStoreItem, setStoreItem } from "@cromwell/core";
import { importCMSConfig } from '../../.cromwell/gen.imports';
export const checkCMSConfig = (): void => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.templateName) {
        setStoreItem('cmsconfig', importCMSConfig());
    }
}