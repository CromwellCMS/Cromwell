import { setStoreItem } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './components/layout/Layout';

(async () => {
  await getRestAPIClient()?.getCmsSettingsAndSave();
  setStoreItem('environment', {
    isAdminPanel: true
  });

  ReactDOM.render(
    React.createElement(Layout),
    document.getElementById('root')
  );
})();




