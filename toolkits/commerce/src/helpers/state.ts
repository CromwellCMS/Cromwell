import { getRandStr, TAttribute, TOrderPaymentSession, TProduct } from '@cromwell/core';
import { useForceUpdate } from '@cromwell/core-frontend';
import { useEffect } from 'react';

class ModuleState {
    /**
     * `id` of CList block rendered by `Category` base ccom component
     */
    public categoryListId?: string;

    public setCategoryListId(id: string) {
        this.categoryListId = id;
        this.triggerUpdateHooks();
    }

    /**
     * All available attributes in the store. Used for validation and displaying info
     */
    public attributes?: TAttribute[];

    public setAttributes(attributes: TAttribute[] | undefined) {
        this.attributes = attributes;
        this.triggerUpdateHooks();
    }

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

    private updateHooks: Record<string, (() => void)> = {};

    public addOnUpdateHook(cb: (() => any)): string {
        const cbId = getRandStr(8);
        this.updateHooks[cbId] = cb;
        return cbId;
    }

    public removeOnUpdateHook(cbId: string) {
        delete this.updateHooks[cbId];
    }

    private triggerUpdateHooks() {
        for (const listener of Object.values(this.updateHooks)) {
            listener();
        }
    }

    public paymentSession?: TOrderPaymentSession | null | undefined;
    public setPaymentSession(session: TOrderPaymentSession | null | undefined) {
        this.paymentSession = session;
        this.triggerUpdateHooks();
    }
}

export const moduleState = new ModuleState();

/**
 * A hook that gives an access to the `store` of this toolkit.
 * It will also re-render component on store updates.
 */
export const useModuleState = (): ModuleState => {
    const update = useForceUpdate();
    useEffect(() => {
        const cbId = moduleState.addOnUpdateHook(() => update());
        return () => {
            moduleState.removeOnUpdateHook(cbId);
        }
    });
    return moduleState;
}
