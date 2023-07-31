import { getRandStr, TPagesMetaInfo } from '@cromwell/core';
import {
  getMetaInfoPath,
  getNodeModuleDir,
  getThemePagesMetaPath,
  getThemeTempRollupBuildDir,
} from '@cromwell/core-backend/dist/helpers/paths';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';

export type TThemeExportsInfo = {
  pagesInfo: TPagePathInfo[];
  adminPanelPath?: string;
  themeDir: string;
  themeBuildDir: string;
};
export type TPagePathInfo = {
  name: string;
  path?: string;
  compName?: string;
  fileContent?: string;
  metaInfoPath?: string;
  depsBundlePath?: string;
};

/**
 * Returns object with page names as keys paths as values: {"pageName": "pagePath"}
 */
export const readThemeExports = async (themeModuleName: string | undefined): Promise<TThemeExportsInfo> => {
  if (!themeModuleName) throw new Error('readThemeExports: !themeName');

  const themeDir = await getNodeModuleDir(themeModuleName);
  if (!themeDir) throw new Error('readThemeExports: !themeDir of ' + themeModuleName);

  const buildDir = getThemeTempRollupBuildDir();
  if (!buildDir) throw new Error('readThemeExports: !buildDir of ' + themeModuleName);

  const metainfoPath = getThemePagesMetaPath(buildDir);

  const exportsInfo: TThemeExportsInfo = {
    pagesInfo: [],
    themeDir,
    themeBuildDir: buildDir,
  };

  if (await fs.pathExists(metainfoPath)) {
    const pagesMeta: TPagesMetaInfo = await fs.readJSON(metainfoPath);

    if (!pagesMeta || !pagesMeta.paths)
      throw new Error('Could not find or read pages meta info file at: ' + metainfoPath);

    for (const pagePaths of pagesMeta.paths) {
      // if (!/\.(m?jsx?|tsx?)$/.test(p)) continue;
      if (!pagePaths.localPath) continue;

      const fullPath = normalizePath(resolve(buildDir, pagePaths.localPath));
      if (!(await fs.pathExists(fullPath))) continue;

      const name = pagePaths.pageName;
      const compName = `Theme_${themeModuleName.replace(/\W/g, '_')}_Page_${name.replace(/\W/g, '_')}_${getRandStr()}`;

      let metaInfoPath: string | undefined = normalizePath(getMetaInfoPath(fullPath));
      if (!metaInfoPath || !(await fs.pathExists(metaInfoPath))) metaInfoPath = undefined;

      let fileContent: string | undefined = undefined;
      if (pagePaths.pageName === '_app' || pagePaths.pageName === '_document') {
        fileContent = (await fs.readFile(fullPath)).toString();
      }

      let depsBundlePath;
      if (pagePaths.localDepsBundle && pagePaths.pageName !== '_app' && pagePaths.pageName !== '_document') {
        const depsPath = resolve(buildDir, pagePaths.localDepsBundle);
        if (await fs.pathExists(depsPath)) {
          depsBundlePath = normalizePath(depsPath);
        }
      }

      exportsInfo.pagesInfo.push({
        name,
        path: fullPath,
        compName,
        fileContent,
        metaInfoPath,
        depsBundlePath,
      });
    }
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
};
