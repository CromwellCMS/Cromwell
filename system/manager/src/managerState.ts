
type TRendererStatus = 'inactive' | 'building' | 'running' | 'busy';

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


    public static _log: string[] = [];
    public static get log(): string[] {
        return ManagerState._log;
    }
    public static set log(data: string[]) {
        ManagerState._log = data;
        data.forEach(line => ManagerState.onLogListeners.forEach(l => l?.(line)))
    }
    public static logLine = (line: string) => {
        console.log(line);
        ManagerState._log.push(line);
        ManagerState.onLogListeners.forEach(l => l?.(line));
    }

    private static onLogListeners: ((line: string) => void)[] = [];
    public static addOnLogListener = (cb: (line: string) => void) => {
        ManagerState.onLogListeners.push(cb);
    }
}