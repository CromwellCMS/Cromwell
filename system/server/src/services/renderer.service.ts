import { serviceLocator } from '@cromwell/core';
import { getAuthSettings, getLogger, getThemeConfigs, TAuthSettings, getCmsSettings } from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { Container, Service } from 'typedi';

import { CmsConfigDto } from '../dto/cms-config.dto';
import { ThemeConfigDto } from '../dto/theme-config.dto';
import { ThemeService } from './theme.service';

const logger = getLogger();

@Injectable()
@Service()
export class RendererService {

    private get themeService() {
        return Container.get(ThemeService);
    }

    private authSettings: TAuthSettings;

    private async loadSettings() {
        if (!this.authSettings) {
            this.authSettings = await getAuthSettings();
        }
    }

    public async getRendererData(pageRoute: string, themeName: string) {
        await this.loadSettings();

        const allConfigs = await getThemeConfigs(themeName);
        const [pageConfig, pagesInfo, cmsSettings] = await Promise.all([
            this.themeService.getPageConfig(pageRoute, themeName, allConfigs),
            this.themeService.getPagesInfo(themeName, allConfigs),
            getCmsSettings(),
        ]);
        const pluginsSettings = await this.themeService.getPluginsAtPage(pageRoute, themeName, pageConfig);

        return {
            pageConfig,
            pluginsSettings,
            themeConfig: new ThemeConfigDto().parse(allConfigs.themeConfig),
            userConfig: new ThemeConfigDto().parse(allConfigs.userConfig),
            cmsSettings: cmsSettings && new CmsConfigDto().parseConfig(cmsSettings),
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