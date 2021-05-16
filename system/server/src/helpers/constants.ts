export const publicSystemDirs = [
    'bundled-modules'
]

export type TServerCommands = 'build' | 'dev' | 'prod';

export const restartMessage = 'crw_restart_server';

export const restartServer = () => {
    if (process.send) process.send(JSON.stringify({
        message: restartMessage,
    }));
}

