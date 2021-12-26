import { getStoreItem, isServer, setStoreItem, TAttribute, TCoupon, TProduct, TProductVariant, TStoreListItem } from '@cromwell/core';

import { getGraphQLClient } from '../api/CGraphQLClient';

const cartKey = 'crw_shop_cart_list';
const wishlistKey = 'crw_shop_wish_list';
const compareKey = 'crw_shop_compare_list';
const watchedKey = 'crw_shop_watched_items';

const currencyKey = 'crw_shop_currency';

type TLocalStorage = {
    getItem: (key: string) => any;
    setItem: (key: string, value: any) => void;
}

export type TApiClient = {
    getProductById: (id: number) => Promise<TProduct | undefined>;
    getAttributes: () => Promise<TAttribute[] | undefined>;
    getCouponsByCodes?: (codes: string[]) => Promise<TCoupon[] | undefined>;
};

export type OperationResult = {
    success: boolean;
    message?: string;
    code: number;
}

/**
 * CStore - CromwellCMS Online Store module. Helps to manage shopping cart, convert currency.
 */
export class CStore {

    // < LISTS >    cart / wishlist / comparison list / watched items
    private localStorage: TLocalStorage & { internalStore: Record<string, any> } = {
        internalStore: {},
        getItem: (key: string) => this.localStorage.internalStore[key],
        setItem: (key: string, value: any) => { this.localStorage.internalStore[key] = value },
    }

    private store: TLocalStorage;
    private apiClient?: TApiClient;
    private appliedCoupons: TCoupon[] = [];

    constructor(local?: boolean, apiClient?: TApiClient) {
        if (local || isServer()) this.store = this.localStorage;
        else this.store = window.localStorage;

        this.apiClient = apiClient ?? getGraphQLClient();
    }

    private onListUpdatedCallbacks: Record<string, Record<string, (cart: TStoreListItem[]) => void>> = {};

    private getList = (key: string): TStoreListItem[] => {
        let list: TStoreListItem[] = [];
        let listJSON = this.store.getItem(key);
        if (listJSON) try {
            listJSON = JSON.parse(listJSON);
            if (listJSON && Array.isArray(listJSON)) {
                list = listJSON;
            }
        } catch (e) { }
        return list;
    }

