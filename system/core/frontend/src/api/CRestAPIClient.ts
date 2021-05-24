import {
    apiV1BaseRoute,
    getStoreItem,
    isServer,
    logFor,
    serviceLocator,
    setStoreItem,
    TCCSVersion,
    TCmsEntityInput,
    TCmsSettings,
    TCmsStats,
    TCmsStatus,
    TCreateUser,
    TFrontendBundle,
    TOrder,
    TPackageCromwellConfig,
    TPageConfig,
    TPageInfo,
    TPluginConfig,
    TProductReview,
    TProductReviewInput,
    TServerCreateOrder,
    TThemeConfig,
    TUser,
} from '@cromwell/core';

import { fetch } from '../helpers/isomorphicFetch';

export type TPluginsModifications = TPluginConfig & { [x: string]: any };

export type TErrorInfo = {
    statusCode: number;
    message: string;
    route: string;
    disableLog?: boolean;
}

export type TRequestOptions = {
    method?: string;
    input?: any;
    disableLog?: boolean;
}

class CRestAPIClient {
    constructor(private baseUrl: string) { }

    private onUnauthorized: (() => any) | null = null;
    private onErrorCallbacks: Record<string, ((info: TErrorInfo) => any)> = {};

    private handleError = async (responce: Response, data: any, route: string, disableLog?: boolean): Promise<[any, TErrorInfo | null]> => {
        if ((responce.status === 403 || responce.status === 401) && !isServer()) {
            this.onUnauthorized?.();
        }

        if (responce.status >= 400) {
            const errorInfo: TErrorInfo = {
                statusCode: responce.status,
                message: data?.message,
                route,
                disableLog,
            };
            return [data, errorInfo];
        }
        return [data, null];
    }

    private logError = (route: string, e?: any) => {
        logFor('errors-only', `CRestAPIClient route: ${route}` + e, console.error)
    }

    public fetch = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
        const input = options?.input;
        let data;
        let errorInfo: TErrorInfo | null = null;
        try {
            const res = await fetch(`${this.baseUrl}/${route}`, {
                method: options?.method ?? 'get',
                credentials: 'include',
                body: typeof input === 'string' ? input : input ? JSON.stringify(input) : undefined,
                headers: { 'Content-Type': 'application/json' },
            });
            const dataParsed = await res.json();
            [data, errorInfo] = await this.handleError(res, dataParsed, route, options?.disableLog);
        } catch (e) {
            errorInfo = {
                route,
                statusCode: 0,
                message: 'Could not connect to the Server. ' + String(e),
                disableLog: options?.disableLog,
            }
        }

        if (errorInfo) {
            for (const cb of Object.values(this.onErrorCallbacks)) {
                cb(errorInfo);
            }
            if (!options?.disableLog)
                this.logError(route, `Request failed, status: ${errorInfo.statusCode}. ${errorInfo.message}`);

            throw new Error(JSON.stringify(errorInfo));
        }

