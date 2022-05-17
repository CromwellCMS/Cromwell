import { serviceLocator, TCmsConfig } from '@cromwell/core';
import { ConnectionOptions } from 'typeorm';

import { AttributeToProduct } from '../models/entities/attribute-product.entity';
import { AttributeValue } from '../models/entities/attribute-value.entity';
import { Attribute } from '../models/entities/attribute.entity';
import { CmsEntity } from '../models/entities/cms.entity';
import { Coupon } from '../models/entities/coupon.entity';
import { CustomEntity } from '../models/entities/custom-entity.entity';
import { AttributeMeta } from '../models/entities/meta/attribute-meta.entity';
import { CouponMeta } from '../models/entities/meta/coupon-meta.entity';
import { CustomEntityMeta } from '../models/entities/meta/custom-entity-meta.entity';
import { OrderMeta } from '../models/entities/meta/order-meta.entity';
import { PostMeta } from '../models/entities/meta/post-meta.entity';
import { ProductCategoryMeta } from '../models/entities/meta/product-category-meta.entity';
import { ProductMeta } from '../models/entities/meta/product-meta.entity';
import { ProductVariantMeta } from '../models/entities/meta/product-variant-meta.entity';
import { RoleMeta } from '../models/entities/meta/role-meta.entity';
import { TagMeta } from '../models/entities/meta/tag-meta.entity';
import { UserMeta } from '../models/entities/meta/user-meta.entity';
import { Order } from '../models/entities/order.entity';
import { PageStats } from '../models/entities/page-stats.entity';
import { PluginEntity } from '../models/entities/plugin.entity';
import { PostComment } from '../models/entities/post-comment.entity';
import { Post } from '../models/entities/post.entity';
import { ProductCategory } from '../models/entities/product-category.entity';
import { ProductReview } from '../models/entities/product-review.entity';
import { ProductVariant } from '../models/entities/product-variant.entity';
import { Product } from '../models/entities/product.entity';
import { Role } from '../models/entities/role.entity';
import { Tag } from '../models/entities/tag.entity';
import { ThemeEntity } from '../models/entities/theme.entity';
import { User } from '../models/entities/user.entity';
import { DashboardEntity } from "../models/entities/dashboard-entity.entity";

export const ORMEntities = [
  ThemeEntity, PluginEntity,
  Product, ProductCategory, Post, User,
  Attribute, ProductReview, Order,
  CmsEntity, Tag, PageStats, PostComment,
  AttributeMeta, OrderMeta, PostMeta,
  ProductCategoryMeta, ProductMeta, TagMeta,
  UserMeta, AttributeToProduct, AttributeValue,
  CustomEntity, CustomEntityMeta, Coupon, CouponMeta,
  ProductVariant, ProductVariantMeta, Role, DashboardEntity,
  RoleMeta,
]

export const rendererMessages = {
  onBuildStartMessage: "onBuildStart",
  onBuildEndMessage: "onBuildEnd",
  onBuildErrorMessage: "onBuildError",
  onStartMessage: "onStart",
  onStartErrorMessage: "onStartError",
};

export const adminPanelMessages = {
  onBuildStartMessage: "onBuildStart",
  onBuildEndMessage: "onBuildEnd",
  onBuildErrorMessage: "onBuildError",
  onStartMessage: "onStart",
  onStartErrorMessage: "onStartError",
};

export const serverMessages = {
  onBuildStartMessage: "onBuildStart",
  onBuildEndMessage: "onBuildEnd",
  onBuildErrorMessage: "onBuildError",
  onStartMessage: "onStart",
  onStartErrorMessage: "onStartError",
};

