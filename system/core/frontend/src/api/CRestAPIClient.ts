import {
    getStoreItem,
    isServer,
    serviceLocator,
    setStoreItem,
    TCCSVersion,
    TCmsEntityInput,
    TCmsSettings,
    TCmsStats,
    TCmsStatus,
    TCreateUser,
    TDBEntity,
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
    /**
     * HTTP method: 'get', 'post', 'put', etc.
     */
    method?: string;
    /**
     * Body for 'post' and 'put' requests
     */
    input?: any;
    /**
     * Disable error logging
     */
    disableLog?: boolean;
}

/**
 * CRestAPIClient - CromwellCMS REST API Client
 */
export class CRestAPIClient {

    /** @internal */
    private onUnauthorizedCallbacks: Record<string, ((route: string) => any)> = {};

    /** @internal */
    private onErrorCallbacks: Record<string, ((info: TErrorInfo) => any)> = {};
    public getBaseUrl = () => {
        const serverUrl = serviceLocator.getMainApiUrl();
        if (!serverUrl) throw new Error('CRestAPIClient: Failed to find base API URL');
        return `${serverUrl}/api`;
    }

    /** @internal */
    private handleError = async (response: Response, data: any, route: string, disableLog?: boolean): Promise<[any, TErrorInfo | null]> => {
        if ((response.status === 403 || response.status === 401) && !isServer()) {
            Object.values(this.onUnauthorizedCallbacks).forEach(cb => cb?.(route));
        }

        if (response.status >= 400) {
            let message = data?.message;
            if (!message) {
                try {
                    message = (await response.json())?.message;
                } catch (error) { }
            }
            const errorInfo: TErrorInfo = {
                statusCode: response.status,
                message,
                route,
                disableLog,
            };
            return [data, errorInfo];
        }
        return [data, null];
    }

    /** @internal */
    private logError = (route: string, e?: any) => {
        console.error(`CRestAPIClient route: ${route}` + e);
    }

    /** @internal */
    private throwError(errorInfo: TErrorInfo, route: string, options?: TRequestOptions) {
        for (const cb of Object.values(this.onErrorCallbacks)) {
            cb(errorInfo);
        }
        if (!options?.disableLog)
            this.logError(route, `Request failed, status: ${errorInfo.statusCode}. ${errorInfo.message}`);

        throw new Error(JSON.stringify(errorInfo));
    }

    /**
     * Make a custom request to a specified route
     * @auth no
     */
    public fetch = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
        const baseUrl = this.getBaseUrl();
        const input = options?.input;
        let data;
        let errorInfo: TErrorInfo | null = null;
        try {
            const res = await fetch(`${baseUrl}/${route}`, {
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
            this.throwError(errorInfo, route, options)
        }

        return data;
    }


    /**
     * Makes GET request to specified route
     * @auth no
     */
    public get = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
        return this.fetch(route, options);
    }

    /**
     * Makes POST request to specified route
     * @auth no
     */
    public post = async <T>(route: string, input?: any, options?: TRequestOptions): Promise<T | undefined> => {
        return this.fetch(route, {
            method: 'post',
            input,
            ...(options ?? {}),
        });
    }

