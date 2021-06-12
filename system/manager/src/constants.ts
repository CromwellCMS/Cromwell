export type TServiceNames = 'renderer' | 'r' | 'server' | 's' | 'adminPanel' | 'a' | 'nginx' | 'n';

export type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';

export type TServerCommands = 'build' | 'dev' | 'prod';

export type TAdminPanelCommands = 'buildService' | 'build' | 'dev' | 'prod';

export const serviceNames: TServiceNames[] = ["adminPanel", 'a', "server", 's', "renderer", 'r', 'nginx', 'n'];

// description in startup.js
export type TScriptName = 'production' | 'development' | 'buildService' | 'build' | 'winDev' | 'try';