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
    ConfirmationNumber as ConfirmationNumberIcon,
} from '@mui/icons-material';
import React from 'react';
import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import { CategoryIcon, PluginIcon } from '../constants/icons';
import {
    attributesInfo,
    categoryListPageInfo,
    categoryPageInfo,
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
    couponListPageInfo,
    couponPageInfo,
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

const pageInfoModifiers: Record<string, (infos: TPageInfo[]) => TPageInfo[]> = {}
const sidebarLinkModifiers: Record<string, (infos: TSidebarLink[]) => TSidebarLink[]> = {}

export const registerPageInfoModifier = (key: string, modifier: (infos: TPageInfo[]) => TPageInfo[]) => {
    pageInfoModifiers[key] = modifier;
}
export const registerSidebarLinkModifier = (key: string, modifier: (links: TSidebarLink[]) => TSidebarLink[]) => {
    sidebarLinkModifiers[key] = modifier;
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
            roles: ['administrator', 'guest'],
        },
        {
            id: '2_Store',
            title: 'Store',
            icon: React.createElement(LocalMallIcon),
            roles: ['administrator', 'guest'],
            subLinks: [
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
                    id: 'Coupon_list',
                    title: 'Coupons',
                    route: couponListPageInfo.route,
                    icon: React.createElement(ConfirmationNumberIcon),
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
            subLinks: [
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
        ...getCustomEntitySidebarLinks(),
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
    ];

    for (const modifier of Object.values(sidebarLinkModifiers)) {
        links = modifier(links);
    }
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
