import { TAttribute } from '@cromwell/core';
import { getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';

import { useForceUpdate } from './forceUpdate';
import { useModuleState } from './state';

export const useStoreAttributes = (attributes?: TAttribute[] | null) => {
    const forceUpdate = useForceUpdate();
    const moduleState = useModuleState();

    const checkAttributesData = async () => {
        const client = getGraphQLClient();
        if (!moduleState.attributes) {
            try {
                moduleState.setAttributes(await client.getAttributes());
                forceUpdate();
            } catch (e) {
                console.error('ccom_ModuleState::checkAttributesData', getGraphQLErrorInfo(e))
            }
        }
    }
    if (!moduleState.attributes) {
        if (attributes && Array.isArray(attributes)) moduleState.attributes = attributes;
        else checkAttributesData();
    }
    return moduleState.attributes;
}