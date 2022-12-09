import { EDBEntity, TOrder, TOrderInput } from '@cromwell/core';
import { getCStore, getGraphQLClient } from '@cromwell/core-frontend';
import React, { useRef } from 'react';
import { gql } from '@apollo/client';

import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import { orderListPageInfo, orderPageInfo } from '../../constants/PageInfos';
import { getCustomMetaFor, getCustomMetaKeysFor } from '../../helpers/customFields';
import { PageContent } from './components/PageContent';

export default function OrderPage() {
  const client = getGraphQLClient();
  const cstoreRef = useRef(getCStore({ local: true }));
  const dataRef = useRef<TOrder | null>(null);
  const cartUpdatedRef = useRef(false);

  return (
    <EntityEdit
      entityCategory={EDBEntity.Order}
      entityListRoute={orderListPageInfo.route}
      entityBaseRoute={orderPageInfo.baseRoute}
      listLabel="Orders"
      disableMeta
      entityLabel="Order"
      getById={(id) => {
        const metaKeys = getCustomMetaKeysFor(EDBEntity.Order);

        return client.getOrderById(
          id,
          gql`
          fragment AdminOrderFragment on Order {
              ...OrderFragment
              ${metaKeys?.length ? `customMeta (keys: ${JSON.stringify(metaKeys)})` : ''}
              coupons {
                  ...CouponFragment
              }
          }
          ${client.CouponFragment}
          ${client.OrderFragment}
        `,
          'AdminOrderFragment',
        );
      }}
      update={client.updateOrder}
      create={client.createOrder}
      deleteOne={client.deleteOrder}
      classes={{ content: 'bg-transparent border-0 p-0' }}
      customElements={{
        getEntityFields: (props) => (
          <PageContent {...props} cstoreRef={cstoreRef} dataRef={dataRef} cartUpdatedRef={cartUpdatedRef} />
        ),
      }}
      onSave={async () => {
        const data = dataRef.current;
        const cstore = cstoreRef.current;

        const cartInfo = cstore.getCartTotal();
        const updatedCartTotal = cartInfo.total ?? 0;
        const updatedOrderTotalPrice = parseFloat((updatedCartTotal + (data?.shippingPrice ?? 0)).toFixed(2));

        const inputData: TOrderInput = {
          status: data.status,
          cart: JSON.stringify(cstore.getCart()),
          orderTotalPrice: cartUpdatedRef.current ? updatedOrderTotalPrice : data.orderTotalPrice,
          cartTotalPrice: cartUpdatedRef.current ? updatedCartTotal : data.cartTotalPrice,
          cartOldTotalPrice: data.cartOldTotalPrice,
          shippingPrice: data.shippingPrice,
          totalQnt: data.totalQnt,
          userId: data.userId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          customerAddress: data.customerAddress,
          customerComment: data.customerComment,
          shippingMethod: data.shippingMethod,
          paymentMethod: data.paymentMethod,
          currency: data.currency,
          couponCodes: cstore.getCoupons()?.map((c) => c.code) ?? [],
          customMeta: await getCustomMetaFor(EDBEntity.Order),
        };
        return inputData;
      }}
    />
  );
}
