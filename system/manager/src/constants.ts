export type TServiceNames = 'renderer' | 'server' | 'adminPanel';

export type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';

export type TServerCommands = | 'dev' | 'build' | 'prod';

export type TAdminPanelCommands = 'buildService' | 'build' | 'dev' | 'prod';

export const serviceNames: TServiceNames[] = ["adminPanel", "server", "renderer"];

export type TScriptName = 'build' | 'b' |
    'watch' | 'w' |
    'install' | 'i' |
    'bundle-modules' | 'bm' |
    'rebundle-modules' | 'rm' |
    'download' | 'd' |
    'start' | 's';

export const commands = ['build', 'b', 'watch', 'w', 'install', 'i',
    'bundle-modules', 'bm', 'rebundle-modules', 'rm', 'start', 's',
    'download', 'd']