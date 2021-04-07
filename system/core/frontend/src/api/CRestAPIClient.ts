import { fetch } from '../helpers/isomorphicFetch';
import {
    apiV1BaseRoute,
    getStoreItem,
    serviceLocator,
    setStoreItem,
    TPageConfig,
    TPageInfo,
    TPluginConfig,
    TFrontendBundle,
    TPackageCromwellConfig,
    TPluginInfo,
    TCmsSettings,
    TThemeConfig,
    logFor,
    isServer,
    TUser,
    TCmsEntityInput,
} from '@cromwell/core';

type TPluginsModifications = TPluginConfig & { [x: string]: any };

class CRestAPIClient {
    constructor(private baseUrl: string) { }

    private unauthorizedRedirect: string | null = null;

    private handleError = (responce: Response, data: any, route: string): any => {
        if ((responce.status === 403 || responce.status === 401) && !isServer()) {
            if (this.unauthorizedRedirect && !window.location.href.includes(this.unauthorizedRedirect)) {
                window.location.href = this.unauthorizedRedirect;
            }
        }

        if (responce.status >= 400) {
            this.logError(route, `Request failed, status: ${responce.status}. ${data?.message}`)
            return undefined;
        }
        return data;
    }

    private logError = (route: string, e?: any) => {
        logFor('errors-only', `CRestAPIClient route: ${route}` + e, console.error)
    }

    public get = async <T>(route: string): Promise<T | undefined> => {
        try {
            const res = await fetch(`${this.baseUrl}/${route}`, {
                method: 'get',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            return this.handleError(res, data, route);
        } catch (e) {
            this.logError(route, e);
        }
    }

    public post = async <T>(route: string, input?: any): Promise<T | undefined> => {
        try {
            const res = await fetch(`${this.baseUrl}/${route}`, {
                method: 'post',
                credentials: 'include',
                body: typeof input === 'string' ? input : input ? JSON.stringify(input) : undefined,
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await res.json();
            return this.handleError(res, data, route);
        } catch (e) {
            this.logError(route, e);
        }
    }

    // < Auth >

    public login = async (credentials: {
        email: string;
        password: string;
    }): Promise<TUser | undefined> => {
        return this.post('auth/login', credentials);
    }

    public logOut = async () => {
        return this.post('auth/log-out', {});
    }

    public getUserInfo = async (): Promise<TUser | undefined> => {
        return this.get('auth/user-info');
    }

    public setUnauthorizedRedirect = (url: string | null) => {
        this.unauthorizedRedirect = url;
    }

    // < CMS >

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

    public uploadPublicFiles = async (inPath: string, files: File[]): Promise<boolean | null | undefined> => {
        const formData = new FormData();
        for (const file of files) {
            formData.append(file.name, file);
        }
        const response = await fetch(`${this.baseUrl}/cms/upload-public-file?inPath=${inPath ?? '/'}`, {
            method: 'POST',
            body: formData
        });
        return response.body;
    }

    public getThemesInfo = async (): Promise<TPackageCromwellConfig[] | undefined> => {
        return this.get(`cms/themes`);
    }

    public getPluginList = async (): Promise<TPackageCromwellConfig[] | undefined> => {
        return this.get(`cms/plugins`);
    }

    public setUpCms = async (): Promise<boolean | undefined> => {
        return this.post(`cms/set-up`, {});
    }

    public updateCmsConfig = async (input: TCmsEntityInput): Promise<TCmsSettings | undefined> => {
        return this.post(`cms/update-config`, input);
    }

    // < / CMS >


    // < Theme >

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

    public getThemeInfo = async (): Promise<TPackageCromwellConfig | undefined> => {
        return this.get(`theme/info`);
    }

    public getThemeConfig = async (): Promise<TThemeConfig | undefined> => {
        return this.get(`theme/config`);
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

    // < / Theme >


    // < Plugin >

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

    // < / Plugin >


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

export const getRestAPIClient = (serverType: 'main' | 'plugin' = 'main'): CRestAPIClient | undefined => {
    let clients = getStoreItem('apiClients');
    if (serverType === 'main' && clients?.mainRestAPIClient) return clients.mainRestAPIClient;
    if (serverType === 'plugin' && clients?.pluginRestAPIClient) return clients.pluginRestAPIClient;

    const typeUrl = serverType === 'plugin' ? serviceLocator.getPluginApiUrl() : serviceLocator.getMainApiUrl();
    const baseUrl = `${typeUrl}/${apiV1BaseRoute}/graphql`;

    const newClient = new CRestAPIClient(baseUrl);
    if (!clients) clients = {};
    if (serverType === 'main') clients.mainRestAPIClient = newClient;
    if (serverType === 'plugin') clients.pluginRestAPIClient = newClient;

    setStoreItem('apiClients', clients);
    return newClient;
}