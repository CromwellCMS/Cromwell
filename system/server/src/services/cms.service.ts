import {
    getStoreItem,
    setStoreItem,
    TCmsConfig,
    TCmsSettings,
    TOrder,
    TPackageCromwellConfig,
    TProductReview,
    TUser,
    TUserRole,
} from '@cromwell/core';
import {
    applyGetPaged,
    getCmsEntity,
    getLogger,
    getNodeModuleDir,
    Order,
    OrderRepository,
    PageStats,
    Product,
    ProductReview,
    ProductReviewRepository,
    readCMSConfig,
    serverLogFor,
    User,
    UserRepository,
} from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import nodemailer from 'nodemailer';
import { join, resolve } from 'path';
import stream from 'stream';
import { getCustomRepository, getManager } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';
import * as util from 'util';

import { AdvancedCmsConfigDto } from '../dto/advanced-cms-config.dto';
import { CmsConfigUpdateDto } from '../dto/cms-config.update.dto';
import { CmsStatsDto, SalePerDayDto } from '../dto/cms-stats.dto';
import { PageStatsDto } from '../dto/page-stats.dto';
import { GenericCms } from '../helpers/genericEntities';

const logger = getLogger('detailed');
let nodemailerTransporter;
let sendmailTransporter;

// Don't re-read cmsconfig.json but update info from DB
export const getCmsSettings = async (): Promise<TCmsSettings | undefined> => {
    let config: TCmsConfig | undefined = undefined;
    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) config = await readCMSConfig();

    if (!cmsSettings && !config) {
        serverLogFor('errors-only', 'getCmsSettings: Failed to read CMS config', 'Error');
        return;
    }
    const entity = await getCmsEntity();

    const settings: TCmsSettings = Object.assign({}, cmsSettings,
        config, JSON.parse(JSON.stringify(entity)), { currencies: entity.currencies });

    delete settings.defaultSettings;
    delete (settings as any)._currencies;

    setStoreItem('cmsSettings', settings);
    return settings;
}

@Injectable()
export class CmsService {

    public getSettings = getCmsSettings;

    public async setThemeName(themeName: string) {
        const entity = await getCmsEntity();
        if (entity) {
            entity.themeName = themeName;
            const cmsRepo = getCustomRepository(GenericCms.repository);
            await cmsRepo.save(entity);
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
            return false;
        }

        cmsEntity.installed = true;
        const cmsRepo = getCustomRepository(GenericCms.repository);
        await cmsRepo.save(cmsEntity);

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
        const config = await this.getSettings();
        if (config)
            return new AdvancedCmsConfigDto().parseConfig(config);
    }

    async sendEmail(addresses: string[], subject: string, htmlContent: string,): Promise<boolean> {
        const cmsSettings = getStoreItem('cmsSettings');

        const sendFrom = (cmsSettings?.sendFromEmail && cmsSettings.sendFromEmail !== '') ? cmsSettings.sendFromEmail : 'Service@CromwellCMS.com';
        const messageContent = {
            from: sendFrom,
            to: addresses.join(', '),
            subject: subject,
            html: htmlContent,
        };

        // Define sender service.
        // If SMTP connection string provided, use nodemailer
        if (cmsSettings?.smtpConnectionString && cmsSettings.smtpConnectionString !== '') {
            if (!nodemailerTransporter) {
                nodemailerTransporter = nodemailer.createTransport(cmsSettings.smtpConnectionString);
            }
            try {
                await nodemailerTransporter.sendMail(messageContent);
                return true;
            } catch (e) {
                logger.error(e);
                return false;
            }

        } else {
            // Otherwise use local SMTP client via sendmail

            if (!sendmailTransporter) {
                sendmailTransporter = require('sendmail')({
                    logger: {
                        debug: logger.log,
                        info: logger.info,
                        warn: logger.warn,
                        error: logger.error
                    },
                    silent: false,
                })
            }
            return new Promise(done => {
                sendmailTransporter(messageContent, (err, reply) => {
                    logger.log(reply);
                    if (err)
                        logger.error(err && err.stack);
                    err ? done(false) : done(true);
                });
            })

        }
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

