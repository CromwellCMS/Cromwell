import { getStoreItem, resolvePageRoute, serviceLocator, setStoreItem, TDefaultPageName } from '@cromwell/core';
import fetch from 'node-fetch';

import { getLogger } from './logger';
import { getThemeConfigs } from './theme-config';

let lastUsedTheme: string | undefined;

/**
 * Request frontend page by page name and slug. Used to revalidate Next.js static pages
 * after data update.
 */
export const requestPage = async (pageName: TDefaultPageName, routeOptions?: {
    slug?: string;
    id?: string;
}) => {
    // Update/load defaultPages first 
    const cmsSettings = getStoreItem('cmsSettings');
    if (lastUsedTheme !== cmsSettings?.themeName) {
        const defaultPages = (await getThemeConfigs())?.themeConfig?.defaultPages;
        setStoreItem('defaultPages', defaultPages);
    }

    const pageRoute = serviceLocator.getFrontendUrl() + resolvePageRoute(pageName, routeOptions);

    try {
        await fetch(pageRoute);
    } catch (error) {
        getLogger().error(error);
    }
}