import treeKill from 'tree-kill';
import { saveProcessPid, getProcessPid } from '../utils/cacheManager';
import { fork, spawn, ChildProcess } from "child_process";

export const closeService = (name: string, cb?: () => void) => {
    getProcessPid(name, (pid: number) => {
        treeKill(pid, 'SIGKILL', (err) => {
            if (cb) cb();
        });
    })
}

export const startService = (path: string, name: string, args: string[]): ChildProcess => {
    const proc = fork(path, args);
    saveProcessPid(name, proc.pid);
    proc.on('close', (code: number) => {

    });
    return proc;
}