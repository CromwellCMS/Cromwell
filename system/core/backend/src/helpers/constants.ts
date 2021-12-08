import { serviceLocator, TCmsConfig } from '@cromwell/core';
import { ConnectionOptions } from 'typeorm';

import { AttributeToProduct } from '../models/entities/attribute-product.entity';
import { AttributeValue } from '../models/entities/attribute-value.entity';
import { Attribute } from '../models/entities/attribute.entity';
import { CmsEntity } from '../models/entities/cms.entity';
import { CustomEntity } from '../models/entities/custom-entity.entity';
import { AttributeMeta } from '../models/entities/meta/attribute-meta.entity';
import { CustomEntityMeta } from '../models/entities/meta/custom-entity-meta.entity';
import { OrderMeta } from '../models/entities/meta/order-meta.entity';
import { PostMeta } from '../models/entities/meta/post-meta.entity';
import { ProductCategoryMeta } from '../models/entities/meta/product-category-meta.entity';
import { ProductMeta } from '../models/entities/meta/product-meta.entity';
import { TagMeta } from '../models/entities/meta/tag-meta.entity';
import { UserMeta } from '../models/entities/meta/user-meta.entity';
import { Order } from '../models/entities/order.entity';
import { PageStats } from '../models/entities/page-stats.entity';
import { PluginEntity } from '../models/entities/plugin.entity';
import { PostComment } from '../models/entities/post-comment.entity';
import { Post } from '../models/entities/post.entity';
import { ProductCategory } from '../models/entities/product-category.entity';
import { ProductReview } from '../models/entities/product-review.entity';
import { Product } from '../models/entities/product.entity';
import { Tag } from '../models/entities/tag.entity';
import { ThemeEntity } from '../models/entities/theme.entity';
import { User } from '../models/entities/user.entity';
import { Coupon } from '../models/entities/coupon.entity';
import { CouponMeta } from '../models/entities/meta/coupon-meta.entity';


export const ORMEntities = [
    ThemeEntity, PluginEntity,
    Product, ProductCategory, Post, User,
    Attribute, ProductReview, Order,
    CmsEntity, Tag, PageStats, PostComment,
    AttributeMeta, OrderMeta, PostMeta,
    ProductCategoryMeta, ProductMeta, TagMeta,
    UserMeta, AttributeToProduct, AttributeValue,
    CustomEntity, CustomEntityMeta, Coupon, CouponMeta,
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
    apiUrl: serviceLocator.defaultLocations.apiUrl,
    adminUrl: serviceLocator.defaultLocations.adminUrl,
    frontendUrl: serviceLocator.defaultLocations.frontendUrl,
    centralServerUrl: serviceLocator.defaultLocations.centralServerUrl,
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
            language: 'en',
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

export const getMigrationsDirName = (dbType: ConnectionOptions['type']) => {
    if (dbType === 'sqlite') return 'migrations/sqlite';
    if (dbType === 'mysql' || dbType === 'mariadb') return 'migrations/mysql';
    if (dbType === 'postgres') return 'migrations/postgres';
}
