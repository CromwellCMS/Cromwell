import { TCmsEnabledModules, TPermissionName } from '@cromwell/core';
import React, { lazy } from 'react';

const AttributesListPage = lazy(() => import('../router-pages/attributeList/AttributesList'));
const AttributePage = lazy(() => import('../router-pages/attribute/AttributePage'));
const CategoryPage = lazy(() => import('../router-pages/category/CategoryPage'));
const CategoryListPage = lazy(() => import('../router-pages/categoryList/CategoryList'));
const DashboardPage = lazy(() => import('../router-pages/dashboard/Dashboard'));
const LoginPage = lazy(() => import('../router-pages/login/LoginPage'));
const OrderPage = lazy(() => import('../router-pages/order/Order'));
const OrderListPage = lazy(() => import('../router-pages/orderList/OrderList'));
const PluginPage = lazy(() => import('../router-pages/plugin/PluginPage'));
const PluginListPage = lazy(() => import('../router-pages/pluginList/PluginList'));
const PostPage = lazy(() => import('../router-pages/post/Post'));
const PostListPage = lazy(() => import('../router-pages/postList/PostList'));
const ProductPage = lazy(() => import('../router-pages/product/Product'));
const ProductListPage = lazy(() => import('../router-pages/productList/ProductList'));
const ReviewListPage = lazy(() => import('../router-pages/reviewList/ReviewList'));
const SettingsPage = lazy(() => import('../router-pages/settings/Settings'));
const TagPage = lazy(() => import('../router-pages/tag/Tag'));
const TagListPage = lazy(() => import('../router-pages/tagList/TagList'));
const ThemeEditPage = lazy(() => import('../router-pages/themeEdit/ThemeEdit'));
const ThemeListPage = lazy(() => import('../router-pages/themeList/ThemeList'));
const UserPage = lazy(() => import('../router-pages/user/User'));
const UserListPage = lazy(() => import('../router-pages/userList/UserList'));
const WelcomePage = lazy(() => import('../router-pages/welcome/Welcome'));
const PluginMarket = lazy(() => import('../router-pages/pluginMarket/PluginMarket'));
const ThemeMarket = lazy(() => import('../router-pages/themeMarket/ThemeMarket'));
const CouponList = lazy(() => import('../router-pages/couponList/CouponList'));
const CouponPage = lazy(() => import('../router-pages/coupon/Coupon'));

export type TSidebarLink = {
  id: string;
  title: string;
  route?: string;
  baseRoute?: string;
  subLinks?: TSidebarLink[];
  icon?: React.ReactNode;
  permissions?: TPermissionName[];
  module?: keyof TCmsEnabledModules;
};

export type TPageInfo = {
  name: string;
  route: string;
  baseRoute?: string;
  component: React.ComponentType;
  disableSidebar?: boolean;
  minimizeSidebar?: boolean;
  permissions?: TPermissionName[];
  module?: keyof TCmsEnabledModules;
};

export const homePageInfo: TPageInfo = {
  name: 'Dashboard',
  route: '/',
  component: DashboardPage,
  permissions: ['read_cms_statistics'],
};
export const themeListPageInfo: TPageInfo = {
  name: 'ThemeList',
  route: '/themes',
  component: ThemeListPage,
  permissions: ['read_themes'],
};
export const themeEditPageInfo: TPageInfo = {
  name: 'ThemeEdit',
  route: '/theme-editor',
  baseRoute: '/theme-editor',
  component: ThemeEditPage,
  minimizeSidebar: true,
  disableSidebar: true,
  permissions: ['read_themes'],
};
export const productListInfo: TPageInfo = {
  name: 'ProductList',
  route: '/products',
  component: ProductListPage,
  permissions: ['read_products'],
  module: 'ecommerce',
};
export const productPageInfo: TPageInfo = {
  name: 'Product',
  route: '/products/:id',
  baseRoute: '/products',
  component: ProductPage,
  permissions: ['read_products'],
  module: 'ecommerce',
};

export const categoryListPageInfo: TPageInfo = {
  name: 'CategoryList',
  route: '/categories',
  component: CategoryListPage,
  permissions: ['read_product_categories'],
  module: 'ecommerce',
};
export const categoryPageInfo: TPageInfo = {
  name: 'Category',
  route: '/categories/:id',
  component: CategoryPage,
  baseRoute: '/categories',
  permissions: ['read_product_categories'],
  module: 'ecommerce',
};

