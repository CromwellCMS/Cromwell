import config from './config';
import { fork, spawn } from "child_process";
import { loadCache } from './utils/cacheManager';
import { resolve } from 'path';
import { startManagerServer } from './server';
import { startServer } from './managers/serverManager';
import { startRenderer } from './managers/rendererManager';
import { startAdminPanel } from './managers/adminPanelManager';
import { ManagerState } from './managerState';

type TScriptName = 'production' | 'development' | 'winDev';

loadCache(() => {

    const { projectRootDir, localProjectDir, closeAllOnExit, servicesDev,
        servicesProd, windowsDev, cacheKeys, servicesEnv } = config;

    const scriptName: TScriptName = config.scriptName;

    const startSystem = () => {
        startServer(() => {
            startAdminPanel();
            startRenderer(undefined, (message) => {
                console.log(message);
            });
        }, ManagerState.getLogger('server'))
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
            { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, 'system/core/common') });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, 'system/core/backend') });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, 'system/core/frontend') });

        windowsDev.otherDirs.forEach((dir, i) => {
            spawn(`npx rollup -cw`, [],
                { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, dir) });
        });

        startSystem();
    }

})




