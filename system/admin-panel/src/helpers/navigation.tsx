
import { BadgeCheckIcon, ClipboardListIcon, CogIcon, CollectionIcon, DocumentDuplicateIcon, HashtagIcon, HomeIcon, MailIcon, PencilAltIcon, ShoppingBagIcon, StarIcon, TagIcon, TemplateIcon, UsersIcon, ViewGridAddIcon } from "@heroicons/react/solid";
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
            icon: <HomeIcon className="h-5 w-5" />,
            roles: ['administrator', 'guest'],
        },
        {
            id: '2_Store',
            title: 'Store',
            icon: <ShoppingBagIcon className="h-5 w-5" />,
            roles: ['administrator', 'guest'],
            subLinks: [
                {
                    id: '3_productList',
                    title: 'Products',
                    route: productListInfo.route,
                    icon: <CollectionIcon className="h-5 w-5" />,
                    roles: ['administrator', 'guest'],
                },
                {
                    id: '4_Attributes',
                    title: 'Attributes',
                    route: attributesInfo.route,
                    icon: <TagIcon className="h-5 w-5" />,
                    roles: ['administrator', 'guest'],
                },
                {
                    id: '5_Categories',
                    title: 'Categories',
                    route: categoryListPageInfo.route,
                    icon: <HashtagIcon className="h-5 w-5" />,
                    roles: ['administrator', 'guest'],
                },
                {
                    id: '11_Order_list',
                    title: 'Orders',
                    route: orderListPageInfo.route,
                    icon: <ShoppingBagIcon className="h-5 w-5" />,
                    roles: ['administrator', 'guest'],
                },
                {
                    id: 'Coupon_list',
                    title: 'Coupons',
                    route: couponListPageInfo.route,
                    icon: <BadgeCheckIcon className="h-5 w-5" />,
                    roles: ['administrator', 'guest'],
                },
                {
                    id: 'Review_list',
                    title: 'Reviews',
                    route: reviewListPageInfo.route,
                    icon: <StarIcon className="h-5 w-5" />,
                    roles: ['administrator', 'guest'],
                }
            ]
        },
        {
            id: '6_Blog',
            title: 'Blog',
            icon: <PencilAltIcon className="h-5 w-5" />,
            roles: ['administrator', 'guest', 'author'],
            subLinks: [
                {
                    id: '7_Posts',
                    title: 'Posts',
                    route: postListInfo.route,
                    icon: <DocumentDuplicateIcon className="h-5 w-5" />,
                    roles: ['administrator', 'guest', 'author'],
                },
                {
                    id: 'tags_page',
                    title: 'Tags',
                    route: tagListPageInfo.route,
                    icon: <TagIcon className="h-5 w-5" />,
                    roles: ['administrator', 'guest', 'author'],
                },
            ]
        },
        ...getCustomEntitySidebarLinks(),
        {
            id: '5_themeListPage',
            title: 'Theme Editor',
            route: themeEditPageInfo.route,
            icon: <TemplateIcon className="h-5 w-5" />,
            roles: ['administrator', 'guest'],
        },
        {
            id: '6_pluginsPage',
            title: 'Plugins',
            route: pluginListPageInfo.route,
            icon: <ViewGridAddIcon className="h-5 w-5" />,
            roles: ['administrator', 'guest'],
        },
        {
            id: 'users_page',
            title: 'Users',
            route: userListPageInfo.route,
            icon: <UsersIcon className="h-5 w-5" />,
            roles: ['administrator', 'guest'],
        },
        {
            id: 'settings_page',
            title: 'Settings',
            route: settingsPageInfo.route,
            icon: <CogIcon className="h-5 w-5" />,
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
