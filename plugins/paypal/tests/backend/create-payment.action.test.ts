import { SettingsType } from '../../src/types';

jest.mock('@cromwell/core-frontend', () => {
  return {
    getCStore: () => ({
      getDefaultCurrencyTag: () => null,
      convertPrice: (price) => price + '',
    }),
  };
});

jest.mock('@cromwell/core-backend', () => {
  return {
    getPluginSettings: () =>
      ({
        client_id: 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
        client_secret: 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM',
      } as SettingsType),
    getLogger: () => ({
      warn: console.warn,
      error: console.error,
    }),
  };
});

import { createPayment } from '../../src/backend/actions/create-payment.action';

describe('createPayment action', () => {
  it('creates test payment', async () => {
    const option = await createPayment({
      cart: [{ product: { name: 'test1', id: 1, price: 10 } }],
      orderTotalPrice: 10,
      cancelUrl: 'http://example.org/test1',
      successUrl: 'http://example.org/test2',
    });

    expect(!!option?.link).toBeTruthy();
  });
});
