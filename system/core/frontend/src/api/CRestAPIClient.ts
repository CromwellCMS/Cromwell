import { fetch } from '../helpers/isomorphicFetch';
import {
    apiV1BaseRoute,
    getStoreItem,
    serviceLocator,
    setStoreItem,
    TCmsConfig,
    TPageConfig,
    TPageInfo,
    TThemeMainConfig,
    TPluginConfig,
    TFrontendBundle,
    TPluginInfo
} from '@cromwell/core';


class CRestAPIClient {
    constructor(private baseUrl: string) { }

    public get = async <T>(route: string): Promise<T> => {
        return (await fetch(route)).json();
    }

    public post = async <T>(route: string, data: any): Promise<T> => {
        return (await fetch(route, {
            method: 'post',
            body: JSON.stringify(data)
        })).json();
    }

    private logError = (name: string, e: any) => {
        console.error(`CRestAPIClient::${name ?? ''}`, e);
    }

    public getCmsConfig = async (): Promise<TCmsConfig> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/cms/config`);
        } catch (e) { this.logError('getCmsConfig', e); }
        return data;
    }

    public getCmsConfigAndSave = async (): Promise<TCmsConfig> => {
        const config = await this.getCmsConfig();
        setStoreItem('cmsconfig', config);
        return config;
    }

    public getThemesInfo = async (): Promise<TThemeMainConfig[]> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/cms/themes`);
        } catch (e) { this.logError('getThemesInfo', e); }
        return data;
    }

    public getPageConfig = async (pageRoute: string): Promise<TPageConfig> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/page/?pageRoute=${pageRoute}`);
        } catch (e) { this.logError('getPageConfig', e); }
        return data ?? [];
    }

    public savePageConfig = async (config: TPageConfig): Promise<boolean> => {
        let data: any;
        try {
            data = await this.post(`${this.baseUrl}/theme/page`, config);
        } catch (e) { this.logError('savePageConfig', e); }
        return data ?? false;
    }

    public getPluginsModifications = async (pageRoute: string): Promise<Record<string, TPluginConfig & { [x: string]: any }>> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/plugins?pageRoute=${pageRoute}`);
        } catch (e) { this.logError('getPluginsModifications', e); }
        return data ?? {};
    }

    public getPluginNames = async (): Promise<string[]> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/plugin-names`);
        } catch (e) { this.logError('getPluginNames', e); }
        return data ?? [];
    }

    public getPagesInfo = async (): Promise<TPageInfo[]> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/pages/info`);
        } catch (e) { this.logError('getPagesInfo', e); }
        return data ?? [];
    }

    public getPageConfigs = async (): Promise<TPageConfig[]> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/pages/configs`);
        } catch (e) { this.logError('getPageConfigs', e); }
        return data ?? [];
    }

    public getThemeMainConfig = async (): Promise<TThemeMainConfig> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/main-config`);
        } catch (e) { this.logError('getThemeMainConfig', e); }
        return data ?? {};
    }

    public getThemeCustomConfig = async (): Promise<Record<string, any>> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/custom-config`);
        } catch (e) { this.logError('getThemeCustomConfig', e); }
        return data ?? {};
    }

    public getThemePageBundle = async (pageRoute: string): Promise<TFrontendBundle | null> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/page-bundle?pageRoute=${pageRoute}`);
        } catch (e) { this.logError('getThemePageBundle', e); }
        return data ?? null;
    }

    public installTheme = async (themeName: string): Promise<boolean> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/theme/install/${themeName}`);
        } catch (e) { this.logError('installTheme', e); }
        return data ?? null;
    }



    public getPluginSettings = async (pluginName: string): Promise<any | null> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/plugin/settings/${pluginName}`);
        } catch (e) { this.logError('getPluginSettings', e); }
        return data ?? null;
    }

    public setPluginSettings = async (pluginName: string, settings: any): Promise<boolean> => {
        let data: any;
        try {
            data = await this.post(`${this.baseUrl}/plugin/settings/${pluginName}`, settings);
        } catch (e) { this.logError('setPluginSettings', e); }
        return data ?? null;
    }

    public getPluginFrontendBundle = async (pluginName: string): Promise<TFrontendBundle | null> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/plugin/frontend-bundle/${pluginName}`);
        } catch (e) { this.logError('getPluginFrontendBundle', e); }
        return data ?? null;
    }

    public getPluginAdminBundle = async (pluginName: string): Promise<TFrontendBundle | null> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/plugin/admin-bundle/${pluginName}`);
        } catch (e) { this.logError('getPluginAdminBundle', e); }
        return data ?? null;
    }

    public getPluginList = async (): Promise<TPluginInfo[] | null> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/plugin/list`);
        } catch (e) { this.logError('getPluginList', e); }
        return data ?? null;
    }

    public installPlugin = async (pluginName: string): Promise<boolean> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/plugin/install/${pluginName}`);
        } catch (e) { this.logError('installPlugin', e); }
        return data ?? null;
    }


    // < Manager >

    public changeTheme = async (themeName: string): Promise<boolean | null> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/manager/services/change-theme/${themeName}`);
        } catch (e) { this.logError('changeTheme', e); }
        return data ?? null;
    }

    public rebuildTheme = async (): Promise<boolean | null> => {
        let data: any;
        try {
            data = await this.get(`${this.baseUrl}/manager/services/rebuild-theme`);
        } catch (e) { this.logError('rebuildTheme', e); }
        return data ?? null;
    }

    // < / Manager >
}

export const getRestAPIClient = (): CRestAPIClient | undefined => {
    let client = getStoreItem('restAPIClient');
    if (client) return client;

    const baseUrl = `${serviceLocator.getApiUrl()}/${apiV1BaseRoute}`;

    client = new CRestAPIClient(baseUrl);

    setStoreItem('restAPIClient', client);
    return client;
}