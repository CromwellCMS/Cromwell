import { TDeleteManyInput, TOrder, TOrderInput, TPagedList, TPagedParams } from '@cromwell/core';
import sanitizeHtml from 'sanitize-html';
import { DeleteQueryBuilder, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';

import { OrderFilterInput } from '../entities/filter/OrderFilterInput';
import { Order } from '../entities/Order';
import { getLogger } from '../helpers/constants';
import { validateEmail } from '../helpers/validation';
import { PagedParamsInput } from './../inputs/PagedParamsInput';
import { checkEntitySlug, getPaged, handleBaseInput } from './BaseQueries';
import { BaseRepository } from './BaseRepository';

const logger = getLogger('detailed');

@EntityRepository(Order)
export class OrderRepository extends BaseRepository<Order> {

    constructor() {
        super(Order)
    }

    async getOrders(params?: TPagedParams<TOrder>): Promise<TPagedList<Order>> {
        logger.log('OrderRepository::getOrders');
        return this.getPaged(params)
    }

    async getOrderById(id: string): Promise<Order | undefined> {
        logger.log('OrderRepository::getOrderById id: ' + id);
        return this.getById(id);
    }

    async getOrderBySlug(slug: string): Promise<Order | undefined> {
        logger.log('OrderRepository::getOrderBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    private async handleBaseOrderInput(order: Order, input: TOrderInput) {
        if (input.customerEmail && !validateEmail(input.customerEmail))
            throw new Error('Provided e-mail is not valid');

        handleBaseInput(order, input);

        order.status = input.status;
        order.cart = Array.isArray(input.cart) ? JSON.stringify(input.cart) : input.cart;
        order.orderTotalPrice = input.orderTotalPrice;
        order.cartTotalPrice = input.cartTotalPrice;
        order.cartOldTotalPrice = input.cartOldTotalPrice;
        order.shippingPrice = input.shippingPrice;
        order.totalQnt = input.totalQnt;
        order.userId = input.userId;
        order.customerName = input.customerName;
        order.customerPhone = input.customerPhone?.replace(/\W/g, '');
        order.customerEmail = input.customerEmail;
        order.customerAddress = input.customerAddress;
        order.customerComment = input.customerComment ? sanitizeHtml(input.customerComment, {
            allowedTags: []
        }) : undefined;
        order.shippingMethod = input.shippingMethod;
    }

    async createOrder(inputData: TOrderInput): Promise<Order> {
        logger.log('OrderRepository::createOrder');
        let order = new Order();

        await this.handleBaseOrderInput(order, inputData);
        order = await this.save(order);
        await checkEntitySlug(order, Order);

        return order;
    }

    async updateOrder(id: string, inputData: TOrderInput): Promise<Order | undefined> {
        logger.log('OrderRepository::updateOrder id: ' + id);

        let order = await this.findOne({
            where: { id }
        });
        if (!order) throw new Error(`Order ${id} not found!`);

        await this.handleBaseOrderInput(order, inputData);
        order = await this.save(order);
        await checkEntitySlug(order, Order);

        return order;
    }

    async deleteOrder(id: string): Promise<boolean> {
        logger.log('OrderRepository::deleteOrder; id: ' + id);

        const order = await this.getOrderById(id);
        if (!order) {
            logger.log('OrderRepository::deleteOrder failed to find Order by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

    applyOrderFilter(qb: SelectQueryBuilder<TOrder> | DeleteQueryBuilder<TOrder>, filterParams?: OrderFilterInput) {
        // Search by status
        if (filterParams?.status && filterParams.status !== '') {
            const query = `"${this.metadata.tablePath}".status = :statusSearch`;
            qb.andWhere(query, { statusSearch: filterParams.status });
        }

        // Search by orderId
        if (filterParams?.orderId && filterParams.orderId !== '') {
            const query = `"${this.metadata.tablePath}".id = :orderId`;
            qb.andWhere(query, { orderId: filterParams.orderId });
        }

        // Search by customerName
        if (filterParams?.customerName && filterParams.customerName !== '') {
            const customerNameSearch = `%${filterParams.customerName}%`;
            const query = `"${this.metadata.tablePath}".customerName LIKE :customerNameSearch`;
            qb.andWhere(query, { customerNameSearch });
        }

        // Search by customerPhone
        if (filterParams?.customerPhone && filterParams.customerPhone !== '') {
            const customerPhone = filterParams.customerPhone.replace(/\W/g, '');
            const customerPhoneSearch = `%${customerPhone}%`;
            const query = `"${this.metadata.tablePath}".customerPhone LIKE :customerPhoneSearch`;
            qb.andWhere(query, { customerPhoneSearch });
        }

        // Search by customerEmail
        if (filterParams?.customerEmail && filterParams.customerEmail !== '') {
            const customerEmailSearch = `%${filterParams.customerEmail}%`;
            const query = `"${this.metadata.tablePath}".customerEmail LIKE :customerEmailSearch`;
            qb.andWhere(query, { customerEmailSearch });
        }

        // Search by create date
        if (filterParams?.dateFrom && filterParams.dateFrom !== '') {
            const dateFrom = new Date(Date.parse(filterParams.dateFrom));
            const dateTo = new Date(filterParams.dateTo ? Date.parse(filterParams.dateTo) : Date.now());

            const query = `"${this.metadata.tablePath}".createDate BETWEEN :dateFrom AND :dateTo`;
            qb.andWhere(query, {
                dateFrom: DateUtils.mixedDateToDatetimeString(dateFrom),
                dateTo: DateUtils.mixedDateToDatetimeString(dateTo),
            });
        }
    }

    async getFilteredOrders(pagedParams?: PagedParamsInput<TOrder>, filterParams?: OrderFilterInput): Promise<TPagedList<TOrder>> {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyOrderFilter(qb, filterParams);
        return await getPaged<TOrder>(qb, this.metadata.tablePath, pagedParams);
    }


    async deleteManyFilteredOrders(input: TDeleteManyInput, filterParams?: OrderFilterInput): Promise<boolean | undefined> {
        const qb = this.createQueryBuilder()
            .delete().from<Order>(this.metadata.tablePath);

        this.applyOrderFilter(qb, filterParams);
        this.applyDeletMany(qb, input);
        try {
            await qb.execute();
        } catch (e) {
            logger.error(e)
        }
        return true;
    }

}