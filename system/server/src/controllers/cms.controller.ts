import { logFor, TCmsSettings, TThemeMainConfig, TPluginConfig } from '@cromwell/core';
import { getCmsModuleConfig, getNodeModuleDir, readCmsModules } from '@cromwell/core-backend';
import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import fs from 'fs-extra';
import { resolve } from 'path';

import { CmsConfigDto } from '../dto/cms-config.dto';
import { PluginInfoDto } from '../dto/plugin-info.dto';
import { ThemeMainConfigDto } from '../dto/theme-main-config.dto';
import { CmsService } from '../services/cms.service';

@ApiBearerAuth()
@ApiTags('CMS')
@Controller('cms')
export class CmsController {

    constructor(
        private readonly cmsService: CmsService
    ) { }

    @Get('config')
    @ApiOperation({ description: 'Returns CMS settings from DB and cmsconfig.json' })
    @ApiResponse({
        status: 200,
        type: CmsConfigDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getConfig(): Promise<TCmsSettings | undefined> {
        logFor('detailed', 'CmsController::getConfig');
        const config = await this.cmsService.getSettings();
        if (!config) {
            throw new HttpException('CmsController::getConfig Failed to read CMS Config', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return config;
    }


    @Get('set-theme')
    @ApiOperation({
        description: 'Update new theme name in DB',
        parameters: [{ name: 'themeName', in: 'query', required: true }]

    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async setThemeName(@Query('themeName') themeName: string): Promise<boolean> {
        logFor('detailed', 'CmsController::setThemeName');

        if (themeName && themeName !== "") {
            return this.cmsService.setThemeName(themeName);
        }
        return false;
    }


    @Get('themes')
    @ApiOperation({ description: 'Returns info from configs of all themes present in "themes" directory' })
    @ApiResponse({
        status: 200,
        type: [ThemeMainConfigDto],
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getThemes(): Promise<TThemeMainConfig[] | undefined> {
        logFor('detailed', 'CmsController::getThemes');
        let out: TThemeMainConfig[] = [];

        const themeModuleNames = (await readCmsModules()).themes;

        for (const themeName of themeModuleNames) {
            const themeConfig = await getCmsModuleConfig(themeName);

            if (themeConfig && themeConfig.main) {

                if (themeConfig.main.previewImage) {
                    // Read image and convert to base64
                    const themeDir = await getNodeModuleDir(themeName);
                    if (themeDir) {
                        const imgPath = resolve(themeDir, themeConfig.main.previewImage);
                        if (await fs.pathExists(imgPath)) {
                            const data = (await fs.readFile(imgPath))?.toString('base64');
                            if (data) themeConfig.main.previewImage = data;
                        }
                    }

                }
                out.push(themeConfig.main);
            }
        }
        return out;
    }


    @Get('plugins')
    @ApiOperation({ description: 'Returns info for all plugins present in "plugins" directory' })
    @ApiResponse({
        status: 200,
        type: [PluginInfoDto],
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getPlugins(): Promise<PluginInfoDto[]> {
        logFor('detailed', 'CmsController::getPlugins');
        let out: PluginInfoDto[] = [];

        const pluginModules = (await readCmsModules()).plugins;

        for (const pluginName of pluginModules) {


            const pluginConfig = await getCmsModuleConfig<TPluginConfig>(pluginName);

            const info: PluginInfoDto = {
                name: pluginName,
                info: pluginConfig?.info
            }

            if (pluginConfig?.icon) {
                const pluginDir = await getNodeModuleDir(pluginName);

                // Read icon and convert to base64
                if (pluginDir) {
                    const imgPath = resolve(pluginDir, pluginConfig?.icon);
                    if (await fs.pathExists(imgPath)) {
                        const data = (await fs.readFile(imgPath))?.toString('base64');
                        if (data) info.icon = data;
                    }
                }

            }
            out.push(info);
        }

        return out;
    }

    // @Get('upload-image')
    // @ApiOperation({ description: 'Uploads image' })
    // @ApiResponse({
    //     status: 200,
    // })
    // @ApiForbiddenResponse({ description: 'Forbidden.' })
    // async uploadImage(): Promise<boolean> {

    // }
}
