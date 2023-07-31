import { ActionNames, ActionTypes, fireAction, getLogger } from '@cromwell/core-backend';

const logger = getLogger();

export const serverFireAction = async <T extends ActionNames>(actionName: T, payload?: ActionTypes[T]['payload']) => {
  try {
    return await fireAction({
      actionName: actionName,
      payload: payload,
    });
  } catch (error) {
    logger.error('serverFireAction: ', error);
  }
};
