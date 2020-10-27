import { TThemeConfig, TPagesMetaInfo } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve, isAbsolute } from 'path';
import normalizePath from 'normalize-path';
import decache from 'decache';

import { getMetaInfoPath, getThemePagesMetaPath, buildDirName } from './paths';

export type TThemeExportsInfo = {
    pagesInfo: TPagePathInfo[]
    adminPanelPath?: string;
    themeDir: string;
    themeBuildDir: string;
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

    const buildDir = resolve(themeDir, buildDirName);
    const metainfoPath = getThemePagesMetaPath(buildDir);

    const exportsInfo: TThemeExportsInfo = {
        pagesInfo: [],
        themeDir,
        themeBuildDir: buildDir
    }

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
            if (pagePaths.pageName === '_app' || pagePaths.pageName === '_document') {
                fileContent = (await fs.readFile(fullPath)).toString();
            }

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

    // const adminPanelConfigDir = themeConfig?.main?.adminPanelDir;
    // if (adminPanelConfigDir) {
    //     const adminPanelDir = resolve(themeDir, adminPanelConfigDir);
    //     if (await fs.pathExists(adminPanelDir)) {
    //         exportsInfo.adminPanelPath = adminPanelDir.replace(/\\/g, '/');
    //     }
    // }

    return exportsInfo;
}