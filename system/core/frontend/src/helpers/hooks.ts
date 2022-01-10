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
