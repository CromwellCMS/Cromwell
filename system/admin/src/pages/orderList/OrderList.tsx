import { EDBEntity } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { orderStatuses } from '../../constants/order';
import { orderListPageInfo, orderPageInfo } from '../../constants/PageInfos';
import { getTooltipValueView, getValueView } from '../../helpers/addressParser';
import { formatTimeAgo } from '../../helpers/time';

export default function OrderTable() {
  const client = getGraphQLClient();

  return (
    <EntityTable
      entityCategory={EDBEntity.Order}
      entityListRoute={orderListPageInfo.route}
      entityBaseRoute={orderPageInfo.baseRoute}
      listLabel="Orders"
      entityLabel="Order"
      hideAddNew
      getMany={client.getOrders as any}
      deleteOne={client.deleteOrder}
      deleteMany={client.deleteManyOrders}
      columns={[
        {
          name: 'id',
          label: 'ID',
          type: 'Simple text',
          exactSearch: true,
          visible: true,
          maxWidth: '100px',
        },
        {
          name: 'status',
          label: 'Status',
          type: 'Simple text',
          visible: true,
          exactSearch: true,
          searchOptions: orderStatuses.map((status) => ({
            value: status,
            label: status,
          })),
        },
        {
          name: 'orderTotalPrice',
          label: 'Total',
          type: 'Currency',
          visible: true,
        },
        {
          name: 'createDate',
          label: 'Created',
          type: 'Datetime',
          visible: true,
          getValueView: (value) => formatTimeAgo(value),
        },
        {
          name: 'updateDate',
          label: 'Updated',
          type: 'Datetime',
          visible: false,
          getValueView: (value) => formatTimeAgo(value),
        },
        {
          name: 'customerName',
          label: 'Name',
          type: 'Simple text',
          visible: true,
        },
        {
          name: 'customerAddress',
          label: 'Address',
          type: 'Simple text',
          visible: true,
          getValueView: getValueView,
          getTooltipValueView: getTooltipValueView,
        },
        {
          name: 'customerPhone',
          label: 'Phone',
          type: 'Simple text',
          visible: false,
        },
        {
          name: 'customerEmail',
          label: 'Email',
          type: 'Simple text',
          visible: false,
        },
        {
          name: 'customerComment',
          label: 'Comment',
          type: 'Simple text',
          visible: false,
        },
        {
          name: 'shippingMethod',
          label: 'Shipping method',
          type: 'Simple text',
          visible: false,
        },
        {
          name: 'paymentMethod',
          label: 'Payment method',
          type: 'Simple text',
          visible: false,
        },
        {
          name: 'shippingPrice',
          label: 'Shipping price',
          type: 'Currency',
          visible: false,
        },
        {
          name: 'totalQnt',
          label: 'Total Qnt',
          type: 'Simple text',
          visible: false,
        },
        {
          name: 'userId',
          label: 'User ID',
          type: 'Simple text',
          visible: false,
        },
        {
          name: 'currency',
          label: 'Currency',
          type: 'Simple text',
          visible: false,
        },
      ]}
    />
  );
}
