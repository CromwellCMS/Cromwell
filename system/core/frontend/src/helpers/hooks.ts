import { useEffect, useState } from 'react';

import { getCStore } from './CStore';

export const useCart = () => {
    const cstore = getCStore();
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

export const useWishlist = () => {
    const cstore = getCStore();
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

export const useViewedItems = () => {
    const cstore = getCStore();
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