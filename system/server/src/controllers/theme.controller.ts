import {
    logFor,
    TFrontendBundle,
    TPageConfig,
    TPageInfo,
    TThemeEntityInput,
    TThemeMainConfig,
} from '@cromwell/core';
import { buildDirName, getNodeModuleDir, configFileName, getThemeAdminPanelBundleDir, serverLogFor, getPublicThemesDir } from '@cromwell/core-backend';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import decache from 'decache';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';

import { FrontendBundleDto } from '../dto/FrontendBundle.dto';
import { PageConfigDto } from '../dto/PageConfig.dto';
import { PageInfoDto } from '../dto/PageInfo.dto';
import { ThemeMainConfigDto } from '../dto/ThemeMainConfig.dto';
import { CmsService } from '../services/cms.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';

@ApiBearerAuth()
@ApiTags('Themes')
@Controller('theme')
export class ThemeController {

    constructor(
        private readonly themeService: ThemeService,
        private readonly pluginService: PluginService,
        private readonly cmsService: CmsService,
    ) { }


    @Get('page')
    @ApiOperation({
        description: `Returns merged page config for specified Page by pageRoute in query param. Output contains theme's original modificators overwritten by user's modificators.`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: PageConfigDto
    })
    async getPageConfig(@Query('pageRoute') pageRoute: string): Promise<TPageConfig | null> {

        logFor('detailed', 'ThemeController::getPageConfig');

        let out: TPageConfig | null = null;
        if (pageRoute && typeof pageRoute === 'string') {
            out = await this.themeService.getPageConfig(pageRoute)
        }
        return out;
    }


