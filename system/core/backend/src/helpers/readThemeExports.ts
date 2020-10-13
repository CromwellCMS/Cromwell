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
    metaInfoPath?: string;
}

const getRandStr = () => Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);

/**
 * Returns object with page names as keys paths as values: {"pageName": "pagePath"}
 * @param projectRootDir absolute path to the root of the CMS
 */
export const readThemeExports = async (projectRootDir: string, themeName: string): Promise<TThemeExportsInfo> => {
    const themesDir = resolve(projectRootDir, 'themes').replace(/\\/g, '/');
    const themeDir = `${themesDir}/${themeName}`;

    const themeConfigPath = `${themeDir}/cromwell.config.js`;
    let themeConfig: TThemeConfig | undefined = undefined;
    try {
        themeConfig = require(themeConfigPath);
    } catch (e) {
        console.log('core/backend::readThemeExports ', e);
    }
    if (!themeConfig) {
        console.log('core/backend::readThemeExports cannot read Theme config at: ' + themeConfigPath);
    }

    const pagesPath = (themeConfig && themeConfig.main && themeConfig.main.pagesDir) ?
        resolve(themeDir, themeConfig.main.pagesDir).replace(/\\/g, '/') :
        `${themeDir}/pages`;

    const exportsInfo: TThemeExportsInfo = {
        pagesInfo: []
    }

    if (fs.existsSync(pagesPath)) {
        const files: string[] = await readRecursive(pagesPath);
        files.forEach(p => {
            if (!/\.(m?jsx?|tsx?)$/.test(p)) return;

            let path: string | undefined = p.replace(/\\/g, '/');
            const name = path.replace(/\.js$/, '').replace(`${pagesPath}/`, '');
            const compName = `Theme_${themeName.replace(/\W/g, '_')}_Page_${name.replace(/\W/g, '_')}_${getRandStr()}`;

            let metaInfoPath: string | undefined = path + '_meta.json';
            if (!fs.existsSync(metaInfoPath)) metaInfoPath = undefined;

            let fileContent: string | undefined = undefined;
            // if (pageName === '_app' || pageName === '_document') {
            //     fileContent = fs.readFileSync(pagePath).toString();
            //     pagePath = undefined;
            // }

            exportsInfo.pagesInfo.push({
                name,
                path,
                compName,
                fileContent,
                metaInfoPath
            })
        });
    }

    const adminPanelConfigDir = themeConfig?.main?.adminPanelDir;
    if (adminPanelConfigDir) {
        const adminPanelDir = resolve(themeDir, adminPanelConfigDir);
        if (fs.existsSync(adminPanelDir)) {
            exportsInfo.adminPanelPath = adminPanelDir.replace(/\\/g, '/');
        }
    }

    return exportsInfo;
}