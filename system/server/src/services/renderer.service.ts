import { serviceLocator } from '@cromwell/core';
import { getAuthSettings, getCmsSettings, getLogger, getThemeConfigs, TAuthSettings } from '@cromwell/core-backend';
import fetch from 'node-fetch';
import { getDIService } from 'src/helpers/utils';
import { Service } from 'typedi';

import { CmsSettingsDto } from '../dto/cms-settings.dto';
import { ThemeConfigDto } from '../dto/theme-config.dto';
import { ThemeService } from './theme.service';

const logger = getLogger();

@Service()
export class RendererService {
  private themeService = getDIService(ThemeService);

  private authSettings: TAuthSettings;

  private async loadSettings() {
    if (!this.authSettings) {
      this.authSettings = await getAuthSettings();
    }
  }

  public async getRendererData(pageName: string, themeName: string, slug?: string) {
    await this.loadSettings();

    const allConfigs = await getThemeConfigs(themeName);
    const genericPages = allConfigs.themeConfig?.genericPages ?? [{ route: 'pages/[slug]', name: 'default' }];

    let pageRoute = pageName;
    // Infer name to request a page config. Config will be the same for different slugs
    // of a page. There's an exception: generic pages - such as `pages/[slug]`,
    // since they can be edited separately in Theme Editor
    if (slug && genericPages.map((p) => p.route).includes(pageName)) {
      pageRoute = pageName.replace('[slug]', slug);
    }

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
      cmsSettings: cmsSettings && new CmsSettingsDto().parseSettings(cmsSettings),
      themeCustomConfig: Object.assign(
        {},
        allConfigs.themeConfig?.themeCustomConfig,
        allConfigs.userConfig?.themeCustomConfig,
      ),
      pagesInfo,
    };
  }

  public async purgePageCache(pageRoute: string) {
    await this.fetchRenderer(`?purge=page&&pageRoute=${pageRoute}`);
  }

  public async purgeEntireCache() {
    await this.fetchRenderer(`?purge=all`);
  }

  private async fetchRenderer(
    route: string,
    options?: {
      method?: string;
      input?: any;
      headers?: Record<string, string>;
    },
  ) {
    await this.loadSettings();
    const baseUrl = serviceLocator.getFrontendUrl();
    const input = options?.input;
    const url = `${baseUrl}/${route}`;

    const response = await fetch(url, {
      method: options?.method ?? 'get',
      body: typeof input === 'string' ? input : input ? JSON.stringify(input) : undefined,
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        options?.headers,
        this.authSettings.serviceSecret && { Authorization: `Service ${this.authSettings.serviceSecret}` },
      ),
    });

    if (response.status >= 400) {
      logger.error('Purge request to renderer failed', url);
      try {
        const dataParsed = await response.json();
        throw new Error(dataParsed);
      } catch (error) {}
    }
  }
}
