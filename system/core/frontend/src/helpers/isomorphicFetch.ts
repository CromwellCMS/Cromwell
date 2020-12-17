import { isServer } from '@cromwell/core';
import { fetch as fetchPolyfill } from 'whatwg-fetch';

export const fetch = (...args) => {
    const func = isServer() ? Function("return require('node-fetch')")() : fetchPolyfill;
    return func(args);
}