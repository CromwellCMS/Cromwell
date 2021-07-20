import { getStoreItem, logFor, TLogLevel } from '@cromwell/core';
import colorsdef from 'colors/safe';
import * as winston from 'winston';

import { getErrorLogPath } from './paths';

const colors: any = colorsdef;

const { combine, timestamp, printf } = winston.format;
const loggerFormat = printf(({ message, timestamp }) => {
    return `[${timestamp}] ${message}`;
});

let logger;
let fileLogger;

export const getLogger = (writeToFile = true) => {
    if (!logger) {
        logger = winston.createLogger({
            format: combine(
                timestamp(),
                loggerFormat
            ),
            transports: [
                new winston.transports.Console(),
            ],
        });
    }
    if (!fileLogger) {
        fileLogger = winston.createLogger({
            format: combine(
                timestamp(),
                loggerFormat
            ),
            transports: [
                new winston.transports.File({
                    filename: getErrorLogPath(),
                    level: 'error',
                }),
            ],
        });
    }

    return {
        log: (...args) => {
            if (getStoreItem('environment')?.mode !== 'dev') return;
            logger.log({
                level: 'info',
                message: args.join(' '),
            });
        },
        info: (...args) => {
            logger.info({
                level: 'info',
                message: colors.cyan('Info: ') + args.join(' '),
            });
        },
        warn: (...args) => {
            logger.warn({
                level: 'warn',
                message: colors.brightYellow('Warning: ') + args.join(' '),
            });
        },
        error: (...args) => {
            logger.error({
                level: 'error',
                message: colors.brightRed('Error: ') + args.join(' ') + (args[0]?.stack ?? ''),
            });
            if (writeToFile) {
                fileLogger.error({
                    level: 'error',
                    message: 'Error: ' + args.join(' '),
                });
            }
        }
    }
}