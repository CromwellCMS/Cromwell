import { getRandStr, TAttribute, TProduct } from '@cromwell/core';

class ModuleState {
    /**
     * `id` of CList block rendered by `Category` base ccom component
     */
    public categoryListId?: string;

    /**
     * All available attributes in the store. Used for validation and displaying info
     */
    public attributes?: TAttribute[];

    /**
     * { [product_id]: product_state}
     */
    public products: Record<string, {
        /**
         * { [attribute_key]: attribute_value }
         */
        pickedAttributes?: Record<string, string[]>;
        /**
         * Can display errors for required attributes that weren't selected?
         */
        canValidate?: boolean;

        /**
         * Subscribe on events when some action happens to a product (e.g. 
         * user picked an attribute which modified product by product variant)
         */
        productUpdateListeners?: Record<string, (() => any)>;

        /**
         * Product modified by `onChange` of `ProductAttributes` component. 
         * When user picks attributes, product view can change properties such as
         * price, stock status, etc. because some attributes can have
         * assigned product variants with different product data.
         */
        modifiedProduct?: TProduct | null;
    }> = {};

    public addOnProductUpdateListener(productId: number, cb: (() => any)): string {
        if (!this.products[productId]) this.products[productId] = {};
        if (!this.products[productId].productUpdateListeners) this.products[productId].productUpdateListeners = {};
        const cbId = getRandStr(8);
        this.products[productId].productUpdateListeners![cbId] = cb;
        return cbId;
    }

    public removeOnProductUpdateListener(productId: number, cbId: string) {
        if (this.products[productId]?.productUpdateListeners) {
            delete this.products[productId].productUpdateListeners![cbId];
        }
    }

    public setCheckedAttributes(productId: number, pickedAttributes: Record<string, string[]>,
        modifiedProduct: TProduct) {
        if (!this.products[productId]) this.products[productId] = {};
        this.products[productId].pickedAttributes = pickedAttributes;
        this.products[productId].modifiedProduct = modifiedProduct;
        this.triggerProductUpdateListeners(productId);
    }

    private triggerProductUpdateListeners(productId: number) {
        const listeners = this.products[productId]?.productUpdateListeners;
        if (!listeners) return;
        for (const listener of Object.values(listeners)) {
            listener();
        }
    }

    public setCanValidate(productId: number, canValidate: boolean) {
        if (!this.products[productId]) this.products[productId] = {};
        this.products[productId].canValidate = canValidate;
        this.triggerProductUpdateListeners(productId);
    }



}

export const moduleState = new ModuleState();
