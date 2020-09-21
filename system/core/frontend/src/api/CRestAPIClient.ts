import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
    TCromwellBlockData, getStoreItem, TPageConfig, TPageInfo, apiV1BaseRoute,
    TAppConfig, TProduct, TPagedList, TCmsConfig, TPagedParams, TProductCategory,
    setStoreItem, serviceLocator, TThemeInfo
} from '@cromwell/core';
import queryString from 'query-string';


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

    public getThemesInfo = async (): Promise<TThemeInfo[]> => {
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
        return (res && res.data) ? res.data : [];
    }

    public savePageConfig = async (config: TPageConfig): Promise<boolean> => {
        let res: any;
        try {
            res = await axios.post(`${this.baseUrl}/theme/page`, config);
        } catch (e) { console.error('CRestAPIClient::savePageConfig', e) }
        return (res && res.data) ? res.data : false;
    }

    public getPluginsModifications = async (pageRoute: string): Promise<Record<string, any>> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/plugins?pageRoute=${pageRoute}`);
        } catch (e) { console.error('CRestAPIClient::getPluginsModifications', e) }
        return (res && res.data) ? res.data : {};
    }

    public getPluginNames = async (): Promise<string[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/plugin-names`);
        } catch (e) { console.error('CRestAPIClient::getPluginNames', e) }
        return (res && res.data) ? res.data : [];
    }

    public getPagesInfo = async (): Promise<TPageInfo[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/pages/info`);
        } catch (e) { console.error('CRestAPIClient::getPagesInfo', e) }
        return (res && res.data) ? res.data : [];
    }

    public getPageConfigs = async (): Promise<TPageConfig[]> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/pages/configs`);
        } catch (e) { console.error('CRestAPIClient::getPageConfigs', e) }
        return (res && res.data) ? res.data : [];
    }

    public getAppConfig = async (): Promise<TAppConfig> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/app/config`);
        } catch (e) { console.error('CRestAPIClient::getAppConfig', e) }
        return (res && res.data) ? res.data : {};
    }

    public getAppCustomConfig = async (): Promise<Record<string, any>> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/theme/app/custom-config`);
        } catch (e) { console.error('CRestAPIClient::getAppCustomConfig', e) }
        return (res && res.data) ? res.data : {};
    }

    public getPluginSettings = async (pluginName: string): Promise<any | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/plugin/settings/${pluginName}`);
        } catch (e) { console.error('CRestAPIClient::getPluginSettings', e) }
        return (res && res.data) ? res.data : null;
    }

    public setPluginSettings = async (pluginName: string, settings: any): Promise<boolean> => {
        let res: any;
        try {
            res = await axios.post(`${this.baseUrl}/plugin/settings/${pluginName}`, settings);
        } catch (e) { console.error('CRestAPIClient::setPluginSettings', e) }
        return (res && res.data) ? res.data : null;
    }

    // < Manager >

    public changeTheme = async (themeName: string): Promise<boolean | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/manager/services/change-theme/${themeName}`);
        } catch (e) { console.error('CRestAPIClient::changeTheme', e) }
        return (res && res.data) ? res.data : null;
    }

    public rebuildTheme = async (): Promise<boolean | null> => {
        let res: any;
        try {
            res = await axios.get(`${this.baseUrl}/manager/services/rebuild-theme`);
        } catch (e) { console.error('CRestAPIClient::changeTheme', e) }
        return (res && res.data) ? res.data : null;
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