    /**
     * Makes DELETE request to specified route
     * @auth no
     */
    public delete = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
        return this.fetch(route, {
            method: 'delete',
            ...(options ?? {}),
        });
    }

    /**
     * Makes PUT request to specified route
     * @auth no
     */
    public put = async <T>(route: string, input?: any, options?: TRequestOptions): Promise<T | undefined> => {
        return this.fetch(route, {
            method: 'put',
            input,
            ...(options ?? {}),
        });
    }

    // < Auth >

    /**
     * Logs user in via cookies
     * @auth no
     */
    public login = async (credentials: {
        email: string;
        password: string;
    }, options?: TRequestOptions): Promise<TUser | undefined> => {
        return this.post('v1/auth/login', credentials, options);
    }

    /**
     * Logs user out via cookies
     * @auth any
     */
    public logOut = async (options?: TRequestOptions) => {
        return this.post('v1/auth/log-out', {}, options);
    }


    /**
     * Returns currently logged user profile
     * @auth any
     */
    public getUserInfo = async (options?: TRequestOptions): Promise<TUser | undefined> => {
        return this.get(`v1/auth/user-info`, options);
    }

    /**
     * Sign up a new user
     * @auth no
     */
    public signUp = async (credentials: TCreateUser, options?: TRequestOptions): Promise<TUser | undefined> => {
        return this.post('v1/auth/sign-up', credentials, options);
    }

    /**
     * Initiate reset password transaction. Will send a code to user's email
     * @auth no
     */
    public forgotPassword = async (credentials: { email: string }, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.post('v1/auth/forgot-password', credentials, options);
    }

    /**
     * Finish reset password transaction. Set a new password
     * @auth no
     */
    public resetPassword = async (credentials: {
        email: string;
        code: string;
        newPassword: string;
    }, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.post('v1/auth/reset-password', credentials, options);
    }

    /**
     * Add on unauthorized error callback. Triggers if any of methods of this
     * client get unauthorized error
     */
    public onUnauthorized(callback: ((route: string) => any), id?: string) {
        if (!id) id = Object.keys(this.onErrorCallbacks).length + '';
        this.onUnauthorizedCallbacks[id] = callback;
    }

    /**
     * Remove on unauthorized error callback
     */
    public removeOnUnauthorized(id: string) {
        delete this.onUnauthorizedCallbacks[id];
    }

    /**
     * Add on error callback. Triggers if any of methods of this
     * client get any type of error
     */
    public onError(cb: ((info: TErrorInfo) => any), id?: string) {
        if (!id) id = Object.keys(this.onErrorCallbacks).length + '';
        this.onErrorCallbacks[id] = cb;
    }

    /**
     * Remove on error callback
     */
    public removeOnError(id: string) {
        delete this.onErrorCallbacks[id];
    }


    // < CMS >

    /**
     * Get public CMS settings
     * @auth no
     */
    public getCmsSettings = async (options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        return this.get(`v1/cms/config`, options);
    }

    /**
     * Get admin CMS settings
     * @auth admin
     */
    public getAdminCmsSettings = async (options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        return this.get(`v1/cms/admin-config`, options);
    }

    /**
     * Get public CMS settings and save into the store
     * @auth no
     */
    public getCmsSettingsAndSave = async (options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        const config = await this.getCmsSettings(options);
        if (config) {
            setStoreItem('cmsSettings', config);
            return config;
        }
    }

    /**
     * List files in a public directory by specified path
     * @auth no
     */
    public readPublicDir = (path?: string, options?: TRequestOptions): Promise<string[] | null | undefined> => {
        return this.get(`v1/cms/read-public-dir?path=${path ?? '/'}`, options);
    }

    /**
     * Crates a public directory by specified path
     * @auth admin
     */
    public createPublicDir = (dirName: string, inPath?: string, options?: TRequestOptions): Promise<string[] | null | undefined> => {
        return this.get(`v1/cms/create-public-dir?inPath=${inPath ?? '/'}&dirName=${dirName}`, options);
    }

    /**
     * Removes a public directory by specified path
     * @auth admin
     */
    public removePublicDir = (dirName: string, inPath?: string, options?: TRequestOptions): Promise<string[] | null | undefined> => {
        return this.get(`v1/cms/remove-public-dir?inPath=${inPath ?? '/'}&dirName=${dirName}`, options);
    }

    /**
     * Upload files in specified public directory
     * @auth admin
     */
    public uploadPublicFiles = async (inPath: string, files: File[], options?: TRequestOptions): Promise<boolean | null | undefined> => {
        const formData = new FormData();
        for (const file of files) {
            formData.append(file.name, file);
        }
        const response = await fetch(`${this.getBaseUrl()}/v1/cms/upload-public-file?inPath=${inPath ?? '/'}`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
            ...(options ?? {}),
        });
        return response.body;
    }

    /**
     * Get info about currently used Theme
     * @auth no
     */
    public getThemesInfo = async (options?: TRequestOptions): Promise<TPackageCromwellConfig[] | undefined> => {
        return this.get(`v1/cms/themes`, options);
    }

    /**
     * List all installed Plugins
     * @auth admin
     */
    public getPluginList = async (options?: TRequestOptions): Promise<TPackageCromwellConfig[] | undefined> => {
        return this.get(`v1/cms/plugins`, options);
    }

    /** @internal */
    public setUpCms = async (options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.post(`v1/cms/set-up`, {}, options);
    }

    /**
     * Update CMS config
     * @auth admin
     */
    public updateCmsConfig = async (input: TCmsEntityInput, options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        return this.post(`v1/cms/update-config`, input, options);
    }

    /**
     * Active disabled Theme
     * @auth admin
     */
    public activateTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.get<boolean>(`v1/cms/activate-theme?themeName=${themeName}`, options);
        return data ?? false;
    }

    /**
     * Active disabled Plugin
     * @auth admin
     */
    public activatePlugin = async (pluginName: string, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.get<boolean>(`v1/cms/activate-plugin?pluginName=${pluginName}`, options);
        return data ?? false;
    }

    /**
     * Set active Theme
     * @auth admin
     */
    public changeTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.get<boolean>(`v1/cms/change-theme?themeName=${themeName}`, options);
        return data ?? false;
    }

    /**
     * Calculate total price of a cart 
     * @auth no
     */
    public getOrderTotal = async (input: TServerCreateOrder, options?: TRequestOptions): Promise<TOrder | undefined> => {
        return this.post(`v1/cms/get-order-total`, input, options);
    }

    /**
     * Calculate total price of a cart and creates a payment session via service provider
     * @auth no
     */
    public createPaymentSession = async (input: TServerCreateOrder, options?: TRequestOptions)
        : Promise<TOrder & { checkoutUrl?: string } | undefined> => {
        return this.post(`v1/cms/create-payment-session`, input, options);
    }

    /**
     * Place a new order in the store
     * @auth no
     */
    public placeOrder = async (input: TServerCreateOrder, options?: TRequestOptions): Promise<TOrder | undefined> => {
        return this.post(`v1/cms/place-order`, input, options);
    }

    /**
     * Place a review about some product
     * @auth no
     */
    public placeProductReview = async (input: TProductReviewInput, options?: TRequestOptions): Promise<TProductReview | undefined> => {
        return this.post(`v1/cms/place-product-review`, input, options);
    }

    /**
     * Get CMS recent statistics, for Admin panel home page
     * @auth admin
     */
    public getCmsStats = async (options?: TRequestOptions): Promise<TCmsStats | undefined> => {
        return this.get(`v1/cms/stats`, options);
    }

    /**
     * Get CMS updates info
     * @auth admin
     */
    public getCmsStatus = async (options?: TRequestOptions): Promise<TCmsStatus | undefined> => {
        return this.get(`v1/cms/status`, options);
    }

    /**
     * Launch CMS update
     * @auth admin
     */
    public launchCmsUpdate = async (options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/cms/launch-update`, options);
    }

    /**
     * Export database into Excel (.xlsx) file. 
     * @auth admin
     * @param tables specify tables to export or export all if not provided
     */
    public exportDB = async (tables?: TDBEntity[], options?: TRequestOptions) => {
        const url = `${this.getBaseUrl()}/v1/cms/export-db`;
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ tables }),
            headers: { 'Content-Type': 'application/json' },
            ...(options ?? {}),
        });
        const [data, errorInfo] = await this.handleError(response, await response.blob(), url, options?.disableLog);
        if (errorInfo) {
            this.throwError(errorInfo, url, options);
        }

        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(data);
        a.download = "export.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    /**
     * Import database from Excel (.xlsx) file/files
     * @auth admin
     */
    public importDB = async (files: File[], options?: TRequestOptions): Promise<boolean | null | undefined> => {
        const formData = new FormData();
        for (const file of files) {
            formData.append(file.name, file);
        }
        const url = `${this.getBaseUrl()}/v1/cms/import-db`;
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: formData,
            ...(options ?? {}),
        });
        const [data, errorInfo] = await this.handleError(response, response.body, url, options?.disableLog);
        if (errorInfo) {
            this.throwError(errorInfo, url, options);
        }
        return data;
    }

    // < / CMS >


    // < Theme >

    /**
     * Check if Theme has available update
     * @auth admin
     */
    public getThemeUpdate = async (themeName: string, options?: TRequestOptions): Promise<TCCSVersion | undefined> => {
        return this.get(`v1/theme/check-update?themeName=${themeName}`, options);
    }

    /**
     * Launch Theme update
     * @auth admin
     */
    public updateTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/theme/update?themeName=${themeName}`, options);
    }

    /**
     * Install a new Theme
     * @param themeName npm package name of a Theme
     * @auth admin
     */
    public installTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/theme/install?themeName=${themeName}`, options);
    }

    /**
     * Delete (uninstall) Theme
     * @param themeName npm package name of a Theme
     * @auth admin
     */
    public deleteTheme = async (themeName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/theme/delete?themeName=${themeName}`, options);
    }

    /**
     * Get page config by page route of currently active Theme
     * @auth no
     */
    public getPageConfig = async (pageRoute: string, options?: TRequestOptions): Promise<TPageConfig | undefined> => {
        return this.get(`v1/theme/page?pageRoute=${pageRoute}`, options);
    }

    /**
     * Update page config by page route of currently active Theme
     * @auth admin
     */
    public savePageConfig = async (config: TPageConfig, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.post<boolean>(`v1/theme/page`, config, options);
        return data ?? false;
    }

    /**
     * Delete generic page of currently active Theme
     * @auth admin
     */
    public deletePage = async (pageRoute: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.delete(`v1/theme/page?pageRoute=${pageRoute}`, options);
    }

    /**
     * Remove all user's modifications for specified page of currently active Theme
     * @auth admin
     */
    public resetPage = async (pageRoute: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/theme/page/reset?pageRoute=${pageRoute}`, options);
    }

    /**
     * Get all used Plugins at specified page of currently active Theme
     * @auth no
     */
    public getPluginsAtPage = async (pageRoute: string, options?: TRequestOptions): Promise<Record<string, TPluginsModifications> | undefined> => {
        return this.get(`v1/theme/plugins?pageRoute=${pageRoute}`, options);
    }

    /**
     * Get all used Plugins in currently active Theme
     * @auth no
     */
    public getPluginNames = async (options?: TRequestOptions): Promise<string[] | undefined> => {
        return this.get(`v1/theme/plugin-names`, options);
    }

    /**
     * Get all pages info of currently active Theme
     * @auth no
     */
    public getPagesInfo = async (options?: TRequestOptions): Promise<TPageInfo[] | undefined> => {
        return this.get(`v1/theme/pages/info`, options);
    }

    /**
     * Get all page config of currently active Theme
     * @auth no
     */
    public getPageConfigs = async (options?: TRequestOptions): Promise<TPageConfig[] | undefined> => {
        return this.get(`v1/theme/pages/configs`, options);
    }

    /**
     * Get theme info of currently active Theme
     * @auth no
     */
    public getThemeInfo = async (options?: TRequestOptions): Promise<TPackageCromwellConfig | undefined> => {
        return this.get(`v1/theme/info`, options);
    }

    /**
     * Get theme config of currently active Theme
     * @auth no
     */
    public getThemeConfig = async (options?: TRequestOptions): Promise<TThemeConfig | undefined> => {
        return this.get(`v1/theme/config`, options);
    }

    /** @internal */
    public getThemeCustomConfig = async (options?: TRequestOptions): Promise<Record<string, any> | undefined> => {
        return this.get(`v1/theme/custom-config`, options);
    }

    /**
     * Get Admin panel page bundle by specified route of currently active Theme
     * @auth no
     */
    public getThemePageBundle = async (pageRoute: string, options?: TRequestOptions): Promise<TFrontendBundle | undefined> => {
        return this.get(`v1/theme/page-bundle?pageRoute=${pageRoute}`, options);
    }

    /** @internal */
    public batchRendererData = async (pageRoute: string, options?: TRequestOptions): Promise<any> => {
        return this.get(`v1/theme/renderer?pageRoute=${pageRoute}`, options);
    }

    // < / Theme >


    // < Plugin >

    /**
     * Get available update info for Plugin
     * @param pluginName npm package name of Plugin
     * @auth admin
     */
    public getPluginUpdate = async (pluginName: string, options?: TRequestOptions): Promise<TCCSVersion | undefined> => {
        return this.get(`v1/plugin/check-update?pluginName=${pluginName}`, options);
    }

    /**
     * Launch Plugin update
     * @param pluginName npm package name of Plugin
     * @auth admin
     */
    public updatePlugin = async (pluginName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/plugin/update?pluginName=${pluginName}`, options);
    }

    /**
     * Install a new Plugin
     * @param pluginName npm package name of Plugin
     * @auth admin
     */
    public installPlugin = async (pluginName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/plugin/install?pluginName=${pluginName}`, options);
    }

    /**
     * Delete (uninstall) Plugin
     * @param pluginName npm package name of Plugin
     * @auth admin
     */
    public deletePlugin = async (pluginName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/plugin/delete?pluginName=${pluginName}`, options);
    }

    /**
     * Get settings of Plugin
     * @param pluginName npm package name of Plugin
     * @auth no
     */
    public getPluginSettings = async (pluginName: string, options?: TRequestOptions): Promise<any | undefined> => {
        return this.get(`v1/plugin/settings?pluginName=${pluginName}`, options);
    }

    /**
     * Save settings for Plugin
     * @param pluginName npm package name of Plugin
     * @auth admin
     */
    public savePluginSettings = async (pluginName: string, settings: any, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.post<boolean>(`v1/plugin/settings?pluginName=${pluginName}`, settings, options);
        return data ?? false;
    }

    /**
     * Get frontend bundle of Plugin
     * @param pluginName npm package name of Plugin
     * @auth no
     */
    public getPluginFrontendBundle = async (pluginName: string, options?: TRequestOptions): Promise<TFrontendBundle | undefined> => {
        return this.get(`v1/plugin/frontend-bundle?pluginName=${pluginName}`, options);
    }

    /**
     * Get admin panel bundle of Plugin
     * @param pluginName npm package name of Plugin
     * @auth no
     */
    public getPluginAdminBundle = async (pluginName: string, options?: TRequestOptions): Promise<TFrontendBundle | undefined> => {
        return this.get(`v1/plugin/admin-bundle?pluginName=${pluginName}`, options);
    }

    // < / Plugin >

}

/**
 * Get CRestAPIClient instance from global store (singleton)
 */
export const getRestAPIClient = (): CRestAPIClient => {
    let clients = getStoreItem('apiClients');
    if (clients?.restAPIClient) return clients.restAPIClient;

    const newClient = new CRestAPIClient();
    if (!clients) clients = {};
    clients.restAPIClient = newClient;
    setStoreItem('apiClients', clients);
    return newClient;
}

export type TCRestAPIClient = typeof CRestAPIClient;