import { TProduct, TAttributeInstance, isServer } from "@cromwell/core";
import { toast } from 'react-toastify';
import { TProductListItem, productListStore } from './ProductListStore'

const cartKey = 'DemoShop_CartList';
const wishlistKey = 'DemoShop_WishList';
const compareKey = 'DemoShop_CompareList';


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
    if (key === cartKey) productListStore.cart = list;
    if (key === wishlistKey) productListStore.wishlist = list;
    if (key === compareKey) productListStore.compare = list;
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
            const productKeys: string[] = Object.keys(product.pickedAttributes || {});
            const itemKeys: string[] = Object.keys(it.pickedAttributes || {});
            if (productKeys.length === 0 && itemKeys.length === 0) {
                return true;
            }
            if (it.pickedAttributes) {
                if (!product.pickedAttributes) return false;
                if (itemKeys.length !== productKeys.length) return false;
                if (!itemKeys.every(key => productKeys.includes(key))) return false;

                return Object.keys(it.pickedAttributes).every(attrKey => {
                    if (!it.pickedAttributes) return false;
                    if (!product.pickedAttributes) return false;

                    const vals = it.pickedAttributes[attrKey] || [];
                    const pickedVals = product.pickedAttributes[attrKey] || [];
                    if (vals.length !== pickedVals.length) return false;
                    return vals.every(key => pickedVals.includes(key))
                })
            }
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
