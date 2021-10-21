import { TPackageCromwellConfig, TPageConfig, TPageInfo, TThemeConfig } from '@cromwell/core';
import { getLogger, getThemeConfigs, JwtAuthGuard, Roles } from '@cromwell/core-backend';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ModuleInfoDto } from '../dto/module-info.dto';
import { PageConfigDto } from '../dto/page-config.dto';
import { PageInfoDto } from '../dto/page-info.dto';
import { ThemeConfigDto } from '../dto/theme-config.dto';
import { ThemePaletteDto } from '../dto/theme-palette.dto';
import { UpdateInfoDto } from '../dto/update-info.dto';
import { CmsService } from '../services/cms.service';
import { ThemeService } from '../services/theme.service';

const logger = getLogger();

@ApiBearerAuth()
@ApiTags('Themes')
@Controller('v1/theme')
export class ThemeController {

    constructor(
        private readonly themeService: ThemeService,
        private readonly cmsService: CmsService,
    ) { }


    @Get('page')
    @ApiOperation({
        description: `Returns merged page config for specified Page by pageRoute in query param. Output contains theme's original modifications overwritten by user's modifications.`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: PageConfigDto
    })
    async getPageConfig(@Query('pageRoute') pageRoute: string): Promise<TPageConfig | null> {
        logger.log('ThemeController::getPageConfig');

        if (!pageRoute || pageRoute === '')
            throw new HttpException('Page route is not valid: ' + pageRoute, HttpStatus.NOT_ACCEPTABLE);

        return this.themeService.getPageConfig(pageRoute)
    }


    @Post('page')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Saves page config for specified Page by pageRoute in query param. Modifications (TCromwellBlockData) must contain only newly added mods or an empty array. It is not allowed to send all mods from /theme/page route because they contain mods from theme's config and we don't need to copy them into user's config that way.`,
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiBody({ type: PageConfigDto })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async savePageConfig(@Body() input: PageConfigDto): Promise<boolean> {
        logger.log('ThemeController::savePageConfig');
        if (input && typeof input === 'object') {
            return await this.themeService.saveUserPageConfig(input);
        }
        return false;
    }


    @Delete('page')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Deletes virtual page in both configs`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: PageConfigDto
    })
    async deletePage(@Query('pageRoute') pageRoute: string): Promise<boolean | null> {
        logger.log('ThemeController::deletePage');

        if (!pageRoute || pageRoute === '')
            throw new HttpException('Page route is not valid: ' + pageRoute, HttpStatus.NOT_ACCEPTABLE);

        return await this.themeService.deletePage(pageRoute);
    }


    @Get('page/reset')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Deletes user config of a page`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: PageConfigDto
    })
    async resetPage(@Query('pageRoute') pageRoute: string): Promise<boolean | null> {
        logger.log('ThemeController::resetPage');

        if (!pageRoute || pageRoute === '')
            throw new HttpException('Page route is not valid: ' + pageRoute, HttpStatus.NOT_ACCEPTABLE);

        return await this.themeService.resetPage(pageRoute);
    }


    @Get('palette')
    @ApiOperation({
        description: `Get palette of an active theme`,
    })
    @ApiResponse({
        status: 200,
        type: ThemePaletteDto
    })
    async getThemePalette(): Promise<ThemePaletteDto> {
        logger.log('ThemeController::getThemePalette');
        return await this.themeService.getThemePalette();
    }


    @Post('palette')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Update palette of an active theme`,
    })
    @ApiResponse({
        status: 201,
        type: Boolean
    })
    @ApiBody({ type: ThemePaletteDto })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async saveThemePalette(@Body() input: ThemePaletteDto): Promise<boolean> {
        logger.log('ThemeController::saveThemePalette');
        if (input && typeof input === 'object') {
            return await this.themeService.saveThemePalette(input);
        }
        return false;
    }


    @Get('plugins')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Returns plugins' configs at specified Page by pageRoute in query param. Output contains theme's original modifications overwritten by user's modifications.`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
    })
    async getPluginsAtPage(@Query('pageRoute') pageRoute: string) {
        logger.log('ThemeController::getPluginsAtPage');

        if (!pageRoute || pageRoute === '')
            throw new HttpException('Page route is not valid: ' + pageRoute, HttpStatus.NOT_ACCEPTABLE);

        return this.themeService.getPluginsAtPage(pageRoute)
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
        logger.log('ThemeController::getAllPluginNames');
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
        description: `Returns all pages' info without modifications.`,
    })
    @ApiResponse({
        status: 200,
        type: PageInfoDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getPagesInfo(): Promise<TPageInfo[]> {
        logger.log('ThemeController::getPagesInfo');
        return this.themeService.getPagesInfo();
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

        logger.log('ThemeController::getAllPageConfigs');
        return this.themeService.readAllPageConfigs();
    }


    @Get('config')
    @ApiOperation({
        description: `Returns theme's module config from module.config.js.`,
    })
    @ApiResponse({
        status: 200,
        type: ThemeConfigDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getThemeConfig(): Promise<TThemeConfig | null> {
        logger.log('ThemeController::getThemeConfig');
        const { themeConfig } = await getThemeConfigs();
        return new ThemeConfigDto().parse(themeConfig);
    }


    @Get('info')
    @ApiOperation({
        description: `Returns theme's info from package.json.`,
    })
    @ApiResponse({
        status: 200,
        type: ModuleInfoDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getThemeInfo(): Promise<TPackageCromwellConfig | null> {
        logger.log('ThemeController::getThemeInfo');
        const { themeInfo } = await getThemeConfigs();

        return themeInfo;
    }


    @Get('custom-config')
    @ApiOperation({
        description: `Returns merged custom app configs.`,
    })
    @ApiResponse({
        status: 200,
    })
    async getCustomConfig(): Promise<Record<string, any>> {
        logger.log('ThemeController::getCustomConfig');
        let out: Record<string, any> = {};
        const { themeConfig, userConfig } = await getThemeConfigs();
        out = Object.assign(out, themeConfig?.themeCustomConfig, userConfig?.themeCustomConfig);
        return out;
    }


    @Get('check-update')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
    @ApiOperation({
        description: `Returns available Update for specified Theme`,
        parameters: [{ name: 'themeName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: UpdateInfoDto,
    })
    async checkUpdate(@Query('themeName') themeName: string): Promise<UpdateInfoDto | boolean | undefined> {
        const update = await this.themeService.checkThemeUpdate(themeName);
        if (update) return new UpdateInfoDto()?.parseVersion?.(update);
        return false;
    }


    @Get('update')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Updates a Theme to latest version`,
        parameters: [{ name: 'themeName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    async updateTheme(@Query('themeName') themeName: string): Promise<boolean | undefined> {
        return this.themeService.handleThemeUpdate(themeName);
    }


    @Get('install')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Installs a Theme`,
        parameters: [{ name: 'themeName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    async installTheme(@Query('themeName') themeName: string): Promise<boolean | undefined> {
        return this.themeService.handleInstallTheme(themeName);
    }


    @Get('delete')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Deletes a Theme`,
        parameters: [{ name: 'themeName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    async deleteTheme(@Query('themeName') themeName: string): Promise<boolean | undefined> {
        return this.themeService.handleDeleteTheme(themeName);
    }

}
