import { TAttribute, TProduct } from '@cromwell/core';

import { getGraphQLClient } from '../api/CGraphQLClient';
import { TProductListItem } from '../types';
import { getCart, saveCart } from './actions';

/** Applies all ProductVariants from values of checked attributes */
export const applyProductVariants = (product: TProduct, checkedAttrs?: Record<string, string[]>,
    attributes?: TAttribute[]): TProduct => {
    if (product.attributes && checkedAttrs && attributes) {
        const newProd = Object.assign({}, product);

        for (const key of Object.keys(checkedAttrs)) {
            const origAttribute = attributes.find(a => a.key === key);
            const attributeInstance = product.attributes.find(a => a.key === key);
            if (origAttribute && attributeInstance) {
                if (origAttribute.type === 'radio') {
                    // checks array should contain one element for value
                    if (checkedAttrs[key] && checkedAttrs[key].length === 1) {
                        const valueInstance = attributeInstance.values.find(v => v.value === checkedAttrs[key][0])
                        if (valueInstance && valueInstance.productVariant) {
                            const variant = valueInstance.productVariant;

                            for (const varKey of Object.keys(variant)) {
                                const varValue = (variant as any)[varKey];
                                if (varValue !== null && varValue !== undefined) {
                                    (newProd as any)[varKey] = varValue;
                                }
                            }
                        }
                    }
                }
            }
        }
        return newProd;
    }
    return product;
}

/**
 * For each product in cart will make "getProductById" request to backend and then refresh cart.
 * If item has checked attribues that were deleted at the server, then it will delete
 * such items from cart.
 */
export const updateCart = async () => {
    const client = getGraphQLClient();
    const cart = getCart().filter(p => Boolean(p.product));
    const promises: (Promise<TProduct | undefined>)[] = [];
    for (const cartProd of cart) {
        if (client && cartProd.product) {
            promises.push(client.getProductById(cartProd.product.id));
        }
    }
    const updatedProducts: (TProduct | undefined)[] = await Promise.all(promises);
    const attributes: TAttribute[] | undefined = await client?.getAttributes();

    const updatedCart: TProductListItem[] = [];
    cart.forEach((cartItem, i) => {
        const updated = updatedProducts[i];
        if (updated) {
            let hasAllAttrs = true;
            if (cartItem.pickedAttributes && updated.attributes) {
                for (const key of Object.keys(cartItem.pickedAttributes)) {
                    let hasAttr = false;
                    for (const updatedAttr of updated.attributes) {
                        if (updatedAttr.key === key) {
                            hasAttr = true;
                            const vals = cartItem.pickedAttributes[key];
                            const updatedVals: string[] = updatedAttr.values.map(v => v.value);
                            if (!vals.every(v => updatedVals.includes(v))) {
                                hasAttr = false;
                            }
                        }
                    }
                    if (!hasAttr) {
                        hasAllAttrs = false;
                    }
                }
            }
            if (hasAllAttrs) {
                cartItem.product = applyProductVariants(updated,
                    cartItem.pickedAttributes, attributes);

                if (cartItem.pickedAttributes) {
                    for (const key of Object.keys(cartItem.pickedAttributes)) {
                        const vals = cartItem.pickedAttributes[key];
                        if (!vals || !Array.isArray(vals) || vals.length === 0) {
                            delete cartItem.pickedAttributes[key];
                        }
                    }
                }
                updatedCart.push(cartItem);
            }
        }
    })

    saveCart(updatedCart);
}