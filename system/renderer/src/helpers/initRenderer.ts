import { isServer, setStoreItem } from '@cromwell/core';

let normalizePath;
let nodeRequire;
let fs: typeof import('fs-extra');
let requireFromString;
let coreBackendPaths: typeof import('@cromwell/core-backend/dist/helpers/paths');
let coreBackendCmsSettings: typeof import('@cromwell/core-backend/dist/helpers/cms-settings');
let coreBackendAuthSettings: typeof import('@cromwell/core-backend/dist/helpers/auth-settings');
let pathResolve: typeof import('path')['resolve'];
let hasRequired = false;

const checkBackendModules = () => {
  setStoreItem('fsRequire', fsRequire);
  if (hasRequired) return;
  hasRequired = true;
  normalizePath = eval(`require('normalize-path');`);
  nodeRequire = (name: string) => eval(`require('${normalizePath(name)}');`);
  fs = nodeRequire('fs-extra');
  requireFromString = nodeRequire('require-from-string');
  coreBackendPaths = nodeRequire('@cromwell/core-backend/dist/helpers/paths');
  coreBackendCmsSettings = nodeRequire('@cromwell/core-backend/dist/helpers/cms-settings');
  coreBackendAuthSettings = nodeRequire('@cromwell/core-backend/dist/helpers/auth-settings');

  pathResolve = nodeRequire('path').resolve;
};

export const initRenderer = (): void => {
  if (!isServer()) return undefined;
  checkBackendModules();

  const cmsConfigPath = coreBackendPaths.getCmsConfigPathSync();
  const config = coreBackendCmsSettings.readCMSConfigSync(cmsConfigPath);
  setStoreItem('cmsSettings', config);

  if (!config.serviceSecret) {
    (async () => {
      try {
        let serverCachePath = pathResolve(coreBackendPaths.getServerTempDir(), 'cache');
        if (!fs.pathExistsSync(serverCachePath)) {
          serverCachePath = pathResolve(
            coreBackendPaths.getServerTempDir(pathResolve(process.cwd(), '../../')),
            'cache',
          );
        }

        if (fs.pathExistsSync(serverCachePath)) {
          const authSettings = await coreBackendAuthSettings.getAuthSettings({
            serverCachePath,
          });
          config.serviceSecret = authSettings.serviceSecret;
          setStoreItem('cmsSettings', config);
        }
      } catch (error) {}
    })();
  }
};

export const getPluginCjsPath = async (
  pluginName: string,
): Promise<
  | {
      cjsPath: string | undefined;
      metaPath: string | undefined;
    }
  | undefined
> => {
  if (!isServer()) return undefined;
  checkBackendModules();
  const pluginDir = await coreBackendPaths.getNodeModuleDir(pluginName);
  if (!pluginDir) return;
  const buildDir = pathResolve(pluginDir, coreBackendPaths.buildDirName);

  let cjsPath = coreBackendPaths.getPluginFrontendCjsPath(buildDir);
  if (cjsPath) cjsPath = normalizePath(cjsPath);
  if (cjsPath && !(await fs.pathExists(cjsPath))) return undefined;

  let metaPath: string | undefined = coreBackendPaths.getPluginFrontendMetaPath(buildDir);
  if (!(await fs.pathExists(metaPath))) metaPath = undefined;

  return {
    cjsPath,
    metaPath,
  };
};

export const fsRequire = async (path: string, json?: boolean) => {
  if (!isServer()) return undefined;
  checkBackendModules();

  if (await fs.pathExists(path)) {
    const str = (await fs.readFile(path)).toString();
    if (json) return JSON.parse(str);
    return requireFromString(str);
  }
};

setStoreItem('fsRequire', fsRequire);
