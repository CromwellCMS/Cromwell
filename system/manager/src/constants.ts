export type TServiceNames = 'renderer' | 'r' | 'server' | 's' | 'adminPanel' | 'a';

export type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';

export type TServerCommands = | 'dev' | 'build' | 'prod';

export type TAdminPanelCommands = 'buildService' | 'build' | 'dev' | 'prod';

export const serviceNames: TServiceNames[] = ["adminPanel", 'a', "server", 's', "renderer", 'r'];
