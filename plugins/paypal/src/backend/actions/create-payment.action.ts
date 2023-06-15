import { TOrderPaymentSession, TStoreListItem } from '@cromwell/core';
import { getLogger, getPluginSettings } from '@cromwell/core-backend';
import { getCStore } from '@cromwell/core-frontend';
import paypal, { PaymentResponse, Payment } from 'paypal-rest-sdk';

import { pluginName } from '../../constants';
import { SettingsType } from '../../types';

const logger = getLogger();

export const createPayment = async (input: TOrderPaymentSession) => {
  const settings = await getPluginSettings<SettingsType>(pluginName);
  const { client_id, client_secret, mode, enabled } = settings ?? {};
  const cart = (input.cart as TStoreListItem[]) ?? [];

  if (!enabled) {
    return;
  }

  if (!client_id) {
    logger.warn(`${pluginName}: You must setup client_id in plugin settings`);
    return;
  }
  if (!client_secret) {
    logger.warn(`${pluginName}: You must setup client_secret in plugin settings`);
    return;
  }

  if (!input.successUrl) {
    logger.warn(`${pluginName}: body.successUrl is not set when creating payment session.`);
    return;
  }
  if (!input.cancelUrl) {
    logger.warn(`${pluginName}: body.cancelUrl is not set when creating payment session.`);
    return;
  }

  const output: { name: string; link?: string | null } = {
    name: 'Paypal',
  };

  paypal.configure({
    mode: mode || 'sandbox',
    client_id,
    client_secret,
  });

  const store = getCStore({ local: true });
  const defaultCurrency = store.getDefaultCurrencyTag() ?? 'usd';
  const currency = (input.currency ?? defaultCurrency).toUpperCase();

  const convertPrice = (price: number | null | undefined) =>
    parseFloat(store.convertPrice(price ?? 0, defaultCurrency, currency) as any).toFixed(2);

  const paypalOrder: Payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    transactions: [
      {
        item_list: {
          items: [
            ...cart.map((item) => ({
              currency: currency,
              price: convertPrice(item.product?.price),
              name: item.product?.name ?? '',
              quantity: item.amount ?? 1,
            })),
            {
              currency: currency,
              price: convertPrice(input?.shippingPrice),
              name: 'shipping',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: currency,
          total: convertPrice(input.orderTotalPrice),
        },
      },
    ],
    redirect_urls: {
      return_url: input.successUrl,
      cancel_url: input.cancelUrl,
    },
  };

  const payment = await new Promise<PaymentResponse | undefined>((done) => {
    paypal.payment.create(paypalOrder, (error, payment) => {
      if (error) {
        logger.error(JSON.stringify(error?.message), JSON.stringify(error?.response), error);
      }
      done(payment);
    });
  });

  for (const link of payment?.links ?? []) {
    if (link.rel === 'approval_url') {
      output.link = link.href;
    }
  }

  if (output.link) {
    return output;
  }
};
