import { EDBEntity } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { couponListPageInfo, couponPageInfo } from '../../constants/PageInfos';
import { baseEntityColumns } from '../../helpers/customEntities';


export default function CouponList() {
  const client = getGraphQLClient();

  return (
    <EntityTable
      entityCategory={EDBEntity.Coupon}
      entityListRoute={couponListPageInfo.route}
      entityBaseRoute={couponPageInfo.baseRoute}
      listLabel="Coupons"
      entityLabel="Coupon"
      nameProperty="name"
      getMany={client.getCoupons}
      deleteOne={client.deleteCoupon}
      deleteMany={client.deleteManyCoupons}
      columns={[
        {
          name: 'code',
          label: 'Code',
          type: 'Simple text',
          visible: true,
        },
        {
          name: 'discountType',
          label: 'Discount type',
          type: 'Simple text',
          visible: true,
        },
        {
          name: 'value',
          label: 'Value',
          type: 'Simple text',
          visible: true,
        },
        {
          name: 'expiryDate',
          label: 'Expiry date',
          type: 'Datetime',
          visible: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'Simple text',
          visible: false,
        },
        {
          name: 'allowFreeShipping',
          label: 'Free Shipping',
          type: 'Checkbox',
          visible: false,
        },
        {
          name: 'minimumSpend',
          label: 'Minimum spend',
          type: 'Currency',
          visible: false,
        },
        {
          name: 'maximumSpend',
          label: 'Maximum spend',
          type: 'Currency',
          visible: false,
        },
        {
          name: 'usageLimit',
          label: 'Usage limit',
          type: 'Simple text',
          visible: false,
        },
        ...baseEntityColumns.map(col => {
          if (col.name === 'createDate') return { ...col, visible: true }
          return { ...col, visible: false }
        }),
      ]}
    />
  )
}