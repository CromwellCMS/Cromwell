import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import {
  getCmsModuleInfo,
  getManagerDir,
  getModulePackage,
  getTempDir,
} from '@cromwell/core-backend/dist/helpers/paths';
import { TPackage } from '@cromwell/utils';
import fs from 'fs-extra';
import { resolve } from 'path';

const logger = getLogger(false);

export const checkModules = async (isDevelopment?: boolean, pckgs?: TPackage[]) => {
  const { downloader } = require('@cromwell/utils/build/downloader');
  // If cms launched for the first time, we need to download bundled modules
  if (!pckgs) {
    await downloader();
  }
  if (pckgs) {
    await downloader({ packages: pckgs });
  }
};

export const checkDependencies = async () => {
  const { parseFrontendDeps, defaultFrontendDeps } = require('@cromwell/utils/build/shared');
  // Enforce peerDependencies if some plugin or theme used it as dependency
  const pckg = await getModulePackage();
  const defaultDeps = (await parseFrontendDeps(defaultFrontendDeps)).map((dep) => dep.name);
  const serverPckg = await getModulePackage('@cromwell/server');
  const serverDeps = Object.keys(serverPckg?.dependencies ?? {});

  const backendPckg = await getModulePackage('@cromwell/core-backend');
  const backendDeps = Object.keys(backendPckg?.dependencies ?? {});

  const rendererPckg = await getModulePackage('@cromwell/renderer');
  const rendererDeps = Object.keys(rendererPckg?.dependencies ?? {});

  const wrongDeps: string[] = [];
  const wrongCmsModules: string[] = [];
  if (pckg?.dependencies) {
    for (const dep of Object.keys(pckg.dependencies)) {
      if (
        dep.startsWith('@cromwell/') ||
        serverDeps.includes(dep) ||
        backendDeps.includes(dep) ||
        defaultDeps.includes(dep) ||
        rendererDeps.includes(dep)
      ) {
        wrongDeps.push(dep);
      }

      const moduleInfo = await getCmsModuleInfo(dep);
      if (moduleInfo?.type) {
        wrongCmsModules.push(dep);
      }
    }
  }

  if (wrongDeps.length) {
    wrongDeps.sort();
    logger.error(
      'CromwellCMS already includes following dependencies: ' +
        wrongDeps.join(', ') +
        '\n Please configure them as devDependencies or peerDependencies in your package.json',
    );
  }

  if (wrongCmsModules.length) {
    wrongCmsModules.sort();
    logger.error(
      'Do not include themes or plugins as dependencies in your package.json: ' +
        wrongCmsModules.join(', ') +
        '\n Please configure them as devDependencies or peerDependencies',
    );
  }

  if (wrongDeps.length && wrongCmsModules.length) {
    process.exit(0);
  }
};

export const checkConfigs = async () => {
  const nginxDir = resolve(getTempDir(), 'nginx');
  const managerDir = getManagerDir();
  if (managerDir && !(await fs.pathExists(nginxDir))) {
    const managerNginxDir = resolve(managerDir, 'docker/nginx');
    if (await fs.pathExists(managerNginxDir)) await fs.copy(managerNginxDir, nginxDir);
  }
};
