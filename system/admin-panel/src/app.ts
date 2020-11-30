import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/layout/Layout';
import { setStoreItem } from '@cromwell/core';

(async () => {
  const cmsConf = await (await fetch('/cmsconfig.json')).json();
  setStoreItem('cmsconfig', cmsConf);
  setStoreItem('environment', {
    isAdminPanel: true
  });

  ReactDOM.render(
    React.createElement(Layout),
    document.getElementById('root')
  );
})();




