/// <reference path="./declarations.d.ts" />
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/layout/Layout';
import { setStoreItem } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';

// Define API port:
import { CMSconfig } from '../.cromwell/imports/plugins.gen';
setStoreItem('cmsconfig', CMSconfig);

// Update config from api
if (CMSconfig) {
  (async () => {
    const cmsConfig = await getRestAPIClient()?.getCmsConfig();
    setStoreItem('cmsconfig', cmsConfig);
  })();
}


ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);

