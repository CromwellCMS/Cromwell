import { onStoreChange, removeOnStoreChange, TOrder, TStoreListItem, TUser } from '@cromwell/core';
import { getCStore, getGraphQLClient, LoadBox as DefaultLoadBox, useUserInfo } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';
import { useEffect, useState } from 'react';

import { CartList as BaseCartList, CartListProps } from '../CartList/CartList';
import styles from './AccountOrders.module.scss';

export type AccountOrdersProps = {
  classes?: Partial<
    Record<'root' | 'order' | 'orderTitle' | 'orderCart' | 'detailsRow' | 'totalText' | 'detailsText', string>
  >;

  elements?: {
    Loadbox?: React.ComponentType;
    CartList?: React.ComponentType<CartListProps>;
  };

  text?: {
    nothingHere?: string;
    shipping?: string;
    total?: string;
    status?: string;
  };

  /**
   * Create custom order title
   */
  getOrderTitle?: (order: TOrder) => string;
};

/**
 * Displays all store orders placed by currently logged in account.
 * User must be logged in via `SignIn` component of `@cromwell/core-frontend`
 * or via `AuthClient` (`getAuthClient`) for this component to work.
 */
export function AccountOrders(props: AccountOrdersProps) {
  const { text, classes, getOrderTitle } = props;
  const { Loadbox = DefaultLoadBox, CartList = BaseCartList } = props.elements ?? {};
  const cstore = getCStore();

  const userInfo = useUserInfo();
  const [orders, setOrders] = useState<TOrder[] | undefined | null>(null);
  const [loading, setLoading] = useState(false);

  const getOrders = async (email: string) => {
    setLoading(true);
    try {
      const orders = await getGraphQLClient().getOrdersOfUser({
        email,
        pagedParams: { pageSize: 1000 },
      });
      if (orders?.elements) {
        orders.elements = orders.elements.map((order) => {
          if (typeof order.createDate === 'string') {
            order.createDate = new Date(order.createDate);
          }
          try {
            order.cart = typeof order.cart === 'string' ? JSON.parse(order.cart) : order.cart;
          } catch (error) {
            console.error(error);
          }

          return order;
        });
        orders.elements.sort((a, b) => (b.createDate?.getTime() ?? 0) - (a.createDate?.getTime() ?? 0));

        setOrders(orders.elements);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userInfo?.email) getOrders(userInfo.email);

    const onChange = (changed?: TUser) => {
      if (changed?.email) getOrders(changed.email);
      else setOrders(null);
    };
    const cbId = onStoreChange('userInfo', onChange);

    return () => {
      removeOnStoreChange('userInfo', cbId);
    };
  }, []);

  if (!userInfo?.id) return null;
  if (loading) return <Loadbox />;

  return (
    <div className={styles.AccountOrders}>
      {!orders?.length && <p>{text?.nothingHere ?? 'Nothing here yet'}</p>}
      {orders?.map((order) => {
        return (
          <div key={order.id} className={clsx(styles.order, classes?.order)}>
            <h3 className={clsx(styles.orderTitle, classes?.orderTitle)}>
              {getOrderTitle
                ? getOrderTitle(order)
                : `Order #${order.id} from ${order.createDate?.toLocaleDateString?.() ?? ''}`}
            </h3>
            <div className={clsx(styles.orderCart, classes?.orderCart)}>
              <CartList hideDelete={true} cart={order.cart as TStoreListItem[]} />
            </div>
            <div className={clsx(styles.detailsRow, classes?.detailsRow)}>
              <p className={clsx(styles.detailsText, classes?.detailsText)}>{text?.shipping ?? 'Shipping:'}</p>
              <b>{cstore.getPriceWithCurrency(order?.shippingPrice)}</b>
            </div>
            <div className={clsx(styles.detailsRow, classes?.detailsRow)}>
              <p className={clsx(styles.totalText, classes?.totalText)}>{text?.total ?? 'Total:'}</p>
              <b className={clsx(styles.totalText, classes?.totalText)}>
                {cstore.getPriceWithCurrency(order?.orderTotalPrice)}
              </b>
            </div>
            <div className={clsx(styles.detailsRow, classes?.detailsRow)}>
              <p className={clsx(styles.detailsText, classes?.detailsText)}>{text?.status ?? 'Status:'}</p>
              <b>{order?.status}</b>
            </div>
          </div>
        );
      })}
    </div>
  );
}
