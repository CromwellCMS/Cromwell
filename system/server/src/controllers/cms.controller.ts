import { TOrder, TPackageCromwellConfig, TProductReview } from '@cromwell/core';
import {
    getCmsSettings,
    getLogger,
    getPublicDir,
    JwtAuthGuard,
    ProductReviewInput,
    ProductReviewRepository,
    Roles,
} from '@cromwell/core-backend';
import {
    Body,
    Controller,
    Get,
    Header,
    HttpException,
    HttpStatus,
    Post,
    Query,
    Req,
    Response,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FastifyReply } from 'fastify';
import fs from 'fs-extra';
import { join } from 'path';
import { Container } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { AdminCmsConfigDto } from '../dto/admin-cms-config.dto';
import { CmsConfigDto } from '../dto/cms-config.dto';
import { CmsStatsDto } from '../dto/cms-stats.dto';
import { CmsStatusDto } from '../dto/cms-status.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ExportOptionsDto } from '../dto/export-options.dto';
import { ModuleInfoDto } from '../dto/module-info.dto';
import { OrderTotalDto } from '../dto/order-total.dto';
import { PageStatsDto } from '../dto/page-stats.dto';
import { SetupDto } from '../dto/setup.dto';
import { publicSystemDirs } from '../helpers/constants';
import { serverFireAction } from '../helpers/serverFireAction';
import { CmsService } from '../services/cms.service';
import { MigrationService } from '../services/migration.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';

const logger = getLogger();

@ApiBearerAuth()
@ApiTags('CMS')
@Controller('v1/cms')
export class CmsController {

    private get pluginService() {
        return Container.get(PluginService);
    }

    constructor(
        private readonly cmsService: CmsService,
        private readonly themeService: ThemeService,
        private readonly migrationService: MigrationService,
    ) { }

