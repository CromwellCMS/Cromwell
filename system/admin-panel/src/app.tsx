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
    const restClient = getRestAPIClient();
    const graphClient = getGraphQLClient();

    try {
        const config = await restClient?.getCmsSettingsAndSave();

        // Redirect to /setup page if not installed
        if (config && !config.installed) {
            isInstalled = false;
            if (!window.location.hash.includes(welcomePageInfo.route)) {
                window.location.href = '/admin/#' + welcomePageInfo.route;
                // window.location.reload();
            }
        }
    } catch (e) {
        console.error(e);
    }

    const onUnauthorized = async () => {
        let userInfo;
        restClient?.setOnUnauthorized(null);
        graphClient?.setOnUnauthorized(null);
        try {
            userInfo = await restClient?.getUserInfo();
        } catch (e) {
            console.error(e);
        }
        restClient?.setOnUnauthorized(onUnauthorized);
        graphClient?.setOnUnauthorized(onUnauthorized);
        if (!userInfo?.id) {
            if (!window.location.hash.includes(loginPageInfo.route)) {
                window.location.href = '/admin/#' + loginPageInfo.route;
                // window.location.reload();
            }
        }
    }

    restClient?.setOnUnauthorized(onUnauthorized);
    graphClient?.setOnUnauthorized(onUnauthorized);

    restClient?.onError((info) => {
        if (info.route !== 'auth/user-info') {
            if (info?.statusCode === 429) {
                toast.error('Too many requests. Try again later');
            } else {
                if (info?.message)
                    toast.error(info.message);
            }
        }
    }, 'app');

    graphClient?.onError((message) => {
        if (message)
            toast.error(message);
    }, 'app');

    if (isInstalled) {
        if (window.location.hash.includes(welcomePageInfo.route)) {
            window.location.href = '/admin/#' + loginPageInfo.route;
        }

        // Redirect to /login page if not authorized
        try {
            const userInfo = await restClient?.getUserInfo();
            if (!userInfo) {
                if (!window.location.hash.includes(loginPageInfo.route)) {
                    window.location.href = '/admin/#' + loginPageInfo.route;
                    // window.location.reload();
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




