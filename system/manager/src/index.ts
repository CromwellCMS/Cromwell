import { setStoreItem } from '@cromwell/core';
import { readCMSConfigSync } from '@cromwell/core-backend';

const cmsConfig = readCMSConfigSync();
setStoreItem('cmsSettings', cmsConfig);

export { startSystem, startServiceByName, closeServiceByName, closeSystem } from './managers/baseManager';
export { buildTask } from './tasks/buildTask';
export { checkModules } from './tasks/checkModules';
export { serviceNames, TServiceNames } from './constants';
