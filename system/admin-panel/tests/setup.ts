import React from 'react';
import { setStoreItem } from '@cromwell/core';
import '@testing-library/jest-dom/extend-expect';

const idObj = new Proxy({}, {
    get: function getter(target, key) {
        if (key === '__esModule') {
            return true;
        }
        return (props) => React.createElement('div', null, props.children);
    }
});

// For perfomance reasons
jest.mock('@material-ui/icons', () => {
    return idObj;
});


setStoreItem('cmsSettings', {
    apiPort: 1,
    adminPanelPort: 2,
    frontendPort: 3,
    managerPort: 4,
})