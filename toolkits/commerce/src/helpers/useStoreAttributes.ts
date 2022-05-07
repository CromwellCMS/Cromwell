import { TAttribute } from '@cromwell/core';
import { getGraphQLClient, useForceUpdate } from '@cromwell/core-frontend';

import { useModuleState } from './state';

let isFetchingAttributes = false;

/** @internal */
export const useStoreAttributes = (attributes?: TAttribute[] | null) => {
    const forceUpdate = useForceUpdate();
    const moduleState = useModuleState();

    const checkAttributesData = async () => {
        const client = getGraphQLClient();
        if (!moduleState.attributes) {
            if (!isFetchingAttributes) {
                isFetchingAttributes = true;
                try {
                    const data = await client.getAttributes({ pagedParams: { pageSize: 1000 } });
                    moduleState.setAttributes(data?.elements);
                    forceUpdate();
                } catch (e) {
                    console.error('ccom_ModuleState::checkAttributesData', e)
                }
                isFetchingAttributes = false;
            }
        }
    }
    if (!moduleState.attributes) {
        if (attributes && Array.isArray(attributes)) moduleState.attributes = attributes;
        else checkAttributesData();
    }
    return moduleState.attributes;
}