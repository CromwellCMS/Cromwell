import { getBundledModulesDir, downloader, TPackage } from '@cromwell/cromwella';
import fs from 'fs-extra';

// If cms launched for the first time, we need to download bundled modules
export const checkModules = async (isDevelopment?: boolean, pckgs?: TPackage[]) => {
    if (!pckgs && !(await fs.pathExists(getBundledModulesDir()))) {
        await downloader(process.cwd());
    }
    if (pckgs) {
        await downloader(process.cwd(), pckgs);
    }
}