import { TProduct } from '@cromwell/core';
import { useEffect, useRef, useState } from 'react';

import { moduleState } from './state';

/**
 * A hook that will track selection of product attributes by user and apply
 * product variants, so returned value will be modified product (new object).
 * Store this value in a separate variable and do not pass this modified value back.
 * @param original Original, unmodified product
 */
export const useProductVariants = (original?: TProduct | null): TProduct => {
    const productRef = useRef(original);
    const [product, setProduct] = useState(original);
    if (original && original.id !== productRef.current?.id) {
        productRef.current = original;
        setProduct(original);
    }

    useEffect(() => {
        const onUpdateId = product?.id && moduleState.addOnProductUpdateListener(product.id, () => {
            const modified = moduleState.products[product.id]?.modifiedProduct ?? product;
            if (modified) setProduct(modified);
        });

        return () => {
            if (product?.id) {
                delete moduleState.products[product.id];
                if (onUpdateId) moduleState.removeOnProductUpdateListener(product?.id, onUpdateId);
            }
        }
    }, [productRef.current]);

    return product!;
}
