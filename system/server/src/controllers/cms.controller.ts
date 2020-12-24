import { logFor, TCmsConfig, TThemeConfig, TThemeMainConfig } from '@cromwell/core';
import { readCMSConfig } from '@cromwell/core-backend';
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import fs from 'fs-extra';
import { resolve } from 'path';

import { projectRootDir } from '../constants';
import { CmsConfigDto } from '../dto/CmsConfig.dto';
import { ThemeMainConfigDto } from '../dto/ThemeMainConfig.dto';
import { ThemeService } from '../services/theme.service';

@ApiBearerAuth()
@ApiTags('CMS')
@Controller('cms')
export class CmsController {

    constructor(private readonly themeService: ThemeService) { }

    private readonly themesDir = resolve(projectRootDir, 'themes');

    @Get('config')
    @ApiOperation({ description: 'Returns CMS config' })
    @ApiResponse({
        status: 200,
        type: CmsConfigDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getConfig(): Promise<TCmsConfig | undefined> {
        logFor('detailed', 'CmsController::getConfig');
        const config = await readCMSConfig(projectRootDir);
        if (!config) {
            throw new HttpException('CmsController::getConfig Failed to read CMS Config', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return config;
    }

    @Get('themes')
    @ApiOperation({ description: 'Returns info from configs of all installed themes and present in directory' })
    @ApiResponse({
        status: 200,
        type: [ThemeMainConfigDto],
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getThemes(): Promise<TThemeMainConfig[] | undefined> {
        logFor('detailed', 'cmsController/themes');
        let out: TThemeMainConfig[] = [];
        let themeDirs: string[] = [];
        try {
            themeDirs = await fs.readdir(this.themesDir);
        } catch (e) {
            logFor('errors-only', "CmsController::getThemes Failed to read themeDirs at: " + this.themesDir, e);
        }
        for (const dirName of themeDirs) {
            const themeEntity = await this.themeService.findOne(dirName);
            if (themeEntity && themeEntity.settings) {
                try {
                    const themeConfig: TThemeConfig | undefined = JSON.parse(themeEntity.settings);
                    if (themeConfig && themeConfig.main) {
                        out.push(themeConfig.main);
                    }
                } catch (e) {
                    logFor('errors-only', `CmsController::getThemes Failed to parse settings of ${dirName} theme`)
                }
            }

        }
        return out;
    }
}
