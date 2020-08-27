import { TProduct, TAttributeInstance, TAttribute, isServer } from "@cromwell/core";
import { toast } from 'react-toastify';
import { TProductListItem } from '../types';


const cartKey = 'CromwellShop_CartList';
const wishlistKey = 'CromwellShop_WishList';
const compareKey = 'CromwellShop_CompareList';


const getList = (key: string): TProductListItem[] => {
    let list: TProductListItem[] = [];
    if (!isServer()) {
        let listJSON = window.localStorage.getItem(key);
        if (listJSON) try {
            listJSON = JSON.parse(listJSON);
            if (listJSON && Array.isArray(listJSON)) {
                list = listJSON;
            }
        } catch (e) { };
    }
    return list;
}

const saveList = (key: string, list: TProductListItem[]) => {
    if (!isServer()) {
        window.localStorage.setItem(key, JSON.stringify(list));
    }
}

/** Will return -1 if not found, otherwise first index of matched item in a list  */
const getIndexInList = (listKey: string, product: TProductListItem): number => {
    const list = getList(listKey);
    let index = -1;

    const areEqual = (it: TProductListItem): boolean => {
        if (!it.product || !product.product)
            return false;

        if (it.product.id === product.product.id) {
            // filter empty attribute sets
            const filter = (picked: Record<string, string[]>) => {
                for (const key of Object.keys(picked)) {
                    const vals = picked[key];
                    if (!vals || !Array.isArray(vals) || vals.length === 0) {
                        delete picked[key];
                    }
                }
                return picked;
            }
            const productPickedAttributes = filter(Object.assign({}, product.pickedAttributes));
            const itPickedAttributes = filter(Object.assign({}, it.pickedAttributes));

            const productKeys: string[] = Object.keys(productPickedAttributes);
            const itemKeys: string[] = Object.keys(itPickedAttributes);

            if (productKeys.length === 0 && itemKeys.length === 0) return true;
            if (productKeys.length !== itemKeys.length) return false;

            if (!itemKeys.every(key => productKeys.includes(key))) return false;

            return itemKeys.every(attrKey => {
                const vals = itPickedAttributes[attrKey] || [];
                const pickedVals = productPickedAttributes[attrKey] || [];
                if (vals.length !== pickedVals.length) return false;
                return vals.every(key => pickedVals.includes(key))
            })
        }
        return false;
    };

    for (let i = 0; i < list.length; i++) {
        const it = list[i];
        const equal = areEqual(it);

        if (equal) {
            index = i;
            break;
        }
    }

    return index;
}

const addToList = (key: string, product: TProductListItem): boolean => {
    const list = getList(key);
    if (getIndexInList(key, product) === -1) {
        list.push(product);
    } else return false;

    saveList(key, list);
    return true;
}

const removeFromList = (key: string, product: TProductListItem): boolean => {
    const list = getList(key);
    let index = getIndexInList(key, product);
    if (index > -1) {
        list.splice(index, 1);
    } else return false;

    saveList(key, list);
    return true;
}


export const getCart = () => {
    return getList(cartKey);
}

export const saveCart = (cart: TProductListItem[]) => {
    saveList(cartKey, cart);
}

export const isInCart = (item: TProductListItem): boolean => {
    if (getIndexInList(cartKey, item) > -1) return true;
    return false;
}

export const addToCart = (product: TProductListItem) => {
    const hasBeenAdded = addToList(cartKey, product);
    if (hasBeenAdded) {
        toast.success("Added!", {
            position: toast.POSITION.TOP_RIGHT
        });
    } else {
        toast.warn("Product is already in your cart!", {
            position: toast.POSITION.TOP_RIGHT
        });
    }
}

export const removeFromCart = (product: TProductListItem) => {
    removeFromList(cartKey, product);
}


export const getWishlist = () => {
    return getList(wishlistKey);
}

export const isInWishlist = (item: TProductListItem): boolean => {
    if (getIndexInList(wishlistKey, item) > -1) return true;
    return false;
}

export const addToWishlist = (product: TProductListItem) => {
    const hasBeenAdded = addToList(wishlistKey, product);
    if (hasBeenAdded) {
        toast.success("Added!", {
            position: toast.POSITION.TOP_RIGHT
        });
    } else {
        toast.warn("Product is already in your wishlist!", {
            position: toast.POSITION.TOP_RIGHT
        });
    }
}

export const removeFromWishlist = (product: TProductListItem) => {
    removeFromList(wishlistKey, product);
}



export const getCompare = () => {
    return getList(compareKey);
}

export const isInCompare = (item: TProductListItem): boolean => {
    if (getIndexInList(compareKey, item) > -1) return true;
    return false;
}


export const addToCompare = (product: TProductListItem) => {
    const hasBeenAdded = addToList(compareKey, product);
    if (hasBeenAdded) {
        toast.success("Added!", {
            position: toast.POSITION.TOP_RIGHT
        });
    } else {
        toast.warn("Product is already in your list!", {
            position: toast.POSITION.TOP_RIGHT
        });
    }
}

export const removeFromCompare = (product: TProductListItem) => {
    removeFromList(compareKey, product);
}
