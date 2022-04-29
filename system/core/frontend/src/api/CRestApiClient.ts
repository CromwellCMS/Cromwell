import {
    getStoreItem,
    isServer,
    serviceLocator,
    setStoreItem,
    TCCSVersion,
    TCmsSettings,
    TCmsStats,
    TCmsStatus,
    TCreateUser,
    TDBEntity,
    TFrontendBundle,
    TOrder,
    TOrderInput,
    TOrderPaymentSession,
    TPackageCromwellConfig,
    TPageConfig,
    TPageInfo,
    TPalette,
    TPermission,
    TPluginEntity,
    TProductReview,
    TProductReviewInput,
    TSystemUsage,
    TThemeConfig,
    TUser,
} from '@cromwell/core';
import queryString from 'query-string';

import { getServiceSecret } from '../helpers/getServiceSecret';
import { fetch } from '../helpers/isomorphicFetch';

export type TRestApiErrorInfo = {
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
    /**
     * Add headers
     */
    headers?: Record<string, string>;
}

/**
 * CRestApiClient - CromwellCMS REST API Client
 */
export class CRestApiClient {

    /** @internal */
    private onUnauthorizedCallbacks: Record<string, ((route: string) => any)> = {};

    /** @internal */
    private onErrorCallbacks: Record<string, ((info: TRestApiErrorInfo) => any)> = {};
    public getBaseUrl = () => {
        const serverUrl = serviceLocator.getApiUrl();
        if (!serverUrl) throw new Error('CRestApiClient: Failed to find base API URL');
        return `${serverUrl}/api`;
    }

    /** @internal */
    private serviceSecret?: string;

    /** @internal */
    private initializePromise?: Promise<void>;

    /** @internal */
    constructor() {
        this.init()
    }

