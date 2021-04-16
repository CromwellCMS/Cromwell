import {
    Category as CategoryIcon,
    Dashboard as DashboardIcon,
    FilterList as FilterListIcon,
    FormatPaint as FormatPaintIcon,
    LocalMall as LocalMallIcon,
    Power as PowerIcon,
    Storage as StorageIcon,
    LibraryBooks as LibraryBooksIcon,
    ShoppingBasket as ShoppingBasketIcon,
    Settings as SettingsIcon,
    PeopleAlt as PeopleAltIcon,
    LocalOfferOutlined as LocalOfferOutlinedIcon,
} from '@material-ui/icons';
import React from 'react';
import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import AttributesPage from '../pages/attributes/AttributesPage';
import HomePage from '../pages/home/Home';
import PluginPage from '../pages/plugin/PluginPage';
import PluginListPage from '../pages/pluginList/PluginList';
import ProductPage from '../pages/product/Product';
import ProductListPage from '../pages/productList/ProductList';
import ThemeEditPage from '../pages/themeEdit/ThemeEdit';
import ThemeListPage from '../pages/themeList/ThemeList';
import PostListPage from '../pages/postList/PostList';
import CategoryPage from '../pages/category/CategoryPage';
import PostPage from '../pages/post/Post';
import CategoryListPage from '../pages/categoryList/CategoryList';
import LoginPage from '../pages/login/LoginPage';
import WelcomePage from '../pages/welcome/Welcome';
import OrderListPage from '../pages/orderList/OrderList';
import OrderPage from '../pages/order/Order';
import SettingsPage from '../pages/settings/Settings';
import UserListPage from '../pages/userList/UserList';
import UserPage from '../pages/user/User';
import TagListPage from '../pages/tagList/TagList';
import TagPage from '../pages/tag/Tag';

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