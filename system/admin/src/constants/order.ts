import { TOrderStatus } from '@cromwell/core';

export const orderStatuses = [
  'Pending',
  'Awaiting shipment',
  'Shipped',
  'Refunded',
  'Cancelled',
  'Completed',
] as TOrderStatus[];
