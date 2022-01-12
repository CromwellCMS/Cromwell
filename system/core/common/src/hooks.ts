import { useEffect, useState } from 'react';

import { getStoreItem, onStoreChange, removeOnStoreChange } from './global-store';
import { TCromwellStore } from './types/data';

const createStoreItemHook = <K extends keyof TCromwellStore>(key: K): (() => TCromwellStore[K]) => {
    return () => {
        const [item, setItem] = useState(getStoreItem(key));

        useEffect(() => {
            const onChange = (changed) => {
                setItem(changed)
            }
            const cbId = onStoreChange(key, onChange);

            return () => {
                removeOnStoreChange(key, cbId);
            }
        }, []);

        return item;
    }
}

export const useUserInfo = createStoreItemHook('userInfo');
export const useCurrency = createStoreItemHook('currency');
export const useCmsSettings = createStoreItemHook('cmsSettings');