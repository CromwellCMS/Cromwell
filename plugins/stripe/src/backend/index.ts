import { registerAction } from '@cromwell/core-backend';

import { pluginName } from '../constants';
import { createPayment } from './actions/createPayment';

registerAction({
    pluginName,
    actionName: 'create_payment',
    action: createPayment,
});
