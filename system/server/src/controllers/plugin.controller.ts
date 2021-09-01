import { TFrontendBundle } from '@cromwell/core';
import { getLogger, getPluginSettings, JwtAuthGuard, Roles, savePluginSettings } from '@cromwell/core-backend';
import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FrontendBundleDto } from '../dto/frontend-bundle.dto';
import { UpdateInfoDto } from '../dto/update-info.dto';
import { PluginService } from '../services/plugin.service';

const logger = getLogger();

@ApiBearerAuth()
@ApiTags('Plugins')
@Controller('v1/plugin')
export class PluginController {

    constructor(private readonly pluginService: PluginService) { }

    @Get('settings')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
    @ApiOperation({
        description: 'Returns JSON settings of a plugin by pluginName.',
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getPluginSettings(@Query('pluginName') pluginName: string): Promise<any | undefined> {
        logger.log('PluginController::getPluginSettings ' + pluginName);

        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        return getPluginSettings(pluginName);
    }


    @Post('settings')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: 'Saves JSON settings of a plugin by pluginName.',
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async savePluginSettings(@Query('pluginName') pluginName: string, @Body() input): Promise<boolean> {
        logger.log('PluginController::savePluginSettings');

        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        return savePluginSettings(pluginName, input);
    }


    @Get('frontend-bundle')
    @ApiOperation({
        description: `Returns plugin's JS frontend bundle info.`,
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: FrontendBundleDto
    })
    async getPluginFrontendBundle(@Query('pluginName') pluginName: string): Promise<TFrontendBundle | undefined> {
        logger.log('PluginController::getPluginFrontendBundle');

        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        const bundle = await this.pluginService.getPluginBundle(pluginName, 'frontend');
        if (!bundle)
            throw new HttpException(`Frontend bundle not found for: ${pluginName}`, HttpStatus.NOT_FOUND);

        return bundle;
    }


    @Get('admin-bundle')
    @ApiOperation({
        description: `Returns plugin's JS admin bundle info.`,
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: FrontendBundleDto
    })
    async getPluginAdminBundle(@Query('pluginName') pluginName: string): Promise<TFrontendBundle | undefined> {
        logger.log('PluginController::getPluginAdminBundle');

        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        const bundle = await this.pluginService.getPluginBundle(pluginName, 'admin');
        if (!bundle)
            throw new HttpException(`Bundle for plugin ${pluginName} was not found`, HttpStatus.NOT_FOUND);

        return bundle;
    }


    @Get('check-update')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
    @ApiOperation({
        description: `Returns available Update for sepcified Plugin`,
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: UpdateInfoDto,
    })
    async checkUpdate(@Query('pluginName') pluginName: string): Promise<UpdateInfoDto | boolean | undefined> {
        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        const update = await this.pluginService.checkPluginUpdate(pluginName);
        if (update) return new UpdateInfoDto()?.parseVersion?.(update);
        return false;
    }


    @Get('update')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Updates a Plugin to latest version`,
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    async updatePlugin(@Query('pluginName') pluginName: string): Promise<boolean | undefined> {
        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        return this.pluginService.handlePluginUpdate(pluginName);
    }


    @Get('install')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Installs a Plugin`,
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    async installPlugin(@Query('pluginName') pluginName: string): Promise<boolean | undefined> {
        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        return this.pluginService.handleInstallPlugin(pluginName);
    }


    @Get('delete')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Deletes a Plugin`,
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    async deletePlugin(@Query('pluginName') pluginName: string): Promise<boolean | undefined> {
        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        return this.pluginService.handleDeletePlugin(pluginName);
    }

}
