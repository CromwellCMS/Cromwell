import * as core from '@cromwell/core';
import { getRestAPIClient, getGraphQLClient } from '@cromwell/core-frontend';
import * as coreFrontend from '@cromwell/core-frontend';
import { getModuleImporter } from '@cromwell/utils/build/importer.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux-ts';
import { loginPageInfo, welcomePageInfo } from './constants/PageInfos';
import Layout from './components/layout/Layout';
import { setStoreItem } from '@cromwell/core';
import { store } from './redux/store';
import { toast } from './components/toast/toast';

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

    // getRestAPIClient()?.setUnauthorizedRedirect(loginPageInfo.route);
    // getGraphQLClient()?.setUnauthorizedRedirect(loginPageInfo.route);
    const onUnauthorized = async () => {
        let userInfo;
        getRestAPIClient()?.setOnUnauthorized(null);
        getGraphQLClient()?.setOnUnauthorized(null);
        try {
            userInfo = await getRestAPIClient()?.getUserInfo();
        } catch (e) {
            console.error(e);
        }
        getRestAPIClient()?.setOnUnauthorized(onUnauthorized);
        getGraphQLClient()?.setOnUnauthorized(onUnauthorized);
        if (!userInfo?.id) {
            if (window.location.pathname != loginPageInfo.route) {
                window.location.href = loginPageInfo.route;
            }
        }
    }

    getRestAPIClient()?.setOnUnauthorized(onUnauthorized);
    getGraphQLClient()?.setOnUnauthorized(onUnauthorized);

    getRestAPIClient()?.onError((info) => {
        if (info.statusCode === 429) {
            toast.error('Too many requests');
        }
    });

    if (isInstalled) {
        // Redirect to /login page if not authorized
        try {
            const userInfo = await getRestAPIClient()?.getUserInfo();
            if (!userInfo) {
                if (window.location.pathname !== loginPageInfo.route) {
                    window.location.href = loginPageInfo.route;
                    return;
                }
            }
            setStoreItem('userInfo', userInfo);
        } catch (e) {
            console.error(e);
        }
    }


    ReactDOM.render(
        <Provider store={store}>
            <Layout />
        </Provider>,
        document.getElementById('root')
    );
})();




