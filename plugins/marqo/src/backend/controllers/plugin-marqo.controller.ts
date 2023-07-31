import { AuthGuard, getLogger } from '@cromwell/core-backend';
import { Controller, Post } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { marqoClient } from '../marqo-client';

@ApiTags('PluginMarqo')
@Controller('plugin-marqo')
class PluginMarqoController {
  private syncing = false;

  @Post('update-data')
  @AuthGuard({ permissions: ['update_plugin_settings'] })
  @ApiOperation({ description: 'Update data from Cromwell DB to Marqo DB' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async updateData(): Promise<{ success: boolean; message?: string }> {
    if (this.syncing) return { success: false, message: 'Syncing in progress. Try again later' };
    this.syncing = true;

    let success = false;
    let message;
    try {
      await marqoClient.updateSettings();
      const { index_name, marqo_url } = marqoClient.getSettings();
      if (!index_name) {
        message = 'Index name is not set';
      }
      if (!marqo_url) {
        message = 'URL is not set';
      }

      if (index_name && marqo_url) {
        success = await marqoClient.syncAllProducts();
      }
    } catch (error: any) {
      message = error.message;
      getLogger().error(error);
    }

    this.syncing = false;
    return { success, message };
  }

  @Post('delete-data')
  @AuthGuard({ permissions: ['update_plugin_settings'] })
  @ApiOperation({ description: 'Delete index in Marqo DB' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async deleteData(): Promise<{ success: boolean; message?: string }> {
    if (this.syncing) return { success: false, message: 'Syncing in progress. Try again later' };
    this.syncing = true;

    let success = false;
    let message;
    try {
      await marqoClient.updateSettings();
      const { index_name, marqo_url } = marqoClient.getSettings();
      if (!index_name) {
        message = 'Index name is not set';
      }
      if (!marqo_url) {
        message = 'URL is not set';
      }

      if (index_name && marqo_url) {
        await marqoClient.deleteIndex(index_name);
        success = true;
      }
    } catch (error: any) {
      message = error.message;
      getLogger().error(error);
    }

    this.syncing = false;
    return { success, message };
  }
}

export default PluginMarqoController;
