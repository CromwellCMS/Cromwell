import { TCmsSettings, TServiceVersions } from '@cromwell/core';

import { getCmsEntity } from './cms-settings';

export const extractServiceVersion = (settings: TCmsSettings | undefined, serviceName: keyof TServiceVersions): number | undefined => {
    if (settings?.versions) {
        try {
            const versions: TServiceVersions = typeof settings.versions === 'string' ? JSON.parse(settings.versions) : settings.versions;
            return typeof versions[serviceName] === 'number' ? versions[serviceName] : undefined;
        } catch (e) { }
    }
}

export const incrementServiceVersion = async (serviceName: keyof TServiceVersions) => {
    const cms = await getCmsEntity();
    const versions: TServiceVersions = typeof cms.versions === 'string' ? JSON.parse(cms.versions) : cms.versions ?? {};
    const sVer = versions?.[serviceName];
    versions[serviceName] = sVer ? sVer + 1 : 1;
    cms.versions = JSON.stringify(versions);
    await cms.save();
}