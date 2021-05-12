import { getLogger, getManagerDir, getModulePackage, getTempDir } from '@cromwell/core-backend';
import { defaultFrontendDeps, downloader, parseFrontendDeps, TPackage } from '@cromwell/utils';
import fs from 'fs-extra';
import { resolve } from 'path';

const logger = getLogger(false);

export const checkModules = async (isDevelopment?: boolean, pckgs?: TPackage[]) => {
    // If cms launched for the first time, we need to download bundled modules
    if (!pckgs) {
        await downloader();
    }
    if (pckgs) {
        await downloader({ packages: pckgs });
    }
}

export const checkDepenencies = async () => {
    // Enforce peerDependencies if some plugin or theme used it as dependency
    const pckg = await getModulePackage();
    const defaultDeps = parseFrontendDeps(defaultFrontendDeps).map(dep => dep.name);
    const serverPckg = await getModulePackage('@cromwell/server')
    const serverDeps = Object.keys(serverPckg?.dependencies ?? {});

    const backendPckg = await getModulePackage('@cromwell/core-backend')
    const backendDeps = Object.keys(backendPckg?.dependencies ?? {});

    const rendererPckg = await getModulePackage('@cromwell/renderer')
    const rendererDeps = Object.keys(rendererPckg?.dependencies ?? {});

    const wrongDeps: string[] = [];
    if (pckg?.dependencies) {
        Object.keys(pckg.dependencies).forEach(dep => {
            if (dep.startsWith('@cromwell/') || serverDeps.includes(dep) ||
                backendDeps.includes(dep) || defaultDeps.includes(dep) ||
                rendererDeps.includes(dep)
            ) {
                wrongDeps.push(dep);
            }
        })
    }
    if (wrongDeps.length) {
        wrongDeps.sort();
        logger.error('CromwellCMS already includes following dependencies: '
            + wrongDeps.join(', ') + '\n Please configure them as peerDependencies in your package.json');

        process.exit(0);
    }
}

export const checkConfigs = async () => {
    const nginxDir = resolve(getTempDir(), 'nginx');
    const managerDir = getManagerDir();
    if (managerDir && ! await fs.pathExists(nginxDir)) {
        const managerNginxDir = resolve(managerDir, 'docker/nginx');
        if (await fs.pathExists(managerNginxDir))
            await fs.copy(managerNginxDir, nginxDir);
    }
}