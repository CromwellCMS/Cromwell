/// <reference path="./declarations.d.ts" />
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/layout/Layout';
import { setStoreItem } from '@cromwell/core';
import { CMSconfig } from '../.cromwell/imports/plugins.gen';
setStoreItem('cmsconfig', CMSconfig);
setStoreItem('isAdminPanel', true);

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);

