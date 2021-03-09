import * as core from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import * as coreFrontend from '@cromwell/core-frontend';
import { getModuleImporter } from '@cromwell/utils/build/importer.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux-ts';
import { loginPageInfo, welcomePageInfo } from './constants/PageInfos';
import Layout from './components/layout/Layout';
import { setStoreItem } from '@cromwell/core';
import { store } from './redux/store';

const importer = getModuleImporter();

importer.modules['@cromwell/core-frontend'] = coreFrontend;
importer.modules['@cromwell/core'] = core;

(async () => {
    let isInstalled = true;

    try {
        const config = await getRestAPIClient()?.getCmsSettingsAndSave();

        // Redirect to /setup page if not installed
        if (config && !config.installed) {
            isInstalled = false;
            if (window.location.pathname !== welcomePageInfo.route) {
                window.location.href = welcomePageInfo.route;
                return;
            }
        }
    } catch (e) {
        console.error(e);
    }

    getRestAPIClient()?.setUnauthorizedRedirect(loginPageInfo.route);

    if (isInstalled) {
        // Redirect to /login page if not authorized
        const userInfo = await getRestAPIClient()?.getUserInfo();
        if (!userInfo) {
            if (window.location.pathname !== loginPageInfo.route) {
                window.location.href = loginPageInfo.route;
                return;
            }
        }
        setStoreItem('userInfo', userInfo);
    }


    ReactDOM.render(
        <Provider store={store}>
            <Layout />
        </Provider>,
        document.getElementById('root')
    );
})();




