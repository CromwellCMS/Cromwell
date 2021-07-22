import {
    getRandStr,
    setStoreItem,
    sleep,
    TCCSVersion,
    TOrder,
    TOrderInput,
    TPackageCromwellConfig,
    TProductReview,
    TStoreListItem,
    TUser,
    TUserRole,
} from '@cromwell/core';
import {
    applyGetPaged,
    AttributeRepository,
    cmsPackageName,
    getCmsEntity,
    getCmsModuleInfo,
    getCmsSettings,
    getEmailTemplate,
    getLogger,
    getModulePackage,
    getNodeModuleDir,
    Order,
    OrderRepository,
    PageStats,
    PageStatsRepository,
    Product,
    ProductRepository,
    ProductReview,
    ProductReviewRepository,
    readCmsModules,
    runShellCommand,
    sendEmail,
    User,
    UserRepository,
} from '@cromwell/core-backend';
import { getCentralServerClient, getCStore } from '@cromwell/core-frontend';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import fs from 'fs-extra';
import { join, resolve } from 'path';
import stream from 'stream';
import { Container, Service } from 'typedi';
import { getConnection, getCustomRepository, getManager } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';
import * as util from 'util';

import { AdminCmsConfigDto } from '../dto/admin-cms-config.dto';
import { CmsConfigUpdateDto } from '../dto/cms-config.update.dto';
import { CmsStatsDto, SalePerDayDto } from '../dto/cms-stats.dto';
import { CmsStatusDto } from '../dto/cms-status.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderTotalDto } from '../dto/order-total.dto';
import { PageStatsDto } from '../dto/page-stats.dto';
import { childSendMessage } from '../helpers/serverManager';
import { endTransaction, restartService, setPendingKill, startTransaction } from '../helpers/stateManager';
import { PluginService } from './plugin.service';
import { ThemeService } from './theme.service';

const logger = getLogger();


@Injectable()
@Service()
export class CmsService {

    private get pluginService() {
        return Container.get(PluginService);
    }

    private get themeService() {
        return Container.get(ThemeService);
    }

    constructor() {
        this.init();
    }

    private async init() {
        await sleep(1);
        if (!getConnection()?.isConnected) return;

        if (await this.getIsUpdating()) {
            // Limit updating time in case if previous server instance
            // crashed and was unable to set isUpdating to false
            setTimeout(async () => {
                if (await this.getIsUpdating()) {
                    logger.error('Server: CMS is still updating after minute of running a new server instance. Setting isUpdating to false');
                    await this.setIsUpdating(false);
                }
            }, 60000);
        }
    }

    private async setIsUpdating(updating: boolean) {
        const entity = await getCmsEntity();
        entity.isUpdating = updating;
        await entity.save();
    }

    private async getIsUpdating() {
        return (await getCmsEntity()).isUpdating;
    }

    public async setThemeName(themeName: string) {
        const entity = await getCmsEntity();
        if (entity) {
            entity.themeName = themeName;
            await entity.save();
            return true;
        }
        return false;
    }

    async uploadFile(req: any, dirName: string): Promise<any> {
        //Check request is multipart
        if (!req.isMultipart()) {
            return
        }

        const handler = async (field: string, file: any, filename: string): Promise<void> => {
            const fullPath = join(`${dirName}/${filename}`);
            if (await fs.pathExists(fullPath)) {
                await fs.remove(fullPath);
                await sleep(0.1);
            }

            const pipeline = util.promisify(stream.pipeline);
            const writeStream = fs.createWriteStream(fullPath); //File path
            try {
                await pipeline(file, writeStream);
            } catch (err) {
                logger.error('Pipeline failed', err);
            }
        }

        const mp = await req.multipart(handler, (err) => {
            logger.error(err);
        });
        // for key value pairs in request
        mp.on('field', function (key: any, value: any) {
            logger.log('form-data', key, value);
        });
    }


