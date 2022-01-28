import { useEffect, useState } from 'react';

import { getCStore, TGetCStoreOptions } from './CStore';

type TUseCStorePropertyOptions = {
    cstoreOptions?: TGetCStoreOptions;
    cstore?: ReturnType<typeof getCStore>;
}

export const useCart = (options?: TUseCStorePropertyOptions) => {
    const cstore = options?.cstore ?? getCStore(options?.cstoreOptions);
    const [cart, setCart] = useState(cstore.getCart());

    useEffect(() => {
        const updateId = cstore.onCartUpdate((cart) => {
            setCart(cart);
        });
        return () => {
            cstore.removeOnCartUpdate(updateId)
        }
    }, []);

    return cart;
}

export const useWishlist = (options?: TUseCStorePropertyOptions) => {
    const cstore = options?.cstore ?? getCStore(options?.cstoreOptions);
    const [list, setList] = useState(cstore.getWishlist());

    useEffect(() => {
        const updateId = cstore.onWishlistUpdate((cart) => {
            setList(cart);
        });
        return () => {
            cstore.removeOnWishlistUpdate(updateId)
        }
    }, []);

    return list;
}

export const useViewedItems = (options?: TUseCStorePropertyOptions) => {
    const cstore = options?.cstore ?? getCStore(options?.cstoreOptions);
    const [list, setList] = useState(cstore.getViewedItems());

    useEffect(() => {
        const updateId = cstore.onViewedItemsUpdate((cart) => {
            setList(cart);
        });
        return () => {
            cstore.removeOnViewedItemsUpdate(updateId)
        }
    }, []);

    return list;
}