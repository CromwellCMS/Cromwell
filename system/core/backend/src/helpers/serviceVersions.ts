import { TCmsSettings, TServiceVersions } from '@cromwell/core';

import { getCmsEntity } from './cms-settings';

/** @internal */
export const extractServiceVersion = (settings: TCmsSettings | undefined, serviceName: keyof TServiceVersions): number | undefined => {
    if (settings?.versions) {
        try {
            const versions: TServiceVersions = typeof settings.versions === 'string' ? JSON.parse(settings.versions) : settings.versions;
            return typeof versions[serviceName] === 'number' ? versions[serviceName] : undefined;
        } catch (e) { }
    }
}

// Internal. Listener: https://github.com/CromwellCMS/Cromwell/blob/55046c48d9da0a44e4b11e7918c73876fcd1cfc1/system/manager/src/managers/baseManager.ts#L194:L206
/** @internal */
export const incrementServiceVersion = async (serviceName: keyof TServiceVersions) => {
    const cms = await getCmsEntity();
    const versions: TServiceVersions = typeof cms.versions === 'string' ? JSON.parse(cms.versions) : cms.versions ?? {};
    const sVer = versions?.[serviceName];
    versions[serviceName] = sVer ? sVer + 1 : 1;
    cms.versions = JSON.stringify(versions);
    await cms.save();
}