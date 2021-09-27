import { TUserRole } from '@cromwell/core';
import {
    Dashboard as DashboardIcon,
    FilterList as FilterListIcon,
    FormatPaint as FormatPaintIcon,
    LibraryBooks as LibraryBooksIcon,
    LocalMall as LocalMallIcon,
    LocalOfferOutlined as LocalOfferOutlinedIcon,
    PeopleAlt as PeopleAltIcon,
    Settings as SettingsIcon,
    ShoppingBasket as ShoppingBasketIcon,
    Stars as StarsIcon,
    Storage as StorageIcon,
} from '@material-ui/icons';
import React, { lazy } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import { CategoryIcon, PluginIcon } from './icons';

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

export type SidebarLinkType = {
    id: string;
    title: string;
    route?: string;
    baseRoute?: string;
    sublinks?: SidebarLinkType[];
    icon?: React.ReactNode;
    roles: TUserRole[];
}

export type PageInfo = {
    name: string;
    route: string;
    baseRoute?: string;
    component: React.ComponentType<Partial<RouteComponentProps>>;
    disableSidebar?: boolean;
    roles?: TUserRole[];
}

export const homePageInfo: PageInfo = {
    name: 'Dashboard',
    route: '/',
    component: DashboardPage,
    roles: ['administrator', 'guest'],
};
export const themeListPageInfo: PageInfo = {
    name: 'ThemeList',
    route: '/theme-list',
    component: ThemeListPage,
    roles: ['administrator', 'guest'],
};
export const themeEditPageInfo: PageInfo = {
    name: 'ThemeEdit',
    route: '/theme-edit',
    baseRoute: '/theme-edit',
    component: ThemeEditPage,
    roles: ['administrator', 'guest'],
};
export const productListInfo: PageInfo = {
    name: 'ProductList',
    route: '/product-list',
    component: ProductListPage,
    roles: ['administrator', 'guest'],
};
export const productPageInfo: PageInfo = {
    name: 'ProductList',
    route: '/product/:id',
    baseRoute: '/product',
    component: ProductPage,
    roles: ['administrator', 'guest'],
};

export const categoryListPageInfo: PageInfo = {
    name: 'CategoryList',
    route: '/category-list',
    component: CategoryListPage,
    roles: ['administrator', 'guest'],
};
export const categoryPageInfo: PageInfo = {
    name: 'Category',
    route: '/category/:id',
    component: CategoryPage,
    baseRoute: '/category',
    roles: ['administrator', 'guest'],
};

export const attributesInfo: PageInfo = {
    name: 'Attributes',
    route: '/product-attributes',
    component: AttributesPage,
    roles: ['administrator', 'guest'],
};
export const pluginListPageInfo: PageInfo = {
    name: 'PluginList',
    route: '/plugins',
    component: PluginListPage,
    roles: ['administrator', 'guest'],
};
export const pluginPageInfo: PageInfo = {
    name: 'Plugin',
    baseRoute: '/plugin',
    route: '/plugin',
    component: PluginPage,
    roles: ['administrator', 'guest'],
};

export const postListInfo: PageInfo = {
    name: 'Posts',
    route: '/post-list',
    component: PostListPage,
    roles: ['administrator', 'guest', 'author'],
};
export const postPageInfo: PageInfo = {
    name: 'Post',
    route: '/post/:id',
    component: PostPage,
    baseRoute: '/post',
    roles: ['administrator', 'guest', 'author'],
};

export const loginPageInfo: PageInfo = {
    name: 'Login',
    route: '/login',
    component: LoginPage,
    baseRoute: '/login',
    disableSidebar: true,
};

export const orderListPageInfo: PageInfo = {
    name: 'Order List',
    route: '/order-list',
    component: OrderListPage,
    baseRoute: '/order-list',
    roles: ['administrator', 'guest'],
};

export const orderPageInfo: PageInfo = {
    name: 'Order',
    route: '/order/:id',
    baseRoute: '/order',
    component: OrderPage,
    roles: ['administrator', 'guest'],
};

export const welcomePageInfo: PageInfo = {
    name: 'Welcome',
    route: '/setup',
    component: WelcomePage,
    disableSidebar: true,
};

export const settingsPageInfo: PageInfo = {
    name: 'Settings',
    route: '/settings',
    component: SettingsPage,
    roles: ['administrator', 'guest'],
};

export const userListPageInfo: PageInfo = {
    name: 'User List',
    route: '/user-list',
    component: UserListPage,
    roles: ['administrator', 'guest'],
};
export const userPageInfo: PageInfo = {
    name: 'User',
    route: '/user/:id',
    baseRoute: '/user',
    component: UserPage,
    roles: ['administrator', 'guest', 'author'],
};

export const tagPageInfo: PageInfo = {
    name: 'Tag',
    route: '/tag/:id',
    baseRoute: '/tag',
    component: TagPage,
    roles: ['administrator', 'guest', 'author'],
}
export const tagListPageInfo: PageInfo = {
    name: 'Tag List',
    route: '/tag-list',
    component: TagListPage,
    roles: ['administrator', 'guest', 'author'],
}
export const reviewListPageInfo: PageInfo = {
    name: 'Reviews',
    route: '/review-list',
    component: ReviewListPage,
    roles: ['administrator', 'guest'],
}

