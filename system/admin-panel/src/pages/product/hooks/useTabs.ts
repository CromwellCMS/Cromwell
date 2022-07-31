import queryString from 'query-string';
import { useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { ProductContext, TProductStore } from '../contexts/Product';

export function useTabs(init?: { store: TProductStore, setStore: (value: TProductStore) => void }): [number, (v: number) => void] {
    const history = useHistory();
    const context = useContext(ProductContext);

    const setStore = init?.setStore ?? context.setStore ?? (() => { });
    const store = init?.store ?? context.store ?? {};

    const changeTab = useCallback((value) => {
        if (value == store.tab || (!value && !store.tab)) return;
        setStore({ ...store, tab: value });

        if (store.productRef?.data?.id) {
            const parsed = queryString.parse(window.location.search);
            if (value != parsed.tab) {
                parsed.tab = value;
                if (!value || value == '0') delete parsed.tab;
                history.push(`${history.location.pathname}?${queryString.stringify(parsed)}`);
            }
        }
    }, [store]);

    return [store.tab, changeTab];
}
