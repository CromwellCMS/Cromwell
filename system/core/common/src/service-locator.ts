import { getCmsSettings } from './global-store';
import { isServer } from './helpers';
import { TCmsConfig } from './types/data';

const getBaseUrl = (key: keyof TCmsConfig): string | null => {
  const cmsConfig = getCmsSettings();
  const url = (cmsConfig?.[key] ?? serviceLocator.defaultLocations[key]) as string;

  if (isServer()) {
    if (!url) {
      console.error('core:serviceLocator: !url for ' + key);
      return null;
    }
    return url;
  }

  if (window.location.hostname === 'localhost') {
    if (url) return url;
  }

  return window.location.protocol + '//' + window.location.host;
};

/**
 * Get base url of a CMS Service
 */
export const serviceLocator = {
  defaultLocations: {
    apiUrl: 'http://localhost:4016',
    adminUrl: 'http://localhost:4064',
    frontendUrl: 'http://localhost:4128',
    centralServerUrl: 'https://api.cromwellcms.com',
  } as TCmsConfig,
  getApiUrl: () => {
    return getBaseUrl('apiUrl');
  },
  getFrontendUrl: () => {
    return getBaseUrl('frontendUrl');
  },
  getAdminUrl: () => {
    return getBaseUrl('adminUrl');
  },
};
