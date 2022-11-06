import { getStoreItem, setStoreItem } from '@cromwell/core';

export const getServiceSecret = async () => {
  try {
    const nodeRequire = (name: string) => eval(`require('${name}');`);

    const getAuthSettings: typeof import('@cromwell/core-backend')['getAuthSettings'] = nodeRequire(
      '@cromwell/core-backend/dist/helpers/auth-settings',
    ).getAuthSettings;

    let cmsConfig = getStoreItem('cmsSettings');
    if (!cmsConfig) {
      const readCMSConfig: typeof import('@cromwell/core-backend')['readCMSConfig'] = nodeRequire(
        '@cromwell/core-backend/dist/helpers/cms-settings',
      ).readCMSConfig;
      cmsConfig = await readCMSConfig();
      setStoreItem('cmsSettings', cmsConfig);
    }
    if (!cmsConfig.serviceSecret) {
      cmsConfig.serviceSecret = (await getAuthSettings())?.serviceSecret;
    }
    return cmsConfig.serviceSecret;
  } catch (error) {
    console.error(error);
  }
};
