
type TRendererStatus = 'inactive' | 'building' | 'running' | 'busy';
type TServices = 'renderer' | 'server' | 'adminPanel';

export class ManagerState {

    public static _rendererStatus: TRendererStatus = 'inactive';
    public static get rendererStatus(): TRendererStatus {
        return ManagerState._rendererStatus;
    }
    public static set rendererStatus(status: TRendererStatus) {
        ManagerState._rendererStatus = status;
        ManagerState.rendererStatusListeners.forEach(l => l?.(status));
    }

    private static rendererStatusListeners: ((status: TRendererStatus) => void)[] = [];
    public static addRendererStatusListener = (cb: (status: TRendererStatus) => void) => {
        ManagerState.rendererStatusListeners.push(cb);
    }


    public static _log: Record<TServices, string[]> = { renderer: [], server: [], adminPanel: [] };
    public static get log(): Record<TServices, string[]> {
        return ManagerState._log;
    }
    public static set log(data: Record<TServices, string[]>) {
        ManagerState._log = data;
        Object.keys(data).forEach((serviceName) => {
            const name = serviceName as TServices;
            data[name].forEach(line =>
                Object.values(ManagerState.onLogListeners[name]).forEach(cb => cb(line)));
        })
    }

    public static clearLog = () =>
        ManagerState._log = { renderer: [], server: [], adminPanel: [] };

    public static getLogger = (serviceName: TServices, logDate?: boolean) => (line: string) => {
        if (logDate) {
            line = new Date(Date.now()).toISOString() + ': ' + line;
        }
        console.log(line);
        ManagerState._log[serviceName].push(line);
        Object.values(ManagerState.onLogListeners[serviceName]).forEach(l => l?.(line));
    }

    private static onLogListeners: Record<TServices, Record<string, (line: string) => void>> = { renderer: {}, server: {}, adminPanel: {} };

    public static addOnLogListener = (serivceName: TServices, id: string, cb: (line: string) => void) =>
        ManagerState.onLogListeners[serivceName][id] = cb;
}