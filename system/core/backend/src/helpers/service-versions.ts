import { TCmsSettings, TServiceVersions } from '@cromwell/core';

import { getCmsSettings, getCmsEntity } from './cms-settings';

/** @internal */
export const extractServiceVersion = (
  settings: TCmsSettings | undefined,
  serviceName: keyof TServiceVersions,
): number | undefined => {
  if (settings?.versions) {
    const versions: TServiceVersions = settings.versions ?? {};
    return typeof versions[serviceName] === 'number' ? versions[serviceName] : undefined;
  }
};

// Internal. Listener: https://github.com/CromwellCMS/Cromwell/blob/55046c48d9da0a44e4b11e7918c73876fcd1cfc1/system/manager/src/managers/baseManager.ts#L194:L206
/** @internal */
export const incrementServiceVersion = async (serviceName: keyof TServiceVersions) => {
  const cms = await getCmsEntity();
  if (!cms) throw new Error('incrementServiceVersion: could not load CMS settings');

  const versions: TServiceVersions = cms.internalSettings?.versions ?? {};
  const sVer = versions?.[serviceName];
  versions[serviceName] = sVer ? sVer + 1 : 1;

  cms.internalSettings = {
    ...cms.internalSettings,
    versions,
  };
  await cms.save();
};

/** @internal */
export const getServiceVersion = async (serviceName: keyof TServiceVersions) => {
  const cms = await getCmsSettings();
  return extractServiceVersion(cms, serviceName);
};
