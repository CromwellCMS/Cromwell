import { TProduct, TAttributeInstance, TAttribute, isServer } from "@cromwell/core";
import { toast } from 'react-toastify';
import { TStoreListItem } from './types';
import { getGraphQLClient } from './api/CGraphQLClient';
import { getStoreItem, setStoreItem } from '@cromwell/core';

const cartKey = 'CromwellShop_CartList';
const wishlistKey = 'CromwellShop_WishList';
const compareKey = 'CromwellShop_CompareList';
const watchedKey = 'CromwellShop_Watched';

const currencyKey = 'CromwellShop_Currency';

class CStore {

    // < LISTS >    cart / wishlist / comparision list / watched items

    private onCartUpdatedCallbacks: Record<string, (cart: TStoreListItem[]) => void> = {};

    private getList = (key: string): TStoreListItem[] => {
        let list: TStoreListItem[] = [];
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

    private saveList = (key: string, list: TStoreListItem[]) => {
        if (!isServer()) {
            window.localStorage.setItem(key, JSON.stringify(list));
        }

        if (key === cartKey) {
            Object.keys(this.onCartUpdatedCallbacks).forEach(cbId => {
                this.onCartUpdatedCallbacks[cbId](list);
            })
        }
    }

    /** Will return -1 if not found, otherwise first index of matched item in a list  */
    private getIndexInList = (listKey: string, product: TStoreListItem): number => {
        const list = this.getList(listKey);
        let index = -1;

        const areEqual = (it: TStoreListItem): boolean => {
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

    private addToList = (key: string, product: TStoreListItem): boolean => {
        const list = this.getList(key);
        if (this.getIndexInList(key, product) === -1) {
            list.push(product);
        } else return false;

        this.saveList(key, list);
        return true;
    }

    private removeFromList = (key: string, product: TStoreListItem): boolean => {
        const list = this.getList(key);
        let index = this.getIndexInList(key, product);
        if (index > -1) {
            list.splice(index, 1);
        } else return false;

        this.saveList(key, list);
        return true;
    }


    public getCart = () => {
        return this.getList(cartKey);
    }

    public saveCart = (cart: TStoreListItem[]) => {
        this.saveList(cartKey, cart);
    }

    public isInCart = (item: TStoreListItem): boolean => {
        if (this.getIndexInList(cartKey, item) > -1) return true;
        return false;
    }

    public hasSameQntInCart = (item: TStoreListItem): boolean => {
        const index = this.getIndexInList(cartKey, item);
        const cartItem = this.getCart()[index];
        if (cartItem) {
            if (cartItem.amount === item.amount) return true;
        }
        return false;
    }

    public addToCart = (product: TStoreListItem) => {
        const hasBeenAdded = this.addToList(cartKey, product);
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

    public updateQntInCart = (item: TStoreListItem) => {
        const index = this.getIndexInList(cartKey, item);
        const cart = this.getCart();
        const cartItem = cart[index];
        if (cartItem) {
            if (cartItem.amount !== item.amount) {
                cartItem.amount = item.amount;
                cart[index] = cartItem;
                this.saveCart(cart);
            }
        }
    }

    public removeFromCart = (product: TStoreListItem) => {
        this.removeFromList(cartKey, product);
    }

    public addOnCartUpdatedCallback = (cb: (cart: TStoreListItem[]) => void, id?: string): string => {
        const key = id ? id : Object.keys(this.onCartUpdatedCallbacks).length + '';
        this.onCartUpdatedCallbacks[key] = cb;
        return key;
    }


    public getWishlist = () => {
        return this.getList(wishlistKey);
    }

    public isInWishlist = (item: TStoreListItem): boolean => {
        if (this.getIndexInList(wishlistKey, item) > -1) return true;
        return false;
    }

    public addToWishlist = (product: TStoreListItem) => {
        const hasBeenAdded = this.addToList(wishlistKey, product);
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

    public removeFromWishlist = (product: TStoreListItem) => {
        this.removeFromList(wishlistKey, product);
    }



    public getCompare = () => {
        return this.getList(compareKey);
    }

    public isInCompare = (item: TStoreListItem): boolean => {
        if (this.getIndexInList(compareKey, item) > -1) return true;
        return false;
    }


    public addToCompare = (product: TStoreListItem) => {
        const hasBeenAdded = this.addToList(compareKey, product);
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

    public removeFromCompare = (product: TStoreListItem) => {
        this.removeFromList(compareKey, product);
    }


    public getWatchedItems = () => {
        return this.getList(watchedKey);
    }

    public saveWatchedItems = (items: TStoreListItem[]) => {
        this.saveList(watchedKey, items);
    }

    public isInWatchedItems = (item: TStoreListItem): boolean => {
        if (this.getIndexInList(watchedKey, item) > -1) return true;
        return false;
    }

    public addToWatchedItems = (item: TStoreListItem) => {
        const hasBeenAdded = this.addToList(watchedKey, item);
    }

    /**
     * For each distinctive productId in cart will make "getProductById" request to backend and then refresh cart.
     * If item has checked attribues that were deleted at the server, then it will delete
     * such items from the cart.
     */
    private updateList = async (listKey: string) => {
        const client = getGraphQLClient();
        const list = this.getList(listKey)
        const promises: Record<string, Promise<TProduct | undefined>> = {};

        for (const listItem of list) {
            const id = listItem?.product?.id;
            if (client && id) {
                if (!promises[id]) {
                    promises[id] = client.getProductById(id).catch(e => {
                        console.log(e);
                        return undefined;
                    });
                }
            }
        }

        const updatedProducts: (TProduct | undefined)[] = await Promise.all(Object.values(promises));

        let attributes: TAttribute[] | undefined = undefined;
        try {
            attributes = await client?.getAttributes();
        } catch (e) { console.log(e) }

        const updatedList: TStoreListItem[] = [];

        list.forEach(listItem => {
            const updated = updatedProducts.find(u => (u && listItem.product && (u.id === listItem.product.id)))
            if (updated) {
                let hasAllAttrs = true;
                if (listItem.pickedAttributes && updated.attributes) {
                    for (const key of Object.keys(listItem.pickedAttributes)) {
                        let hasAttr = false;
                        for (const updatedAttr of updated.attributes) {
                            if (updatedAttr.key === key) {
                                hasAttr = true;
                                const vals = listItem.pickedAttributes[key];
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
                    listItem.product = this.applyProductVariants(updated,
                        listItem.pickedAttributes, attributes);

                    if (listItem.pickedAttributes) {
                        for (const key of Object.keys(listItem.pickedAttributes)) {
                            const vals = listItem.pickedAttributes[key];
                            if (!vals || !Array.isArray(vals) || vals.length === 0) {
                                delete listItem.pickedAttributes[key];
                            }
                        }
                    }
                    updatedList.push(listItem);
                }
            }
        })

        this.saveList(listKey, updatedList);
    }

    public updateCart = async () => {
        await this.updateList(cartKey)
    }

    public updateWishlist = async () => {
        await this.updateList(wishlistKey)
    }

    public updateComparisionList = async () => {
        await this.updateList(compareKey)
    }

    public updateWatchedItems = async () => {
        await this.updateList(watchedKey);
    }


    // < / LISTS >


    // < HELPERS > 

    /** Applies all ProductVariants from values of checked attributes */
    public applyProductVariants = (product: TProduct, checkedAttrs?: Record<string, string[]>,
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

    // < / HELPERS > 


    // < CURRENCY >

    private getDafaultCurrencyTag = (): string | undefined => {
        const cmsSettings = getStoreItem('cmsSettings');
        let defaultCurrency;
        if (cmsSettings && cmsSettings.currencies && Array.isArray(cmsSettings.currencies) &&
            cmsSettings.currencies.length > 0) {
            defaultCurrency = cmsSettings.currencies[0].tag;
        }
        return defaultCurrency;
    }

    /** Returns merged price with sign of active (picked by user or default) currency */
    public getPriceWithCurrency = (price: any): string => {
        if (price === undefined || price === null)
            return '';
        //return 'Not available';
        let priceStr = price + '';
        const cmsSettings = getStoreItem('cmsSettings');
        const currency = this.getActiveCurrencyTag();
        const defaultCurrency = this.getDafaultCurrencyTag();

        if (currency && defaultCurrency) {
            priceStr = this.convertPrice(price, defaultCurrency, currency) + '';

            const currencySymbol = cmsSettings?.currencies?.find(curr => curr.tag === currency)?.symbol;
            if (currencySymbol) priceStr = currencySymbol + priceStr;
        }
        return priceStr;
    }

    public convertPrice = (price: number | string, from: string, to: string) => {
        if (from === to) return price;
        if (typeof price === 'string') {
            const priceInt = parseInt(price);
            if (isNaN(priceInt)) return price;
            price = priceInt;
        }
        const cmsSettings = getStoreItem('cmsSettings');
        const ratioFrom = cmsSettings?.currencies?.find(curr => curr.tag === from)?.ratio;
        const ratioTo = cmsSettings?.currencies?.find(curr => curr.tag === to)?.ratio;
        if (ratioFrom && ratioTo) return (price * (ratioTo / ratioFrom)).toFixed(2);
        return price.toFixed(2);
    }

    public getActiveCurrencyTag = (): string | undefined => {
        let currency = getStoreItem('currency');
        if (!currency) {
            let _currency: string | null | undefined = !isServer() ? window.localStorage.getItem(currencyKey) : null;
            if (!_currency || _currency === "") {
                _currency = this.getDafaultCurrencyTag();;
            }
            if (_currency) {
                setStoreItem('currency', _currency);
                currency = _currency;
            }
        }
        return currency;
    }

    public getActiveCurrencySymbol = (): string | undefined => {
        const currency = this.getActiveCurrencyTag();
        return getStoreItem('cmsSettings')?.currencies?.find(curr => curr.tag === currency)?.symbol;
    }

    public setActiveCurrency = (currency: string) => {
        if (currency) {
            setStoreItem('currency', currency);

            if (!isServer()) {
                window.localStorage.setItem(currencyKey, currency);
            }

            // Re-render page
            const forceUpdatePage = getStoreItem('forceUpdatePage');
            if (forceUpdatePage) forceUpdatePage();

        }
    }

    // < / CURRENCY >

}

export const getCStore = (): CStore => {
    let cstore = getStoreItem('cstore');
    if (!cstore) {
        cstore = new CStore();
        setStoreItem('cstore', cstore);
        return cstore;
    }
    return cstore;
}
