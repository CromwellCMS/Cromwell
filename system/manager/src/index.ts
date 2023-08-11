import { setStoreItem } from '@cromwell/core';
import { readCMSConfigSync } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { reportProcessPid } from '@cromwell/core-backend/dist/helpers/shell';

const cmsConfig = readCMSConfigSync();
setStoreItem('cmsSettings', cmsConfig);

export {
  startSystem,
  startServiceByName,
  closeServiceByName,
  closeServiceAndManagerByName,
  shutDownSystem,
  getServicesStatus,
} from './managers/baseManager';
export { buildTask } from './tasks/buildTask';
export { checkModules } from './tasks/checkModules';
export { serviceNames, TServiceNames } from './constants';

reportProcessPid('manager_runner');
