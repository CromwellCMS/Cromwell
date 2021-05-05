import {
    setStoreItem,
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
    getCmsEntity,
    getCmsSettings,
    getEmailTemplate,
    getLogger,
    getNodeModuleDir,
    Order,
    OrderRepository,
    PageStats,
    Product,
    ProductRepository,
    ProductReview,
    ProductReviewRepository,
    sendEmail,
    User,
    UserRepository,
} from '@cromwell/core-backend';
import { getCStore } from '@cromwell/core-frontend';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import fs from 'fs-extra';
import { join, resolve } from 'path';
import stream from 'stream';
import { getCustomRepository, getManager } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';
import * as util from 'util';

import { AdvancedCmsConfigDto } from '../dto/advanced-cms-config.dto';
import { CmsConfigUpdateDto } from '../dto/cms-config.update.dto';
import { CmsStatsDto, SalePerDayDto } from '../dto/cms-stats.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderTotalDto } from '../dto/order-total.dto';
import { PageStatsDto } from '../dto/page-stats.dto';
import { themeServiceInst } from './theme.service';

const logger = getLogger('detailed');

export let cmsServiceInst: CmsService;

@Injectable()
export class CmsService {

    constructor() {
        cmsServiceInst = this;
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
            if (await fs.pathExists(fullPath)) return;

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
        if (moduleInfo?.icon) {
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

        if (moduleInfo?.previewImage) {
            // Read image and convert to base64
            const moduleDir = await getNodeModuleDir(moduleName);
            if (moduleDir) {
                const imgPath = resolve(moduleDir, moduleInfo.previewImage);
                if (await fs.pathExists(imgPath)) {
                    const data = (await fs.readFile(imgPath))?.toString('base64');
                    if (data) moduleInfo.previewImage = data;
                }
            }
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

    public async updateCmsConfig(input: CmsConfigUpdateDto): Promise<AdvancedCmsConfigDto | undefined> {
        const entity = await getCmsEntity();
        if (!entity) throw new Error('!entity');

        entity.protocol = input.protocol;
        entity.defaultPageSize = input.defaultPageSize;
        entity.currencies = input.currencies;
        entity.timezone = input.timezone;
        entity.language = input.language;
        entity.favicon = input.favicon;
        entity.logo = input.logo;
        entity.headerHtml = input.headerHtml;
        entity.footerHtml = input.footerHtml;
        entity.defaultShippingPrice = input.defaultShippingPrice;
        entity.smtpConnectionString = input.smtpConnectionString;
        entity.sendFromEmail = input.sendFromEmail;

        await entity.save();
        const config = await getCmsSettings();
        if (config)
            return new AdvancedCmsConfigDto().parseConfig(config);
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
        const { themeConfig } = await themeServiceInst.readConfigs();
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

                const compiledEmail = await getEmailTemplate('order', mailProps)
                if (compiledEmail)
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
        const pageStatsTable = 'page_stats';
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
            stats.reviews = reviewsStats?.[0]?.[reviewsCountKey];
        }

        const getOrders = async () => {
            const ordersStats = await getManager().createQueryBuilder(Order, orderTable)
                .select([])
                .addSelect(`SUM(${orderTable}.${totalPriceKey})`, totalPriceKey)
                .addSelect(`COUNT(${orderTable}.id)`, orderCountKey).execute();

            stats.orders = ordersStats?.[0]?.[orderCountKey];
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
                sales.orders = ordersStats?.[0]?.[orderCountKey] ?? 0;
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

            stats.pages = viewsStats?.[0]?.[viewsPagesCountKey];
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

            stats.customers = customersStats?.[0]?.[userCountKey];
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
}