export const pluginMarketPageInfo: PageInfo = {
    name: 'Plugin Market',
    route: '/plugin-market',
    component: PluginMarket,
    roles: ['administrator', 'guest'],
}
export const themeMarketPageInfo: PageInfo = {
    name: 'Theme Market',
    route: '/theme-market',
    component: ThemeMarket,
    roles: ['administrator', 'guest'],
}

// Export all pages for react-router
export const pageInfos: PageInfo[] = [
    homePageInfo,
    themeEditPageInfo,
    themeListPageInfo,
    productListInfo,
    productPageInfo,
    pluginListPageInfo,
    attributesInfo,
    pluginPageInfo,
    postListInfo,
    postPageInfo,
    categoryListPageInfo,
    categoryPageInfo,
    loginPageInfo,
    orderListPageInfo,
    welcomePageInfo,
    orderPageInfo,
    settingsPageInfo,
    userListPageInfo,
    userPageInfo,
    tagPageInfo,
    tagListPageInfo,
    reviewListPageInfo,
    pluginMarketPageInfo,
    themeMarketPageInfo,
].filter(i => Boolean(i.component));

// Export links for sidebar
export const sideBarLinks: SidebarLinkType[] = [
    {
        id: '1_homePage',
        title: homePageInfo.name,
        route: homePageInfo.route,
        icon: React.createElement(DashboardIcon),
        roles: ['administrator', 'guest'],
    },
    {
        id: '2_Store',
        title: 'Store',
        icon: React.createElement(LocalMallIcon),
        roles: ['administrator', 'guest'],
        sublinks: [
            {
                id: '3_productList',
                title: 'Products',
                route: productListInfo.route,
                icon: React.createElement(StorageIcon),
                roles: ['administrator', 'guest'],
            },
            {
                id: '4_Attributes',
                title: 'Attributes',
                route: attributesInfo.route,
                icon: React.createElement(FilterListIcon),
                roles: ['administrator', 'guest'],
            },
            {
                id: '5_Categories',
                title: 'Categories',
                route: categoryListPageInfo.route,
                icon: React.createElement(CategoryIcon, {
                    viewBox: "-50 -50 400 400"
                }),
                roles: ['administrator', 'guest'],
            },
            {
                id: '11_Order_list',
                title: 'Orders',
                route: orderListPageInfo.route,
                icon: React.createElement(ShoppingBasketIcon),
                roles: ['administrator', 'guest'],
            },
            {
                id: 'Review_list',
                title: 'Reviews',
                route: reviewListPageInfo.route,
                icon: React.createElement(StarsIcon),
                roles: ['administrator', 'guest'],
            }
        ]
    },
    {
        id: '6_Blog',
        title: 'Blog',
        icon: React.createElement('div', {
            className: sidebarStyles.customIcon,
            style: { backgroundImage: 'url(/admin/static/icon_blogging.png)' }
        }),
        roles: ['administrator', 'guest', 'author'],
        sublinks: [
            {
                id: '7_Posts',
                title: 'Posts',
                route: postListInfo.route,
                icon: React.createElement(LibraryBooksIcon),
                roles: ['administrator', 'guest', 'author'],
            },
            {
                id: 'tags_page',
                title: 'Tags',
                route: tagListPageInfo.route,
                icon: React.createElement(LocalOfferOutlinedIcon),
                roles: ['administrator', 'guest', 'author'],
            },
        ]
    },
    {
        id: '5_themeListPage',
        title: 'Themes',
        route: themeListPageInfo.route,
        icon: React.createElement(FormatPaintIcon),
        roles: ['administrator', 'guest'],
    },
    {
        id: '6_pluginsPage',
        title: 'Plugins',
        route: pluginListPageInfo.route,
        icon: React.createElement(PluginIcon, {
            className: sidebarStyles.customIcon,
            style: {
                filter: 'invert(1)',
            }
        }),
        roles: ['administrator', 'guest'],
    },
    {
        id: 'users_page',
        title: 'Users',
        route: userListPageInfo.route,
        icon: React.createElement(PeopleAltIcon),
        roles: ['administrator', 'guest'],
    },
    {
        id: 'settings_page',
        title: 'Settings',
        route: settingsPageInfo.route,
        icon: React.createElement(SettingsIcon),
        roles: ['administrator', 'guest'],
    }
]

export const getLinkByInfo = (pageInfo: PageInfo) => {
    if (!pageInfo) return;
    const getFromLinks = (links: SidebarLinkType[]): (SidebarLinkType & { parentId?: string }) | undefined => {
        for (const link of links) {
            if (link.route === pageInfo.route) return link;
            if (link.sublinks) {
                const sub = getFromLinks(link.sublinks);
                if (sub) {
                    sub.parentId = link.id;
                    return sub;
                }
            }
        }
    }
    return getFromLinks(sideBarLinks);
}

