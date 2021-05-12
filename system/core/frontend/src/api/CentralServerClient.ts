import { fetch } from '../helpers/isomorphicFetch';
import { getStoreItem, TCCSVersion, TCCSModuleShortInfo, TCCSModuleInfoDto } from '@cromwell/core';


class CentralServerClient {

    private baseUrl: string;

    constructor() {
        const centralServerUrl = getStoreItem('cmsSettings')?.centralServerUrl;
        if (!centralServerUrl) {
            throw new Error('Central cerver URL undefined');
        }
        this.baseUrl = centralServerUrl;
    }

    get(path: string) {
        return fetch(`${this.baseUrl}/api/${path}`);
    }

    // < CMS >
    async getCmsInfo(): Promise<TCCSModuleShortInfo> {
        return this.get('cms/info');
    }

    async getCmsFullInfo(): Promise<TCCSModuleInfoDto> {
        return this.get('cms/full-info');
    }

    async getCmsAllVersions(): Promise<TCCSVersion[]> {
        return this.get('cms/all-versions');
    }

    async getVersionByPackage(packageVersion: string): Promise<TCCSVersion | undefined> {
        return this.get(`cms/version-by-package/${packageVersion}`);
    }

    // < /CMS >


    // < Plugin >

    async getPluginInfo(name: string): Promise<TCCSModuleShortInfo> {
        return this.get(`plugin​/info?name=${name}`);
    }

    async getPluginFullInfo(name: string): Promise<TCCSModuleInfoDto> {
        return this.get(`plugin​?name=${name}`);
    }

    async getPluginAllVersions(name: string): Promise<TCCSVersion[]> {
        return this.get(`plugin​/all-versions?name=${name}`);
    }

    // < / Plugin >


    // < Theme >

    async getThemeInfo(name: string): Promise<TCCSModuleShortInfo> {
        return this.get(`theme/info?name=${name}`);
    }

    async getThemeFullInfo(name: string): Promise<TCCSModuleInfoDto> {
        return this.get(`theme?name=${name}`);
    }

    async getThemeAllVersions(name: string): Promise<TCCSVersion[]> {
        return this.get(`theme/all-versions?name=${name}`);
    }

    // < / Theme >

}

export const getCentralServerClient = () => new CentralServerClient();