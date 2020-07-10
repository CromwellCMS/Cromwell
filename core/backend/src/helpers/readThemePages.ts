import { CMSconfigType } from '@cromwell/core';
import crypto from 'crypto';
import fs from 'fs-extra';
import { resolve } from 'path';
import readRecursive from 'recursive-readdir';


type TPageInfo = {
    pagePath?: string;
    pageComponentName?: string;
    fileContent?: string;
}
/**
 * Returns object with page names as keys paths as values: {"pageName": "pagePath"}
 * @param projectRootDir absolute path to the root of the CMS
 */
export const readThemePages = async (projectRootDir: string): Promise<Record<string, TPageInfo>> => {
    const configPath = resolve(projectRootDir, 'cmsconfig.json');

    let config: CMSconfigType | undefined = undefined;
    try {
        config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('renderer::server ', e);
    }
    if (!config) throw new Error('core/backend::readThemePages cannot read CMS config');

    const themesDir = resolve(projectRootDir, 'themes').replace(/\\/g, '/');
    const themeDir = `${themesDir}/${config.themeName}`;
    const themeImportsDir = `${themeDir}/es`;
    const pagesPath = `${themeImportsDir}/pages`;
    const customPages: Record<string, TPageInfo> = {};

    if (fs.existsSync(pagesPath)) {
        const files: string[] = await readRecursive(pagesPath);
        files.forEach(p => {
            let pagePath: string | undefined = p.replace(/\\/g, '/');
            const pageName = pagePath.replace(/\.js$/, '').replace(`${pagesPath}/`, '');
            const pageComponentName = pageName.replace(/\W/g, '_') + '_' + crypto.randomBytes(6).toString('hex');

            let fileContent: string | undefined = undefined;
            if (pageName === '_app' || pageName === '_document') {
                fileContent = fs.readFileSync(pagePath).toString();
                pagePath = undefined;
            }

            customPages[pageName] = {
                pagePath,
                pageComponentName,
                fileContent
            }
        });
    }

    return customPages;
}