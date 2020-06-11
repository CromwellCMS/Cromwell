import { CromwellStoreType } from './types';
import { isServer } from './constants';

const initialStore: CromwellStoreType = {
    modulesData: {
    },
    blocksData: [
        {
            componentId: '1',
            destinationComponentId: '2',
            destinationPosition: 'after',
            styles: "background: red;"
        },
        {
            componentId: '111',
            destinationComponentId: '3',
            destinationPosition: 'inside',
            isVirtual: true,
            styles: "background: red;",
            moduleName: "ProductShowcaseDemo"
        },
        {
            componentId: '112',
            destinationComponentId: '111',
            destinationPosition: 'after',
            isVirtual: true,
            moduleName: 'ProductShowcase'
        }
    ]
}

if (isServer()) {
    if (!global.CromwellStore)
        global.CromwellStore = initialStore;
}
else {
    if (!window.CromwellStore)
        window.CromwellStore = initialStore;
}

export const getStoreItem = <K extends keyof CromwellStoreType>(itemName: K): CromwellStoreType[K] => {
    if (isServer()) {
        return global.CromwellStore[itemName];
    }
    else {
        return window.CromwellStore[itemName];
    }
}

export const setStoreItem = <K extends keyof CromwellStoreType>(itemName: K, item: CromwellStoreType[K]): void => {
    if (isServer()) {
        global.CromwellStore[itemName] = item;
    }
    else {
        window.CromwellStore[itemName] = item;
    }
}