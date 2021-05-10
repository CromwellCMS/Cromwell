import { ActionNames, ActionTypes, getLogger } from '@cromwell/core-backend';
import { getRestAPIClient } from '@cromwell/core-frontend';

import { authSettings } from '../auth/constants';
import { ServerActionDto } from '../dto/server-action.dto';

export const mainFireAction = async <T extends ActionNames>(actionName: T, payload?: ActionTypes[T]) => {
    const action = new ServerActionDto();
    action.payload = payload;
    action.actionName = actionName;
    action.secretKey = authSettings.actionsSecret;
    try {
        await getRestAPIClient('plugin').post('cms/fire-action', action);
    } catch (error) {
        getLogger('errors-only').error(error);
    }
}
