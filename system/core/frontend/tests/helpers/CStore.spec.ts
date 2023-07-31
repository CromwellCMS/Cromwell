import { TStoreListItem } from '@cromwell/core';

import { getCStore } from '../../src/helpers/CStore';
import { mockWorkingDirectory } from '../helpers';

mockWorkingDirectory('CStore');
const getLocalCStore = () =>
  getCStore({
    local: true,
    apiClient: {
      getProductById: async () => undefined,
    },
  });

describe('CStore', () => {
  it('adds to cart', () => {
    const store = getLocalCStore();

    const item: TStoreListItem = {
      product: {
        id: 1,
        name: '_test_',
      },
    };
    store.addToCart(item);

    expect(store.isInCart(item)).toBeTruthy();
    expect(store.getCart()[0].product?.name).toEqual(item.product?.name);
  });

  it('adds to cart with attributes', () => {
    const store = getLocalCStore();

    const item1: TStoreListItem = {
      product: {
        id: 1,
        name: '_test_',
      },
      pickedAttributes: {
        color: ['white'],
      },
    };
    const item2: TStoreListItem = {
      product: {
        id: 1,
        name: '_test_',
      },
      pickedAttributes: {
        color: ['black'],
      },
    };
    const res1 = store.addToCart(item1);

    expect(store.isInCart(item1)).toBeTruthy();
    expect(store.isInCart(item2)).toBeFalsy();
    expect(res1.code).toEqual(0);

    const res2 = store.addToCart(item2);

    expect(store.isInCart(item1)).toBeTruthy();
    expect(store.isInCart(item2)).toBeTruthy();
    expect(res2.code).toEqual(0);
  });

  it("won't add to cart the same", () => {
    const store = getLocalCStore();

    const item1: TStoreListItem = {
      product: {
        id: 1,
        name: '_test_',
      },
      pickedAttributes: {
        color: ['white'],
      },
    };

    const res1 = store.addToCart(item1);

    expect(store.isInCart(item1)).toBeTruthy();
    expect(res1.code).toEqual(0);
    expect(res1.success).toEqual(true);

    const res2 = store.addToCart(item1);
    expect(res2.success).toEqual(false);
  });

  it('updates quantity in cart', () => {
    const store = getLocalCStore();

    const item1: TStoreListItem = {
      product: {
        id: 1,
        name: '_test_',
      },
      amount: 1,
    };

    const res1 = store.addToCart(item1);

    expect(store.isInCart(item1)).toBeTruthy();
    expect(res1.success).toEqual(true);
    expect(store.getCart()[0].product?.name).toEqual(item1.product?.name);
    expect(store.getCart()[0].amount).toEqual(1);

    store.updateQntInCart({
      ...item1,
      amount: 2,
    });
    expect(store.getCart()[0].amount).toEqual(2);
  });

  it('removes from cart', () => {
    const store = getLocalCStore();

    const item1: TStoreListItem = {
      product: {
        id: 1,
        name: '_test_',
      },
    };

    const res1 = store.addToCart(item1);

    expect(store.isInCart(item1)).toBeTruthy();
    expect(res1.success).toEqual(true);

    const res2 = store.removeFromCart(item1);
    expect(res2.success).toBeTruthy();
    expect(store.isInCart(item1)).toBeFalsy();
  });

  it('clears cart', () => {
    const store = getLocalCStore();

    const item1: TStoreListItem = {
      product: {
        id: 1,
        name: '_test_',
      },
    };

    const res1 = store.addToCart(item1);

    expect(store.isInCart(item1)).toBeTruthy();
    expect(res1.success).toEqual(true);

    store.clearCart();
    expect(store.isInCart(item1)).toBeFalsy();
    expect(store.getCart().length).toEqual(0);
  });

  it('updates cart', async () => {
    const store = getCStore({
      local: true,
      apiClient: {
        getProductById: async () => ({
          id: 1,
          name: '_test2_',
        }),
      },
    });

    const item1: TStoreListItem = {
      product: {
        id: 1,
        name: '_test_',
      },
    };

    const res1 = store.addToCart(item1);

    expect(store.isInCart(item1)).toBeTruthy();
    expect(res1.success).toEqual(true);

    await store.updateCart([]);
    expect(store.getCart()[0]?.product?.name).toEqual('_test2_');
  });

  it('calculates total price', () => {
    const store = getLocalCStore();

    const item1: TStoreListItem = {
      product: {
        id: 1,
        name: '_test1_',
        price: 10,
      },
    };
    const item2: TStoreListItem = {
      product: {
        id: 2,
        name: '_test2_',
        price: 20,
      },
      amount: 2,
    };
    const res1 = store.addToCart(item1);
    expect(res1.code).toEqual(0);

    const res2 = store.addToCart(item2);
    expect(res2.code).toEqual(0);

    const total = store.getCartTotal();
    expect(total.total).toEqual(50);
    expect(total.amount).toEqual(3);
  });
});
