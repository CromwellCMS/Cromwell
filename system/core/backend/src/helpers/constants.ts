import { TCmsConfig } from '@cromwell/core';

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

export const defaultCmsConfig: TCmsConfig = {
    apiPort: 4016,
    adminPanelPort: 4064,
    frontendPort: 4128,
    centralServerUrl: 'http://165.22.20.48',
    useWatch: true,
    accessTokenExpirationTime: 600,
    refreshTokenExpirationTime: 1296000,
    defaultSettings: {
        installed: false,
        themeName: "@cromwell/theme-store",
        logo: "/themes/@cromwell/theme-store/shopping-cart.png",
        defaultPageSize: 15,
        defaultShippingPrice: 10,
        adminSettings: {
            stripeApiKey: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
        },
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
                "tag": "CNY",
                "title": "Chinese Yuan",
                "symbol": '¥',
                "ratio": 6.40
            }
        ]
    }
}

export const cmsPackageName = '@cromwell/cms';