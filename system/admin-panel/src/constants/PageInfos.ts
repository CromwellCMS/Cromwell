import React from 'react';
import HomePage from '../pages/home';
import PluginsPage from '../pages/plugins';
import ThemeEditPage from '../pages/themeEdit/ThemeEdit';
import ThemeListPage from '../pages/themeList/ThemeList';
import ProductListPage from '../pages/productList/ProductList';
import ProductPage from '../pages/product/Product';
import AttributesPage from '../pages/attributes/AttributesPage';
import {
    Dashboard as DashboardIcon,
    LocalMall as LocalMallIcon,
    Power as PowerIcon,
    FormatPaint as FormatPaintIcon,
    FilterList as FilterListIcon,
    Storage as StorageIcon,
    Category as CategoryIcon
} from '@material-ui/icons';


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
export const pluginsPageInfo: PageInfo = {
    name: 'Plugins',
    route: '/plugins',
    component: PluginsPage
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
export const productInfo: PageInfo = {
    name: 'ProductList',
    route: '/product/:id',
    baseRoute: '/product',
    component: ProductPage
};
export const attributesInfo: PageInfo = {
    name: 'Attributes',
    route: '/product-attributes',
    component: AttributesPage
};

// Export all pages for react-router
export const pageInfos: PageInfo[] = [
    homePageInfo,
    themeEditPageInfo,
    themeListPageInfo,
    productListInfo,
    productListInfo,
    productInfo,
    pluginsPageInfo,
    attributesInfo,
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
                route: productListInfo.route,
                icon: React.createElement(CategoryIcon)
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
        title: pluginsPageInfo.name,
        route: pluginsPageInfo.route,
        icon: React.createElement(PowerIcon)
    }
]