    @Post('page')
    @ApiOperation({
        description: `Saves page config for specified Page by pageRoute in query param. Modificators (TCromwellBlockData) must contain only newly added mods or an empty array. It is not allowed to send all mods from /theme/page route because they contain mods from theme's config and we don't need to copy them into user's config that way.`,
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async savePageConfig(@Body() input: PageConfigDto): Promise<boolean> {

        logFor('detailed', 'ThemeController::savePageConfig');

        if (input && typeof input === 'object') {
            return await this.themeService.saveUserPageConfig(input);
        }
        return false;
    }


    @Get('plugins')
    @ApiOperation({
        description: `Returns plugins' configs at specified Page by pageRoute in query param. Output contains theme's original modificators overwritten by user's modificators.`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
    })
    async getPluginsAtPage(@Query('pageRoute') pageRoute: string): Promise<Record<string, any>> {

        logFor('detailed', 'ThemeController::getPluginsAtPage');
        const out: Record<string, any> = {};

        if (pageRoute && typeof pageRoute === 'string') {
            const pageConfig = await this.themeService.getPageConfig(pageRoute);

            if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
                for (const mod of pageConfig.modifications) {
                    const pluginName = mod?.plugin?.pluginName;
                    if (pluginName) {
                        const pluginEntity = await this.pluginService.findOne(pluginName);
                        try {
                            const pluginConfig = Object.assign({}, mod?.plugin?.settings,
                                JSON.parse(pluginEntity?.settings ?? '{}'));
                            out[pluginName] = pluginConfig;
                        } catch (e) {
                            serverLogFor('errors-only', 'Failed to parse plugin settings of ' + pluginName + e, 'Error')
                        }
                    }
                };
            }
        }
        return out;
    }


    @Get('plugin-names')
    @ApiOperation({
        description: `Returns array of plugin names at all pages.`,
    })
    @ApiResponse({
        status: 200,
        type: [String]
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getAllPluginNames(): Promise<string[]> {

        logFor('detailed', 'ThemeController::getAllPluginNames');
        const out: string[] = [];

        const pages = await this.themeService.readAllPageConfigs();
        pages.forEach(p => {
            p.modifications.forEach(mod => {
                if (mod.type === 'plugin' && mod.plugin && mod.plugin.pluginName && !out.includes(mod.plugin.pluginName)) {
                    out.push(mod.plugin.pluginName);
                }
            })
        });

        return out;
    }


    @Get('pages/info')
    @ApiOperation({
        description: `Returns all pages' metainfo without modificators.`,
    })
    @ApiResponse({
        status: 200,
        type: PageInfoDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getPagesInfo(): Promise<TPageInfo[]> {

        logFor('detailed', 'ThemeController::getPagesInfo');
        const out: TPageInfo[] = [];
        const { themeConfig, userConfig, cmsSettings } = await this.themeService.readConfigs();
        let pages: TPageConfig[] = [];
        if (themeConfig && themeConfig.pages && Array.isArray(themeConfig.pages)) {
            pages = themeConfig.pages;
        }
        const pageRoutes: string[] = [];
        pages.forEach(p => pageRoutes.push(p.route));

        if (userConfig && userConfig.pages && Array.isArray(userConfig.pages)) {
            userConfig.pages.forEach(p => {
                if (pageRoutes.includes(p.route)) {
                    const i = pageRoutes.indexOf(p.route);
                    pages[i] = Object.assign({}, pages[i], p);
                }
                else {
                    pages.push(p);
                }
            })
        }
        pages.forEach(p => {
            const info: TPageInfo = {
                route: p.route,
                name: p.name,
                title: p.title,
                isDynamic: p.isDynamic
            }
            out.push(info);
        });

        return out;
    }


    @Get('pages/configs')
    @ApiOperation({
        description: `Returns all pages with merged modifications.`,
    })
    @ApiResponse({
        status: 200,
        type: [PageConfigDto]
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getAllPageConfigs(): Promise<TPageConfig[]> {

        logFor('detailed', 'ThemeController::getAllPageConfigs');
        return this.themeService.readAllPageConfigs();
    }


    @Get('main-config')
    @ApiOperation({
        description: `Returns merged main config (theme meta info).`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: ThemeMainConfigDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getMainConfig(): Promise<TThemeMainConfig | null> {

        logFor('detailed', 'ThemeController::getMainConfig');
        let out: TThemeMainConfig;
        const { themeConfig, userConfig } = await this.themeService.readConfigs();

        out = Object.assign({}, themeConfig?.main, userConfig?.main);
        return out;
    }


    @Get('custom-config')
    @ApiOperation({
        description: `Returns merged custom app configs.`,
    })
    @ApiResponse({
        status: 200,
    })
    async getCustomConfig(): Promise<Record<string, any>> {
        logFor('detailed', 'ThemeController::getCustomConfig');
        let out: Record<string, any> = {};
        const { themeConfig, userConfig } = await this.themeService.readConfigs();
        out = Object.assign(out, themeConfig?.themeCustomConfig, userConfig?.themeCustomConfig);
        return out;
    }


    @Get('page-bundle')
    @ApiOperation({
        description: `Returns page's admin panel bundle from theme dir.`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: FrontendBundleDto
    })
    async getPageBundle(@Query('pageRoute') pageRoute: string): Promise<TFrontendBundle | null> {

        logFor('detailed', 'ThemeController::getPageBundle');
        let out: TFrontendBundle | null = null;

        if (!pageRoute || pageRoute === "") throw new HttpException('Invalid pageRoute or bundle not found', HttpStatus.NOT_ACCEPTABLE);

        const cmsSettings = await this.cmsService.getSettings();
        if (!cmsSettings?.themeName) throw new HttpException('!cmsSettings?.themeName', HttpStatus.INTERNAL_SERVER_ERROR);

        const pagePath = await getThemeAdminPanelBundleDir(cmsSettings.themeName, pageRoute);
        if (!pagePath) throw new HttpException('page path cannot be resolved', HttpStatus.NOT_ACCEPTABLE);

        const pagePathBunle = normalizePath(pagePath) + '.js';
        if (await fs.pathExists(pagePathBunle)) {
            try {
                out = {};
                out.source = (await fs.readFile(pagePathBunle)).toString();
            } catch (e) {
                serverLogFor('errors-only', 'Failed to read page file at: ' + pagePathBunle, 'Error');
            }

            const pageMetaInfoPath = pagePathBunle + '_meta.json';
            if (await fs.pathExists(pageMetaInfoPath)) {
                try {
                    if (out) out.meta = await fs.readJSON(pageMetaInfoPath);
                } catch (e) {
                    serverLogFor('errors-only', 'Failed to read meta of page at: ' + pageMetaInfoPath, 'Error');
                }
            }
            return out;
        }

        throw new HttpException("Page bundle doesn't exist", HttpStatus.NOT_ACCEPTABLE);

    }


    @Get('install')
    @ApiOperation({
        description: `Installs downloaded theme`,
        parameters: [{ name: 'themeName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async installTheme(@Query('themeName') themeName: string): Promise<boolean> {

        logFor('detailed', 'ThemeController::installTheme');

        if (themeName && themeName !== "") {
            this.themeService.installTheme(themeName);
        };

        throw new HttpException('Invalid themeName', HttpStatus.NOT_ACCEPTABLE);
    }


}