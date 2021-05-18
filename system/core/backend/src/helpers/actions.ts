import { getLogger } from "./logger";
import { ActionTypes, ActionNames } from './types';


const actions: Record<string, Record<string, ((payload) => any)>> = {};

export const registerAction = <T extends ActionNames>(options: {
    pluginName: string;
    actionName: T;
    action: (payload: ActionTypes[T]) => any;
}) => {
    const logger = getLogger();
    const { pluginName, actionName, action } = options ?? {};
    if (!pluginName || !actionName || !action) {
        logger.error('registerAction: Invalid options: ' + options);
        return;
    }

    if (!actions[actionName]) actions[actionName] = {};
    actions[actionName][pluginName] = action;
}

export const fireAction = async <T extends ActionNames>(options: {
    actionName: T | string;
    payload?: ActionTypes[T];
}): Promise<Record<string, any>> => {
    const logger = getLogger();
    const { payload, actionName } = options ?? {};
    if (!actionName) {
        logger.error('fireAction: Invalid options: ' + options);
        return {};
    }

    if (!actions[actionName]) actions[actionName] = {};
    const results = await Promise.all(
        Object.keys(actions[actionName]).map(async (pluginName) => {
            let res;
            try {
                res = await actions[actionName][pluginName](payload);
            } catch (error) {
                logger.error(`fireAction: Action of ${pluginName} failed: ` + error);
            }
            return { [pluginName]: res }
        })
    );
    return Object.assign({}, ...results);
}
