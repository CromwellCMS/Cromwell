import { spawn } from 'child_process';
import { resolve } from 'path';
import { getCoreCommonDir, getCoreFrontendDir, getCoreBackendDir } from '@cromwell/core-backend';
import config from './config';
import { startAdminPanel } from './managers/adminPanelManager';
import { startRenderer } from './managers/rendererManager';
import { startServer } from './managers/serverManager';
import { ManagerState } from './managerState';
import { startManagerServer } from './server';
import { loadCache } from './utils/cacheManager';

type TScriptName = 'production' | 'development' | 'winDev';

loadCache(async () => {

    const { projectRootDir, localProjectDir, closeAllOnExit, servicesDev,
        servicesProd, windowsDev, cacheKeys, servicesEnv } = config;

    const scriptName: TScriptName = config.scriptName;

    const startSystem = async () => {
        await startServer(ManagerState.getLogger('server'));

        startAdminPanel(ManagerState.getLogger('adminPanel'));
        startRenderer((message) => {
            console.log(message);
        });
    }

    // if (scriptName === 'winDev') {
    //     startManagerServer();
    //     const windDevPath = resolve(localProjectDir, 'src/utils/windowsDev.js')
    //     spawn(`node ${windDevPath}`, [],
    //         { shell: true, stdio: 'inherit', cwd: localProjectDir });
    // }

    if (scriptName === 'production') {
        startManagerServer();
        startSystem();
    }

    if (scriptName === 'development') {

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreCommonDir() });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreBackendDir() });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreFrontendDir() });

        windowsDev.otherDirs.forEach((dir, i) => {
            spawn(`npx rollup -cw`, [],
                { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, dir) });
        });

        startSystem();
    }

})




