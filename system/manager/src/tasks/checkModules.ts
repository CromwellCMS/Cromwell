import { downloader, TPackage } from '@cromwell/utils';

// If cms launched for the first time, we need to download bundled modules
export const checkModules = async (isDevelopment?: boolean, pckgs?: TPackage[]) => {
    if (!pckgs) {
        await downloader();
    }
    if (pckgs) {
        await downloader({ packages: pckgs });
    }
}