import { getCmsSettings } from './global-store';
import { isServer } from './helpers';
import { TCmsConfig } from './types/data';

const getBaseUrl = (key: keyof TCmsConfig) => {
    const cmsConfig = getCmsSettings();
    if (!cmsConfig) {
        console.error('core:serviceLocator: CmsConfig was not found in the global store!');
        return undefined;
    }
    const port = cmsConfig[key] as string;

    if (isServer()) {
        if (!port) {
            console.error('core:serviceLocator: !port for ' + key);
            return undefined;
        }
        return `http://localhost:${port}`;
    }

    if (window.location.hostname === 'localhost') {
        if (!port) {
            console.error('core:serviceLocator: !port for ' + key);
            return undefined;
        }
        return window.location.protocol + '//localhost:' + port;
    }
    else return window.location.protocol + '//' + window.location.host;
}

/**
 * Get base url of a CMS Service
 */
export const serviceLocator = {
    getMainApiUrl: () => {
        return getBaseUrl('apiPort');
    },
    getApiWsUrl: () => {
        return getBaseUrl('apiPort');
    },
    getFrontendUrl: () => {
        return getBaseUrl('frontendPort');
    },
    getAdminPanelUrl: () => {
        return getBaseUrl('adminPanelPort');
    }
};