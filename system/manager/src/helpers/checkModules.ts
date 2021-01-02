import { getBundledModulesDir, installer } from '@cromwell/cromwella';
import fs from 'fs-extra';

// If cms launched for the first time, we need to download bundled modules
export const checkModules = async (isDevelopment?: boolean) => {
    if (!(await fs.pathExists(getBundledModulesDir()))) {
        console.log('installerinstallerinstaller')
        await installer(process.cwd(), isDevelopment ? 'development' : 'production', !isDevelopment, false);
    }
}