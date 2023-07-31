import { resolvePageRoute, setStoreItem } from '@cromwell/core';
import { getCmsSettings, getLogger, getThemeConfigs } from '@cromwell/core-backend';
import { Container } from 'typedi';

import { RendererService } from '../services/renderer.service';

let lastUsedTheme: string | undefined;

/**
 * Purges frontend Next.js page cache by page name and slug. Used to update
 * Next.js statically generated pages after data update.
 */
export const resetPageCache = async (
  pageName: string,
  routeOptions?: {
    slug?: string;
    id?: string;
  },
) => {
  // Update/load defaultPages first
  const cmsSettings = await getCmsSettings();

  if (cmsSettings?.themeName && lastUsedTheme !== cmsSettings.themeName) {
    lastUsedTheme = cmsSettings.themeName;
    const defaultPages = (await getThemeConfigs(cmsSettings.themeName))?.themeConfig?.defaultPages;
    setStoreItem('defaultPages', defaultPages);
  }

  const pageRoute = resolvePageRoute(pageName, routeOptions);

  try {
    await Container.get(RendererService).purgePageCache(pageRoute);
  } catch (error) {
    getLogger(false).error(error);
  }
};

/**
 * Purges entire Next.js pages cache. Used to update
 * Next.js statically generated pages after data update.
 */
export const resetAllPagesCache = async () => {
  try {
    await Container.get(RendererService).purgeEntireCache();
  } catch (error) {
    getLogger(false).error(error);
  }
};