    private saveList = (key: string, list: TStoreListItem[]) => {
        this.store.setItem(key, JSON.stringify(list));

        Object.keys(this.onListUpdatedCallbacks[key] ?? {}).forEach(cbId => {
            this.onListUpdatedCallbacks[key]?.[cbId]?.(list);
        })
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

    private addToList = (key: string, product: TStoreListItem): OperationResult => {
        const list = this.getList(key);
        if (this.getIndexInList(key, product) === -1) {
            list.push(product);
        } else {
            return {
                success: false,
                code: 1,
                message: 'Item already in the list'
            }
        }

        this.saveList(key, list);
        return {
            success: true,
            code: 0
        }
    }

    private addOnListUpdated = (key: string, cb: (cart: TStoreListItem[]) => any, id?: string): string => {
        const cbId = id ?? Object.keys(this.onListUpdatedCallbacks[key] ?? {}).length + '';
        if (!this.onListUpdatedCallbacks[key]) this.onListUpdatedCallbacks[key] = {};
        this.onListUpdatedCallbacks[key][cbId] = cb;
        return cbId;
    }

    private removeOnListUpdated = (key: string, id: string) => {
        if (!this.onListUpdatedCallbacks[key]) this.onListUpdatedCallbacks[key] = {};
        delete this.onListUpdatedCallbacks[key][id];
    }

    private removeFromList = (key: string, product: TStoreListItem): OperationResult => {
        const list = this.getList(key);
        const index = this.getIndexInList(key, product);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            return {
                success: false,
                code: 6,
                message: 'Item was not in the list'
            }
        }

        this.saveList(key, list);
        return {
            success: true,
            code: 7,
            message: 'Removed'
        }
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

    public addToCart = (product: TStoreListItem, attributes?: TAttribute[]): OperationResult & {
        missingAttributes?: TAttribute[];
    } => {
        if (!product?.product) return {
            success: false,
            code: 3,
            message: 'Product not found'
        }


        if (attributes) {
            const missingAttributes: TAttribute[] = [];
            for (const attr of attributes) {
                if (attr.key && attr.required) {
                    if (!product.pickedAttributes || !product.pickedAttributes[attr.key] ||
                        !product.pickedAttributes[attr.key].length)
                        missingAttributes.push(attr);
                }
            }
            if (missingAttributes.length) {
                return {
                    success: false,
                    code: 4,
                    message: `Attribute${missingAttributes.length > 1 ? 's' : ''} ${missingAttributes.map(attr => attr.key).join(', ')} ${missingAttributes.length > 1 ? 'are' : 'is'} required`,
                    missingAttributes,
                }
            }

        }
        return this.addToList(cartKey, product);
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
        return this.removeFromList(cartKey, product);
    }

    public onCartUpdate = (cb: (cart: TStoreListItem[]) => any, id?: string): string => {
        return this.addOnListUpdated(cartKey, cb, id);
    }

    public removeOnCartUpdate = (id: string) => {
        return this.removeOnListUpdated(cartKey, id);
    }



    public getWishlist = () => {
        return this.getList(wishlistKey);
    }

    public isInWishlist = (item: TStoreListItem): boolean => {
        if (this.getIndexInList(wishlistKey, item) > -1) return true;
        return false;
    }

    public addToWishlist = (product: TStoreListItem): OperationResult => {
        return this.addToList(wishlistKey, product);
    }

    public removeFromWishlist = (product: TStoreListItem) => {
        return this.removeFromList(wishlistKey, product);
    }

    public onWishlistUpdate = (cb: (cart: TStoreListItem[]) => any, id?: string): string => {
        return this.addOnListUpdated(wishlistKey, cb, id);
    }

    public removeOnWishlistUpdate = (id: string) => {
        return this.removeOnListUpdated(wishlistKey, id);
    }


    public getCompare = () => {
        return this.getList(compareKey);
    }

    public isInCompare = (item: TStoreListItem): boolean => {
        if (this.getIndexInList(compareKey, item) > -1) return true;
        return false;
    }

    public addToCompare = (product: TStoreListItem): OperationResult => {
        return this.addToList(compareKey, product);
    }

    public removeFromCompare = (product: TStoreListItem) => {
        return this.removeFromList(compareKey, product);
    }

    public onCompareUpdate = (cb: (cart: TStoreListItem[]) => any, id?: string): string => {
        return this.addOnListUpdated(compareKey, cb, id);
    }

    public removeOnCompareUpdate = (id: string) => {
        return this.removeOnListUpdated(compareKey, id);
    }


    public getWatchedItems = () => {
        return this.getList(watchedKey);
    }

    public saveWatchedItems = (items: TStoreListItem[]) => {
        return this.saveList(watchedKey, items);
    }

    public isInWatchedItems = (item: TStoreListItem): boolean => {
        if (this.getIndexInList(watchedKey, item) > -1) return true;
        return false;
    }

    public addToWatchedItems = (item: TStoreListItem) => {
        return this.addToList(watchedKey, item);
    }

    public onWatchedItemsUpdate = (cb: (cart: TStoreListItem[]) => any, id?: string): string => {
        return this.addOnListUpdated(watchedKey, cb, id);
    }

    public removeOnWatchedItemsUpdate = (id: string) => {
        return this.removeOnListUpdated(watchedKey, id);
    }

    /**
     * For each distinctive productId in cart will make "getProductById" request to backend and then refresh cart.
     * If item has checked attributes that were deleted at the server, then it will delete
     * such items from the cart.
     */
    private updateList = async (listKey: string) => {
        const list = this.getList(listKey)
        const promises: Record<string, Promise<TProduct | undefined>> = {};
        for (const listItem of list) {
            const id = listItem?.product?.id;
            if (this.apiClient && id) {
                if (!promises[id]) {
                    promises[id] = this.apiClient.getProductById(id).catch(e => {
                        console.error(e);
                        return undefined;
                    });
                }
            }
        }

        const updatedProducts: (TProduct | undefined)[] = await Promise.all(Object.values(promises));

        // let attributes: TAttribute[] | undefined = undefined;
        // try {
        //     attributes = await this.apiClient?.getAttributes();
        // } catch (e) { console.error(e) }

        const updatedList: TStoreListItem[] = [];

        list.forEach(listItem => {
            const updated = updatedProducts.find(u => (u && listItem.product && (u.id + '' === listItem.product.id + '')))
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
                        listItem.pickedAttributes);

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

        return this.saveList(listKey, updatedList);
    }

    public updateCart = async () => {
        await this.updateList(cartKey);
    }

    public updateWishlist = async () => {
        await this.updateList(wishlistKey);
    }

    public updateComparisonList = async () => {
        await this.updateList(compareKey);
    }

    public updateWatchedItems = async () => {
        await this.updateList(watchedKey);
    }


    public clearCart = () => {
        this.saveList(cartKey, []);
    }

    public clearWishlist = () => {
        this.saveList(wishlistKey, []);
    }

    public clearComparisionList = () => {
        this.saveList(compareKey, []);
    }

    public clearWatchedItems = () => {
        this.saveList(watchedKey, []);
    }


    public getCartTotal = (customCart?: TStoreListItem[]) => {
        const cart = customCart ?? this.getCart();

        const baseTotal: number = cart.reduce<number>((prev, current) =>
            prev += (current.product?.price ?? 0) * (current.amount ?? 1), 0);

        const coupons: TCoupon[] = [];

        for (const coupon of this.appliedCoupons) {
            coupon.productIds = coupon.productIds?.map(id => Number(id));
            coupon.categoryIds = coupon.categoryIds?.map(id => Number(id));

            if (coupon.maximumSpend) {
                if (baseTotal > coupon.maximumSpend) continue;
            }
            if (coupon.minimumSpend) {
                if (baseTotal < coupon.minimumSpend) continue;
            }
            coupons.push(coupon);
        }

        let total: number = cart.reduce<number>((prev, current) => {
            let price = current.product?.price ?? 0;

            // Apply coupons per product
            for (const coupon of coupons) {
                if (current.product && coupon.value && (coupon.productIds?.length || coupon.categoryIds?.length)) {
                    if (coupon.productIds?.includes(current.product.id)) {
                        if (coupon.discountType === 'fixed') {
                            price -= coupon.value;
                        }
                        if (coupon.discountType === 'percentage') {
                            price = price - price * coupon.value / 100;
                        }
                        // Coupon applied
                        continue;
                    }
                    if (current.product.categories?.length && current.product.categories.some(cat =>
                        coupon.categoryIds?.includes(cat.id))) {
                        if (coupon.discountType === 'fixed') {
                            price -= coupon.value;
                        }
                        if (coupon.discountType === 'percentage') {
                            price = price - price * coupon.value / 100;
                        }
                        continue;
                    }
                }
            }
            if (price < 0) price = 0;
            return prev += price * (current.amount ?? 1)
        }, 0);

        // Apply coupons per cart
        for (const coupon of coupons) {
            if (coupon.value && !(coupon.productIds?.length || coupon.categoryIds?.length)) {
                if (coupon.discountType === 'fixed') {
                    total -= coupon.value;
                }
                if (coupon.discountType === 'percentage') {
                    total = total - total * coupon.value / 100;
                }
            }
        }
        if (total < 0) total = 0;

        total = parseFloat(total.toFixed(2));

        let totalOld: number = cart.reduce<number>(
            (prev, current) => prev += (current.product?.oldPrice ?? current.product?.price ?? 0) * (current.amount ?? 1)
            , 0);
        totalOld = parseFloat(totalOld.toFixed(2));

        const amount: number = cart.reduce<number>((prev, current) =>
            prev += (current.amount ?? 1), 0);

        return {
            total, totalOld, amount, coupons
        }
    }


    // < / LISTS >


    // < HELPERS > 

    /** Applies all ProductVariants from values of checked attributes */
    public applyProductVariants = (product: TProduct, checkedAttrs?: Record<string, (string | number)[]>): TProduct => {
        if (checkedAttrs && Object.keys(checkedAttrs).length && product.variants?.length) {
            const newProd = Object.assign({}, product);
            const matchedVariants: {
                variant: TProductVariant;
                matches: number;
            }[] = [];

            for (const variant of product.variants) {
                if (!variant.attributes) continue;
                const filteredAttributes: Record<string, string | number> = {};
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    if (value) filteredAttributes[key] = value;
                });
                if (!Object.keys(filteredAttributes).length) continue;

                let matches = 0;
                Object.entries(filteredAttributes).forEach(([key, value]) => {
                    if (checkedAttrs[key] && checkedAttrs[key].includes(value)) {
                        matches++;
                    }
                });
                if (matches && Object.keys(filteredAttributes).length === matches) {
                    matchedVariants.push({
                        matches,
                        variant: variant,
                    })
                }
            }
            matchedVariants.sort((a, b) => a.matches - b.matches);

            for (const variant of matchedVariants) {
                Object.entries(variant.variant).forEach(([key, value]) => {
                    if (!key || key === 'id' || key === 'attributes') return;
                    if (value === null || value === undefined) return;
                    newProd[key] = value;
                });
            }
            return newProd;
        }
        return product;
    }

