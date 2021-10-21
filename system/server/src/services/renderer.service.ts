import { serviceLocator } from '@cromwell/core';
import { getAuthSettings, getThemeConfigs, TAuthSettings, getLogger } from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { Container, Service } from 'typedi';

import { CmsConfigDto } from '../dto/cms-config.dto';
import { ThemeConfigDto } from '../dto/theme-config.dto';
import { PluginService } from './plugin.service';
import { ThemeService } from './theme.service';

const logger = getLogger();

@Injectable()
@Service()
export class RendererService {

    private get pluginService() {
        return Container.get(PluginService);
    }

    private get themeService() {
        return Container.get(ThemeService);
    }

    private authSettings: TAuthSettings;

    private async loadSettings() {
        if (!this.authSettings) {
            this.authSettings = await getAuthSettings();
        }
    }

    public async getRendererData(pageRoute: string) {
        await this.loadSettings();

        const allConfigs = await getThemeConfigs();
        const [pageConfig, pagesInfo] = await Promise.all([
            this.themeService.getPageConfig(pageRoute, allConfigs),
            this.themeService.getPagesInfo(allConfigs),
        ]);
        const pluginsSettings = await this.themeService.getPluginsAtPage(pageRoute, pageConfig);

        return {
            pageConfig,
            pluginsSettings,
            themeConfig: new ThemeConfigDto().parse(allConfigs.themeConfig),
            userConfig: new ThemeConfigDto().parse(allConfigs.userConfig),
            cmsSettings: allConfigs.cmsSettings && new CmsConfigDto().parseConfig(allConfigs.cmsSettings),
            themeCustomConfig: Object.assign({}, allConfigs.themeConfig?.themeCustomConfig, allConfigs.userConfig?.themeCustomConfig),
            pagesInfo,
        }
    }

    public async purgePageCache(pageRoute: string) {
        await this.fetchRenderer(`?purge=page&&pageRoute=${pageRoute}`);
    }

    public async purgeEntireCache() {
        await this.fetchRenderer(`?purge=all`);
    }

    private async fetchRenderer(route: string, options?: {
        method?: string;
        input?: any;
        headers?: Record<string, string>;
    }) {
        await this.loadSettings();
        const baseUrl = serviceLocator.getFrontendUrl();
        const input = options?.input;
        const url = `${baseUrl}/${route}`;

        const response = await fetch(url, {
            method: options?.method ?? 'get',
            credentials: 'include',
            body: typeof input === 'string' ? input : input ? JSON.stringify(input) : undefined,
            headers: Object.assign(
                { 'Content-Type': 'application/json' },
                options?.headers,
                this.authSettings.serviceSecret && { 'Authorization': `Service ${this.authSettings.serviceSecret}` },
            ),
        });

        if (response.status >= 400) {
            logger.error('Purge request to renderer failed', url)
            try {
                const dataParsed = await response.json();
                throw new Error(dataParsed);
            } catch (error) { }
        }
    }
}