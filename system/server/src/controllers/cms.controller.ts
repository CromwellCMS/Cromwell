import { logFor, TCmsSettings, TPackageCromwellConfig } from '@cromwell/core';
import { getCmsModuleInfo, getPublicDir, readCmsModules, getLogger } from '@cromwell/core-backend';
import { Controller, Get, Header, HttpException, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import fs from 'fs-extra';
import { join } from 'path';

import { CmsConfigDto } from '../dto/cms-config.dto';
import { ModuleInfoDto } from '../dto/module-info.dto';
import { CmsService } from '../services/cms.service';
import { publicSystemDirs } from '../helpers/constants';

const logger = getLogger('detailed');

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
        logger.log('CmsController::getConfig');
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
        logger.log('CmsController::setThemeName');

        if (themeName && themeName !== "") {
            return this.cmsService.setThemeName(themeName);
        }
        return false;
    }


    @Get('themes')
    @ApiOperation({ description: 'Returns info from configs of all themes present in "themes" directory' })
    @ApiResponse({
        status: 200,
        type: [ModuleInfoDto],
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getThemes(): Promise<TPackageCromwellConfig[] | undefined> {
        logger.log('CmsController::getThemes');
        let out: TPackageCromwellConfig[] = [];

        const themeModuleNames = (await readCmsModules()).themes;

        for (const themeName of themeModuleNames) {
            const moduleInfo = getCmsModuleInfo(themeName);
            delete moduleInfo?.frontendDependencies;
            delete moduleInfo?.bundledDependencies;

            if (moduleInfo) {
                await this.cmsService.parseModuleConfigImages(moduleInfo, themeName);
                out.push(moduleInfo);
            }
        }
        return out;
    }


    @Get('plugins')
    @ApiOperation({ description: 'Returns info for all plugins present in "plugins" directory' })
    @ApiResponse({
        status: 200,
        type: [ModuleInfoDto],
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getPlugins(): Promise<TPackageCromwellConfig[]> {
        logger.log('CmsController::getPlugins');
        let out: TPackageCromwellConfig[] = [];

        const pluginModules = (await readCmsModules()).plugins;

        for (const pluginName of pluginModules) {
            const moduleInfo = getCmsModuleInfo(pluginName);
            delete moduleInfo?.frontendDependencies;
            delete moduleInfo?.bundledDependencies;

            if (moduleInfo) {
                await this.cmsService.parseModuleConfigImages(moduleInfo, pluginName);
                out.push(moduleInfo);
            }
        }

        return out;
    }


    @Get('read-public-dir')
    @ApiOperation({
        description: 'Read files and directories in specified subfolder of "public" files',
        parameters: [{ name: 'path', in: 'query' }]
    })
    @ApiResponse({
        status: 200,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async readPublicDir(@Query('path') path: string): Promise<string[] | null> {
        const fullPath = join(getPublicDir(), path ?? '');
        if (! await fs.pathExists(fullPath)) return null;
        return (await fs.readdir(fullPath)).filter(dir => !publicSystemDirs.includes(dir));
    }

    @Get('create-public-dir')
    @ApiOperation({
        description: 'Creates new directory in specified subfolder of "public" files',
        parameters: [
            { name: 'inPath', in: 'query' },
            { name: 'dirName', in: 'query' }]
    })
    @ApiResponse({
        status: 200,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async createDir(@Query('inPath') inPath: string, @Query('dirName') dirName: string): Promise<boolean> {
        if (publicSystemDirs.includes(dirName)) return false;

        const fullPath = join(getPublicDir(), inPath ?? '', dirName);
        if (await fs.pathExists(fullPath)) return false;
        await fs.mkdir(fullPath);
        return true;
    }

    @Get('remove-public-dir')
    @ApiOperation({
        description: 'Removes directory in specified subfolder of "public" files',
        parameters: [
            { name: 'inPath', in: 'query' },
            { name: 'dirName', in: 'query' }]
    })
    @ApiResponse({
        status: 200,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async removeDir(@Query('inPath') inPath: string, @Query('dirName') dirName: string): Promise<boolean> {
        if (publicSystemDirs.includes(dirName)) return false;

        const fullPath = join(getPublicDir(), inPath ?? '', dirName);
        if (! await fs.pathExists(fullPath)) return false;
        await fs.remove(fullPath);
        return true;
    }

    @Post('upload-public-file')
    @Header('content-type', 'multipart/form-data')
    @ApiOperation({
        description: 'Uploads a file to specified subfolder of "public" files',
        parameters: [
            { name: 'inPath', in: 'query' },
            { name: 'fileName', in: 'query' }]
    })
    @ApiResponse({
        status: 200,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async uploadFile(@Query('inPath') inPath: string, @Query('fileName') fileName: string,
        @Req() req: any): Promise<boolean> {
        const fullPath = join(getPublicDir(), inPath ?? '');

        await this.cmsService.uploadFile(req, fullPath)
        return true;
    }
}