export const attributePageInfo: TPageInfo = {
  name: 'Attribute',
  route: '/attributes/:id',
  baseRoute: '/attributes',
  component: AttributePage,
  permissions: ['read_attributes'],
  module: 'ecommerce',
};
export const attributeListPageInfo: TPageInfo = {
  name: 'Attributes',
  route: '/attributes',
  component: AttributesListPage,
  permissions: ['read_attributes'],
  module: 'ecommerce',
};
export const pluginListPageInfo: TPageInfo = {
  name: 'PluginList',
  route: '/plugins',
  component: PluginListPage,
  permissions: ['read_plugins'],
};
export const pluginPageInfo: TPageInfo = {
  name: 'Plugin',
  baseRoute: '/plugin',
  route: '/plugin',
  component: PluginPage,
  permissions: ['read_plugins'],
};

export const postListInfo: TPageInfo = {
  name: 'Posts',
  route: '/posts',
  component: PostListPage,
  permissions: ['read_posts'],
  module: 'blog',
};
export const postPageInfo: TPageInfo = {
  name: 'Post',
  route: '/posts/:id',
  component: PostPage,
  baseRoute: '/posts',
  permissions: ['read_posts'],
  module: 'blog',
};

export const loginPageInfo: TPageInfo = {
  name: 'Login',
  route: '/login',
  component: LoginPage,
  baseRoute: '/login',
  disableSidebar: true,
};

export const orderListPageInfo: TPageInfo = {
  name: 'Order List',
  route: '/orders',
  component: OrderListPage,
  permissions: ['read_orders'],
  module: 'ecommerce',
};

export const orderPageInfo: TPageInfo = {
  name: 'Order',
  route: '/orders/:id',
  baseRoute: '/orders',
  component: OrderPage,
  permissions: ['read_orders'],
  module: 'ecommerce',
};

export const welcomePageInfo: TPageInfo = {
  name: 'Welcome',
  route: '/setup',
  component: WelcomePage,
  disableSidebar: true,
};

export const settingsPageInfo: TPageInfo = {
  name: 'Settings',
  route: '/settings',
  baseRoute: '/settings',
  component: SettingsPage,
  permissions: ['read_cms_settings'],
};

export const userListPageInfo: TPageInfo = {
  name: 'User List',
  route: '/users',
  component: UserListPage,
  permissions: ['read_users'],
};
export const userPageInfo: TPageInfo = {
  name: 'User',
  route: '/users/:id',
  baseRoute: '/users',
  component: UserPage,
  permissions: ['read_users'],
};

export const tagPageInfo: TPageInfo = {
  name: 'Tag',
  route: '/tags/:id',
  baseRoute: '/tags',
  component: TagPage,
  permissions: ['read_tags'],
  module: 'blog',
};
export const tagListPageInfo: TPageInfo = {
  name: 'Tag List',
  route: '/tags',
  component: TagListPage,
  permissions: ['read_tags'],
  module: 'blog',
};

export const reviewListPageInfo: TPageInfo = {
  name: 'Reviews',
  route: '/reviews',
  component: ReviewListPage,
  permissions: ['read_product_reviews'],
  module: 'ecommerce',
};

export const pluginMarketPageInfo: TPageInfo = {
  name: 'Plugin Market',
  route: '/plugin-market',
  component: PluginMarket,
  permissions: ['read_plugins'],
};
export const themeMarketPageInfo: TPageInfo = {
  name: 'Theme Market',
  route: '/theme-market',
  component: ThemeMarket,
  permissions: ['read_themes'],
};

export const couponPageInfo: TPageInfo = {
  name: 'Coupon',
  route: '/coupons/:id',
  baseRoute: '/coupons',
  component: CouponPage,
  permissions: ['read_coupons'],
  module: 'ecommerce',
};
export const couponListPageInfo: TPageInfo = {
  name: 'Coupon List',
  route: '/coupons',
  component: CouponList,
  permissions: ['read_coupons'],
  module: 'ecommerce',
};
