import { logFor, logLevelMoreThan, TCmsConfig, TLogLevel } from '@cromwell/core';
import colorsdef from 'colors/safe';

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

export const getLogger = (level: TLogLevel, func?: (...args) => any) => {
    return {
        log: (...args) => {
            if (logLevelMoreThan(level)) func ? func(...args) : console.log(...args);
        },
        info: (...args) => {
            if (logLevelMoreThan(level)) func ? func(...args) : console.log(...args);
        },
        warn: (...args) => {
            const msg = colors.brightYellow('Warning: ') + args.join(' ');
            if (logLevelMoreThan(level)) func ? func(msg) : console.warn(msg);
        },
        error: (...args) => {
            const msg = colors.brightRed('Error: ') + args.join(' ');
            if (logLevelMoreThan(level)) func ? func(msg) : console.error(msg);
        }
    }
}

export const defaultCmsConfig: TCmsConfig = {
    mainApiPort: 4016,
    pluginApiPort: 4032,
    adminPanelPort: 4064,
    frontendPort: 4128,
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
