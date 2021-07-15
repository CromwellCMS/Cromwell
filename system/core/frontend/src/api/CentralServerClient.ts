import { fetch } from '../helpers/isomorphicFetch';
import { getStoreItem, TCCSVersion, TCCSModuleShortInfo, TCCSModuleInfo, TPagedParams, TPagedList } from '@cromwell/core';
import { TErrorInfo, TRequestOptions } from './CRestAPIClient'

/**
 * CentralServerClient - CromwellCMS Central Server API Client
 * CromwellCMS Central Server is official server at ... 
 * API used to check local CMS updates.
 */
export class CentralServerClient {

    public getBaseUrl = () => {
        return getStoreItem('cmsSettings')?.centralServerUrl;
    }

    private handleError = async (responce: Response, data: any, route: string, disableLog?: boolean): Promise<[any, TErrorInfo | null]> => {
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

    public fetch = async <T>(route: string, options?: TRequestOptions): Promise<T | undefined> => {
        const input = options?.input;
        let data;
        let errorInfo: TErrorInfo | null = null;
        const baseUrl = this.getBaseUrl();
        if (!baseUrl) throw new Error('CentralServer URL is not defined');

        try {
            const res = await fetch(`${baseUrl}/api/${route}`, {
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

    // < CMS >
    async getCmsInfo(): Promise<TCCSModuleShortInfo | undefined> {
        return this.get('cms/info');
    }

    async getCmsFullInfo(): Promise<TCCSModuleInfo | undefined> {
        return this.get('cms/full-info');
    }

    async getVersionByPackage(packageVersion: string): Promise<TCCSVersion | undefined> {
        return this.get(`cms/version-by-package/${packageVersion}`);
    }

    async checkCmsUpdate(version: string, beta?: boolean): Promise<TCCSVersion | undefined> {
        return this.get(`cms/check-update/${version}?beta=${beta ? 'true' : 'false'}`);
    }

    // < / CMS >


    // < Plugin >

    async getPluginInfo(name: string): Promise<TCCSModuleShortInfo | undefined> {
        return this.get(`plugin/info?name=${name}`);
    }

    async getPluginList(params?: TPagedParams<TCCSModuleInfo>, filter?: {
        search?: string;
    }): Promise<TPagedList<TCCSModuleInfo> | undefined> {
        return this.post(`plugin/list`, {
            params,
            filter,
        });
    }

    async getPluginFullInfo(name: string): Promise<TCCSModuleInfo | undefined> {
        return this.get(`plugin?name=${name}`);
    }

    async getPluginAllVersions(name: string): Promise<TCCSVersion[] | undefined> {
        return this.get(`plugin/all-versions?name=${name}`);
    }

    async checkPluginUpdate(name: string, version: string, beta?: boolean): Promise<TCCSVersion | undefined> {
        return this.get(`plugin/check-update/${version}?name=${name}&beta=${beta ? 'true' : 'false'}`);
    }

    // < / Plugin >


    // < Theme >

    async getThemeInfo(name: string): Promise<TCCSModuleShortInfo | undefined> {
        return this.get(`theme/info?name=${name}`);
    }

    async getThemeList(params?: TPagedParams<TCCSModuleInfo>, filter?: {
        search?: string;
    }): Promise<TPagedList<TCCSModuleInfo> | undefined> {
        return this.post(`theme/list`, {
            params,
            filter,
        });
    }

    async getThemeFullInfo(name: string): Promise<TCCSModuleInfo | undefined> {
        return this.get(`theme?name=${name}`);
    }

    async getThemeAllVersions(name: string): Promise<TCCSVersion[] | undefined> {
        return this.get(`theme/all-versions?name=${name}`);
    }

    async checkThemeUpdate(name: string, version: string, beta?: boolean): Promise<TCCSVersion | undefined> {
        return this.get(`theme/check-update/${version}?name=${name}&beta=${beta ? 'true' : 'false'}`);
    }

    // < / Theme >

}

/**
 * Get CentralServerClient instance from global store (singleton)
 */
export const getCentralServerClient = () => new CentralServerClient();
