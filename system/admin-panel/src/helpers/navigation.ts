import { getStoreItem } from '@cromwell/core';
import {
    ConfirmationNumber as ConfirmationNumberIcon,
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
} from '@mui/icons-material';
import React from 'react';

import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import { CategoryIcon, PluginIcon } from '../constants/icons';
import {
    attributesInfo,
    categoryListPageInfo,
    categoryPageInfo,
    couponListPageInfo,
    couponPageInfo,
    homePageInfo,
    loginPageInfo,
    orderListPageInfo,
    orderPageInfo,
    pluginListPageInfo,
    pluginMarketPageInfo,
    pluginPageInfo,
    postListInfo,
    postPageInfo,
    productListInfo,
    productPageInfo,
    reviewListPageInfo,
    settingsPageInfo,
    tagListPageInfo,
    tagPageInfo,
    themeEditPageInfo,
    themeListPageInfo,
    themeMarketPageInfo,
    TPageInfo,
    TSidebarLink,
    userListPageInfo,
    userPageInfo,
    welcomePageInfo,
} from '../constants/PageInfos';
import { getCustomEntityPages, getCustomEntitySidebarLinks } from '../helpers/customEntities';
import { store } from '../redux/store';

const pageInfoModifiers: Record<string, (infos: TPageInfo[]) => TPageInfo[]> = {}
const sidebarLinkModifiers: Record<string, (infos: TSidebarLink[]) => TSidebarLink[]> = {}

export const registerPageInfoModifier = (key: string, modifier: (infos: TPageInfo[]) => TPageInfo[]) => {
    pageInfoModifiers[key] = modifier;
    getStoreItem('forceUpdatePage')?.();
}

export const registerSidebarLinkModifier = (key: string, modifier: (links: TSidebarLink[]) => TSidebarLink[]) => {
    sidebarLinkModifiers[key] = modifier;
    store.getState().forceUpdateSidebar?.();
}

// Export all pages for react-router
export const getPageInfos = (): TPageInfo[] => {
    const defaultPageInfos: TPageInfo[] = [
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
        couponListPageInfo,
        couponPageInfo,
    ];

    let infos = [...defaultPageInfos, ...getCustomEntityPages()].filter(i => Boolean(i.component));
    for (const modifier of Object.values(pageInfoModifiers)) {
        infos = modifier(infos);
    }
    return infos.filter(i => Boolean(i.component));
}

// Export links for sidebar
export const getSideBarLinks = (): TSidebarLink[] => {
    let links: TSidebarLink[] = [
        {
            id: '1_homePage',
            title: homePageInfo.name,
            route: homePageInfo.route,
            icon: React.createElement(DashboardIcon),
            permissions: ['read_cms_statistics'],
        },
        {
            id: '2_Store',
            title: 'Store',
            icon: React.createElement(LocalMallIcon),
            subLinks: [
                {
                    id: '3_productList',
                    title: 'Products',
                    route: productListInfo.route,
                    icon: React.createElement(StorageIcon),
                    permissions: ['read_products'],
                },
                {
                    id: '4_Attributes',
                    title: 'Attributes',
                    route: attributesInfo.route,
                    icon: React.createElement(FilterListIcon),
                    permissions: ['read_attributes'],
                },
                {
                    id: '5_Categories',
                    title: 'Categories',
                    route: categoryListPageInfo.route,
                    icon: React.createElement(CategoryIcon, {
                        viewBox: "-50 -50 400 400"
                    }),
                    permissions: ['read_product_categories'],
                },
                {
                    id: '11_Order_list',
                    title: 'Orders',
                    route: orderListPageInfo.route,
                    icon: React.createElement(ShoppingBasketIcon),
                    permissions: ['read_orders'],
                },
                {
                    id: 'Coupon_list',
                    title: 'Coupons',
                    route: couponListPageInfo.route,
                    icon: React.createElement(ConfirmationNumberIcon),
                    permissions: ['read_coupons'],
                },
                {
                    id: 'Review_list',
                    title: 'Reviews',
                    route: reviewListPageInfo.route,
                    icon: React.createElement(StarsIcon),
                    permissions: ['read_product_reviews'],
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
            subLinks: [
                {
                    id: '7_Posts',
                    title: 'Posts',
                    route: postListInfo.route,
                    icon: React.createElement(LibraryBooksIcon),
                    permissions: ['read_posts'],
                },
                {
                    id: 'tags_page',
                    title: 'Tags',
                    route: tagListPageInfo.route,
                    icon: React.createElement(LocalOfferOutlinedIcon),
                    permissions: ['read_tags'],
                },
            ]
        },
        ...getCustomEntitySidebarLinks(),
        {
            id: '5_themeListPage',
            title: 'Themes',
            route: themeListPageInfo.route,
            icon: React.createElement(FormatPaintIcon),
            permissions: ['read_themes'],
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
            permissions: ['read_plugins'],
        },
        {
            id: 'users_page',
            title: 'Users',
            route: userListPageInfo.route,
            icon: React.createElement(PeopleAltIcon),
            permissions: ['read_users'],
        },
        {
            id: 'settings_page',
            title: 'Settings',
            route: settingsPageInfo.route,
            icon: React.createElement(SettingsIcon),
            permissions: ['read_cms_settings'],
        }
    ];

    for (const modifier of Object.values(sidebarLinkModifiers)) {
        links = modifier(links);
    }
    return links;
}

export const getSideBarLinksFlat = () => {
    const links: TSidebarLink[] = [];
    const pushLinks = (link: TSidebarLink) => {
        links.push(link);
        link.subLinks?.forEach(pushLinks);
    }
    getSideBarLinks().forEach(pushLinks);
    return links;
}

export const getLinkByInfo = (pageInfo: TPageInfo) => {
    if (!pageInfo) return;
    const getFromLinks = (links: TSidebarLink[]): (TSidebarLink & { parentId?: string }) | undefined => {
        for (const link of links) {
            if (link.route === pageInfo.route) return link;
            if (link.subLinks) {
                const sub = getFromLinks(link.subLinks);
                if (sub) {
                    sub.parentId = link.id;
                    return sub;
                }
            }
        }
    }
    return getFromLinks(getSideBarLinks());
}
