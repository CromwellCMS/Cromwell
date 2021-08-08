import '@testing-library/jest-dom/extend-expect';
import { setStoreItem } from '@cromwell/core';

window.fetch = () => new Promise(done => done({
    status: 200,
    json: () => new Promise(done => done(null)),
    text: () => new Promise(done => done(null)),
})) as any;

setStoreItem('cmsSettings', {
    apiPort: 1,
    adminPanelPort: 2,
    frontendPort: 3,
    managerPort: 4,
})