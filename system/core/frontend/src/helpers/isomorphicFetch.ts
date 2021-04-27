import { isServer, getStore } from '@cromwell/core';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

export const fetch = (...args) => {
    let func: any;
    if (isServer()) {
        try {
            func = Function('require', "return require('node-fetch')")(require);
        } catch (e) { }
        if (!func) func = getStore()?.nodeModules?.modules?.['node-fetch'];
        if (!func) throw new Error('@cromwell/core-frontend: Failed to require node-fetch');
    } else func = fetchPolyfill;

    return func(...args);
}