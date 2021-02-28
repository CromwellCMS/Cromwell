import {
    Category as CategoryIcon,
    Dashboard as DashboardIcon,
    FilterList as FilterListIcon,
    FormatPaint as FormatPaintIcon,
    LocalMall as LocalMallIcon,
    Power as PowerIcon,
    Storage as StorageIcon,
    LibraryBooks as LibraryBooksIcon
} from '@material-ui/icons';
import React from 'react';
import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import AttributesPage from '../pages/attributes/AttributesPage';
import HomePage from '../pages/home';
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
                icon: React.createElement(LibraryBooksIcon)
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
    }
]