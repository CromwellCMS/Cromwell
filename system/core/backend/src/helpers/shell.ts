import { spawn } from 'child_process';

import { getLogger } from './logger';

const logger = getLogger();

export const runShellCommand = (command: string, cwd?: string): Promise<void> => {
    logger.info('Running shell command: ' + command);

    return new Promise<void>(done => {
        const proc = spawn(command, [],
            { shell: true, stdio: 'pipe', cwd: cwd ?? process.cwd() });

        if (proc.stderr && proc.stderr.on) {
            proc.stderr.on('data', (data) => {
                logger.warn(data.toString ? data.toString() : data);
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