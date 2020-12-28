import { logFor, TCmsSettings, TThemeConfig, TThemeMainConfig } from '@cromwell/core';
import { getThemeConfig, readCMSConfig } from '@cromwell/core-backend';
import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import fs from 'fs-extra';
import { resolve } from 'path';

import { projectRootDir } from '../constants';
import { CmsConfigDto } from '../dto/CmsConfig.dto';
import { ThemeMainConfigDto } from '../dto/ThemeMainConfig.dto';
import { ThemeService } from '../services/theme.service';
import { CmsService } from '../services/cms.service';

@ApiBearerAuth()
@ApiTags('CMS')
@Controller('cms')
export class CmsController {

    constructor(
        private readonly themeService: ThemeService,
        private readonly cmsService: CmsService
    ) { }

    private readonly themesDir = resolve(projectRootDir, 'themes');


    @Get('config')
    @ApiOperation({ description: 'Returns CMS settings from DB' })
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


    @Get('set-theme/:themeName')
    @ApiOperation({
        description: 'Returns CMS settings from DB',
        parameters: [{ name: 'themeName', in: 'path', required: true }]

    })
    @ApiResponse({
        status: 200,
        type: CmsConfigDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async setThemeName(@Param('themeName') themeName: string): Promise<boolean> {
        logFor('detailed', 'CmsController::setThemeName');

        if (themeName && themeName !== "") {
            return this.cmsService.setThemeName(themeName);
        }
        return false;
    }


    @Get('themes')
    @ApiOperation({ description: 'Returns info from configs of all themes present in directory' })
    @ApiResponse({
        status: 200,
        type: [ThemeMainConfigDto],
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getThemes(): Promise<TThemeMainConfig[] | undefined> {
        logFor('detailed', 'CmsController::getThemes');
        let out: TThemeMainConfig[] = [];
        let themeDirs: string[] = [];
        try {
            themeDirs = await fs.readdir(this.themesDir);
        } catch (e) {
            logFor('errors-only', "CmsController::getThemes Failed to read themeDirs at: " + this.themesDir + e);
        }
        for (const dirName of themeDirs) {
            const themeConfig: TThemeConfig | undefined = await getThemeConfig(projectRootDir, dirName);
            if (themeConfig && themeConfig.main) {
                if (themeConfig.main.previewImage) {
                    // Read image and convert to base64
                    const imgPath = resolve(this.themesDir, dirName, themeConfig.main.previewImage);
                    if (await fs.pathExists(imgPath)) {
                        const data = (await fs.readFile(imgPath))?.toString('base64');
                        if (data) themeConfig.main.previewImage = data;
                    }
                }
                out.push(themeConfig.main);
            }
        }
        return out;
    }
}
