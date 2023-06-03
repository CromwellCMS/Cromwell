import { TOrder, TPackageCromwellConfig, TProductReview } from '@cromwell/core';
import {
  AuthGuard,
  getCmsSettings,
  getLogger,
  getPermissions,
  getPublicDir,
  ProductReviewInput,
  TRequestWithUser,
} from '@cromwell/core-backend';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FastifyReply } from 'fastify';
import fs from 'fs-extra';
import { join } from 'path';

import { AdminCmsSettingsDto } from '../dto/admin-cms-settings.dto';
import { CmsSettingsDto } from '../dto/cms-settings.dto';
import { CmsStatsDto } from '../dto/cms-stats.dto';
import { CmsStatusDto } from '../dto/cms-status.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { DashboardSettingsDto } from '../dto/dashboard-settings.dto';
import { ExportOptionsDto } from '../dto/export-options.dto';
import { ModuleInfoDto } from '../dto/module-info.dto';
import { OrderTotalDto } from '../dto/order-total.dto';
import { PageStatsDto } from '../dto/page-stats.dto';
import { PermissionDto } from '../dto/permission.dto';
import { SetupFirstStepDto, SetupSecondStepDto } from '../dto/setup.dto';
import { SystemUsageDto } from '../dto/system-usage.dto';
import { publicSystemDirs } from '../helpers/constants';
import { resetAllPagesCache } from '../helpers/reset-page';
import { getDIService } from '../helpers/utils';
import { CmsService } from '../services/cms.service';
import { MigrationService } from '../services/migration.service';
import { PluginService } from '../services/plugin.service';
import { StatsService } from '../services/stats.service';
import { StoreService } from '../services/store.service';
import { ThemeService } from '../services/theme.service';

const logger = getLogger();

@ApiBearerAuth()
@ApiTags('CMS')
@Controller('v1/cms')
export class CmsController {
  private pluginService = getDIService(PluginService);
  private cmsService = getDIService(CmsService);
  private themeService = getDIService(ThemeService);
  private migrationService = getDIService(MigrationService);
  private storeService = getDIService(StoreService);
  private statsService = getDIService(StatsService);

