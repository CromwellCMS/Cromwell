import * as core from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import * as coreFrontend from '@cromwell/core-frontend';
import { getModuleImporter } from '@cromwell/cromwella/build/importer.js';
import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './components/layout/Layout';

const importer = getModuleImporter();

importer.modules['@cromwell/core-frontend'] = coreFrontend;
importer.modules['@cromwell/core'] = core;


(async () => {
  await getRestAPIClient()?.getCmsSettingsAndSave();

  ReactDOM.render(
    React.createElement(Layout),
    document.getElementById('root')
  );
})();




