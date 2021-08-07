import { TCmsConfig } from '@cromwell/core';

import { Attribute } from '../models/entities/attribute.entity';
import { CmsEntity } from '../models/entities/cms.entity';
import { Order } from '../models/entities/order.entity';
import { PageStats } from '../models/entities/page-stats.entity';
import { PluginEntity } from '../models/entities/plugin.entity';
import { Post } from '../models/entities/post.entity';
import { PostComment } from '../models/entities/post-comment.entity';
import { Product } from '../models/entities/product.entity';
import { ProductCategory } from '../models/entities/product-category.entity';
import { ProductReview } from '../models/entities/product-review.entity';
import { Tag } from '../models/entities/tag.entity';
import { ThemeEntity } from '../models/entities/theme.entity';
import { User } from '../models/entities/user.entity';


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
    centralServerUrl: 'https://api.cromwellcms.com',
    useWatch: true,
    accessTokenExpirationTime: 600,
    refreshTokenExpirationTime: 1296000,
    defaultSettings: {
        internalSettings: {
            installed: false,
        },
        publicSettings: {
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
                    "tag": "CNY",
                    "title": "Chinese Yuan",
                    "symbol": '¥',
                    "ratio": 6.40
                }
            ]
        }
    }
}

export const cmsPackageName = '@cromwell/cms';