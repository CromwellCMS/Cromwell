import { setStoreItem, TPluginEntity, onStoreChange } from '@cromwell/core';
import * as core from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient, TErrorInfo } from '@cromwell/core-frontend';
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
    const restClientExt = getRestAPIClient('plugin');
    const graphClient = getGraphQLClient();
    const graphClientExt = getGraphQLClient('plugin');


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
        restClientExt?.setOnUnauthorized(null);
        graphClient?.setOnUnauthorized(null);
        graphClientExt?.setOnUnauthorized(null);
        try {
            userInfo = await restClient?.getUserInfo();
        } catch (e) {
            console.error(e);
        }
        restClient?.setOnUnauthorized(onUnauthorized);
        restClientExt?.setOnUnauthorized(onUnauthorized);
        graphClient?.setOnUnauthorized(onUnauthorized);
        graphClientExt?.setOnUnauthorized(onUnauthorized);
        if (!userInfo?.id) {
            if (!window.location.hash.includes(loginPageInfo.route)) {
                window.location.href = '/admin/#' + loginPageInfo.route;
                // window.location.reload();
            }
        }
    }

    restClient?.setOnUnauthorized(onUnauthorized);
    graphClient?.setOnUnauthorized(onUnauthorized);
    restClientExt?.setOnUnauthorized(onUnauthorized);
    graphClientExt?.setOnUnauthorized(onUnauthorized);


    const onRestApiError = (info: TErrorInfo) => {
        if (info.route !== 'auth/user-info') {
            if (info?.statusCode === 429) {
                toast.error('Too many requests. Try again later');
            } else {
                if (info?.message)
                    toast.error(info.message);
            }
        }
    }
    restClient?.onError(onRestApiError, 'app');
    restClientExt?.onError(onRestApiError, 'app');


    const onGraphQlError = (message) => {
        if (message)
            toast.error(message);
    }
    graphClient?.onError(onGraphQlError, 'app');
    graphClientExt?.onError(onGraphQlError, 'app');


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


    const loadPlugins = async () => {
        try {
            const pluginEntities: TPluginEntity[] = await graphClient.getAllEntities('Plugin',
                graphClient.PluginFragment, 'PluginFragment');

            const loadPlugin = async (pluginName) => {
                try {
                    const bundle = await restClient.getPluginAdminBundle(pluginName);
                    const success = await new Promise(done => {
                        const sourceBlob = new Blob([bundle.source], { type: 'text/javascript' });
                        const objectURL = URL.createObjectURL(sourceBlob);
                        const domScript = document.createElement('script');
                        domScript.id = pluginName;
                        domScript.src = objectURL;
                        domScript.onload = () => done(true);
                        domScript.onerror = () => done(false);
                        document.head.appendChild(domScript);
                    });
                    if (!success) console.error('Failed to load plugin: ' + pluginName);
                } catch (error) {
                    console.error(error);
                }
            }

            const pluginPromises: Promise<any>[] = [];
            if (pluginEntities && Array.isArray(pluginEntities)) {
                for (const entity of pluginEntities) {
                    pluginPromises.push(loadPlugin(entity.name));
                }
            }
            await Promise.all(pluginPromises);
        } catch (e) { console.error(e); }
        hasLoadedPlugins = true;
    }


    let hasLoadedPlugins = false;
    if (userInfo?.role === 'administrator') {
        setTimeout(loadPlugins, 50);
    } else {
        onStoreChange('userInfo', (info) => {
            if (info?.role === 'administrator' && !hasLoadedPlugins) {
                setTimeout(loadPlugins, 50);
            }
        });
    }

    ReactDOM.render(
        React.createElement(Provider, {
            store,
        }, React.createElement(Layout)),
        document.getElementById('root')
    );
})();




