import React from 'react';
import '@testing-library/jest-dom/extend-expect';

const idObj = new Proxy({}, {
    get: function getter(target, key) {
        if (key === '__esModule') {
            return true;
        }
        return (props) => React.createElement('span', null, props.children);
    }
});

// For perfomance reasons
jest.mock('@mui/icons-material', () => {
    return idObj;
});