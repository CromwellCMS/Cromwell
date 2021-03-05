import { TOrder, TOrderInput, TPagedList, TPagedParams } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { Order } from '../entities/Order';
import { getLogger } from '../helpers/constants';
import { checkEntitySlug, handleBaseInput } from './BaseQueries';
import { BaseRepository } from './BaseRepository';

const logger = getLogger('detailed');

@EntityRepository(Order)
export class OrderRepository extends BaseRepository<Order> {

    constructor() {
        super(Order)
    }

    async getOrders(params: TPagedParams<TOrder>): Promise<TPagedList<Order>> {
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
        handleBaseInput(order, input);

        order.status = input.status;
        order.cart = Array.isArray(input.cart) ? JSON.stringify(input.cart) : input.cart;
        order.totalPrice = input.totalPrice;
        order.oldTotalPrice = input.oldTotalPrice;
        order.totalQnt = input.totalQnt;
        order.userId = input.userId;
        order.customerName = input.customerName;
        order.customerPhone = input.customerPhone;
        order.customerAddress = input.customerAddress;
        order.customerComment = input.customerComment;
        order.shippingMethod = input.shippingMethod;
    }

    async createOrder(inputData: TOrderInput): Promise<Order> {
        logger.log('OrderRepository::createOrder');
        let order = new Order();

        await this.handleBaseOrderInput(order, inputData);
        order = await this.save(order);
        await checkEntitySlug(order);

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
        await checkEntitySlug(order);

        return order;
    }

    async deleteOrder(id: string): Promise<boolean> {
        logger.log('OrderRepository::deleteOrder; id: ' + id);

        const order = await this.getOrderById(id);
        if (!order) {
            console.log('OrderRepository::deleteOrder failed to find Order by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

}