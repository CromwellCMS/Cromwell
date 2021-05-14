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

    async get(path: string) {
        const responce = await fetch(`${this.baseUrl}/api/${path}`);
        const body = await responce.json()
        if (responce.status >= 400) {
            throw new Error(JSON.stringify(body))
        }
        return body;
    }

    // < CMS >
    async getCmsInfo(): Promise<TCCSModuleShortInfo> {
        return this.get('cms/info');
    }

    async getCmsFullInfo(): Promise<TCCSModuleInfoDto> {
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

    async getPluginInfo(name: string): Promise<TCCSModuleShortInfo> {
        return this.get(`plugin/info?name=${name}`);
    }

    async getPluginFullInfo(name: string): Promise<TCCSModuleInfoDto> {
        return this.get(`plugin?name=${name}`);
    }

    async getPluginAllVersions(name: string): Promise<TCCSVersion[]> {
        return this.get(`plugin/all-versions?name=${name}`);
    }

    async checkPluginUpdate(name: string, version: string, beta?: boolean): Promise<TCCSVersion | undefined> {
        return this.get(`plugin/check-update/${version}?name=${name}&beta=${beta ? 'true' : 'false'}`);
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

    async checkThemeUpdate(name: string, version: string, beta?: boolean): Promise<TCCSVersion | undefined> {
        return this.get(`theme/check-update/${version}?name=${name}&beta=${beta ? 'true' : 'false'}`);
    }

    // < / Theme >

}

export const getCentralServerClient = () => new CentralServerClient();