    public async parseModuleConfigImages(moduleInfo: TPackageCromwellConfig, moduleName: string) {
        if (!moduleInfo) return;

        if (moduleInfo.icon) {
            const moduleDir = await getNodeModuleDir(moduleName);
            // Read icon and convert to base64
            if (moduleDir) {
                const imgPath = resolve(moduleDir, moduleInfo?.icon);
                if (await fs.pathExists(imgPath)) {
                    const data = (await fs.readFile(imgPath))?.toString('base64');
                    if (data) moduleInfo.icon = data;
                }
            }
        }

        if (!moduleInfo.images) moduleInfo.images = [];

        if (moduleInfo.image) {
            // Read image and convert to base64
            const moduleDir = await getNodeModuleDir(moduleName);
            if (moduleDir) {
                const imgPath = resolve(moduleDir, moduleInfo.image);
                if (await fs.pathExists(imgPath)) {
                    const data = (await fs.readFile(imgPath))?.toString('base64');
                    if (data) moduleInfo.image = data;
                }
            }

            if (!moduleInfo.images.includes(moduleInfo.image))
                moduleInfo.images.push(moduleInfo.image);
        }
    }

    public async installCms() {
        const cmsEntity = await getCmsEntity();
        if (cmsEntity.installed) {
            logger.error('CMS already installed');
            throw new HttpException('CMS already installed', HttpStatus.FORBIDDEN);
        }

        cmsEntity.installed = true;
        await cmsEntity.save();

        const settings = await getCmsSettings();
        if (settings) {
            setStoreItem('cmsSettings', settings)
        }

        return true;
    }

    public async readPlugins(): Promise<TPackageCromwellConfig[]> {
        const out: TPackageCromwellConfig[] = [];

        const pluginModules = (await readCmsModules()).plugins;

        for (const pluginName of pluginModules) {
            const moduleInfo = await getCmsModuleInfo(pluginName);
            delete moduleInfo?.frontendDependencies;
            delete moduleInfo?.bundledDependencies;
            delete moduleInfo?.firstLoadedDependencies;

            if (moduleInfo) {
                await this.parseModuleConfigImages(moduleInfo, pluginName);
                out.push(moduleInfo);
            }
        }
        return out;
    }

    public async readThemes(): Promise<TPackageCromwellConfig[]> {
        const out: TPackageCromwellConfig[] = [];

        const themeModuleNames = (await readCmsModules()).themes;

        for (const themeName of themeModuleNames) {
            const moduleInfo = await getCmsModuleInfo(themeName);

            if (moduleInfo) {
                delete moduleInfo.frontendDependencies;
                delete moduleInfo.bundledDependencies;
                delete moduleInfo.firstLoadedDependencies;

                await this.parseModuleConfigImages(moduleInfo, themeName);
                out.push(moduleInfo);
            }
        }
        return out;
    }

    public async updateCmsConfig(input: CmsConfigUpdateDto): Promise<AdminCmsConfigDto | undefined> {
        const entity = await getCmsEntity();
        if (!entity) throw new Error('!entity');

        if (typeof input.currencies === 'string') {
            try {
                input.currencies = JSON.parse(input.currencies);
            } catch (error) {
                logger.error(error);
            }
        }

        entity.defaultPageSize = input.defaultPageSize;
        entity.currencies = input.currencies;
        entity.timezone = input.timezone;
        entity.language = input.language;
        entity.favicon = input.favicon;
        entity.logo = input.logo;
        entity.headHtml = input.headHtml;
        entity.footerHtml = input.footerHtml;
        entity.defaultShippingPrice = input.defaultShippingPrice;
        entity.smtpConnectionString = input.smtpConnectionString;
        entity.sendFromEmail = input.sendFromEmail;

        await entity.save();
        const config = await getCmsSettings();
        if (config)
            return new AdminCmsConfigDto().parseConfig(config);
    }

    async viewPage(input: PageStatsDto) {
        if (!input?.pageRoute || input.pageRoute === '') return;

        const page = await getManager().findOne(PageStats, {
            where: {
                pageRoute: input.pageRoute
            }
        });
        if (page) {
            if (!page.views) page.views = 0;
            page.views++;
            await page.save();
        } else {
            const newPage = new PageStats();
            newPage.pageRoute = input.pageRoute;

            newPage.productSlug = input.productSlug;
            newPage.categorySlug = input.categorySlug;
            newPage.postSlug = input.postSlug;
            newPage.tagSlug = input.tagSlug;

            newPage.views = 1;
            await newPage.save();
        }
    }

