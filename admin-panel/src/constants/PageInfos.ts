import React from 'react';
import { pluginNames, importPlugin } from '../../.cromwell/imports/imports.gen';
import HomePage from '../pages/home';
import PluginsPage from '../pages/plugins';

export type SidebarLinkType = {
    title: string;
    route: string;
    sublinks?: SidebarLinkType[];
}

export type PageInfo = {
    name: string;
    route: string;
    component: React.ComponentType;
}

const homePageInfo: PageInfo = {
    name: 'Home',
    route: '/',
    component: HomePage
};
const pluginsPageInfo: PageInfo = {
    name: 'Plugins',
    route: '/plugins',
    component: PluginsPage
};

const pluginPages: PageInfo[] = pluginNames.map((name: string) => {
    return {
        name,
        route: '/plugins/' + name,
        component: importPlugin(name) as React.ComponentType
    }
}).filter(i => Boolean(i.component));

export const pageInfos: PageInfo[] = [
    homePageInfo,
    pluginsPageInfo,
    ...pluginPages
].filter(i => Boolean(i.component));


export const sideBarLinks: SidebarLinkType[] = [
    {
        title: homePageInfo.name,
        route: homePageInfo.route
    },
    {
        title: pluginsPageInfo.name,
        route: pluginsPageInfo.route,
        sublinks: pluginPages.map(p => {
            return { title: p.name, route: p.route }
        })
    }
]