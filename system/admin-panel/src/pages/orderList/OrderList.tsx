import { EDBEntity, TOrder, TOrderFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../../components/entity/types';
import { orderStatuses } from '../../constants/order';
import { orderListPageInfo, orderPageInfo } from '../../constants/PageInfos';

type TOrderItem = TOrder & { id: number };
const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TOrderItem, TOrderFilter>>;

export default function OrderTable() {
    const client = getGraphQLClient();

    return (
        <EntityTableComp
            entityCategory={EDBEntity.Order}
            entityListRoute={orderListPageInfo.route}
            entityBaseRoute={orderPageInfo.baseRoute}
            listLabel="Orders"
            entityLabel="Order"
            hideAddNew
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
                    getValueView: (value) => {
                        if (!value) return '';
                        // Support old and new address format
                        let addressJson
                        try {
                            addressJson = JSON.parse(value);
                        } catch (error) { }
                        if (!addressJson) return value;
                        let addressStr = ''
                        for (const [key, value] of Object.entries(addressJson)) {
                            if (!value || !key) continue;
                            addressStr += value + ', ';
                        }
                        return addressStr;
                    },
                    getTooltipValueView: (value) => {
                        if (!value) return '';
                        // Support old and new address format
                        let addressJson
                        try {
                            addressJson = JSON.parse(value);
                        } catch (error) { }
                        if (!addressJson) return value;
                        let addressStr = ''
                        for (const [key, value] of Object.entries(addressJson)) {
                            if (!value || !key) continue;
                            addressStr += `${key}: ${value}\n`;
                        }
                        return addressStr;
                    }
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