    async placeOrder(input: CreateOrderDto): Promise<TOrder | undefined> {
        const orderTotal = await this.calcOrderTotal(input);
        const settings = await getCmsSettings();
        const { themeConfig } = await this.themeService.readConfigs();
        let cart: TStoreListItem[] | undefined;
        try {
            if (input.cart) cart = JSON.parse(input.cart);
        } catch (error) {
            logger.error('placeOrder: Failed to parse cart', error)
        }

        const createOrder: TOrderInput = {
            cartOldTotalPrice: orderTotal.cartOldTotalPrice,
            cartTotalPrice: orderTotal.cartTotalPrice,
            totalQnt: orderTotal.totalQnt,
            shippingPrice: orderTotal.shippingPrice,
            orderTotalPrice: orderTotal.orderTotalPrice,
            cart: input.cart,
            status: input.status,
            userId: input.userId,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail,
            customerAddress: input.customerAddress,
            customerComment: input.customerComment,
            shippingMethod: input.shippingMethod,
            fromUrl: input.fromUrl,
        }

        const fromUrl = input.fromUrl;

        // < Send e-mail >
        try {

            if (input.customerEmail && fromUrl) {
                const mailProps = {
                    createDate: format(new Date(Date.now()), 'd MMMM yyyy'),
                    logoUrl: (settings?.logo) && fromUrl + '/' + settings.logo,
                    orderLink: (themeConfig?.defaultPages?.account) && fromUrl + '/' + themeConfig.defaultPages.account,
                    totalPrice: getCStore().getPriceWithCurrency(orderTotal.orderTotalPrice),
                    unsubscribeUrl: fromUrl,
                    products: (cart ?? []).map(item => {
                        return {
                            link: (themeConfig?.defaultPages?.product && item?.product?.slug) &&
                                fromUrl + '/' + themeConfig.defaultPages.product.replace('[slug]', item.product.slug),
                            title: `${item?.amount ? item.amount + ' x ' : ''}${item?.product?.name ?? ''}`,
                            price: getCStore().getPriceWithCurrency((item.product?.price ?? 0) * (item.amount ?? 1)),
                        }
                    }),
                    shippingPrice: getCStore().getPriceWithCurrency(orderTotal.shippingPrice),
                }

                const compiledEmail = await getEmailTemplate('order.hbs', mailProps);
                if (!compiledEmail) {
                    logger.error('order.hbs template was not found');
                    throw new HttpException('order.hbs template was not found', HttpStatus.INTERNAL_SERVER_ERROR);
                }

                await sendEmail([input.customerEmail], 'Order', compiledEmail);
            }

        } catch (error) {
            logger.error(error);
        }
        // < / Send e-mail >

        return getCustomRepository(OrderRepository).createOrder(createOrder);
    }

    async calcOrderTotal(input: CreateOrderDto): Promise<OrderTotalDto> {
        const orderTotal = new OrderTotalDto();
        let cart: TStoreListItem[] | undefined;
        try {
            if (input.cart) cart = JSON.parse(input.cart);
        } catch (error) {
            logger.error('placeOrder: Failed to parse cart', error);
        }
        if (typeof cart !== 'object') return orderTotal;

        const settings = await getCmsSettings();

        const cstore = getCStore(true, {
            getProductById: (id) => getCustomRepository(ProductRepository).getProductById(id),
            getAttributes: () => getCustomRepository(AttributeRepository).getAttributes(),
        });

        cstore.saveCart(cart);
        await cstore.updateCart();
        const total = cstore.getCartTotal();

        orderTotal.cartOldTotalPrice = total.totalOld;
        orderTotal.cartTotalPrice = total.total ?? 0;
        orderTotal.totalQnt = total.amount;
        orderTotal.shippingPrice = settings?.defaultShippingPrice ?? 0;
        orderTotal.orderTotalPrice = (orderTotal?.cartTotalPrice ?? 0) + (orderTotal?.shippingPrice ?? 0);
        return orderTotal;
    }

