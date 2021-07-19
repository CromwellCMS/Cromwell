import { isServer, getStore } from '@cromwell/core';

let lastUsedFunc;
/**
 * Isomorphic fetch
 */
export const fetch = (...args) => {
    if (!lastUsedFunc) {
        if (isServer()) {
            try {
                lastUsedFunc = eval(`require('node-fetch');`);
            } catch (e) { }
            if (!lastUsedFunc) lastUsedFunc = getStore()?.nodeModules?.modules?.['node-fetch'];
            if (!lastUsedFunc) throw new Error('@cromwell/core-frontend: Failed to require node-fetch');
        } else lastUsedFunc = window.fetch;
    }
    return lastUsedFunc(...args);
}