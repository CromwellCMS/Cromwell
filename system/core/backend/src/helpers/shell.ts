import { spawn } from 'child_process';

import { getLogger } from './logger';

const logger = getLogger();

export const runShellComand = (comand: string): Promise<void> => {
    return new Promise<void>(done => {
        const proc = spawn(comand, [],
            { shell: true, stdio: 'pipe', cwd: process.cwd() });

        if (proc.stderr && proc.stderr.on) {
            proc.stderr.on('data', (data) => {
                logger.error(data.toString ? data.toString() : data);
            });
        }
        if (proc.stdout && proc.stdout.on) {
            proc.stdout.on('data', (data) => {
                logger.log(data.toString ? data.toString() : data);
            });
        }

        proc.on('close', () => {
            done();
        });
    });
}
