import { EDBEntity, TOrder, TOrderFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../../components/entity/types';
import { orderStatuses } from '../../constants/order';
import { orderListPageInfo, orderPageInfo } from '../../constants/PageInfos';

type TOrderItem = TOrder & { id: number };
const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TOrderItem, TOrderFilter>>;

export default function ProductTable() {
    const client = getGraphQLClient();

    return (
        <EntityTableComp
            entityCategory={EDBEntity.Order}
            entityListRoute={orderListPageInfo.route}
            entityBaseRoute={orderPageInfo.baseRoute}
            listLabel="Orders"
            getManyFiltered={client.getFilteredOrders as any}
            deleteOne={client.deleteOrder}
            deleteMany={client.deleteManyOrders}
            deleteManyFiltered={client.deleteManyFilteredOrders}
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
                    searchOptions: orderStatuses.map(status => ({
                        key: status,
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
                },
                {
                    name: 'updateDate',
                    label: 'Updated',
                    type: 'Datetime',
                    visible: false,
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
    )
}
