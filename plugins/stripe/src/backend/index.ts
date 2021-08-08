import { registerAction } from '@cromwell/core-backend';

import { pluginName } from '../constants';
import { createPayment } from './actions/create-payment.action';

registerAction({
    pluginName,
    actionName: 'create_payment',
    action: createPayment,
});
