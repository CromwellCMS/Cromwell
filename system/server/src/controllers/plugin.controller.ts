import { logFor, TFrontendBundle, TPluginConfig, TPluginEntityInput } from '@cromwell/core';
import { configFileName, getPublicPluginsDir, getNodeModuleDir } from '@cromwell/core-backend';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import decache from 'decache';
import fs from 'fs-extra';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';
import { getCustomRepository } from 'typeorm';

import { FrontendBundleDto } from '../dto/FrontendBundle.dto';
import { GenericPlugin } from '../helpers/genericEntities';
import { PluginService } from '../services/plugin.service';


@ApiBearerAuth()
@ApiTags('Plugins')
@Controller('plugin')
export class PluginController {

    constructor(private readonly pluginService: PluginService) { }


    @Get('settings')
    @ApiOperation({
        description: 'Returns JSON settings of a plugin by pluginName.',
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
    })
    async getPluginConfig(@Query('pluginName') pluginName: string): Promise<TPluginConfig | undefined> {
        logFor('detailed', 'PluginController::getPluginConfig ' + pluginName);

        if (pluginName && pluginName !== "") {
            const plugin = await this.pluginService.findOne(pluginName);

            if (plugin) {
                let defaultSettings;
                let settings;
                try {
                    if (plugin.defaultSettings) defaultSettings = JSON.parse(plugin.defaultSettings);
                } catch (e) {
                    logFor('detailed', e, console.error);
                }
                try {
                    if (plugin.settings) settings = JSON.parse(plugin.settings);
                } catch (e) {
                    logFor('detailed', e, console.error);
                }

                const out = Object.assign({}, defaultSettings, settings);
                return out;
            }
        }

        throw new HttpException('Invalid pluginName', HttpStatus.NOT_ACCEPTABLE);
    }

    @Post('settings')
    @ApiOperation({
        description: 'Saves JSON settings of a plugin by pluginName.',
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async savePluginConfig(@Query('pluginName') pluginName: string, @Body() input): Promise<boolean> {

        logFor('detailed', 'PluginController::savePluginConfig');
        if (pluginName && pluginName !== "") {
            const plugin = await this.pluginService.findOne(pluginName);
            if (plugin) {
                plugin.settings = JSON.stringify(input);
                await this.pluginService.save(plugin);
                return true;
            } else {
                logFor('errors-only', `PluginController::savePluginConfig Error Plugin ${pluginName} was no found!`);
            }
        }
        return false;
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
        logFor('detailed', 'PluginController::getPluginFrontendBundle');

        if (pluginName && pluginName !== "") {
            const bundle = await this.pluginService.getPluginBundle(pluginName, 'frontend');
            if (bundle) {
                return bundle;
            }
        };

        throw new HttpException('Invalid pluginName or frontend bundle not found', HttpStatus.NOT_ACCEPTABLE);
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
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getPluginAdminBundle(@Query('pluginName') pluginName: string): Promise<TFrontendBundle | undefined> {
        logFor('detailed', 'PluginController::getPluginAdminBundle');

        if (pluginName && pluginName !== "") {
            const bundle = await this.pluginService.getPluginBundle(pluginName, 'admin');
            if (bundle) {
                return bundle;
            }
        };

        throw new HttpException('Invalid pluginName or admin panel bundle not found', HttpStatus.NOT_ACCEPTABLE);
    }


    @Get('list')
    @ApiOperation({
        description: 'Returns list of all installed plugins.'
    })
    @ApiResponse({
        status: 200,
        type: [String]
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getPluginList(): Promise<string[]> {
        logFor('detailed', 'PluginController::getPluginList');
        return (await this.pluginService.getAll()).map(ent => ent.name);
    }



    @Get('install')
    @ApiOperation({
        description: 'Installs downloaded plugin.',
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async installPlugin(@Query('pluginName') pluginName: string): Promise<boolean> {
        logFor('detailed', 'PluginController::installPlugin');

        if (pluginName && pluginName !== "") {
            return this.pluginService.installPlugin(pluginName);
        };
        throw new HttpException('Invalid pluginName', HttpStatus.NOT_ACCEPTABLE);
    }
}