        return data;
    }

    public get = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
        return this.fetch(route, options);
    }

    public post = async <T>(route: string, input?: any, options?: TRequestOptions): Promise<T | undefined> => {
        return this.fetch(route, {
            method: 'post',
            input,
            ...(options ?? {}),
        });
    }

    public delete = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
        return this.fetch(route, {
            method: 'delete',
            ...(options ?? {}),
        });
    }

    public put = async <T>(route: string, input?: any, options?: TRequestOptions): Promise<T | undefined> => {
        return this.fetch(route, {
            method: 'put',
            input,
            ...(options ?? {}),
        });
    }

    // < Auth >

    public login = async (credentials: {
        email: string;
        password: string;
    }, options?: TRequestOptions): Promise<TUser | undefined> => {
        return this.post('auth/login', credentials, options);
    }

    public logOut = async (options?: TRequestOptions) => {
        return this.post('auth/log-out', {}, options);
    }


    public getUserInfo = async (options?: TRequestOptions): Promise<TUser | undefined> => {
        return this.get('auth/user-info', options);
    }

    public signUp = async (credentials: TCreateUser, options?: TRequestOptions): Promise<TUser | undefined> => {
        return this.post('auth/sign-up', credentials, options);
    }

    public forgotPassword = async (credentials: { email: string }, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.post('auth/forgot-password', credentials, options);
    }

    public resetPassword = async (credentials: {
        email: string;
        code: string;
        newPassword: string;
    }, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.post('auth/reset-password', credentials, options);
    }

    public setOnUnauthorized(func: (() => any) | null) {
        this.onUnauthorized = func;
    }

    public onError(cb: ((info: TErrorInfo) => any), id?: string) {
        if (!id) id = Object.keys(this.onErrorCallbacks).length + '';
        this.onErrorCallbacks[id] = cb;
    }


    // < CMS >

    public getCmsSettings = async (options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        return this.get(`cms/config`, options);
    }

    public getAdvancedCmsSettings = async (options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        return this.get(`cms/advanced-config`, options);
    }

    public getCmsSettingsAndSave = async (options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        const config = await this.getCmsSettings(options);
        if (config) {
            setStoreItem('cmsSettings', config);
            return config;
        }
    }

    public readPublicDir = (path?: string, options?: TRequestOptions): Promise<string[] | null | undefined> => {
        return this.get(`cms/read-public-dir?path=${path ?? '/'}`, options);
    }

    public createPublicDir = (dirName: string, inPath?: string, options?: TRequestOptions): Promise<string[] | null | undefined> => {
        return this.get(`cms/create-public-dir?inPath=${inPath ?? '/'}&dirName=${dirName}`, options);
    }

    public removePublicDir = (dirName: string, inPath?: string, options?: TRequestOptions): Promise<string[] | null | undefined> => {
        return this.get(`cms/remove-public-dir?inPath=${inPath ?? '/'}&dirName=${dirName}`, options);
    }

    public uploadPublicFiles = async (inPath: string, files: File[], options?: TRequestOptions): Promise<boolean | null | undefined> => {
        const formData = new FormData();
        for (const file of files) {
            formData.append(file.name, file);
        }
        const response = await fetch(`${this.baseUrl}/cms/upload-public-file?inPath=${inPath ?? '/'}`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
            ...(options ?? {}),
        });
        return response.body;
    }

    public getThemesInfo = async (options?: TRequestOptions): Promise<TPackageCromwellConfig[] | undefined> => {
        return this.get(`cms/themes`, options);
    }

    public getPluginList = async (options?: TRequestOptions): Promise<TPackageCromwellConfig[] | undefined> => {
        return this.get(`cms/plugins`, options);
    }

    public setUpCms = async (options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.post(`cms/set-up`, {}, options);
    }

    public updateCmsConfig = async (input: TCmsEntityInput, options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        return this.post(`cms/update-config`, input, options);
    }

    public activateTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.get<boolean>(`cms/activate-theme?themeName=${themeName}`, options);
        return data ?? false;
    }

    public activatePlugin = async (pluginName: string, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.get<boolean>(`cms/activate-plugin?pluginName=${pluginName}`, options);
        return data ?? false;
    }

    public changeTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.get<boolean>(`cms/change-theme?themeName=${themeName}`, options);
        return data ?? false;
    }

    public getOrderTotal = async (input: TServerCreateOrder, options?: TRequestOptions): Promise<TOrder | undefined> => {
        return this.post(`cms/get-order-total`, input, options);
    }

    public placeOrder = async (input: TServerCreateOrder, options?: TRequestOptions): Promise<TOrder | undefined> => {
        return this.post(`cms/place-order`, input, options);
    }

    public placeProductReview = async (input: TProductReviewInput, options?: TRequestOptions): Promise<TProductReview | undefined> => {
        return this.post(`cms/place-product-review`, input, options);
    }

    public getCmsStats = async (options?: TRequestOptions): Promise<TCmsStats | undefined> => {
        return this.get(`cms/stats`, options);
    }

    public getCmsStatus = async (options?: TRequestOptions): Promise<TCmsStatus | undefined> => {
        return this.get(`cms/status`, options);
    }

    public launchCmsUpdate = async (options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`cms/launch-update`, options);
    }

    // < / CMS >


    // < Theme >

    public getThemeUpdate = async (themeName: string, options?: TRequestOptions): Promise<TCCSVersion | undefined> => {
        return this.get(`theme/check-update?themeName=${themeName}`, options);
    }

    public updateTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`theme/update?themeName=${themeName}`, options);
    }

    public installTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`theme/install?themeName=${themeName}`, options);
    }

    public deleteTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`theme/delete?themeName=${themeName}`, options);
    }

    public getPageConfig = async (pageRoute: string, options?: TRequestOptions): Promise<TPageConfig | undefined> => {
        return this.get(`theme/page?pageRoute=${pageRoute}`, options);
    }

    public savePageConfig = async (config: TPageConfig, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.post<boolean>(`theme/page`, config, options);
        return data ?? false;
    }

    public deletePage = async (pageRoute: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.delete(`theme/page?pageRoute=${pageRoute}`, options);
    }

    public resetPage = async (pageRoute: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`theme/page/reset?pageRoute=${pageRoute}`, options);
    }

    public getPluginsModifications = async (pageRoute: string, options?: TRequestOptions): Promise<Record<string, TPluginsModifications> | undefined> => {
        return this.get(`theme/plugins?pageRoute=${pageRoute}`, options);
    }

    public getPluginNames = async (options?: TRequestOptions): Promise<string[] | undefined> => {
        return this.get(`theme/plugin-names`, options);
    }

    public getPagesInfo = async (options?: TRequestOptions): Promise<TPageInfo[] | undefined> => {
        return this.get(`theme/pages/info`, options);
    }

    public getPageConfigs = async (options?: TRequestOptions): Promise<TPageConfig[] | undefined> => {
        return this.get(`theme/pages/configs`, options);
    }

    public getThemeInfo = async (options?: TRequestOptions): Promise<TPackageCromwellConfig | undefined> => {
        return this.get(`theme/info`, options);
    }

    public getThemeConfig = async (options?: TRequestOptions): Promise<TThemeConfig | undefined> => {
        return this.get(`theme/config`, options);
    }

    public getThemeCustomConfig = async (options?: TRequestOptions): Promise<Record<string, any> | undefined> => {
        return this.get(`theme/custom-config`, options);
    }

    public getThemePageBundle = async (pageRoute: string, options?: TRequestOptions): Promise<TFrontendBundle | undefined> => {
        return this.get(`theme/page-bundle?pageRoute=${pageRoute}`, options);
    }

    // < / Theme >


    // < Plugin >

    public getPluginUpdate = async (pluginName: string, options?: TRequestOptions): Promise<TCCSVersion | undefined> => {
        return this.get(`plugin/check-update?pluginName=${pluginName}`, options);
    }

    public updatePlugin = async (pluginName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`plugin/update?pluginName=${pluginName}`, options);
    }

    public installPlugin = async (pluginName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`plugin/install?pluginName=${pluginName}`, options);
    }

    public deletePlugin = async (pluginName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`plugin/delete?pluginName=${pluginName}`, options);
    }

    public getPluginSettings = async (pluginName: string, options?: TRequestOptions): Promise<any | undefined> => {
        return this.get(`plugin/settings?pluginName=${pluginName}`, options);
    }

    public savePluginSettings = async (pluginName: string, settings: any, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.post<boolean>(`plugin/settings?pluginName=${pluginName}`, settings, options);
        return data ?? false;
    }

    public getPluginFrontendBundle = async (pluginName: string, options?: TRequestOptions): Promise<TFrontendBundle | undefined> => {
        return this.get(`plugin/frontend-bundle?pluginName=${pluginName}`, options);
    }

    public getPluginAdminBundle = async (pluginName: string, options?: TRequestOptions): Promise<TFrontendBundle | undefined> => {
        return this.get(`plugin/admin-bundle?pluginName=${pluginName}`, options);
    }

    // < / Plugin >

}

export const getRestAPIClient = (): CRestAPIClient => {
    let clients = getStoreItem('apiClients');
    if (clients?.restAPIClient) return clients.restAPIClient;

    const typeUrl = serviceLocator.getMainApiUrl();
    const baseUrl = `${typeUrl}/${apiV1BaseRoute}`;

    const newClient = new CRestAPIClient(baseUrl);
    if (!clients) clients = {};
    clients.restAPIClient = newClient;
    setStoreItem('apiClients', clients);
    return newClient;
}

export type TCRestAPIClient = typeof CRestAPIClient;