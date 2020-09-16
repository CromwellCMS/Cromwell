import { TCmsConfig, TThemeConfig } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve } from 'path';
import readRecursive from 'recursive-readdir';

export type TThemeExportsInfo = {
    pagesInfo: TPagePathInfo[]
    adminPanelPath?: string;
}
export type TPagePathInfo = {
    name: string;
    path: string;
    compName?: string;
    fileContent?: string;
}

const getRandStr = () => Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);

/**
 * Returns object with page names as keys paths as values: {"pageName": "pagePath"}
 * @param projectRootDir absolute path to the root of the CMS
 */
export const readThemeExports = async (projectRootDir: string, themeName: string): Promise<TThemeExportsInfo> => {
    const themesDir = resolve(projectRootDir, 'themes').replace(/\\/g, '/');
    const themeDir = `${themesDir}/${themeName}`;

    const themeConfigPath = `${themeDir}/cromwell.config.json`;
    let themeConfig: TThemeConfig | undefined = undefined;
    try {
        themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('core/backend::readThemeExports ', e);
    }
    if (!themeConfig) {
        console.log('core/backend::readThemeExports cannot read Theme config - cromwell.config.json')
    }

    const pagesPath = (themeConfig && themeConfig.appConfig && themeConfig.appConfig.pagesDir) ?
        resolve(themeDir, themeConfig.appConfig.pagesDir).replace(/\\/g, '/') :
        `${themeDir}/pages`;

    const exportsInfo: TThemeExportsInfo = {
        pagesInfo: []
    }

    if (fs.existsSync(pagesPath)) {
        const files: string[] = await readRecursive(pagesPath);
        files.forEach(p => {
            let path: string | undefined = p.replace(/\\/g, '/');
            const name = path.replace(/\.js$/, '').replace(`${pagesPath}/`, '');
            const compName = `Theme_${themeName.replace(/\W/g, '_')}_Page_${name.replace(/\W/g, '_')}_${getRandStr()}`;

            let fileContent: string | undefined = undefined;
            // if (pageName === '_app' || pageName === '_document') {
            //     fileContent = fs.readFileSync(pagePath).toString();
            //     pagePath = undefined;
            // }

            exportsInfo.pagesInfo.push({
                name,
                path,
                compName,
                fileContent
            })
        });
    }

    const adminPanelConfigDir = themeConfig?.appConfig?.adminPanelDir;
    if (adminPanelConfigDir) {
        const adminPanelDir = resolve(themeDir, adminPanelConfigDir);
        if (fs.existsSync(adminPanelDir)) {
            exportsInfo.adminPanelPath = adminPanelDir.replace(/\\/g, '/');
        }
    }

    return exportsInfo;
}