    async getCmsStats(): Promise<CmsStatsDto> {
        const stats = new CmsStatsDto();

        // Reviews
        const reviewsCountKey: keyof Product = 'reviewsCount';
        const averageKey: keyof Product = 'averageRating';
        const ratingKey: keyof TProductReview = 'rating';
        const reviewTable = getCustomRepository(ProductReviewRepository).metadata.tablePath;

        // Orders
        const orderTable = getCustomRepository(OrderRepository).metadata.tablePath;
        const totalPriceKey: keyof TOrder = 'orderTotalPrice';
        const orderCountKey = 'orderCount';
        const days = 7;

        // Page stats 
        const pageStatsTable = getCustomRepository(PageStatsRepository).metadata.tablePath;
        const viewsPagesCountKey = 'viewsPagesCount';
        const viewsSumKey: keyof PageStats = 'views';

        // Customers
        const userCountKey = 'userCount';
        const userRoleKey: keyof TUser = 'role';
        const userTable = getCustomRepository(UserRepository).metadata.tablePath;


        const getReviews = async () => {
            const reviewsStats = await getManager().createQueryBuilder(ProductReview, reviewTable)
                .select([])
                .addSelect(`AVG(${reviewTable}.${ratingKey})`, averageKey)
                .addSelect(`COUNT(${reviewTable}.id)`, reviewsCountKey).execute();

            stats.averageRating = reviewsStats?.[0]?.[averageKey];
            stats.reviews = parseInt((reviewsStats?.[0]?.[reviewsCountKey] ?? 0) + '');
        }

        const getOrders = async () => {
            const ordersStats = await getManager().createQueryBuilder(Order, orderTable)
                .select([])
                .addSelect(`SUM(${orderTable}.${totalPriceKey})`, totalPriceKey)
                .addSelect(`COUNT(${orderTable}.id)`, orderCountKey).execute();

            stats.orders = parseInt((ordersStats?.[0]?.[orderCountKey] ?? 0) + '');
            stats.salesValue = ordersStats?.[0]?.[totalPriceKey];
        }

        const getSalesPerDay = async () => {
            stats.salesPerDay = [];

            for (let i = 0; i < days; i++) {
                const dateFrom = new Date(Date.now());
                dateFrom.setUTCDate(dateFrom.getUTCDate() - i);
                dateFrom.setUTCHours(0);
                dateFrom.setUTCMinutes(0);

                const dateTo = new Date(dateFrom);
                dateTo.setDate(dateTo.getDate() + 1);

                const ordersStats = await getManager().createQueryBuilder(Order, orderTable)
                    .select([])
                    .addSelect(`SUM(${orderTable}.${totalPriceKey})`, totalPriceKey)
                    .addSelect(`COUNT(${orderTable}.id)`, orderCountKey)
                    .where(`${orderTable}.createDate BETWEEN :dateFrom AND :dateTo`, {
                        dateFrom: DateUtils.mixedDateToDatetimeString(dateFrom),
                        dateTo: DateUtils.mixedDateToDatetimeString(dateTo),
                    })
                    .execute();

                const sales = new SalePerDayDto();
                sales.orders = parseInt((ordersStats?.[0]?.[orderCountKey] ?? 0) + '');
                sales.salesValue = ordersStats?.[0]?.[totalPriceKey] ?? 0;
                sales.date = dateFrom;

                stats.salesPerDay.push(sales);
            }
        }

        const getPageViews = async () => {
            const viewsStats = await getManager().createQueryBuilder(PageStats, pageStatsTable)
                .select([])
                .addSelect(`SUM(${pageStatsTable}.${viewsSumKey})`, viewsSumKey)
                .addSelect(`COUNT(${pageStatsTable}.id)`, viewsPagesCountKey).execute();

            stats.pages = parseInt((viewsStats?.[0]?.[viewsPagesCountKey] ?? 0) + '');
            stats.pageViews = viewsStats?.[0]?.[viewsSumKey];
        }

        const getTopPageViews = async () => {
            const viewsStats = await applyGetPaged(
                getManager().createQueryBuilder(PageStats, pageStatsTable).select(), pageStatsTable, {
                order: 'DESC',
                orderBy: 'views',
                pageSize: 15
            }).getMany();

            stats.topPageViews = viewsStats.map(stat => {
                if (stat.pageRoute === 'index') stat.pageRoute = '/';
                if (!stat.pageRoute.startsWith('/')) stat.pageRoute = '/' + stat.pageRoute;
                return {
                    pageRoute: stat.pageRoute,
                    views: stat.views,
                }
            })
        }

        const getCustomers = async () => {
            const customersStats = await getManager().createQueryBuilder(User, userTable)
                .select([])
                .addSelect(`COUNT(${userTable}.id)`, userCountKey)
                .where(`${userTable}.${userRoleKey} = :role`, { role: 'customer' as TUserRole })
                .execute();

            stats.customers = parseInt((customersStats?.[0]?.[userCountKey] ?? 0) + '');
        }

        await Promise.all([
            getReviews(),
            getOrders(),
            getPageViews(),
            getCustomers(),
            getSalesPerDay(),
            getTopPageViews(),
        ]);

        return stats;
    }

    async checkCmsUpdate(): Promise<TCCSVersion | undefined> {
        const settings = await getCmsSettings();
        const cmsPckg = await getModulePackage(cmsPackageName);
        const isBeta = !!settings?.beta;
        try {
            return await getCentralServerClient().checkCmsUpdate(settings?.version ?? cmsPckg?.version ?? '0', isBeta);
        } catch (error) { }
    }

