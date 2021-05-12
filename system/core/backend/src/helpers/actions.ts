import { getLogger } from "./constants";
import { ActionTypes, ActionNames } from './types';

const logger = getLogger();

const actions: Record<string, Record<string, ((payload) => any)>> = {};

export const registerAction = <T extends ActionNames>(options: {
    pluginName: string;
    actionName: T;
    action: (payload: ActionTypes[T]) => any;
}) => {
    const { pluginName, actionName, action } = options ?? {};
    if (!pluginName || !actionName || !action) {
        logger.error('registerAction: Invalid options: ' + options);
        return;
    }

    if (!actions[actionName]) actions[actionName] = {};
    actions[actionName][pluginName] = action;
}

export const fireAction = <T extends ActionNames>(options: {
    actionName: T | string;
    payload?: ActionTypes[T];
}) => {
    const { payload, actionName } = options ?? {};
    if (!actionName) {
        logger.error('fireAction: Invalid options: ' + options);
        return;
    }

    if (!actions[actionName]) actions[actionName] = {};
    Object.keys(actions[actionName]).forEach(pluginName => {
        try {
            actions[actionName][pluginName](payload);
        } catch (error) {
            logger.error(`fireAction: Action of ${pluginName} failed: ` + error);
        }
    });
}
