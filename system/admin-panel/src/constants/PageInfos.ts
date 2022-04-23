import { TUserRole } from '@cromwell/core';
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
    roles: TUserRole[];
}

export type TPageInfo = {
    name: string;
    route: string;
    baseRoute?: string;
    component: React.ComponentType<Partial<RouteComponentProps>>;
    disableSidebar?: boolean;
    roles?: TUserRole[];
    minimizeSidebar?: boolean;
}

export const homePageInfo: TPageInfo = {
    name: 'Dashboard',
    route: '/',
    component: DashboardPage,
    roles: ['administrator', 'guest'],
};
export const themeListPageInfo: TPageInfo = {
    name: 'ThemeList',
    route: '/themes',
    component: ThemeListPage,
    roles: ['administrator', 'guest'],
};
export const themeEditPageInfo: TPageInfo = {
    name: 'ThemeEdit',
    route: '/theme-editor',
    baseRoute: '/theme-editor',
    component: ThemeEditPage,
    roles: ['administrator', 'guest'],
    minimizeSidebar: true,
    disableSidebar: true,
};
export const productListInfo: TPageInfo = {
    name: 'ProductList',
    route: '/products',
    component: ProductListPage,
    roles: ['administrator', 'guest'],
};
export const productPageInfo: TPageInfo = {
    name: 'ProductList',
    route: '/products/:id',
    baseRoute: '/products',
    component: ProductPage,
    roles: ['administrator', 'guest'],
};

export const categoryListPageInfo: TPageInfo = {
    name: 'CategoryList',
    route: '/categories',
    component: CategoryListPage,
    roles: ['administrator', 'guest'],
};
export const categoryPageInfo: TPageInfo = {
    name: 'Category',
    route: '/categories/:id',
    component: CategoryPage,
    baseRoute: '/categories',
    roles: ['administrator', 'guest'],
};

export const attributesInfo: TPageInfo = {
    name: 'Attributes',
    route: '/attributes',
    component: AttributesPage,
    roles: ['administrator', 'guest'],
};
export const pluginListPageInfo: TPageInfo = {
    name: 'PluginList',
    route: '/plugins',
    component: PluginListPage,
    roles: ['administrator', 'guest'],
};
export const pluginPageInfo: TPageInfo = {
    name: 'Plugin',
    baseRoute: '/plugin',
    route: '/plugin',
    component: PluginPage,
    roles: ['administrator', 'guest'],
};

export const postListInfo: TPageInfo = {
    name: 'Posts',
    route: '/posts',
    component: PostListPage,
    roles: ['administrator', 'guest', 'author'],
};
export const postPageInfo: TPageInfo = {
    name: 'Post',
    route: '/posts/:id',
    component: PostPage,
    baseRoute: '/posts',
    roles: ['administrator', 'guest', 'author'],
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
    roles: ['administrator', 'guest'],
};

export const orderPageInfo: TPageInfo = {
    name: 'Order',
    route: '/orders/:id',
    baseRoute: '/orders',
    component: OrderPage,
    roles: ['administrator', 'guest'],
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
    roles: ['administrator', 'guest'],
};

export const userListPageInfo: TPageInfo = {
    name: 'User List',
    route: '/users',
    component: UserListPage,
    roles: ['administrator', 'guest'],
};
export const userPageInfo: TPageInfo = {
    name: 'User',
    route: '/users/:id',
    baseRoute: '/users',
    component: UserPage,
    roles: ['administrator', 'guest', 'author'],
};

export const tagPageInfo: TPageInfo = {
    name: 'Tag',
    route: '/tags/:id',
    baseRoute: '/tags',
    component: TagPage,
    roles: ['administrator', 'guest', 'author'],
}
export const tagListPageInfo: TPageInfo = {
    name: 'Tag List',
    route: '/tags',
    component: TagListPage,
    roles: ['administrator', 'guest', 'author'],
}

export const reviewListPageInfo: TPageInfo = {
    name: 'Reviews',
    route: '/reviews',
    component: ReviewListPage,
    roles: ['administrator', 'guest'],
}

export const pluginMarketPageInfo: TPageInfo = {
    name: 'Plugin Market',
    route: '/plugin-market',
    component: PluginMarket,
    roles: ['administrator', 'guest'],
}
export const themeMarketPageInfo: TPageInfo = {
    name: 'Theme Market',
    route: '/theme-market',
    component: ThemeMarket,
    roles: ['administrator', 'guest'],
}

export const couponPageInfo: TPageInfo = {
    name: 'Coupon',
    route: '/coupons/:id',
    baseRoute: '/coupons',
    component: CouponPage,
    roles: ['administrator', 'guest'],
}
export const couponListPageInfo: TPageInfo = {
    name: 'Coupon List',
    route: '/coupons',
    component: CouponList,
    roles: ['administrator', 'guest'],
}