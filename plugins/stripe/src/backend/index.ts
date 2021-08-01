import { TStoreListItem } from '@cromwell/core';
import { getLogger, getPluginSettings, registerAction } from '@cromwell/core-backend';
import { getCStore } from '@cromwell/core-frontend';
import Stripe from 'stripe';

import { pluginName } from '../constants';

const logger = getLogger();

registerAction({
    pluginName,
    actionName: 'create_payment',
    action: async (input) => {
        const settings = await getPluginSettings(pluginName);
        const { stripeApiKey } = settings ?? {};
        const cart = input.cart as TStoreListItem[] ?? [];

        if (!stripeApiKey) {
            logger.warn(`${pluginName}: Please setup Stripe Api Key in plugin settings`);
            return;
        }

        if (!input.successUrl) {
            logger.warn(`${pluginName}: input.successUrl wasn't set. Please provide valid frontend URL where order was created`);
            return;
        }

        if (!input.cancelUrl) {
            logger.warn(`${pluginName}: input.cancelUrl wasn't set. Please provide valid frontend URL where order was created`);
            return;
        }


        const output: { name: string; link?: string | null } = {
            name: 'Pay with card / Google Pay (Stripe)'
        }

        const stripe = new Stripe(stripeApiKey, {
            apiVersion: '2020-08-27',
            timeout: 20 * 1000,
        });

        const store = getCStore();
        const defaultCurrency = store.getDefaultCurrencyTag() ?? 'usd';
        const currency = input.currency ?? defaultCurrency;

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    ...cart.map(item => ({
                        price_data: {
                            currency: currency?.toLowerCase() ?? 'usd',
                            unit_amount_decimal: (parseFloat(store.convertPrice(item.product?.price ?? 0,
                                defaultCurrency, currency) + '') * 100).toFixed(2),
                            product_data: {
                                // images: item.product?.images,
                                name: item.product?.name + '',
                            },
                        },
                        quantity: item.amount ?? 1,
                    })), {
                        price_data: {
                            currency: currency?.toLowerCase() ?? 'usd',
                            unit_amount_decimal: (parseFloat(store.convertPrice(input?.shippingPrice ?? 0,
                                defaultCurrency, currency) + '') * 100).toFixed(2),
                            product_data: {
                                name: 'shipping',
                            },
                        },
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: input.successUrl,
                cancel_url: input.cancelUrl,
            });

            output.link = session.url;

        } catch (error) {
            logger.error(error);
        }

        return output;
    }
});
