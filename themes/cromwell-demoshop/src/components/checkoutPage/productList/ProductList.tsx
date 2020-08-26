import React, { useState, useEffect } from 'react';
import * as actions from '../../../helpers/productActions';
import { LoadBox } from '../../loadbox/Loadbox'
import { getGraphQLClient } from '@cromwell/core-frontend';
import { TProduct } from '@cromwell/core';

const ProductList = () => {
    const [products, setProducts] = useState<TProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const client = getGraphQLClient();
    useEffect(() => {
        (async () => {
            const cart = actions.getCart().filter(p => Boolean(p.product));
            const promises: (Promise<TProduct>)[] = [];
            setIsLoading(true);
            for (const cartProd of cart) {
                if (client && cartProd.product) {
                    promises.push(client.getProductById(cartProd.product.id));
                }
            }
            const updatedProducts: TProduct[] = await Promise.all(promises);
            setIsLoading(false);
            setProducts(updatedProducts);
        })();
    }, []);
    return (
        <div>
            {isLoading && (
                <LoadBox />
            )}
            {!isLoading && products.map((product, i) => (
                <div key={i}>
                    <p>{product.name}</p>
                </div>
            ))}
        </div>
    )
}

export default ProductList;