export const defaultCmsConfig: TCmsConfig = {
  apiUrl: serviceLocator.defaultLocations.apiUrl,
  adminUrl: serviceLocator.defaultLocations.adminUrl,
  frontendUrl: serviceLocator.defaultLocations.frontendUrl,
  centralServerUrl:
    serviceLocator.defaultLocations.centralServerUrl,
  useWatch: true,
  accessTokenExpirationTime: 600,
  refreshTokenExpirationTime: 1296000,
  defaultSettings: {
    internalSettings: {
      installed: false,
    },
    modules: {
      ecommerce: true,
      blog: true,
    },
    adminSettings: {
      signupEnabled: true,
      signupRoles: ['customer'],
    },
    publicSettings: {
      themeName: "@cromwell/theme-store",
      logo: "/themes/@cromwell/theme-store/shopping-cart.png",
      defaultPageSize: 15,
      defaultShippingPrice: 10,
      language: "en",
      currencies: [
        {
          id: "1",
          tag: "USD",
          title: "US Dollar",
          symbol: "$",
          ratio: 1,
        },
        {
          id: "2",
          tag: "EUR",
          title: "Euro",
          symbol: "€",
          ratio: 0.8,
        },
        {
          id: "3",
          tag: "GBP",
          title: "British pound",
          symbol: "£",
          ratio: 0.72,
        },
        {
          id: "4",
          tag: "CNY",
          title: "Chinese Yuan",
          symbol: "¥",
          ratio: 6.4,
        },
      ],
    },
    dashboardSettings: {
      type: "template",
      for: "system",
      layout: {
        lg: [
          {
            w: 4,
            h: 3,
            x: 0,
            y: 0,
            i: "productRating",
            minW: 3,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 4,
            h: 3,
            x: 4,
            y: 0,
            i: "salesValue",
            minW: 3,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 4,
            h: 3,
            x: 8,
            y: 0,
            i: "pageViews",
            minW: 3,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 6,
            h: 8,
            x: 0,
            y: 9,
            i: "ordersLastWeek",
            minH: 6,
            moved: false,
            static: false,
          },
          {
            w: 7,
            h: 6,
            x: 0,
            y: 3,
            i: "salesValueLastWeek",
            minH: 6,
            moved: false,
            static: false,
          },
          {
            w: 5,
            h: 6,
            x: 7,
            y: 3,
            i: "pageViewsStats",
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 6,
            h: 8,
            x: 6,
            y: 9,
            i: "productReviews",
            minH: 4,
            moved: false,
            static: false,
          },
          {
            i: "$widget_@cromwell/plugin-newsletter",
            x: 0,
            y: 21,
            w: 6,
            h: 6,
          },
        ],
        md: [
          {
            w: 3,
            h: 3,
            x: 0,
            y: 0,
            i: "productRating",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 3,
            h: 3,
            x: 3,
            y: 0,
            i: "salesValue",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 3,
            h: 3,
            x: 6,
            y: 0,
            i: "pageViews",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 5,
            h: 8,
            x: 0,
            y: 11,
            i: "ordersLastWeek",
            minH: 6,
            moved: false,
            static: false,
          },
          {
            w: 6,
            h: 8,
            x: 0,
            y: 3,
            i: "salesValueLastWeek",
            minH: 6,
            moved: false,
            static: false,
          },
          {
            w: 3,
            h: 8,
            x: 6,
            y: 3,
            i: "pageViewsStats",
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 4,
            h: 8,
            x: 5,
            y: 11,
            i: "productReviews",
            minH: 4,
            moved: false,
            static: false,
          },
          {
            i: "$widget_@cromwell/plugin-newsletter",
            x: 0,
            y: 21,
            w: 4,
            h: 6,
          },
        ],
        sm: [
          {
            w: 2,
            h: 3,
            x: 0,
            y: 0,
            i: "productRating",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 3,
            x: 2,
            y: 0,
            i: "salesValue",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 3,
            x: 4,
            y: 0,
            i: "pageViews",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 3,
            h: 8,
            x: 0,
            y: 11,
            i: "ordersLastWeek",
            minH: 2,
            moved: false,
            static: false,
          },
          {
            w: 3,
            h: 8,
            x: 0,
            y: 3,
            i: "salesValueLastWeek",
            minH: 2,
            moved: false,
            static: false,
          },
          {
            w: 3,
            h: 8,
            x: 3,
            y: 3,
            i: "pageViewsStats",
            minH: 2,
            moved: false,
            static: false,
          },
          {
            w: 3,
            h: 8,
            x: 3,
            y: 11,
            i: "productReviews",
            minH: 4,
            moved: false,
            static: false,
          },
          {
            i: "$widget_@cromwell/plugin-newsletter",
            x: 0,
            y: 21,
            w: 3,
            h: 6,
          },
        ],
        xs: [
          {
            w: 2,
            h: 3,
            x: 0,
            y: 0,
            i: "productRating",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 3,
            x: 2,
            y: 0,
            i: "salesValue",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 3,
            x: 0,
            y: 11,
            i: "pageViews",
            minW: 2,
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 8,
            x: 0,
            y: 14,
            i: "ordersLastWeek",
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 8,
            x: 0,
            y: 3,
            i: "salesValueLastWeek",
            minH: 2,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 8,
            x: 2,
            y: 3,
            i: "pageViewsStats",
            minH: 2,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 8,
            x: 2,
            y: 11,
            i: "productReviews",
            minH: 3,
            moved: false,
            static: false,
          },
          {
            w: 2,
            h: 4,
            x: 0,
            y: 22,
            i: "$widget_@cromwell/plugin-newsletter",
            moved: false,
            static: false,
          },
        ],
        xxs: [
          {
            i: "productRating",
            x: 0,
            y: 0,
            w: 1,
            h: 3,
            minH: 3,
            minW: 1,
          },
          {
            i: "salesValue",
            x: 1,
            y: 0,
            w: 1,
            h: 3,
            minH: 3,
            minW: 1,
          },
          {
            i: "pageViews",
            x: 0,
            y: 3,
            w: 2,
            h: 3,
            minH: 3,
            minW: 2,
          },
          {
            i: "salesValueLastWeek",
            x: 0,
            y: 6,
            w: 2,
            h: 8,
            minH: 2,
          },
          {
            i: "pageViewsStats",
            x: 0,
            y: 6,
            w: 2,
            h: 8,
            minH: 2,
          },
          {
            i: "ordersLastWeek",
            x: 0,
            y: 14,
            w: 2,
            h: 6,
            minH: 2,
          },
          {
            i: "productReviews",
            x: 0,
            y: 20,
            w: 2,
            h: 8,
            minH: 3,
          },
          {
            i: "$widget_@cromwell/plugin-newsletter",
            x: 0,
            y: 21,
            w: 2,
            h: 4,
          },
        ],
      },
    },
  },
};

export const cmsPackageName = "@cromwell/cms";

export const getMigrationsDirName = (dbType: ConnectionOptions['type']) => {
  if (dbType === 'sqlite') return 'migrations/sqlite';
  if (dbType === 'mysql' || dbType === 'mariadb') return 'migrations/mysql';
  if (dbType === 'postgres') return 'migrations/postgres';
}
