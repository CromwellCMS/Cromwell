import { setStoreItem } from '@cromwell/core';
import * as core from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';
import * as coreFrontend from '@cromwell/core-frontend';
import { getModuleImporter } from '@cromwell/utils/build/importer.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux-ts';

import Layout from './components/layout/Layout';
import { toast } from './components/toast/toast';
import { loginPageInfo, welcomePageInfo } from './constants/PageInfos';
import { store } from './redux/store';

const importer = getModuleImporter();
importer.modules['@cromwell/core-frontend'] = coreFrontend;
importer.modules['@cromwell/core'] = core;

(async () => {
    let isInstalled = true;
    const restClient = getRestAPIClient();
    const graphClient = getGraphQLClient();


    const request = async <T>(req: Promise<T>): Promise<T> => {
        try {
            return await req;
        } catch (e) {
            console.error(e);
        }
    }
    const [
        settings,
        userInfo,
        themeConfig
    ] = await Promise.all([
        request(restClient?.getCmsSettingsAndSave()),
        request(restClient?.getUserInfo()),
        request(restClient?.getThemeConfig()),
    ]);

    // Redirect to /setup page if not installed
    if (settings && !settings.installed) {
        isInstalled = false;
        if (!window.location.hash.includes(welcomePageInfo.route)) {
            window.location.href = '/admin/#' + welcomePageInfo.route;
            // window.location.reload();
        }
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
        if (!userInfo) {
            if (!window.location.hash.includes(loginPageInfo.route)) {
                window.location.href = '/admin/#' + loginPageInfo.route;
                // window.location.reload();
            }
        }
        setStoreItem('userInfo', userInfo);
    }

    if (themeConfig) {
        store.setStateProp({
            prop: 'activeTheme',
            payload: themeConfig,
        })
    }

    ReactDOM.render(
        React.createElement(Provider, {
            store,
        }, React.createElement(Layout)),
        document.getElementById('root')
    );
})();




