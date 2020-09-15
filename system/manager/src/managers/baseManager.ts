import treeKill from 'tree-kill';
import isRunning from 'is-running';
import { saveProcessPid, getProcessPid } from '../utils/cacheManager';
import { fork, spawn, ChildProcess } from "child_process";

export const closeService = (name: string, cb?: (success: boolean) => void, onLog?: (message: string) => void) => {
    getProcessPid(name, (pid: number) => {
        treeKill(pid, 'SIGKILL', (err) => {
            if (err && onLog) onLog(err.message);
            cb?.(!err);
        });
    })
}

export const startService = (path: string, name: string, args: string[], onLog?: (message: string) => void): ChildProcess => {
    const proc = fork(path, args, { stdio: 'pipe' });
    saveProcessPid(name, proc.pid);
    if (onLog) {
        proc?.stdout?.on('data', onLog);
        proc?.stderr?.on('data', onLog);
    }
    return proc;
}

export const isServiceRunning = (name: string, cb: (isRun: boolean) => void) => {
    getProcessPid(name, (pid: number) => {
        cb(isRunning(pid));
    })
}