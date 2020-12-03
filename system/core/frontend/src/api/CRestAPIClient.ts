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
    TSciprtMetaInfo,
    TFrontendBundle,
    TPluginInfo
} from '@cromwell/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


class CRestAPIClient {
    constructor(private baseUrl: string) { }

    public get = <T>(route: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<T>> => {
        return axios.get(`${this.baseUrl}/${route}`, config);
    }

    public getCmsConfig = async (): Promise<TCmsConfig> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/cms/config`);
        } catch (e) { console.error('CRestAPIClient::getCmsConfig', e) }
        return res?.data;
    }

    public getCmsConfigAndSave = async (): Promise<TCmsConfig> => {
        const config = await this.getCmsConfig();
        setStoreItem('cmsconfig', config);
        return config;
    }

    public getThemesInfo = async (): Promise<TThemeMainConfig[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/cms/themes`);
        } catch (e) { console.error('CRestAPIClient::getThemesInfo', e) }
        return res?.data;
    }

    public getPageConfig = async (pageRoute: string): Promise<TPageConfig> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/page/?pageRoute=${pageRoute}`);
        } catch (e) { console.error('CRestAPIClient::getPageConfig', e) }
        return res?.data ?? [];
    }

    public savePageConfig = async (config: TPageConfig): Promise<boolean> => {
        let res: any;
        try {
            res = await axios.post(`${this.baseUrl}/theme/page`, config);
        } catch (e) { console.error('CRestAPIClient::savePageConfig', e) }
        return (res && res.data) ? res.data : false;
    }

    public getPluginsModifications = async (pageRoute: string): Promise<Record<string, TPluginConfig & { [x: string]: any }>> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/plugins?pageRoute=${pageRoute}`);
        } catch (e) { console.error('CRestAPIClient::getPluginsModifications', e) }
        return res?.data ?? {};
    }

    public getPluginNames = async (): Promise<string[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/plugin-names`);
        } catch (e) { console.error('CRestAPIClient::getPluginNames', e) }
        return res?.data ?? [];
    }

    public getPagesInfo = async (): Promise<TPageInfo[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/pages/info`);
        } catch (e) { console.error('CRestAPIClient::getPagesInfo', e) }
        return res?.data ?? [];
    }

    public getPageConfigs = async (): Promise<TPageConfig[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/pages/configs`);
        } catch (e) { console.error('CRestAPIClient::getPageConfigs', e) }
        return res?.data ?? [];
    }

    public getThemeMainConfig = async (): Promise<TThemeMainConfig> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/main-config`);
        } catch (e) { console.error('CRestAPIClient::getThemeMainConfig', e) }
        return res?.data ?? {};
    }

    public getThemeCustomConfig = async (): Promise<Record<string, any>> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/custom-config`);
        } catch (e) { console.error('CRestAPIClient::getThemeCustomConfig', e) }
        return res?.data ?? {};
    }

    public getThemePageBundle = async (pageRoute: string): Promise<TFrontendBundle | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/page-bundle?pageRoute=${pageRoute}`);
        } catch (e) { console.error('CRestAPIClient::getThemePageBundle', e) }
        return res?.data ?? null;
    }

    public getPluginSettings = async (pluginName: string): Promise<any | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/plugin/settings/${pluginName}`);
        } catch (e) { console.error('CRestAPIClient::getPluginSettings', e) }
        return res?.data ?? null;
    }

    public setPluginSettings = async (pluginName: string, settings: any): Promise<boolean> => {
        let res: any;
        try {
            res = await axios.post(`${this.baseUrl}/plugin/settings/${pluginName}`, settings);
        } catch (e) { console.error('CRestAPIClient::setPluginSettings', e) }
        return res?.data ?? null;
    }

    public getPluginFrontendBundle = async (pluginName: string): Promise<TFrontendBundle | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/plugin/frontend-bundle/${pluginName}`);
        } catch (e) { console.error('CRestAPIClient::getPluginFrontendBundle', e) }
        return res?.data ?? null;
    }

    public getPluginAdminBundle = async (pluginName: string): Promise<TFrontendBundle | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/plugin/admin-bundle/${pluginName}`);
        } catch (e) { console.error('CRestAPIClient::getPluginAdminBundle', e) }
        return res?.data ?? null;
    }


    public getPluginList = async (): Promise<TPluginInfo[] | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/plugin/list`);
        } catch (e) { console.error('CRestAPIClient::getPluginList', e) }
        return res?.data ?? null;
    }


    // < Manager >

    public changeTheme = async (themeName: string): Promise<boolean | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/manager/services/change-theme/${themeName}`);
        } catch (e) { console.error('CRestAPIClient::changeTheme', e) }
        return res?.data ?? null;
    }

    public rebuildTheme = async (): Promise<boolean | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/manager/services/rebuild-theme`);
        } catch (e) { console.error('CRestAPIClient::changeTheme', e) }
        return res?.data ?? null;
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