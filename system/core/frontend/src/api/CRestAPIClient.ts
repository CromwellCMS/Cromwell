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

    private handleError = (responce: Response, data: any, route: string): any => {
        if (responce.status >= 400) {
            this.logError(route, `Request failed, status: ${responce.status}. ${data?.message}`)
            return undefined;
        }
        return data;
    }

    private logError = (route: string, e?: any) => {
        console.error(`CRestAPIClient route: ${route}`, e);
    }

    public get = async <T>(route: string): Promise<T | undefined> => {
        try {
            const res = await fetch(route);
            const data = await res.json();
            return this.handleError(res, data, route);
        } catch (e) {
            this.logError(route, e);
        }
    }

    public post = async <T>(route: string, input: any): Promise<T | undefined> => {
        try {
            const res = await window.fetch(route, {
                method: 'post',
                body: JSON.stringify(input)
            })
            const data = await res.json();
            return this.handleError(res, data, route);
        } catch (e) {
            this.logError(route, e);
        }
    }

    public getCmsConfig = async (): Promise<TCmsConfig | undefined> => {
        return this.get(`${this.baseUrl}/cms/config`);
    }

    public getCmsConfigAndSave = async (): Promise<TCmsConfig | undefined> => {
        const config = await this.getCmsConfig();
        if (config) {
            setStoreItem('cmsconfig', config);
            return config;
        }
    }

    public getThemesInfo = async (): Promise<TThemeMainConfig[] | undefined> => {
        return this.get(`${this.baseUrl}/cms/themes`);
    }

    public getPageConfig = async (pageRoute: string): Promise<TPageConfig | undefined> => {
        return this.get(`${this.baseUrl}/theme/page/?pageRoute=${pageRoute}`);
    }

    public savePageConfig = async (config: TPageConfig): Promise<boolean> => {
        const data = await this.post<boolean>(`${this.baseUrl}/theme/page`, config);
        return data ?? false;
    }

    public getPluginsModifications = async (pageRoute: string): Promise<Record<string, TPluginConfig & { [x: string]: any }> | undefined> => {
        return this.get(`${this.baseUrl}/theme/plugins?pageRoute=${pageRoute}`);
    }

    public getPluginNames = async (): Promise<string[] | undefined> => {
        return this.get(`${this.baseUrl}/theme/plugin-names`);
    }

    public getPagesInfo = async (): Promise<TPageInfo[] | undefined> => {
        return this.get(`${this.baseUrl}/theme/pages/info`);
    }

    public getPageConfigs = async (): Promise<TPageConfig[] | undefined> => {
        return this.get(`${this.baseUrl}/theme/pages/configs`);
    }

    public getThemeMainConfig = async (): Promise<TThemeMainConfig | undefined> => {
        return this.get(`${this.baseUrl}/theme/main-config`);
    }

    public getThemeCustomConfig = async (): Promise<Record<string, any> | undefined> => {
        return this.get(`${this.baseUrl}/theme/custom-config`);
    }

    public getThemePageBundle = async (pageRoute: string): Promise<TFrontendBundle | undefined> => {
        return this.get(`${this.baseUrl}/theme/page-bundle?pageRoute=${pageRoute}`);
    }

    public installTheme = async (themeName: string): Promise<boolean> => {
        const data = await this.get<boolean>(`${this.baseUrl}/theme/install/${themeName}`);
        return data ?? false;
    }



    public getPluginSettings = async (pluginName: string): Promise<any | undefined> => {
        return this.get(`${this.baseUrl}/plugin/settings/${pluginName}`);
    }

    public setPluginSettings = async (pluginName: string, settings: any): Promise<boolean> => {
        const data = await this.post<boolean>(`${this.baseUrl}/plugin/settings/${pluginName}`, settings);
        return data ?? false;
    }

    public getPluginFrontendBundle = async (pluginName: string): Promise<TFrontendBundle | undefined> => {
        return this.get(`${this.baseUrl}/plugin/frontend-bundle/${pluginName}`);
    }

    public getPluginAdminBundle = async (pluginName: string): Promise<TFrontendBundle | undefined> => {
        return this.get(`${this.baseUrl}/plugin/admin-bundle/${pluginName}`);
    }

    public getPluginList = async (): Promise<TPluginInfo[] | undefined> => {
        return this.get(`${this.baseUrl}/plugin/list`);
    }

    public installPlugin = async (pluginName: string): Promise<boolean> => {
        const data = await this.get<boolean>(`${this.baseUrl}/plugin/install/${pluginName}`);
        return data ?? false;
    }


    // < Manager >

    public changeTheme = async (themeName: string): Promise<boolean> => {
        const data = await this.get<boolean>(`${this.baseUrl}/manager/services/change-theme/${themeName}`);
        return data ?? false;
    }

    public rebuildTheme = async (): Promise<boolean> => {
        const data = await this.get<boolean>(`${this.baseUrl}/manager/services/rebuild-theme`);
        return data ?? false;
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