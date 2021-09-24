import { getStoreItem, resolvePageRoute, setStoreItem } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';

import { getLogger } from './logger';
import { getThemeConfigs } from './theme-config';

let lastUsedTheme: string | undefined;

/**
 * Purges frontend Next.js page cache by page name and slug. Used to update 
 * Next.js statically generated pages after data update.
 */
export const resetPageCache = async (pageName: string, routeOptions?: {
    slug?: string;
    id?: string;
}) => {
    // Update/load defaultPages first 
    const cmsSettings = getStoreItem('cmsSettings');
    if (lastUsedTheme !== cmsSettings?.themeName) {
        const defaultPages = (await getThemeConfigs())?.themeConfig?.defaultPages;
        setStoreItem('defaultPages', defaultPages);
    }

    const pageRoute = resolvePageRoute(pageName, routeOptions);

    try {
        await getRestApiClient().purgeRendererPageCache(pageRoute);
    } catch (error) {
        getLogger(false).error(error);
    }
}

/**
 * Purges entire Next.js pages cache. Used to update 
 * Next.js statically generated pages after data update.
 */
export const resetAllPagesCache = async () => {
    try {
        await getRestApiClient().purgeRendererEntireCache();
    } catch (error) {
        getLogger(false).error(error);
    }
}