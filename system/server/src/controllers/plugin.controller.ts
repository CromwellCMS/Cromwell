import { logFor, TFrontendBundle, TPluginConfig, TPluginEntityInput } from '@cromwell/core';
import { configFileName } from '@cromwell/core-backend';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import decache from 'decache';
import fs from 'fs-extra';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';
import { getCustomRepository } from 'typeorm';

import { projectRootDir } from '../constants';
import { FrontendBundleDto } from '../dto/FrontendBundle.dto';
import { GenericPlugin } from '../helpers/genericEntities';
import { PluginService } from '../services/plugin.service';


@ApiBearerAuth()
@ApiTags('Plugins')
@Controller('plugin')
export class PluginController {

    constructor(private readonly pluginService: PluginService) { }


    @Get('settings/:pluginName')
    @ApiOperation({
        description: 'Returns JSON settings of a plugin by pluginName.',
        parameters: [{ name: 'pluginName', in: 'path' }]
    })
    @ApiResponse({
        status: 200,
    })
    async getPluginConfig(@Param('pluginName') pluginName: string): Promise<TPluginConfig | undefined> {
        logFor('detailed', 'PluginController::/settings/:pluginName: ' + pluginName);

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

    @Post('settings/:pluginName')
    @ApiOperation({
        description: 'Saves JSON settings of a plugin by pluginName.',
        parameters: [{ name: 'pluginName', in: 'path', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async savePluginConfig(@Param('pluginName') pluginName: string, @Body() input): Promise<boolean> {

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


    @Get('frontend-bundle/:pluginName')
    @ApiOperation({
        description: `Returns plugin's JS frontend bundle info.`,
        parameters: [{ name: 'pluginName', in: 'path', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: FrontendBundleDto
    })
    async getPluginFrontendBundle(@Param('pluginName') pluginName: string): Promise<TFrontendBundle | undefined> {
        logFor('detailed', 'PluginController::getPluginFrontendBundle');

        if (pluginName && pluginName !== "") {
            const bundle = await this.pluginService.getPluginBundle(pluginName, 'frontend');
            if (bundle) {
                return bundle;
            }
        };

        throw new HttpException('Invalid pluginName or frontend bundle not found', HttpStatus.NOT_ACCEPTABLE);
    }


    @Get('admin-bundle/:pluginName')
    @ApiOperation({
        description: `Returns plugin's JS admin bundle info.`,
        parameters: [{ name: 'pluginName', in: 'path', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: FrontendBundleDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getPluginAdminBundle(@Param('pluginName') pluginName: string): Promise<TFrontendBundle | undefined> {
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



    @Get('install/:pluginName')
    @ApiOperation({
        description: 'Installs downloaded plugin.',
        parameters: [{ name: 'pluginName', in: 'path', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async installPlugin(@Param('pluginName') pluginName: string): Promise<boolean> {
        logFor('detailed', 'PluginController::installPlugin');

        if (pluginName && pluginName !== "") {
            const pluginPath = resolve(this.pluginService.pluginsPath, pluginName);
            if (await fs.pathExists(pluginPath)) {

                // @TODO Execute install script



                // Read plugin config
                let pluginConfig: TPluginConfig | undefined;
                const filePath = resolve(pluginPath, configFileName);
                if (await fs.pathExists(filePath)) {
                    try {
                        decache(filePath);
                        pluginConfig = require(filePath);
                    } catch (e) {
                        console.error(e);
                    }
                }
                const defaultSettings = pluginConfig?.defaultSettings;

                // Make symlink for public static content
                const pluginPublicDir = resolve(pluginPath, 'public');
                if (await fs.pathExists(pluginPublicDir)) {
                    try {
                        const publicPluginsDir = resolve(projectRootDir, 'public/plugins');
                        await fs.ensureDir(publicPluginsDir);
                        await symlinkDir(pluginPublicDir, resolve(publicPluginsDir, pluginName))
                    } catch (e) { console.log(e) }
                }

                // Check for admin bundle
                let hasAdminBundle = false;
                const bundle = await this.pluginService.getPluginBundle(pluginName, 'admin');
                if (bundle) hasAdminBundle = true;

                // Create DB entity
                const input: TPluginEntityInput = {
                    name: pluginName,
                    slug: pluginName,
                    title: pluginConfig?.title,
                    isInstalled: true,
                    hasAdminBundle
                };
                if (defaultSettings) {
                    try {
                        input.defaultSettings = JSON.stringify(defaultSettings);
                        input.settings = JSON.stringify(defaultSettings);
                    } catch (e) {
                        console.error(e);
                    }
                }

                const pluginRepo = getCustomRepository(GenericPlugin.repository);
                try {
                    const entity = await pluginRepo.createEntity(input);
                    if (entity) {
                        return true;
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        };
        throw new HttpException('Invalid pluginName', HttpStatus.NOT_ACCEPTABLE);
    }
}