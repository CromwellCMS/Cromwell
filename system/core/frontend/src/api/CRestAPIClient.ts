import { fetch } from '../helpers/isomorphicFetch';
import {
    apiV1BaseRoute,
    getStoreItem,
    serviceLocator,
    setStoreItem,
    TPageConfig,
    TPageInfo,
    TThemeMainConfig,
    TPluginConfig,
    TFrontendBundle,
    TPluginInfo,
    TCmsSettings
} from '@cromwell/core';

type TPluginsModifications = TPluginConfig & { [x: string]: any };

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
            const res = await fetch(`${this.baseUrl}/${route}`);
            const data = await res.json();
            return this.handleError(res, data, route);
        } catch (e) {
            this.logError(route, e);
        }
    }

    public post = async <T>(route: string, input: any): Promise<T | undefined> => {
        try {
            const res = await window.fetch(`${this.baseUrl}/${route}`, {
                method: 'post',
                body: typeof input === 'string' ? input : JSON.stringify(input)
            })
            const data = await res.json();
            return this.handleError(res, data, route);
        } catch (e) {
            this.logError(route, e);
        }
    }

    public getCmsSettings = async (): Promise<TCmsSettings | undefined> => {
        return this.get(`cms/config`);
    }

    public saveThemeName = async (themeName?: string): Promise<boolean | undefined> => {
        return this.get(`cms/set-theme?themeName=${themeName ?? ''}`);
    }

    public getCmsSettingsAndSave = async (): Promise<TCmsSettings | undefined> => {
        const config = await this.getCmsSettings();
        if (config) {
            setStoreItem('cmsSettings', config);
            return config;
        }
    }

    public readPublicDir = (path?: string): Promise<string[] | null | undefined> => {
        return this.get(`cms/read-public-dir?path=${path ?? '/'}`);
    }

    public createPublicDir = (dirName: string, inPath?: string): Promise<string[] | null | undefined> => {
        return this.get(`cms/create-public-dir?inPath=${inPath ?? '/'}&dirName=${dirName}`);
    }

    public removePublicDir = (dirName: string, inPath?: string): Promise<string[] | null | undefined> => {
        return this.get(`cms/remove-public-dir?inPath=${inPath ?? '/'}&dirName=${dirName}`);
    }

    public uploadPublicFile = (dirName: string, inPath?: string): Promise<string[] | null | undefined> => {
        return this.get(`cms/remove-public-dir?inPath=${inPath ?? '/'}&dirName=${dirName}`);
    }

    public getThemesInfo = async (): Promise<TThemeMainConfig[] | undefined> => {
        return this.get(`cms/themes`);
    }

    public getPluginList = async (): Promise<({
        name: string;
        icon?: string;
        info?: string;
    })[] | undefined> => {
        return this.get(`cms/plugins`);
    }


    public getPageConfig = async (pageRoute: string): Promise<TPageConfig | undefined> => {
        return this.get(`theme/page?pageRoute=${pageRoute}`);
    }

    public savePageConfig = async (config: TPageConfig): Promise<boolean> => {
        const data = await this.post<boolean>(`theme/page`, config);
        return data ?? false;
    }

    public getPluginsModifications = async (pageRoute: string): Promise<Record<string, TPluginsModifications> | undefined> => {
        return this.get(`theme/plugins?pageRoute=${pageRoute}`);
    }

    public getPluginNames = async (): Promise<string[] | undefined> => {
        return this.get(`theme/plugin-names`);
    }

    public getPagesInfo = async (): Promise<TPageInfo[] | undefined> => {
        return this.get(`theme/pages/info`);
    }

    public getPageConfigs = async (): Promise<TPageConfig[] | undefined> => {
        return this.get(`theme/pages/configs`);
    }

    public getThemeMainConfig = async (): Promise<TThemeMainConfig | undefined> => {
        return this.get(`theme/main-config`);
    }

    public getThemeCustomConfig = async (): Promise<Record<string, any> | undefined> => {
        return this.get(`theme/custom-config`);
    }

    public getThemePageBundle = async (pageRoute: string): Promise<TFrontendBundle | undefined> => {
        return this.get(`theme/page-bundle?pageRoute=${pageRoute}`);
    }

    public installTheme = async (themeName: string): Promise<boolean> => {
        const data = await this.get<boolean>(`theme/install?themeName=${themeName}`);
        return data ?? false;
    }



    public getPluginSettings = async (pluginName: string): Promise<any | undefined> => {
        return this.get(`plugin/settings?pluginName=${pluginName}`);
    }

    public savePluginSettings = async (pluginName: string, settings: any): Promise<boolean> => {
        const data = await this.post<boolean>(`plugin/settings?pluginName=${pluginName}`, settings);
        return data ?? false;
    }

    public getPluginFrontendBundle = async (pluginName: string): Promise<TFrontendBundle | undefined> => {
        return this.get(`plugin/frontend-bundle?pluginName=${pluginName}`);
    }

    public getPluginAdminBundle = async (pluginName: string): Promise<TFrontendBundle | undefined> => {
        return this.get(`plugin/admin-bundle?pluginName=${pluginName}`);
    }

    public installPlugin = async (pluginName: string): Promise<boolean> => {
        const data = await this.get<boolean>(`plugin/install?pluginName=${pluginName}`);
        return data ?? false;
    }


    // < Manager >

    public changeTheme = async (themeName: string): Promise<boolean> => {
        const data = await this.get<boolean>(`manager/services/change-theme/${themeName}`);
        return data ?? false;
    }

    public rebuildTheme = async (): Promise<boolean> => {
        const data = await this.get<boolean>(`manager/services/rebuild-theme`);
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