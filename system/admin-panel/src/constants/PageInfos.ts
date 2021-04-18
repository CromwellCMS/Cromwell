import SidebarLink from '@App/components/sidebar/SidebarLink';
import { TPageConfig } from '@cromwell/core/es';
import {
    Category as CategoryIcon,
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
    Storage as StorageIcon,
} from '@material-ui/icons';
import React from 'react';

import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import AttributesPage from '../pages/attributes/AttributesPage';
import CategoryPage from '../pages/category/CategoryPage';
import CategoryListPage from '../pages/categoryList/CategoryList';
import HomePage from '../pages/home/Home';
import LoginPage from '../pages/login/LoginPage';
import OrderPage from '../pages/order/Order';
import OrderListPage from '../pages/orderList/OrderList';
import PluginPage from '../pages/plugin/PluginPage';
import PluginListPage from '../pages/pluginList/PluginList';
import PostPage from '../pages/post/Post';
import PostListPage from '../pages/postList/PostList';
import ProductPage from '../pages/product/Product';
import ProductListPage from '../pages/productList/ProductList';
import SettingsPage from '../pages/settings/Settings';
import TagPage from '../pages/tag/Tag';
import TagListPage from '../pages/tagList/TagList';
import ThemeEditPage from '../pages/themeEdit/ThemeEdit';
import ThemeListPage from '../pages/themeList/ThemeList';
import UserPage from '../pages/user/User';
import UserListPage from '../pages/userList/UserList';
import WelcomePage from '../pages/welcome/Welcome';

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
    component: React.ComponentType;
    disableSidebar?: boolean;
}

export const homePageInfo: PageInfo = {
    name: 'Dashboard',
    route: '/',
    component: HomePage
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
    tagListPageInfo
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
                icon: React.createElement(StorageIcon)
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
                icon: React.createElement(CategoryIcon)
            },
            {
                id: '11_Order_list',
                title: 'Orders',
                route: orderListPageInfo.route,
                icon: React.createElement(ShoppingBasketIcon)
            }
        ]
    },
    {
        id: '6_Blog',
        title: 'Blog',
        icon: React.createElement('div', {
            className: sidebarStyles.customIcon,
            style: { backgroundImage: 'url(/icon_blogging.png)' }
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