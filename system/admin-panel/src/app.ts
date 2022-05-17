import './helpers/Draggable/Draggable.css';
import './helpers/importDependencies';
import './styles/global.scss';
import '@cromwell/core-frontend/dist/_index.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/base.css';

import { getStoreItem, matchPermissions, onStoreChange, setStoreItem, TUser } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient, TRestApiErrorInfo } from '@cromwell/core-frontend';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux-ts';

import Layout from './components/layout/Layout';
import { toast } from './components/toast/toast';
import { loginPageInfo, welcomePageInfo } from './constants/PageInfos';
import { registerCustomEntity } from './helpers/customEntities';
import { registerCustomFieldOfType } from './helpers/customFields';
import { loadPlugins } from './helpers/loadPlugins';
import { store } from './redux/store';

(async () => {
    let isInstalled = true;
    const restClient = getRestApiClient();
    const graphClient = getGraphQLClient();

    const request = async <T>(req: Promise<T>): Promise<T> => {
        try {
            return await req;
        } catch (e) {
            console.error('request err', e);
        }
    }
    const [
        settings,
        userInfo,
    ] = await Promise.all([
        request(restClient?.getCmsSettings({ disableLog: true })),
        request(restClient?.getUserInfo({ disableLog: true })),
    ]);

    const themeConfig = settings?.themeName && await request(restClient?.getThemeConfig(settings?.themeName, { disableLog: true }));

    if (settings) {
        setStoreItem('cmsSettings', settings);
    }

    const themeMode = window.localStorage.getItem('crw_theme_mode');
    if (themeMode) {
        setStoreItem('theme', {
            ...(getStoreItem('theme') ?? {}),
            mode: themeMode as any,
        });
    }

    // Redirect to /setup page if not installed
    if (settings && !settings.installed) {
        isInstalled = false;
        if (!window.location.pathname.includes(welcomePageInfo.route)) {
            window.history.pushState({}, '', '/admin' + welcomePageInfo.route);
            window.location.reload();
            return;
        }
    }

    const onUnauthorizedCbId = 'admin-logout';
    const onUnauthorized = async () => {
        let userInfo: TUser;
        restClient?.removeOnUnauthorized(onUnauthorizedCbId);
        try {
            userInfo = await restClient?.getUserInfo({ disableLog: true });
        } catch (e) {
            console.error(e);
        }
        restClient?.onUnauthorized(onUnauthorized, onUnauthorizedCbId);
        if (!userInfo?.id || !userInfo.roles?.length) {
            if (!window.location.pathname.includes(loginPageInfo.route)) {
                window.history.pushState({}, '', '/admin' + loginPageInfo.route);
                window.location.reload();
                return;
            }
        }
    }

    restClient?.onUnauthorized(onUnauthorized, onUnauthorizedCbId);
    graphClient?.onUnauthorized(onUnauthorized, onUnauthorizedCbId);

    const onRestApiError = (info: TRestApiErrorInfo) => {
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
        if (window.location.pathname.includes(welcomePageInfo.route)) {
            window.history.pushState({}, '', '/admin' + loginPageInfo.route);
            window.location.reload();
            return;
        }

        // Redirect to /login page if not authorized
        if (!userInfo?.id || !userInfo.roles?.length) {
            if (!window.location.pathname.includes(loginPageInfo.route)) {
                window.history.pushState({}, '', '/admin' + loginPageInfo.route);
                window.location.reload();
                return;
            }
        }
        setStoreItem('userInfo', userInfo);
    }

    if (themeConfig) {
        store.setStateProp({
            prop: 'activeTheme',
            payload: themeConfig,
        });
        setStoreItem('defaultPages', themeConfig?.defaultPages);
    }

    const onUserLogged = async (info: TUser) => {
        if (matchPermissions(info, ['read_plugins'])) {
            setTimeout(() => loadPlugins({ onlyNew: true }), 50);
        }

        if (matchPermissions(info, ['read_cms_settings'])) {
            try {
                const settings = await restClient.getAdminCmsSettings();
                if (settings) {
                    setStoreItem('cmsSettings', settings);

                    settings?.customFields?.forEach(registerCustomFieldOfType);
                    settings?.customEntities?.forEach(registerCustomEntity);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    if (userInfo?.roles) {
        onUserLogged(userInfo);
    } else {
        onStoreChange('userInfo', (info) => {
            onUserLogged(info);
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




