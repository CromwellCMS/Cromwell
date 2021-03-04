import * as core from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import * as coreFrontend from '@cromwell/core-frontend';
import { getModuleImporter } from '@cromwell/utils/build/importer.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { pageInfos, loginPageInfo } from './constants/PageInfos';

import Layout from './components/layout/Layout';
import { setStoreItem } from '@cromwell/core';


const importer = getModuleImporter();

importer.modules['@cromwell/core-frontend'] = coreFrontend;
importer.modules['@cromwell/core'] = core;

(async () => {
  try {
    await getRestAPIClient()?.getCmsSettingsAndSave();
  } catch (e) {
    console.error(e);
  }

  getRestAPIClient()?.setUnauthorizedRedirect(loginPageInfo.route);
  const userInfo = await getRestAPIClient()?.getUserInfo();

  if (!userInfo) {
    if (!window.location.href.includes(loginPageInfo.route)) {
      window.location.href = loginPageInfo.route;
      return;
    }
  }
  setStoreItem('userInfo', userInfo);

  ReactDOM.render(
    React.createElement(Layout),
    document.getElementById('root')
  );
})();




