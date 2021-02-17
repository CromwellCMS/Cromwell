import { setStoreItem } from '@cromwell/core';
import '@testing-library/jest-dom/extend-expect';

setStoreItem('cmsSettings', {
    apiPort: 1,
    adminPanelPort: 2,
    frontendPort: 3,
    managerPort: 4,
})