    @Get('settings')
    @ApiOperation({ description: 'Returns public CMS settings from DB and cmsconfig.json' })
    @ApiResponse({
        status: 200,
        type: CmsConfigDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getConfig(): Promise<CmsConfigDto | undefined> {
        // logger.log('CmsController::getConfig');
        const config = await getCmsSettings();
        if (!config) {
            throw new HttpException('CmsController::getConfig Failed to read CMS Config', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new CmsConfigDto().parseConfig(config);
    }


    @Get('admin-settings')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
    @ApiOperation({ description: 'Returns admin CMS settings from DB and cmsconfig.json' })
    @ApiResponse({
        status: 200,
        type: AdminCmsConfigDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getAdminConfig(): Promise<AdminCmsConfigDto | undefined> {
        // logger.log('CmsController::getPrivateConfig');
        return this.cmsService.getAdminConfig();
    }


    @Post('admin-settings')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: 'Updates CMS config',
    })
    @ApiBody({ type: AdminCmsConfigDto })
    @ApiResponse({
        status: 200,
        type: AdminCmsConfigDto,
    })
    async updateCmsSettings(@Body() input: AdminCmsConfigDto): Promise<AdminCmsConfigDto | undefined> {
        return this.cmsService.updateCmsSettings(input);
    }


    @Get('themes')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
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
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
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
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
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
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
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
        logger.log('CmsController::createDir');
        if (publicSystemDirs.includes(dirName)) return false;

        const fullPath = join(getPublicDir(), inPath ?? '', dirName);
        if (await fs.pathExists(fullPath)) return false;
        await fs.mkdir(fullPath);
        return true;
    }


    @Get('remove-public-dir')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
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
        logger.log('CmsController::removeDir');
        if (publicSystemDirs.includes(dirName)) return false;

        const fullPath = join(getPublicDir(), inPath ?? '', dirName);
        if (! await fs.pathExists(fullPath)) return false;
        await fs.remove(fullPath);
        return true;
    }


    @Post('upload-public-file')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
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
        @Req() req: any): Promise<string> {
        logger.log('CmsController::uploadFile');
        const fullPath = join(getPublicDir(), inPath ?? '');

        await this.cmsService.uploadFile(req, fullPath)
        return 'true';
    }


    @Get('download-public-file')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
    @ApiOperation({
        description: 'Downloads a file from specified subfolder of "public" files',
        parameters: [
            { name: 'inPath', in: 'query' },
            { name: 'fileName', in: 'query' }]
    })
    @ApiResponse({
        status: 200,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async downloadFile(@Query('inPath') inPath: string, @Query('fileName') fileName: string,
        @Req() req: any, @Response() response: FastifyReply) {
        logger.log('CmsController::downloadFile');
        const fullPath = join(getPublicDir(), inPath ?? '', fileName);

        if (! await fs.pathExists(fullPath)) {
            response.code(404).send({ message: 'File not found' });
            return;
        }
        if (!(await fs.lstat(fullPath)).isFile()) {
            response.code(423).send({ message: 'Not a file' });
            return;
        }

        try {
            const readStream = fs.createReadStream(fullPath);
            response.type('text/html').send(readStream);
        } catch (error) {
            logger.error(error);
            response.code(500).send({ message: error + '' });
        }
    }


    @Post('set-up')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiBody({ type: SetupDto })
    @ApiOperation({
        description: 'Configure CMS after first launch',
    })
    async setUp(@Body() input: SetupDto) {
        const config = await getCmsSettings();
        if (!config) {
            throw new HttpException('CmsController::setUp Failed to read CMS Config', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (config.installed)
            throw new HttpException('CmsController::setUp CMS already installed', HttpStatus.BAD_REQUEST);

        return await this.cmsService.installCms(input);
    }


    @Get('change-theme')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Makes specified theme as active one and restarts Renderer`,
        parameters: [{ name: 'themeName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async setActiveTheme(@Query('themeName') themeName: string): Promise<boolean> {
        logger.log('CmsController::setActiveTheme');
        if (!themeName || themeName === '')
            throw new HttpException(`Invalid theme name: ${themeName}`, HttpStatus.NOT_ACCEPTABLE);

        return this.themeService.setActive(themeName);
    }


    @Get('activate-theme')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Activates/enables (installs in DB) downloaded theme. Does NOT make it as currently used by Renderer. See "change-theme"`,
        parameters: [{ name: 'themeName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async activateTheme(@Query('themeName') themeName: string): Promise<boolean> {
        logger.log('CmsController::activateTheme');
        if (!themeName || themeName === '')
            throw new HttpException(`Invalid theme name: ${themeName}`, HttpStatus.NOT_ACCEPTABLE);

        return this.themeService.activateTheme(themeName);
    }


    @Get('activate-plugin')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: 'Activates downloaded plugin.',
        parameters: [{ name: 'pluginName', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async activatePlugin(@Query('pluginName') pluginName: string): Promise<boolean> {
        logger.log('PluginController::activatePlugin');
        if (!pluginName || pluginName === '')
            throw new HttpException(`Invalid plugin name: ${pluginName}`, HttpStatus.NOT_ACCEPTABLE);

        return this.pluginService.activatePlugin(pluginName);
    }


    @Post('get-order-total')
    @UseGuards(ThrottlerGuard)
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

        return this.cmsService.calcOrderTotal(input);
    }


    @Post('create-payment-session')
    @UseGuards(ThrottlerGuard)
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
        return this.cmsService.createPaymentSession(input);
    }


    @Post('place-order')
    @UseGuards(ThrottlerGuard)
    @Throttle(3, 20)
    @ApiOperation({
        description: 'Creates new Order in the shop',
    })
    @ApiBody({ type: CreateOrderDto })
    @ApiResponse({
        status: 200,
    })
    async placeOrder(@Body() input: CreateOrderDto): Promise<TOrder | undefined> {
        if (!input || !input.customerEmail
            || !input.customerPhone) throw new HttpException('Order form is incomplete', HttpStatus.NOT_ACCEPTABLE);

        const order = await this.cmsService.placeOrder(input);
        serverFireAction('create_order', order);
        return order;
    }


    @Post('place-product-review')
    @UseGuards(ThrottlerGuard)
    @Throttle(2, 20)
    @ApiOperation({
        description: 'Creates new Review for a product in the shop',
    })
    @ApiBody({ type: ProductReviewInput })
    @ApiResponse({
        status: 200,
    })
    async placeProductReview(@Body() input: ProductReviewInput): Promise<TProductReview> {
        if (!input || !input.productId
            || !(input.description || input.rating) || input.approved) throw new HttpException('Review form is incomplete', HttpStatus.NOT_ACCEPTABLE);

        const review = await getCustomRepository(ProductReviewRepository).createProductReview(input);
        serverFireAction('create_product_review', review);
        return review;
    }


    @Post('view-page')
    @UseGuards(ThrottlerGuard)
    @Throttle(5, 1)
    @ApiOperation({
        description: `Increments views number for a page in page_stats table`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiBody({ type: PageStatsDto })
    @ApiResponse({
        status: 200
    })
    async viewPage(@Body() input: PageStatsDto): Promise<boolean> {
        if (!input?.pageRoute || input.pageRoute === '')
            throw new HttpException("pageRoute is not valid", HttpStatus.NOT_ACCEPTABLE);

        await this.cmsService.viewPage(input);
        return true;
    }


    @Get('stats')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
    @ApiOperation({
        description: `Returns CMS stats for AdminPanel dashboard`,
    })
    @ApiResponse({
        status: 200,
        type: CmsStatsDto,
    })
    async getStats(): Promise<CmsStatsDto> {
        return this.cmsService.getCmsStats();
    }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
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
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
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
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
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
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: 'Import DB from Excel files',
    })
    @ApiResponse({
        status: 200,
    })
    async importDB(@Req() req: any) {
        try {
            await this.migrationService.importDB(req);
        } catch (error) {
            logger.error(error);
            throw new HttpException(String(error), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Get('build-sitemap')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({ description: 'Builds sitemap at /default_sitemap.xml' })
    @ApiResponse({
        status: 200,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async buildSitemap() {
        logger.log('CmsController::buildSitemap');
        return this.cmsService.buildSitemap();
    }
}