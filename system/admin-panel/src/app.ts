import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/layout/Layout';
import { setStoreItem } from '@cromwell/core';

(async () => {
  const cmsConf = await (await fetch('/cmsconfig.json')).json();
  setStoreItem('cmsconfig', cmsConf);

  ReactDOM.render(
    React.createElement(Layout),
    document.getElementById('root')
  );
})();