    async getCmsStatus(): Promise<CmsStatusDto> {
        const status = new CmsStatusDto();
        const settings = await getCmsSettings();
        const availableUpdate = await this.checkCmsUpdate();
        status.updateAvailable = !!availableUpdate;
        status.updateInfo = availableUpdate;
        status.isUpdating = settings?.isUpdating;
        status.currentVersion = settings?.version;

        status.notifications = [];

        if (!settings?.smtpConnectionString) {
            status.notifications.push({
                type: 'warning',
                message: 'Setup SMTP settings'
            })
        }

        return status;
    }

    async handleUpdateCms() {
        const transactionId = getRandStr(8);
        startTransaction(transactionId);
        if (await this.getIsUpdating()) return false;
        this.setIsUpdating(true);

        let success = false;
        let error: any;
        try {
            success = await this.updateCms();
        } catch (err) {
            error = err;
        }

        await this.setIsUpdating(false);
        endTransaction(transactionId);

        if (!success) {
            logger.error(error);
            throw new HttpException(error?.message, error?.status);
        }
        return true;
    }

    async updateCms(): Promise<boolean> {
        const availableUpdate = await this.checkCmsUpdate();
        if (!availableUpdate?.packageVersion) throw new HttpException(`Update failed: !availableUpdate?.packageVersion`, HttpStatus.INTERNAL_SERVER_ERROR);
        if (availableUpdate.onlyManualUpdate) throw new HttpException(`Update failed: Cannot launch automatic update. Please update using npm install command and restart CMS`, HttpStatus.FORBIDDEN);

        const pckg = await getModulePackage();
        if (!pckg?.dependencies?.[cmsPackageName])
            throw new HttpException(`Update failed: Could not find ${cmsPackageName} in package.json`, HttpStatus.INTERNAL_SERVER_ERROR);

        const cmsPckgOld = await getModulePackage(cmsPackageName);
        const versionOld = cmsPckgOld?.version;
        if (!versionOld)
            throw new HttpException(`Update failed: Could not find ${cmsPackageName} package`, HttpStatus.INTERNAL_SERVER_ERROR);

        await runShellCommand(`npm install ${cmsPackageName}@${availableUpdate.packageVersion} -S --save-exact`);
        await sleep(1);

        const cmsPckg = await getModulePackage(cmsPackageName);
        if (!cmsPckg?.version || cmsPckg.version !== availableUpdate.packageVersion)
            throw new HttpException(`Update failed: cmsPckg.version !== availableUpdate.packageVersion`, HttpStatus.INTERNAL_SERVER_ERROR);


        const cmsEntity = await getCmsEntity();
        cmsEntity.version = availableUpdate.version;
        await cmsEntity.save();
        await getCmsSettings();

        for (const service of (availableUpdate?.restartServices ?? [])) {
            // Restarts entire service by Manager service
            await restartService(service);
        }
        await sleep(1);

        if ((availableUpdate?.restartServices ?? []).includes('api-server')) {

            // Restart API server by Proxy manager
            const resp1 = await childSendMessage('make-new');
            if (resp1.message !== 'success') {
                // Rollback
                await runShellCommand(`npm install ${cmsPackageName}@${versionOld} -S --save-exact`);
                await sleep(1);

                throw new HttpException('Could not start server after update', HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                const resp2 = await childSendMessage('apply-new', resp1.payload);

                if (resp2.message !== 'success') throw new HttpException('Could not apply new server after update', HttpStatus.INTERNAL_SERVER_ERROR);

                setPendingKill(2000);
            }
        }

        return true;
    }


    async installModuleDependencies(moduleName: string) {
        const pckg = await getModulePackage(moduleName);

        for (const pluginName of (pckg?.cromwell?.plugins ?? [])) {
            const pluginPckg = await getModulePackage(pluginName);
            if (pluginPckg) continue;

            try {
                await this.pluginService.handleInstallPlugin(pluginName);
            } catch (error) {
                logger.error(error);
            }
        }

        for (const themeName of (pckg?.cromwell?.themes ?? [])) {
            const themePckg = await getModulePackage(themeName);
            if (themePckg) continue;

            try {
                await this.themeService.handleInstallTheme(themeName);
            } catch (error) {
                logger.error(error);
            }
        }
    }

}