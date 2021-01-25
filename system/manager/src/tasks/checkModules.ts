import { downloader, TPackage } from '@cromwell/cromwella';

// If cms launched for the first time, we need to download bundled modules
export const checkModules = async (isDevelopment?: boolean, pckgs?: TPackage[]) => {
    if (!pckgs) {
        await downloader(process.cwd());
    }
    if (pckgs) {
        await downloader(process.cwd(), pckgs);
    }
}