    /** @internal */
    private async init() {
        let doneInit: (() => void) | undefined;
        this.initializePromise = new Promise<void>(done => doneInit = done);

        // Set API URL from cookie
        if (!isServer() && !getStoreItem('cmsSettings')?.apiUrl) {
            try {
                const getCookie = (name) => {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop()?.split(';').shift();
                }
                const config = getCookie('crw_cms_config');
                if (config) {
                    const configParsed = JSON.parse(decodeURIComponent(config));
                    if (configParsed?.apiUrl) {
                        setStoreItem('cmsSettings', configParsed)
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (isServer()) {
            // If backend, try to find service secret key to make 
            // authorized requests to the API server.
            this.serviceSecret = await getServiceSecret();
        }
        doneInit?.();
        this.initializePromise = undefined;
    }

    /** @internal */
    private handleError = async (response: Response, data: any, route: string, disableLog?: boolean): Promise<[any, TRestApiErrorInfo | null]> => {
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
            const errorInfo: TRestApiErrorInfo = {
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
        console.error(`CRestApiClient route: ${route}` + e);
    }

    /** @internal */
    private throwError(errorInfo: TRestApiErrorInfo, route: string, options?: TRequestOptions) {
        for (const cb of Object.values(this.onErrorCallbacks)) {
            cb(errorInfo);
        }
        if (!options?.disableLog)
            this.logError(route, `Request failed, status: ${errorInfo.statusCode}. ${errorInfo.message}`);

        throw Object.assign(new Error(), errorInfo);
    }

    /**
     * Make a custom request to a specified route
     * @auth no
     */
    public fetch = async <T = any>(route: string, options?: TRequestOptions): Promise<T> => {
        if (this.initializePromise) await this.initializePromise;
        const baseUrl = this.getBaseUrl();
        const input = options?.input;
        let data;
        let errorInfo: TRestApiErrorInfo | null = null;
        try {
            const res = await fetch(`${baseUrl}/${route}`, {
                method: options?.method ?? 'get',
                credentials: 'include',
                body: typeof input === 'string' ? input : input ? JSON.stringify(input) : undefined,
                headers: Object.assign(
                    { 'Content-Type': 'application/json' },
                    options?.headers,
                    this.serviceSecret && { 'Authorization': `Service ${this.serviceSecret}` },
                ),
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
    public get = async <T = any>(route: string, options?: TRequestOptions): Promise<T> => {
        return this.fetch(route, options);
    }

    /**
     * Makes POST request to specified route
     * @auth no
     */
    public post = async <T = any>(route: string, input?: any, options?: TRequestOptions): Promise<T> => {
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
    public delete = async <T = any>(route: string, input?: any, options?: TRequestOptions): Promise<T> => {
        return this.fetch(route, {
            method: 'delete',
            input,
            ...(options ?? {}),
        });
    }

    /**
     * Makes PUT request to specified route
     * @auth no
     */
    public put = async <T = any>(route: string, input?: any, options?: TRequestOptions): Promise<T> => {
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
    public onError(cb: ((info: TRestApiErrorInfo) => any), id?: string) {
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
    public getCmsSettings = async (options?: TRequestOptions): Promise<TCmsSettings> => {
        return this.get(`v1/cms/settings`, options);
    }

    /**
     * Get admin CMS settings
     * @auth admin
     */
    public getAdminCmsSettings = async (options?: TRequestOptions): Promise<TCmsSettings & {
        robotsContent?: string;
    }> => {
        return this.get(`v1/cms/admin-settings`, options);
    }

    /**
     * Update CMS settings
     * @auth admin
     */
    public saveCmsSettings = async (input: TCmsSettings & {
        robotsContent?: string;
    }, options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        return this.post(`v1/cms/admin-settings`, input, options);
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
    * Download a public file
    * @auth admin
    */
    public downloadPublicFile = async (fileName: string, type: 'file' | 'dir', inPath?: string) => {
        const url = `${this.getBaseUrl()}/v1/cms/download-public-file?inPath=${inPath ?? '/'}&fileName=${fileName}`;
        if (type === 'dir') fileName += '.zip';

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
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
    public setUpCms = async (input: {
        url: string;
        user: TCreateUser;
    }, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.post(`v1/cms/set-up`, input, options);
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
    public getOrderTotal = async (input: TOrderInput, options?: TRequestOptions): Promise<TOrder | undefined> => {
        return this.post(`v1/cms/get-order-total`, input, options);
    }

    /**
     * Calculate total price of a cart and creates a payment session via service provider
     * @auth no
     */
    public createPaymentSession = async (input: TOrderPaymentSession, options?: TRequestOptions): Promise<TOrderPaymentSession | undefined> => {
        return this.post(`v1/cms/create-payment-session`, input, options);
    }

    /**
     * Place a new order in the store
     * @auth no
     */
    public placeOrder = async (input: TOrderInput, options?: TRequestOptions): Promise<TOrder | undefined> => {
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
        return this.get(`v1/cms/statistics`, options);
    }

    /**
     * Get system specs and usage
     * @auth admin
     */
    public getSystemUsage = async (options?: TRequestOptions): Promise<TSystemUsage | undefined> => {
        return this.get(`v1/cms/system`, options);
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
    public importDB = async (files: File[], removeSurplus?: boolean, options?: TRequestOptions): Promise<boolean | null | undefined> => {
        const formData = new FormData();
        for (const file of files) {
            formData.append(file.name, file);
        }

        const url = `${this.getBaseUrl()}/v1/cms/import-db?${queryString.stringify({ removeSurplus })}`;
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

    /**
     * Build sitemap at /default_sitemap.xml
     * @auth admin
     */
    public buildSitemap = async (options?: TRequestOptions): Promise<TCmsSettings | undefined> => {
        return this.get(`v1/cms/build-sitemap`, options);
    }


    /**
     * Get all registered user/role permissions
     * @auth admin
     */
    public getPermissions = async (options?: TRequestOptions): Promise<TPermission[] | undefined> => {
        return this.get(`v1/cms/permissions`, options);
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
    public getPageConfig = async (pageRoute: string, themeName: string, options?: TRequestOptions): Promise<TPageConfig | undefined> => {
        return this.get(`v1/theme/page?pageRoute=${pageRoute}&themeName=${themeName}`, options);
    }

    /**
     * Update page config by page route of currently active Theme
     * @auth admin
     */
    public savePageConfig = async (config: TPageConfig, themeName: string, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.post<boolean>(`v1/theme/page?themeName=${themeName}`, config, options);
        return data ?? false;
    }

    /**
     * Delete generic page of currently active Theme
     * @auth admin
     */
    public deletePage = async (pageRoute: string, themeName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.delete(`v1/theme/page?pageRoute=${pageRoute}&themeName=${themeName}`, {}, options);
    }

    /**
     * Remove all user's modifications for specified page of currently active Theme
     * @auth admin
     */
    public resetPage = async (pageRoute: string, themeName: string, options?: TRequestOptions): Promise<boolean | undefined> => {
        return this.get(`v1/theme/page/reset?pageRoute=${pageRoute}&themeName=${themeName}`, options);
    }

    /**
     * Get all used Plugins at specified page of currently active Theme
     * @auth admin
     */
    public getPluginsAtPage = async (pageRoute: string, themeName: string, options?: TRequestOptions): Promise<{
        pluginName: string;
        version?: string;
        pluginInstances?: any;
    }[] | undefined> => {
        return this.get(`v1/theme/plugins?pageRoute=${pageRoute}&themeName=${themeName}`, options);
    }

    /**
     * Get all used Plugins in currently active Theme
     * @auth no
     */
    public getPluginNames = async (themeName: string, options?: TRequestOptions): Promise<string[] | undefined> => {
        return this.get(`v1/theme/plugin-names?themeName=${themeName}`, options);
    }

    /**
     * Get all pages info of currently active Theme
     * @auth no
     */
    public getPagesInfo = async (themeName: string, options?: TRequestOptions): Promise<TPageInfo[] | undefined> => {
        return this.get(`v1/theme/pages/info?themeName=${themeName}`, options);
    }

    /**
     * Get all page config of currently active Theme
     * @auth no
     */
    public getPageConfigs = async (themeName: string, options?: TRequestOptions): Promise<TPageConfig[] | undefined> => {
        return this.get(`v1/theme/pages/configs?themeName=${themeName}`, options);
    }

    /**
     * Get theme info of currently active Theme
     * @auth no
     */
    public getThemeInfo = async (themeName: string, options?: TRequestOptions): Promise<TPackageCromwellConfig | undefined> => {
        return this.get(`v1/theme/info?themeName=${themeName}`, options);
    }

    /**
     * Get theme config of currently active Theme
     * @auth no
     */
    public getThemeConfig = async (themeName: string, options?: TRequestOptions): Promise<TThemeConfig | undefined> => {
        return this.get(`v1/theme/config?themeName=${themeName}`, options);
    }

    /** @internal */
    public getThemeCustomConfig = async (themeName: string, options?: TRequestOptions): Promise<Record<string, any> | undefined> => {
        return this.get(`v1/theme/custom-config?themeName=${themeName}`, options);
    }

    /**
     * Update page config by page route of currently active Theme
     * @auth admin
     */
    public getThemePalette = async (themeName: string, options?: TRequestOptions): Promise<TPalette> => {
        return this.get(`v1/theme/palette?themeName=${themeName}`, options);
    }

    /**
     * Update page config by page route of currently active Theme
     * @auth admin
     */
    public saveThemePalette = async (themeName: string, palette: TPalette, options?: TRequestOptions): Promise<boolean> => {
        const data = await this.post<boolean>(`v1/theme/palette?themeName=${themeName}`, palette, options);
        return data ?? false;
    }

    // < / Theme >


    // < Renderer >

    /** 
     * @internal 
     * @auth admin
     */
    public getRendererRage = async (pageName: string, themeName: string, slug?: string, options?: TRequestOptions): Promise<any> => {
        return this.get(`v1/renderer/page?pageName=${pageName}&themeName=${themeName}&slug=${slug ?? ''}`, options);
    }

    /** 
     * @internal 
     * @auth admin
     */
    public purgeRendererPageCache = async (pageRoute: string, options?: TRequestOptions): Promise<any> => {
        return this.get(`v1/renderer/purge-page-cache?pageRoute=${pageRoute}`, options ?? {
            disableLog: true,
        });
    }

    /** 
     * @internal 
     * @auth admin
     */
    public purgeRendererEntireCache = async (options?: TRequestOptions): Promise<any> => {
        return this.get(`v1/renderer/purge-entire-cache`, options ?? {
            disableLog: true,
        });
    }

    // < / Renderer >


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
     * Get Plugin's full DB record
     * @param pluginName npm package name of Plugin
     * @auth admin
     */
    public getPluginEntity = async (pluginName: string, options?: TRequestOptions): Promise<TPluginEntity | undefined> => {
        return this.get(`v1/plugin/entity?pluginName=${pluginName}`, options);
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
 * Get CRestApiClient instance from global store (singleton)
 */
export const getRestApiClient = (): CRestApiClient => {
    let clients = getStoreItem('apiClients');
    if (clients?.restAPIClient) return clients.restAPIClient;

    const newClient = new CRestApiClient();
    if (!clients) clients = {};
    clients.restAPIClient = newClient;
    setStoreItem('apiClients', clients);
    return newClient;
}

export type TCRestApiClient = typeof CRestApiClient;