import { TThemeConfig, TPagesMetaInfo } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve, isAbsolute } from 'path';
import normalizePath from 'normalize-path';

import { getMetaInfoPath, getThemePagesMetaPath, defaultDistDirName } from './paths';

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
export const readThemeExports = async (projectRootDir: string | null, themeName: string, themeAbsDir?: string): Promise<TThemeExportsInfo> => {
    if (!projectRootDir && !themeAbsDir) throw new Error('readThemeExports: !projectRootDir && !themeAbsDir');

    const themeDir = (themeAbsDir ? themeAbsDir : resolve(projectRootDir!, 'themes', themeName)).replace(/\\/g, '/');

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

    const exportsInfo: TThemeExportsInfo = {
        pagesInfo: []
    }

    let buildDir = themeConfig?.main?.buildDir ?? resolve(themeDir, defaultDistDirName);
    if (!isAbsolute(buildDir)) buildDir = resolve(themeDir, buildDir)
    const metainfoPath = getThemePagesMetaPath(buildDir);

    if (await fs.pathExists(metainfoPath)) {
        const pagesMeta: TPagesMetaInfo = await fs.readJSON(metainfoPath);

        if (!pagesMeta || !pagesMeta.paths) throw new Error('Could not find or read pages meta info file at: ' + metainfoPath);


        for (const pagePaths of pagesMeta.paths) {
            // if (!/\.(m?jsx?|tsx?)$/.test(p)) continue;
            if (!pagePaths.localPath) continue;

            const fullPath = normalizePath(resolve(buildDir, pagePaths.localPath));
            if (!(await fs.pathExists(fullPath))) continue;

            const name = pagePaths.pageName;
            const compName = `Theme_${themeName.replace(/\W/g, '_')}_Page_${name.replace(/\W/g, '_')}_${getRandStr()}`;

            let metaInfoPath: string | undefined = normalizePath(getMetaInfoPath(fullPath));
            if (!metaInfoPath || !(await fs.pathExists(metaInfoPath))) metaInfoPath = undefined;

            let fileContent: string | undefined = undefined;
            // if (pageName === '_app' || pageName === '_document') {
            //     fileContent = fs.readFileSync(pagePath).toString();
            //     pagePath = undefined;
            // }

            exportsInfo.pagesInfo.push({
                name,
                path: fullPath,
                compName,
                fileContent,
                metaInfoPath
            })
        };
    } else {
        throw new Error('Could not find or read pages meta info file at: ' + metainfoPath);
    }

    const adminPanelConfigDir = themeConfig?.main?.adminPanelDir;
    if (adminPanelConfigDir) {
        const adminPanelDir = resolve(themeDir, adminPanelConfigDir);
        if (await fs.pathExists(adminPanelDir)) {
            exportsInfo.adminPanelPath = adminPanelDir.replace(/\\/g, '/');
        }
    }

    return exportsInfo;
}