  @Get('settings')
  @ApiOperation({ description: 'Returns public CMS settings from DB and cmsconfig.json' })
  @ApiResponse({
    status: 200,
    type: CmsSettingsDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getConfig(): Promise<CmsSettingsDto | undefined> {
    const config = await getCmsSettings();
    if (!config) {
      throw new HttpException('Failed to read CMS Config', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return new CmsSettingsDto().parseSettings(config);
  }

  @Get('admin-settings')
  @AuthGuard({ permissions: ['read_cms_settings'] })
  @ApiOperation({ description: 'Returns admin CMS settings from DB and cmsconfig.json' })
  @ApiResponse({
    status: 200,
    type: AdminCmsSettingsDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAdminSettings(): Promise<AdminCmsSettingsDto | undefined> {
    return this.cmsService.getAdminSettings();
  }

  @Post('admin-settings')
  @AuthGuard({ permissions: ['update_cms_settings'] })
  @ApiOperation({
    description: 'Updates CMS config',
  })
  @ApiBody({ type: AdminCmsSettingsDto })
  @ApiResponse({
    status: 200,
    type: AdminCmsSettingsDto,
  })
  async updateCmsSettings(@Body() input: AdminCmsSettingsDto): Promise<AdminCmsSettingsDto | undefined> {
    const settings = await this.cmsService.updateCmsSettings(input);
    resetAllPagesCache();
    return settings;
  }

  @Get('themes')
  @AuthGuard({ permissions: ['read_themes'] })
  @ApiOperation({ description: 'Returns info from configs of all themes present in "themes" directory' })
  @ApiResponse({
    status: 200,
    type: [ModuleInfoDto],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getThemes(): Promise<TPackageCromwellConfig[] | undefined> {
    logger.log('CmsController::getThemes');
    return this.cmsService.readThemes();
  }

  @Get('plugins')
  @AuthGuard({ permissions: ['read_plugins'] })
  @ApiOperation({ description: 'Returns info for all plugins present in "plugins" directory' })
  @ApiResponse({
    status: 200,
    type: [ModuleInfoDto],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPlugins(): Promise<TPackageCromwellConfig[]> {
    logger.log('CmsController::getPlugins');
    return this.cmsService.readPlugins();
  }

  @Get('read-public-dir')
  @AuthGuard({ permissions: ['read_public_directories'] })
  @ApiOperation({
    description: 'Read files and directories in specified subfolder of "public" files',
    parameters: [{ name: 'path', in: 'query' }],
  })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async readPublicDir(@Query('path') path: string): Promise<string[] | null> {
    const fullPath = join(getPublicDir(), path ?? '');
    if (!(await fs.pathExists(fullPath))) {
      throw new HttpException(`Path not exists`, HttpStatus.NOT_FOUND);
    }
    return (await fs.readdir(fullPath)).filter((dir) => !publicSystemDirs.includes(dir));
  }

  @Get('create-public-dir')
  @AuthGuard({ permissions: ['create_public_directory'] })
  @ApiOperation({
    description: 'Creates new directory in specified subfolder of "public" files',
    parameters: [
      { name: 'inPath', in: 'query' },
      { name: 'dirName', in: 'query' },
    ],
  })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async createDir(@Query('inPath') inPath: string, @Query('dirName') dirName: string): Promise<boolean> {
    logger.log('CmsController::createDir');
    if (publicSystemDirs.includes(dirName)) return false;

    const fullPath = join(getPublicDir(), inPath ?? '', dirName);
    if (await fs.pathExists(fullPath)) return false;
    await fs.mkdir(fullPath);
    return true;
  }

  @Get('remove-public-dir')
  @AuthGuard({ permissions: ['remove_public_directory'] })
  @ApiOperation({
    description: 'Removes directory in specified subfolder of "public" files',
    parameters: [
      { name: 'inPath', in: 'query' },
      { name: 'dirName', in: 'query' },
    ],
  })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async removeDir(@Query('inPath') inPath: string, @Query('dirName') dirName: string): Promise<boolean> {
    logger.log('CmsController::removeDir', inPath, dirName);
    if (publicSystemDirs.includes(dirName)) return false;

    const fullPath = join(getPublicDir(), inPath ?? '', dirName);
    await fs.remove(fullPath);
    return true;
  }

  @Post('upload-public-file')
  @AuthGuard({ permissions: ['upload_file'] })
  @Header('content-type', 'multipart/form-data')
  @ApiOperation({
    description: 'Uploads a file to specified subfolder of "public" files',
    parameters: [
      { name: 'inPath', in: 'query' },
      { name: 'fileName', in: 'query' },
    ],
  })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async uploadFile(
    @Query('inPath') inPath: string,
    @Query('fileName') fileName: string,
    @Req() req: any,
  ): Promise<string> {
    logger.log('CmsController::uploadFile');
    try {
      const dirPath = join(getPublicDir(), inPath ?? '');
      await this.cmsService.uploadFile(req, dirPath);
    } catch (error) {
      logger.error(error);
      return 'false';
    }

    return 'true';
  }

  @Get('download-public-file')
  @AuthGuard({ permissions: ['download_file'] })
  @ApiOperation({
    description: 'Downloads a file from specified subfolder of "public" files',
    parameters: [
      { name: 'inPath', in: 'query' },
      { name: 'fileName', in: 'query' },
    ],
  })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async downloadFile(
    @Query('inPath') inPath: string,
    @Query('fileName') fileName: string,
    @Response() response: FastifyReply,
  ) {
    logger.log('CmsController::downloadFile');
    return this.cmsService.downloadFile(response, inPath, fileName);
  }

  @Post('set-up-step-1')
  @ApiBody({ type: SetupFirstStepDto })
  @ApiOperation({
    description: 'Configure CMS after first launch. Step 1',
  })
  async setupCmsFirstStep(@Body() input: SetupFirstStepDto) {
    logger.log('CmsController::setupCmsFirstStep');
    return this.cmsService.setupCmsFirstStep(input);
  }

  @Post('set-up-step-2')
  @ApiBody({ type: SetupSecondStepDto })
  @ApiOperation({
    description: 'Configure CMS after first launch. Step 2',
  })
  async setupCmsSecondStep(@Body() input: SetupSecondStepDto) {
    logger.log('CmsController::setupCmsSecondStep');
    return this.cmsService.setupCmsSecondStep(input);
  }

  @Get('change-theme')
  @AuthGuard({ permissions: ['change_theme'] })
  @ApiOperation({
    description: `Makes specified theme as active one and restarts Renderer`,
    parameters: [{ name: 'themeName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async setActiveTheme(@Query('themeName') themeName: string): Promise<boolean> {
    logger.log('CmsController::setActiveTheme');
    if (!themeName) throw new HttpException(`Invalid theme name: ${themeName}`, HttpStatus.NOT_ACCEPTABLE);

    return this.themeService.setActive(themeName);
  }

  @Get('activate-theme')
  @AuthGuard({ permissions: ['activate_theme'] })
  @ApiOperation({
    description: `Activates/enables (installs in DB) downloaded theme. Does NOT make it as currently used by Renderer. See "change-theme"`,
    parameters: [{ name: 'themeName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async activateTheme(@Query('themeName') themeName: string): Promise<boolean> {
    logger.log('CmsController::activateTheme');
    if (!themeName) throw new HttpException(`Invalid theme name: ${themeName}`, HttpStatus.NOT_ACCEPTABLE);

    return this.themeService.activateTheme(themeName);
  }

  @Get('activate-plugin')
  @AuthGuard({ permissions: ['activate_plugin'] })
  @ApiOperation({
    description: 'Activates downloaded plugin.',
    parameters: [{ name: 'pluginName', in: 'query', required: true }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async activatePlugin(@Query('pluginName') pluginName: string): Promise<boolean> {
    logger.log('PluginController::activatePlugin');
    if (!pluginName) throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

    return this.pluginService.activatePlugin(pluginName);
  }

  @Post('get-order-total')
  @Throttle(4, 1)
  @ApiOperation({
    description: 'Calculates cart total sum plus shipping costs',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 200,
    type: OrderTotalDto,
  })
  async getOrderTotal(@Body() input: CreateOrderDto): Promise<OrderTotalDto | undefined> {
    if (!input) throw new HttpException('Order form is incomplete', HttpStatus.NOT_ACCEPTABLE);

    const settings = await getCmsSettings();
    if (!settings?.modules?.ecommerce) throw new HttpException('', HttpStatus.NOT_FOUND);

    return this.storeService.calcOrderTotal(input);
  }

  @Post('create-payment-session')
  @Throttle(5, 20)
  @ApiOperation({
    description: 'Creates new payment session',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 200,
    type: OrderTotalDto,
  })
  async createPaymentSession(@Body() input: CreateOrderDto): Promise<OrderTotalDto> {
    if (!input) throw new HttpException('Order form is incomplete', HttpStatus.NOT_ACCEPTABLE);

    const settings = await getCmsSettings();
    if (!settings?.modules?.ecommerce) throw new HttpException('', HttpStatus.NOT_FOUND);

    return this.storeService.createPaymentSession(input);
  }

  @Post('place-order')
  @Throttle(3, 20)
  @ApiOperation({
    description: 'Creates new Order in the shop',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 200,
  })
  async placeOrder(@Body() input: CreateOrderDto): Promise<TOrder | undefined> {
    if (!input || !input.customerEmail || !input.customerPhone)
      throw new HttpException('Order form is incomplete', HttpStatus.NOT_ACCEPTABLE);

    const settings = await getCmsSettings();
    if (!settings?.modules?.ecommerce) throw new HttpException('', HttpStatus.NOT_FOUND);

    return this.storeService.placeOrder(input);
  }

  @Post('place-product-review')
  @Throttle(2, 20)
  @ApiOperation({
    description: 'Creates new Review for a product in the shop',
  })
  @ApiBody({ type: ProductReviewInput })
  @ApiResponse({
    status: 200,
  })
  async placeProductReview(@Body() input: ProductReviewInput): Promise<TProductReview> {
    if (!input || !input.productId || !(input.description || input.rating) || input.approved)
      throw new HttpException('Review form is incomplete', HttpStatus.NOT_ACCEPTABLE);

    const settings = await getCmsSettings();
    if (!settings?.modules?.ecommerce) throw new HttpException('', HttpStatus.NOT_FOUND);

    return this.storeService.placeProductReview(input);
  }

  @Post('view-page')
  @Throttle(5, 1)
  @ApiOperation({
    description: `Increments views number for a page in page_stats table`,
    parameters: [{ name: 'pageRoute', in: 'query', required: true }],
  })
  @ApiBody({ type: PageStatsDto })
  @ApiResponse({
    status: 200,
  })
  async viewPage(@Body() input: PageStatsDto): Promise<boolean> {
    if (!input?.pageRoute) throw new HttpException('pageRoute is not valid', HttpStatus.NOT_ACCEPTABLE);

    await this.statsService.viewPage(input);
    return true;
  }

  @Get('dashboard-settings')
  @ApiOperation({
    description: 'Get current dashboard layout',
  })
  @ApiResponse({
    status: 200,
    type: DashboardSettingsDto,
  })
  async getDashboardSettings(@Request() request: TRequestWithUser): Promise<DashboardSettingsDto | undefined> {
    if (!request.user?.id) throw new UnauthorizedException('user.id is not set for the request');

    const layout = await this.cmsService.getDashboardLayout(request.user?.id);

    return layout;
  }

  @Post('dashboard-settings')
  @ApiOperation({
    description: 'Save dashboard layout for user',
  })
  @ApiBody({
    type: DashboardSettingsDto,
  })
  @ApiResponse({
    status: 200,
    type: DashboardSettingsDto,
  })
  async updateDashboardSettings(
    @Request() request: TRequestWithUser,
    @Body() input: DashboardSettingsDto,
  ): Promise<DashboardSettingsDto | undefined> {
    if (!request.user?.id) throw new UnauthorizedException('user.id is not set for the request');
    if (!input.layout) throw new BadRequestException('no layout provided');

    const layout = await this.cmsService.setDashboardLayout(request.user?.id, input.layout);

    return layout;
  }

  @Get('statistics')
  @AuthGuard({ permissions: ['read_cms_statistics'] })
  @ApiOperation({
    description: `Returns CMS stats for AdminPanel dashboard`,
  })
  @ApiResponse({
    status: 200,
    type: CmsStatsDto,
  })
  async getStats(): Promise<CmsStatsDto> {
    return this.statsService.getCmsStats();
  }

  @Get('system')
  @AuthGuard({ permissions: ['read_system_info'] })
  @ApiOperation({
    description: `Returns system info and usage`,
  })
  @ApiResponse({
    status: 200,
    type: SystemUsageDto,
  })
  async getSystemUsage(): Promise<SystemUsageDto> {
    return this.statsService.getSystemUsage();
  }

  @Get('status')
  @AuthGuard({ permissions: ['read_cms_status'] })
  @ApiOperation({
    description: `Returns Updates available and other info for AdminPanel NotificationCenter`,
  })
  @ApiResponse({
    status: 200,
    type: CmsStatusDto,
  })
  async getStatus(): Promise<CmsStatusDto> {
    return this.cmsService.getCmsStatus();
  }

  @Get('launch-update')
  @AuthGuard({ permissions: ['update_cms'] })
  @ApiOperation({
    description: `Launches CMS update`,
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async updateCms(): Promise<boolean> {
    return this.cmsService.handleUpdateCms();
  }

  @Post('export-db')
  @AuthGuard({ permissions: ['export_db'] })
  @ApiOperation({
    description: `Exports DB into Excel file`,
  })
  @ApiBody({ type: ExportOptionsDto })
  @ApiResponse({
    status: 200,
  })
  async exportDB(@Body() input: ExportOptionsDto, @Response() response: FastifyReply) {
    if (!Array.isArray(input.tables)) input.tables = [];

    try {
      const file = await this.migrationService.exportDB(input.tables as any);
      response.type('text/html').send(file);
    } catch (error) {
      logger.error(error);
      response.code(500).send({ message: error + '' });
    }
  }

  @Post('import-db')
  @AuthGuard({ permissions: ['import_db'] })
  @ApiOperation({
    description: 'Import DB from Excel files',
    parameters: [{ name: 'removeSurplus', in: 'query' }],
  })
  @ApiResponse({
    status: 200,
  })
  async importDB(@Req() req: any, @Query('removeSurplus') removeSurplus?: string | null) {
    try {
      await this.migrationService.importDB(req, removeSurplus);
    } catch (error) {
      logger.error(error);
      throw new HttpException(String(error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    resetAllPagesCache();
  }

  @Get('build-sitemap')
  @AuthGuard({ permissions: ['update_cms_settings'] })
  @ApiOperation({ description: 'Builds sitemap at /default_sitemap.xml' })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async buildSitemap() {
    logger.log('CmsController::buildSitemap');
    return this.cmsService.buildSitemap();
  }

  @Get('permissions')
  @AuthGuard({ permissions: ['read_permissions'] })
  @ApiOperation({ description: 'Returns list of all available/registered permissions' })
  @ApiResponse({
    status: 200,
    type: [PermissionDto],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPermissions() {
    logger.log('CmsController::getPermissions');
    return getPermissions();
  }
}
