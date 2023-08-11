import { TFrontendBundle } from '@cromwell/core';
import { AuthGuard, findPlugin, getLogger, getPluginSettings, savePluginSettings } from '@cromwell/core-backend';
import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FrontendBundleDto } from '../dto/frontend-bundle.dto';
import { PluginEntityDto } from '../dto/plugin-entity.dto';
import { UpdateInfoDto } from '../dto/update-info.dto';
import { updateWithFilters } from '../helpers/data-filters';
import { getDIService } from '../helpers/utils';
import { PluginService } from '../services/plugin.service';

const logger = getLogger();

@ApiBearerAuth()
@ApiTags('Plugins')
@Controller('v1/plugin')
export class PluginController {
  private pluginService = getDIService(PluginService);

  @Get('settings')
  @AuthGuard({ permissions: ['read_plugin_settings'] })
  @ApiOperation({
    description: 'Returns JSON settings of a plugin by pluginName.',
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPluginSettings(@Query('pluginName') pluginName: string): Promise<any | undefined> {
    logger.log('PluginController::getPluginSettings ' + pluginName);

    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    const settings = await getPluginSettings(pluginName);
    if (!settings) {
      throw new HttpException(`Plugin not found: ${pluginName}`, HttpStatus.NOT_FOUND);
    }
    return settings;
  }

  @Post('settings')
  @AuthGuard({ permissions: ['update_plugin_settings'] })
  @ApiOperation({
    description: 'Saves JSON settings of a plugin by pluginName.',
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async savePluginSettings(@Query('pluginName') pluginName: string, @Body() input): Promise<any> {
    logger.log('PluginController::savePluginSettings');

    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    const plugin = await updateWithFilters(
      'PluginSettings',
      undefined,
      ['update_plugin_settings'],
      input,
      pluginName as any,
      async (id, input) => {
        return savePluginSettings(id as any, input);
      },
    );

    return plugin;
  }

  @Get('entity')
  @AuthGuard({ permissions: ['read_plugins'] })
  @ApiOperation({
    description: 'Returns DB record of a plugin by pluginName.',
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: PluginEntityDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPluginEntity(@Query('pluginName') pluginName: string): Promise<PluginEntityDto | undefined> {
    logger.log('PluginController::getPluginEntity ' + pluginName);

    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);
    const plugin = await findPlugin(pluginName);
    if (!plugin) {
      throw new HttpException(`Plugin not found: ${pluginName}`, HttpStatus.NOT_FOUND);
    }
    return new PluginEntityDto().parse(plugin);
  }

  @Get('frontend-bundle')
  @ApiOperation({
    description: `Returns plugin's JS frontend bundle info.`,
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: FrontendBundleDto,
  })
  async getPluginFrontendBundle(@Query('pluginName') pluginName: string): Promise<TFrontendBundle | undefined> {
    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    const bundle = await this.pluginService.getPluginBundle(pluginName, 'frontend');
    if (!bundle) throw new HttpException(`Frontend bundle not found for: ${pluginName}`, HttpStatus.NOT_FOUND);

    return bundle;
  }

  @Get('admin-bundle')
  @AuthGuard({ permissions: ['read_plugins'] })
  @ApiOperation({
    description: `Returns plugin's JS admin bundle info.`,
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: FrontendBundleDto,
  })
  async getPluginAdminBundle(@Query('pluginName') pluginName: string): Promise<TFrontendBundle | undefined> {
    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    const bundle = await this.pluginService.getPluginBundle(pluginName, 'admin');
    if (!bundle) throw new HttpException(`Bundle for plugin ${pluginName} was not found`, HttpStatus.NOT_FOUND);

    return bundle;
  }

  @Get('check-update')
  @AuthGuard({ permissions: ['read_plugins'] })
  @ApiOperation({
    description: `Returns available Update for sepcified Plugin`,
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: UpdateInfoDto,
  })
  async checkUpdate(@Query('pluginName') pluginName: string): Promise<UpdateInfoDto | boolean | undefined> {
    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    const update = await this.pluginService.checkPluginUpdate(pluginName);
    if (update) return new UpdateInfoDto()?.parseVersion?.(update);
    return false;
  }

  @Get('update')
  @AuthGuard({ permissions: ['update_plugin'] })
  @ApiOperation({
    description: `Updates a Plugin to latest version`,
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async updatePlugin(@Query('pluginName') pluginName: string): Promise<boolean | undefined> {
    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    return this.pluginService.handlePluginUpdate(pluginName);
  }

  @Get('install')
  @AuthGuard({ permissions: ['install_plugin'] })
  @ApiOperation({
    description: `Installs a Plugin`,
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async installPlugin(@Query('pluginName') pluginName: string): Promise<boolean | undefined> {
    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    return this.pluginService.handleInstallPlugin(pluginName);
  }

  @Get('delete')
  @AuthGuard({ permissions: ['uninstall_plugin'] })
  @ApiOperation({
    description: `Uninstall a Plugin`,
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deletePlugin(@Query('pluginName') pluginName: string): Promise<boolean | undefined> {
    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    return this.pluginService.handleDeletePlugin(pluginName);
  }
}
