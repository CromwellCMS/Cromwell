import React from 'react';
import ReactDOM from 'react-dom';
import { getModuleImporter } from '@cromwell/cromwella/build/importer.js';

const importer = getModuleImporter();

(async () => {
  const meta = await (await fetch('/build/meta.json')).json();
  await importer.importSciptExternals(meta);

  const App: any = await import('./components/layout/Layout');
  ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
  );

})();



