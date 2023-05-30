import { resolvePageRoute, TOrder, TProductReview } from '@cromwell/core';
import {
  applyGetPaged,
  Order,
  OrderRepository,
  PageStats,
  PageStatsRepository,
  Product,
  ProductReview,
  ProductReviewRepository,
  RoleRepository,
  User,
  UserRepository,
} from '@cromwell/core-backend';
import { Service } from 'typedi';
import { getCustomRepository, getManager } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';

import { CmsStatsDto, SalePerDayDto } from '../dto/cms-stats.dto';
import { PageStatsDto } from '../dto/page-stats.dto';
import { SystemUsageDto } from '../dto/system-usage.dto';
import { getSysInfo, getSysUsageInfo } from '../helpers/monitor-client';

@Service()
export class StatsService {
  private cpuLoads: {
    time: Date;
    load: number;
  }[] = [];

  async viewPage(input: PageStatsDto) {
    if (!input?.pageRoute) return;

    let page: PageStats | undefined;
    try {
      page = await getManager().findOne(PageStats, {
        where: {
          pageRoute: input.pageRoute,
        },
      });
    } catch (error) {}

    if (page) {
      if (!page.views) page.views = 0;
      page.views++;
      await page.save();
    } else {
      const newPage = new PageStats();
      newPage.pageRoute = input.pageRoute;
      newPage.pageName = input.pageName;
      newPage.slug = input.slug;
      newPage.entityType = input.entityType;
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
    const pageStatsTable = getCustomRepository(PageStatsRepository).metadata.tablePath;
    const viewsPagesCountKey = 'viewsPagesCount';
    const viewsSumKey: keyof PageStats = 'views';

    // Customers
    const userCountKey = 'userCount';
    const userTable = getCustomRepository(UserRepository).metadata.tablePath;
    const roleTable = getCustomRepository(RoleRepository).metadata.tablePath;

    const getReviews = async () => {
      const reviewsStats = await getManager()
        .createQueryBuilder(ProductReview, reviewTable)
        .select([])
        .addSelect(`AVG(${reviewTable}.${ratingKey})`, averageKey)
        .addSelect(`COUNT(${reviewTable}.id)`, reviewsCountKey)
        .execute();

      stats.averageRating = reviewsStats?.[0]?.[averageKey];
      stats.reviews = parseInt((reviewsStats?.[0]?.[reviewsCountKey] ?? 0) + '');
    };

    const getOrders = async () => {
      const ordersStats = await getManager()
        .createQueryBuilder(Order, orderTable)
        .select([])
        .addSelect(`SUM(${orderTable}.${totalPriceKey})`, totalPriceKey)
        .addSelect(`COUNT(${orderTable}.id)`, orderCountKey)
        .execute();

      stats.orders = parseInt((ordersStats?.[0]?.[orderCountKey] ?? 0) + '');
      stats.salesValue = ordersStats?.[0]?.[totalPriceKey];
    };

    const getSalesPerDay = async () => {
      stats.salesPerDay = [];

      for (let i = 0; i < days; i++) {
        const dateFrom = new Date(Date.now());
        dateFrom.setUTCDate(dateFrom.getUTCDate() - i);
        dateFrom.setUTCHours(0);
        dateFrom.setUTCMinutes(0);

        const dateTo = new Date(dateFrom);
        dateTo.setDate(dateTo.getDate() + 1);

        const ordersStats = await getManager()
          .createQueryBuilder(Order, orderTable)
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
    };

    const getPageViews = async () => {
      const viewsStats = await getManager()
        .createQueryBuilder(PageStats, pageStatsTable)
        .select([])
        .addSelect(`SUM(${pageStatsTable}.${viewsSumKey})`, viewsSumKey)
        .addSelect(`COUNT(${pageStatsTable}.id)`, viewsPagesCountKey)
        .execute();

      stats.pages = parseInt((viewsStats?.[0]?.[viewsPagesCountKey] ?? 0) + '');
      stats.pageViews = viewsStats?.[0]?.[viewsSumKey];
    };

    const getTopPageViews = async () => {
      const viewsStats = await applyGetPaged(
        getManager().createQueryBuilder(PageStats, pageStatsTable).select(),
        pageStatsTable,
        {
          order: 'DESC',
          orderBy: 'views',
          pageSize: 15,
        },
      ).getMany();

      stats.topPageViews = await Promise.all(
        viewsStats.map(async (stat) => {
          stat.pageRoute = await resolvePageRoute(stat.pageRoute);
          return {
            pageRoute: stat.pageRoute,
            views: stat.views,
            pageName: stat.pageName,
            slug: stat.slug,
          };
        }),
      );
    };

    const getCustomers = async () => {
      const customersStats = await getManager()
        .createQueryBuilder(User, userTable)
        .select([])
        .addSelect(`COUNT(${userTable}.id)`, userCountKey)
        .leftJoinAndSelect(`${userTable}.roles`, roleTable)
        .where(`${roleTable}.name = :roleName`, { roleName: 'customer' })
        .groupBy(`${roleTable}.id`)
        .execute();

      stats.customers = parseInt((customersStats?.[0]?.[userCountKey] ?? 0) + '');
    };

    await Promise.all([getReviews(), getOrders(), getPageViews(), getCustomers(), getSalesPerDay(), getTopPageViews()]);

    return stats;
  }

  async getSystemUsage(): Promise<SystemUsageDto> {
    const [info, usage] = await Promise.all([getSysInfo(), getSysUsageInfo()]);

    const dto = new SystemUsageDto().parseSysInfo(info).parseSysUsage(usage);

    if (dto.cpuUsage?.currentLoad !== undefined) {
      this.cpuLoads.push({
        load: dto.cpuUsage.currentLoad,
        time: new Date(Date.now()),
      });

      if (this.cpuLoads.length > 30)
        this.cpuLoads = this.cpuLoads.slice(this.cpuLoads.length - 30, this.cpuLoads.length);
    }

    if (dto.cpuUsage) {
      dto.cpuUsage.previousLoads = this.cpuLoads;
    }
    return dto;
  }
}
