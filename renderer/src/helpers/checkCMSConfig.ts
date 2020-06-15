import { getStoreItem, setStoreItem } from "@cromwell/core";
import { importCMSConfig, importModule, importDynamicModule } from '.cromwell/imports/gen.imports';
export const checkCMSConfig = (): void => {
    const cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.templateName) {
        setStoreItem('cmsconfig', importCMSConfig());

        setStoreItem('importModule', importModule as any);
        setStoreItem('importDynamicModule', importDynamicModule as any);
    }
}