    // Validate and save coupons in the cart
    async applyCouponCodes(codes?: string[] | null): Promise<TCoupon[] | undefined> {
        const appliedCoupons: TCoupon[] = [];
        codes = codes?.filter(Boolean);
        if (!codes?.length) return;
        if (!this.apiClient?.getCouponsByCodes) {
            console.error('CStore::applyCouponCodes: cannot apply coupons, API method `getCouponsByCodes` is not provided');
            return;
        }

        // Validate coupons
        try {
            const coupons = await this.apiClient.getCouponsByCodes(codes);
            if (!coupons?.length) return;

            for (const coupon of coupons) {
                if (!coupon.code || !coupon.value || !coupon.discountType) continue;
                if (coupon.usageLimit === 0) continue;
                if (coupon.usedTimes && coupon.usageLimit &&
                    coupon.usedTimes >= coupon.usageLimit) continue;

                if (coupon.expiryDate) {
                    const expiryDate = new Date(coupon.expiryDate);
                    if (isNaN(expiryDate.getTime())) continue;
                    if (expiryDate.getTime() - Date.now() > 0)
                        appliedCoupons.push(coupon);
                } else {
                    appliedCoupons.push(coupon);
                }
            }
        } catch (error) { console.error(error) }

        this.appliedCoupons = appliedCoupons;
        return [...appliedCoupons];
    }

