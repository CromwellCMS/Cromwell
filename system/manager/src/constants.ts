export type TServiceNames = 'renderer' | 'server' | 'adminPanel';

export type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';

export type TServerCommands = | 'dev' | 'build' | 'prod';

export type TAdminPanelCommands = 'buildService' | 'build' | 'dev' | 'prod';

export const serviceNames: TServiceNames[] = ["adminPanel", "server", "renderer"];
