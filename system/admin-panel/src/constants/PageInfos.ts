import {
    Dashboard as DashboardIcon,
    FilterList as FilterListIcon,
    FormatPaint as FormatPaintIcon,
    LibraryBooks as LibraryBooksIcon,
    LocalMall as LocalMallIcon,
    LocalOfferOutlined as LocalOfferOutlinedIcon,
    PeopleAlt as PeopleAltIcon,
    Power as PowerIcon,
    Settings as SettingsIcon,
    ShoppingBasket as ShoppingBasketIcon,
    Stars as StarsIcon,
    Storage as StorageIcon,
} from '@material-ui/icons';
import React, { lazy } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import { CategoryIcon } from './icons';

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

export type SidebarLinkType = {
    id: string;
    title: string;
    route?: string;
    baseRoute?: string;
    sublinks?: SidebarLinkType[];
    icon?: React.ReactNode;
}

export type PageInfo = {
    name: string;
    route: string;
    baseRoute?: string;
    component: React.ComponentType<Partial<RouteComponentProps>>;
    disableSidebar?: boolean;
}

export const homePageInfo: PageInfo = {
    name: 'Dashboard',
    route: '/',
    component: DashboardPage
};
export const themeListPageInfo: PageInfo = {
    name: 'ThemeList',
    route: '/theme-list',
    component: ThemeListPage
};
export const themeEditPageInfo: PageInfo = {
    name: 'ThemeEdit',
    route: '/theme-edit/:themeName',
    baseRoute: '/theme-edit',
    component: ThemeEditPage
};
export const productListInfo: PageInfo = {
    name: 'ProductList',
    route: '/product-list',
    component: ProductListPage
};
export const productPageInfo: PageInfo = {
    name: 'ProductList',
    route: '/product/:id',
    baseRoute: '/product',
    component: ProductPage
};

export const categoryListPageInfo: PageInfo = {
    name: 'CategoryList',
    route: '/category-list',
    component: CategoryListPage,
};
export const categoryPageInfo: PageInfo = {
    name: 'Category',
    route: '/category/:id',
    component: CategoryPage,
    baseRoute: '/category',
};

export const attributesInfo: PageInfo = {
    name: 'Attributes',
    route: '/product-attributes',
    component: AttributesPage
};
export const pluginListPageInfo: PageInfo = {
    name: 'PluginList',
    route: '/plugins',
    component: PluginListPage
};
export const pluginPageInfo: PageInfo = {
    name: 'Plugin',
    baseRoute: '/plugin',
    route: '/plugin',
    component: PluginPage
};

export const postListInfo: PageInfo = {
    name: 'Posts',
    route: '/post-list',
    component: PostListPage
};
export const postPageInfo: PageInfo = {
    name: 'Post',
    route: '/post/:id',
    component: PostPage,
    baseRoute: '/post',
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
};

export const orderPageInfo: PageInfo = {
    name: 'Order',
    route: '/order/:id',
    baseRoute: '/order',
    component: OrderPage,
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
};

export const userListPageInfo: PageInfo = {
    name: 'User List',
    route: '/user-list',
    component: UserListPage,
};
export const userPageInfo: PageInfo = {
    name: 'User',
    route: '/user/:id',
    baseRoute: '/user',
    component: UserPage,
};

export const tagPageInfo: PageInfo = {
    name: 'Tag',
    route: '/tag/:id',
    baseRoute: '/tag',
    component: TagPage,
}
export const tagListPageInfo: PageInfo = {
    name: 'Tag List',
    route: '/tag-list',
    component: TagListPage,
}
export const reviewListPageInfo: PageInfo = {
    name: 'Reviews',
    route: '/review-list',
    component: ReviewListPage,
}


// Export all pages for react-router
export const pageInfos: PageInfo[] = [
    homePageInfo,
    themeEditPageInfo,
    themeListPageInfo,
    productListInfo,
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
].filter(i => Boolean(i.component));

// Export links for sidebar
export const sideBarLinks: SidebarLinkType[] = [
    {
        id: '1_homePage',
        title: homePageInfo.name,
        route: homePageInfo.route,
        icon: React.createElement(DashboardIcon)
    },
    {
        id: '2_Store',
        title: 'Store',
        icon: React.createElement(LocalMallIcon),
        sublinks: [
            {
                id: '3_productList',
                title: 'Products',
                route: productListInfo.route,
                icon: React.createElement(StorageIcon),
            },
            {
                id: '4_Attributes',
                title: 'Attributes',
                route: attributesInfo.route,
                icon: React.createElement(FilterListIcon)
            },
            {
                id: '5_Categories',
                title: 'Categories',
                route: categoryListPageInfo.route,
                icon: React.createElement(CategoryIcon, {
                    viewBox: "0 0 300 300"
                }),
            },
            {
                id: '11_Order_list',
                title: 'Orders',
                route: orderListPageInfo.route,
                icon: React.createElement(ShoppingBasketIcon)
            },
            {
                id: 'Review_list',
                title: 'Reviews',
                route: reviewListPageInfo.route,
                icon: React.createElement(StarsIcon)
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
        sublinks: [
            {
                id: '7_Posts',
                title: 'Posts',
                route: postListInfo.route,
                icon: React.createElement(LibraryBooksIcon),
            },
            {
                id: 'tags_page',
                title: 'Tags',
                route: tagListPageInfo.route,
                icon: React.createElement(LocalOfferOutlinedIcon),
            },
        ]
    },
    {
        id: '5_themeListPage',
        title: 'Themes',
        route: themeListPageInfo.route,
        icon: React.createElement(FormatPaintIcon)
    },
    {
        id: '6_pluginsPage',
        title: 'Plugins',
        route: pluginListPageInfo.route,
        icon: React.createElement(PowerIcon)
    },
    {
        id: 'users_page',
        title: 'Users',
        route: userListPageInfo.route,
        icon: React.createElement(PeopleAltIcon)
    },
    {
        id: 'settings_page',
        title: 'Settings',
        route: settingsPageInfo.route,
        icon: React.createElement(SettingsIcon)
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

