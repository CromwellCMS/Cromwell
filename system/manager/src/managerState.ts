
type TServiceStatus = 'inactive' | 'building' | 'running' | 'busy';
type TLogCategories = 'renderer' | 'server' | 'adminPanel' | 'changeTheme' | 'base';
type TLog = Partial<Record<TLogCategories, string[]>>;

export class ManagerState {

    private static _rendererStatus: TServiceStatus = 'inactive';
    public static get rendererStatus(): TServiceStatus {
        return ManagerState._rendererStatus;
    }
    public static set rendererStatus(status: TServiceStatus) {
        ManagerState._rendererStatus = status;
        ManagerState.rendererStatusListeners.forEach(l => l?.(status));
    }

    private static rendererStatusListeners: ((status: TServiceStatus) => void)[] = [];
    public static addRendererStatusListener = (cb: (status: TServiceStatus) => void) => {
        ManagerState.rendererStatusListeners.push(cb);
    }



    private static _adminPanelStatus: TServiceStatus = 'inactive';
    public static get adminPanelStatus(): TServiceStatus {
        return ManagerState._adminPanelStatus;
    }
    public static set adminPanelStatus(status: TServiceStatus) {
        ManagerState._adminPanelStatus = status;
        ManagerState.adminPanelStatusListeners.forEach(l => l?.(status));
    }

    private static adminPanelStatusListeners: ((status: TServiceStatus) => void)[] = [];
    public static addAdminPanelStatusListener = (cb: (status: TServiceStatus) => void) => {
        ManagerState.adminPanelStatusListeners.push(cb);
    }



    public static _log: TLog = {};
    public static get log(): TLog {
        return ManagerState._log;
    }
    public static set log(data: TLog) {
        ManagerState._log = data;
        Object.keys(data).forEach((serviceName) => {
            const name = serviceName as TLogCategories;
            data[name]?.forEach(line =>
                Object.values(ManagerState.onLogListeners[name] ?? {}).forEach(cb => cb(line)));
        })
    }

    public static clearLog = () =>
        ManagerState._log = {};

    public static getLogger = (serviceName: TLogCategories, logDate?: boolean) => (line: string) => {
        if (logDate) {
            line = new Date(Date.now()).toISOString() + ': ' + line;
        }
        console.log(line);
        if (!ManagerState._log[serviceName]) ManagerState._log[serviceName] = [];
        if (ManagerState._log[serviceName] && ((ManagerState._log[serviceName]?.length ?? 0) > 100))
            ManagerState._log[serviceName] = [];
        ManagerState._log[serviceName]?.push(line);
        Object.values(ManagerState.onLogListeners[serviceName] ?? {}).forEach(l => l?.(line));
    }

    private static onLogListeners: Partial<Record<TLogCategories, Record<string, (line: string) => void>>> = {};

    public static addOnLogListener = (serviceName: TLogCategories, id: string, cb: (line: string) => void) => {
        const listeners = ManagerState.onLogListeners[serviceName];
        if (!listeners) {
            ManagerState.onLogListeners[serviceName] = { [id]: cb }
        } else {
            listeners[id] = cb;
        }
    }

}