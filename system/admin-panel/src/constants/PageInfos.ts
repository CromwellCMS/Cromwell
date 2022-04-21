import { TPermissionName } from '@cromwell/core';
import React, { lazy } from 'react';
import { RouteComponentProps } from 'react-router-dom';

const AttributesPage = lazy(() => import('../pages/attributes/AttributesPage'));
const CategoryPage = lazy(() => import('../pages/category/CategoryPage'));
const CategoryListPage = lazy(() => import('../pages/categoryList/CategoryList'));
const DashboardPage = lazy(() => import('../pages/dashboard/Dashboard'));
const LoginPage = lazy(() => import('../pages/login/LoginPage'));
const OrderPage = lazy(() => import('../pages/order/Order'));
const OrderListPage = lazy(() => import('../pages/orderList/OrderList'));
const PluginPage = lazy(() => import('../pages/plugin/PluginPage'));
const PluginListPage = lazy(() => import('../pages/pluginList/PluginList'));
const PostPage = lazy(() => import('../pages/post/Post'));
const PostListPage = lazy(() => import('../pages/postList/PostList'));
const ProductPage = lazy(() => import('../pages/product/Product'));
const ProductListPage = lazy(() => import('../pages/productList/ProductList'));
const ReviewListPage = lazy(() => import('../pages/reviewList/ReviewList'));
const SettingsPage = lazy(() => import('../pages/settings/Settings'));
const TagPage = lazy(() => import('../pages/tag/Tag'));
const TagListPage = lazy(() => import('../pages/tagList/TagList'));
const ThemeEditPage = lazy(() => import('../pages/themeEdit/ThemeEdit'));
const ThemeListPage = lazy(() => import('../pages/themeList/ThemeList'));
const UserPage = lazy(() => import('../pages/user/User'));
const UserListPage = lazy(() => import('../pages/userList/UserList'));
const WelcomePage = lazy(() => import('../pages/welcome/Welcome'));
const PluginMarket = lazy(() => import('../pages/pluginMarket/PluginMarket'));
const ThemeMarket = lazy(() => import('../pages/themeMarket/ThemeMarket'));
const CouponList = lazy(() => import('../pages/couponList/CouponList'));
const CouponPage = lazy(() => import('../pages/coupon/Coupon'));

export type TSidebarLink = {
    id: string;
    title: string;
    route?: string;
    baseRoute?: string;
    subLinks?: TSidebarLink[];
    icon?: React.ReactNode;
    permissions?: TPermissionName[];
}

export type TPageInfo = {
    name: string;
    route: string;
    baseRoute?: string;
    component: React.ComponentType<Partial<RouteComponentProps>>;
    disableSidebar?: boolean;
    permissions?: TPermissionName[];
}

export const homePageInfo: TPageInfo = {
    name: 'Dashboard',
    route: '/',
    component: DashboardPage,
    permissions: ['read_cms_statistics']
};
export const themeListPageInfo: TPageInfo = {
    name: 'ThemeList',
    route: '/themes',
    component: ThemeListPage,
    permissions: ['read_themes']
};
export const themeEditPageInfo: TPageInfo = {
    name: 'ThemeEdit',
    route: '/theme-editor',
    baseRoute: '/theme-editor',
    component: ThemeEditPage,
    permissions: ['read_themes']
};
export const productListInfo: TPageInfo = {
    name: 'ProductList',
    route: '/products',
    component: ProductListPage,
    permissions: ['read_products']
};
export const productPageInfo: TPageInfo = {
    name: 'ProductList',
    route: '/products/:id',
    baseRoute: '/products',
    component: ProductPage,
    permissions: ['read_products']
};

export const categoryListPageInfo: TPageInfo = {
    name: 'CategoryList',
    route: '/categories',
    component: CategoryListPage,
    permissions: ['read_product_categories']
};
export const categoryPageInfo: TPageInfo = {
    name: 'Category',
    route: '/categories/:id',
    component: CategoryPage,
    baseRoute: '/categories',
    permissions: ['read_product_categories']
};

export const attributesInfo: TPageInfo = {
    name: 'Attributes',
    route: '/attributes',
    component: AttributesPage,
    permissions: ['read_attributes']
};
export const pluginListPageInfo: TPageInfo = {
    name: 'PluginList',
    route: '/plugins',
    component: PluginListPage,
    permissions: ['read_plugins']
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
};
export const postPageInfo: TPageInfo = {
    name: 'Post',
    route: '/posts/:id',
    component: PostPage,
    baseRoute: '/posts',
    permissions: ['read_posts'],
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
};

export const orderPageInfo: TPageInfo = {
    name: 'Order',
    route: '/orders/:id',
    baseRoute: '/orders',
    component: OrderPage,
    permissions: ['read_orders'],
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
}
export const tagListPageInfo: TPageInfo = {
    name: 'Tag List',
    route: '/tags',
    component: TagListPage,
    permissions: ['read_tags'],
}

export const reviewListPageInfo: TPageInfo = {
    name: 'Reviews',
    route: '/reviews',
    component: ReviewListPage,
    permissions: ['read_product_reviews'],
}

export const pluginMarketPageInfo: TPageInfo = {
    name: 'Plugin Market',
    route: '/plugin-market',
    component: PluginMarket,
    permissions: ['read_plugins'],
}
export const themeMarketPageInfo: TPageInfo = {
    name: 'Theme Market',
    route: '/theme-market',
    component: ThemeMarket,
    permissions: ['read_themes'],
}

export const couponPageInfo: TPageInfo = {
    name: 'Coupon',
    route: '/coupons/:id',
    baseRoute: '/coupons',
    component: CouponPage,
    permissions: ['read_coupons'],
}
export const couponListPageInfo: TPageInfo = {
    name: 'Coupon List',
    route: '/coupons',
    component: CouponList,
    permissions: ['read_coupons'],
}