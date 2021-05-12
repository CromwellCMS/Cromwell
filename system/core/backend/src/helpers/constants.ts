import { logFor, TCmsConfig, TLogLevel } from '@cromwell/core';
import colorsdef from 'colors/safe';
import { join } from 'path';
import * as winston from 'winston';

import { Attribute } from '../entities/Attribute';
import { CmsEntity } from '../entities/Cms';
import { Order } from '../entities/Order';
import { PageStats } from '../entities/PageStats';
import { PluginEntity } from '../entities/Plugin';
import { Post } from '../entities/Post';
import { PostComment } from '../entities/PostComment';
import { Product } from '../entities/Product';
import { ProductCategory } from '../entities/ProductCategory';
import { ProductReview } from '../entities/ProductReview';
import { Tag } from '../entities/Tag';
import { ThemeEntity } from '../entities/Theme';
import { User } from '../entities/User';
import { getTempDir } from './paths';

const colors: any = colorsdef;



export const ORMEntities = [
    ThemeEntity, PluginEntity,
    Product, ProductCategory, Post, User,
    Attribute, ProductReview, Order,
    CmsEntity, Tag, PageStats, PostComment,
]

export const rendererMessages = {
    onBuildStartMessage: 'onBuildStart',
    onBuildEndMessage: 'onBuildEnd',
    onBuildErrorMessage: 'onBuildError',
    onStartMessage: 'onStart',
    onStartErrorMessage: 'onStartError',
}

export const adminPanelMessages = {
    onBuildStartMessage: 'onBuildStart',
    onBuildEndMessage: 'onBuildEnd',
    onBuildErrorMessage: 'onBuildError',
    onStartMessage: 'onStart',
    onStartErrorMessage: 'onStartError',
}

export const serverMessages = {
    onBuildStartMessage: 'onBuildStart',
    onBuildEndMessage: 'onBuildEnd',
    onBuildErrorMessage: 'onBuildError',
    onStartMessage: 'onStart',
    onStartErrorMessage: 'onStartError',
}


export const serverLogFor = (level: TLogLevel, msg: string,
    type?: 'Log' | 'Warning' | 'Error', func?: (msg: string) => any) => {

    if (type === 'Warning') {
        msg = colors.brightYellow('Warning: ') + msg;
    }
    if (type === 'Error') {
        msg = colors.brightRed('Error: ') + msg;
    }
    logFor(level, msg, func);
}


const { combine, timestamp, label, printf } = winston.format;
const loggerFormat = printf(({ message, level, timestamp }) => {
    return `[${timestamp}] ${message}`;
});

let logger;
let fileLogger;

export const getLogger = (writeToFile = true) => {
    const logsDir = join(getTempDir(), 'logs');
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
                    filename: join(logsDir, 'error.log'),
                    level: 'error',
                }),
            ],
        });
    }

    return {
        log: (...args) => {
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
                message: colors.brightRed('Error: ') + args.join(' '),
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

export const defaultCmsConfig: TCmsConfig = {
    mainApiPort: 4016,
    pluginApiPort: 4032,
    adminPanelPort: 4064,
    frontendPort: 4128,
    centralServerUrl: 'http://localhost:4008',
    useWatch: true,
    defaultSettings: {
        installed: false,
        themeName: "@cromwell/theme-store",
        logo: "/themes/@cromwell/theme-store/shopping-cart.png",
        defaultPageSize: 15,
        defaultShippingPrice: 10,
        currencies: [
            {
                id: '1',
                "tag": "USD",
                "title": "US Dollar",
                "symbol": "$",
                "ratio": 1
            },
            {
                id: '2',
                "tag": "EUR",
                "title": "Euro",
                "symbol": "€",
                "ratio": 0.8
            },
            {
                id: '3',
                "tag": "GBP",
                "title": "British pound",
                "symbol": "£",
                "ratio": 0.72
            },
            {
                id: '4',
                "tag": "RUB",
                "title": "Russian Ruble",
                "symbol": "₽",
                "ratio": 74
            }
        ]
    }
}

export const cmsPackageName = '@cromwell/cms';