import './helpers/Draggable/Draggable.css';
import './helpers/importDependencies';
import './styles/global.scss';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'quill/dist/quill.snow.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import { onStoreChange, setStoreItem } from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient, TErrorInfo } from '@cromwell/core-frontend';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux-ts';

import Layout from './components/layout/Layout';
import { toast } from './components/toast/toast';
import { loginPageInfo, welcomePageInfo } from './constants/PageInfos';
import { loadPlugins } from './helpers/loadPlugins';
import { store } from './redux/store';

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
        request(restClient?.getCmsSettingsAndSave({ disableLog: true })),
        request(restClient?.getUserInfo({ disableLog: true })),
        request(restClient?.getThemeConfig({ disableLog: true })),
    ]);

    // Redirect to /setup page if not installed
    if (settings && !settings.installed) {
        isInstalled = false;
        if (!window.location.hash.includes(welcomePageInfo.route)) {
            window.location.href = '/admin/#' + welcomePageInfo.route;
            // window.location.reload();
        }
    }

    const onUnauthorizedCbId = 'admin-logout';
    const onUnauthorized = async () => {
        let userInfo;
        restClient?.removeOnUnauthorized(onUnauthorizedCbId);
        try {
            userInfo = await restClient?.getUserInfo({ disableLog: true });
        } catch (e) {
            console.error(e);
        }
        restClient?.onUnauthorized(onUnauthorized, onUnauthorizedCbId);
        if (!userInfo?.id) {
            if (!window.location.hash.includes(loginPageInfo.route)) {
                window.location.href = '/admin/#' + loginPageInfo.route;
                // window.location.reload();
            }
        }
    }

    restClient?.onUnauthorized(onUnauthorized, onUnauthorizedCbId);
    graphClient?.onUnauthorized(onUnauthorized, onUnauthorizedCbId);

    const onRestApiError = (info: TErrorInfo) => {
        if (info?.statusCode === 429) {
            toast.error('Too many requests. Try again later');
        } else {
            if (info?.message && !info?.disableLog)
                toast.error(info.message);
        }
    }

    restClient?.onError(onRestApiError, 'app');


    const onGraphQlError = (info) => {
        if (info?.message)
            toast.error(info.message);
    }
    graphClient?.onError(onGraphQlError, 'app');


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

    if (userInfo?.role) {
        setTimeout(() => loadPlugins({ onlyNew: true }), 50);
    } else {
        onStoreChange('userInfo', (info) => {
            if (info?.role) {
                setTimeout(() => loadPlugins({ onlyNew: true }), 50);
            }
        });
    }

    ReactDOM.render(
        React.createElement(
            Provider, { store, },
            React.createElement(Layout)
        ),
        document.getElementById('root')
    );
})();




