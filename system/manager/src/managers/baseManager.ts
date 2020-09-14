import treeKill from 'tree-kill';
import { saveProcessPid, getProcessPid } from '../utils/cacheManager';
import { fork, spawn, ChildProcess } from "child_process";

export const closeService = (name: string, cb?: (success: boolean) => void) => {
    getProcessPid(name, (pid: number) => {
        treeKill(pid, 'SIGKILL', (err) => cb?.(!err));
    })
}

export const startService = (path: string, name: string, args: string[], onLog?: (...args: any[]) => void): ChildProcess => {
    const proc = fork(path, args, { stdio: 'pipe' });
    saveProcessPid(name, proc.pid);
    if (onLog) {
        proc?.stdout?.on('data', onLog);
        proc?.stderr?.on('data', onLog);
    }
    return proc;
}