    // Set coupons without validation. If coupons are outdates, getCartTotal
    // may produce wrong calculation
    public setCoupons(coupons: TCoupon[]) {
        this.appliedCoupons = [...coupons];
    }

    public getCoupons() {
        return [...this.appliedCoupons];
    }

    // < / HELPERS > 


    // < CURRENCY >

    public getDefaultCurrencyTag = (): string | undefined => {
        const cmsSettings = getStoreItem('cmsSettings');
        let defaultCurrency;
        if (cmsSettings && cmsSettings.currencies && Array.isArray(cmsSettings.currencies) &&
            cmsSettings.currencies.length > 0) {
            defaultCurrency = cmsSettings.currencies[0].tag;
        }
        return defaultCurrency;
    }

    /** Returns string of a price converted to active currency */
    public getPrice = (price: any): string => {
        if (price === undefined || price === null)
            return '';
        //return 'Not available';
        let priceStr = price + '';
        const currency = this.getActiveCurrencyTag();
        const defaultCurrency = this.getDefaultCurrencyTag();

        if (currency && defaultCurrency) {
            priceStr = this.convertPrice(price, defaultCurrency, currency) + '';
        }
        return priceStr;
    }

    /** Returns merged price with sign of active (picked by user or default) currency */
    public getPriceWithCurrency = (price: any): string => {
        let priceStr = this.getPrice(price);
        if (!priceStr || priceStr === '') return '';

        const cmsSettings = getStoreItem('cmsSettings');
        const currency = this.getActiveCurrencyTag();
        const defaultCurrency = this.getDefaultCurrencyTag();

        if (currency && defaultCurrency) {
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
            let _currency: string | null | undefined = this.store.getItem(currencyKey);
            if (!_currency || _currency === "") {
                _currency = this.getDefaultCurrencyTag();
            }
            if (_currency) {
                setStoreItem('currency', _currency);
                currency = _currency;
            }
        }
        return currency;
    }

    public getActiveCurrencySymbol = (): string => {
        const currency = this.getActiveCurrencyTag();
        const currencies = getStoreItem('cmsSettings')?.currencies;
        if (Array.isArray(currencies)) return currencies.find(curr => curr.tag === currency)?.symbol ?? '';
        return '';
    }

    public setActiveCurrency = (currency: string) => {
        if (currency) {
            setStoreItem('currency', currency);

            this.store.setItem(currencyKey, currency);

            // Re-render page
            const forceUpdatePage = getStoreItem('forceUpdatePage');
            if (forceUpdatePage) forceUpdatePage();
        }
    }

    // < / CURRENCY >

}

/**
 * Get CStore instance from global store (singleton)
 * @param local if true, create and return a new instance, false by default
 * @param apiClient provide custom apiClient instance
 * @returns 
 */
export const getCStore = (local?: boolean, apiClient?: TApiClient): CStore => {
    if (local) return new CStore(local, apiClient);

    let cstore = getStoreItem('cstore');
    if (!cstore) {
        cstore = new CStore();
        setStoreItem('cstore', cstore);
        return cstore;
    }
    return cstore;
}
