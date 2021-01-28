import { DBTableNames, logFor, TPagedList, TProduct } from '@cromwell/core';
import { applyGetManyFromOne, getPaged, PagedParamsInput, Product, ProductRepository } from '@cromwell/core-backend';
import { Arg, Query, Resolver } from 'type-graphql';
import { Brackets, getCustomRepository, SelectQueryBuilder } from 'typeorm';

import { TFilteredList, TFilterMeta, TProductFilter } from '../../types';
import FilteredProduct from '../entities/FilteredProduct';
import ProductFilterInput from '../entities/ProductFilterInput';

@Resolver(Product)
export default class ProductFilterResolver {

    @Query(() => FilteredProduct)
    async getFilteredProductsFromCategory(
        @Arg("categoryId", { nullable: true }) categoryId: string,
        @Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>,
        @Arg("filterParams", { nullable: true }) filterParams: ProductFilterInput
    ): Promise<TFilteredList<TProduct> | undefined> {
        logFor('detailed', 'ProductFilterResolver::getFilteredProductsFromCategory categoryId:' + categoryId + ' pagedParams:' + pagedParams);
        const timestamp = Date.now();
        const productRepo = getCustomRepository(ProductRepository);

        const getQb = (shouldApplyPriceFilter = true): SelectQueryBuilder<Product> => {
            const qb = productRepo.createQueryBuilder(DBTableNames.Product);
            applyGetManyFromOne(qb, DBTableNames.Product, 'categories',
                DBTableNames.ProductCategory, categoryId);

            if (filterParams) {
                this.applyProductFilter(qb, filterParams, shouldApplyPriceFilter);
            }
            return qb;
        }

        const getFilterMeta = async (): Promise<TFilterMeta> => {
            // Get max price
            const qb = getQb(false);

            let [maxPrice, minPrice] = await Promise.all([
                qb.select(`MAX(${DBTableNames.Product}.price)`, "maxPrice").getRawOne().then(res => res?.maxPrice),
                qb.select(`MIN(${DBTableNames.Product}.price)`, "minPrice").getRawOne().then(res => res?.minPrice)
            ]);
            if (maxPrice && typeof maxPrice === 'string') maxPrice = parseInt(maxPrice);
            if (minPrice && typeof minPrice === 'string') minPrice = parseInt(minPrice);

            return {
                minPrice, maxPrice
            }
        }

        const getElements = async (): Promise<TPagedList<TProduct>> => {
            const qb = getQb();
            return productRepo.applyAndGetPagedProducts(qb, pagedParams);
        }

        const [filterMeta, paged] = await Promise.all([getFilterMeta(), getElements()]);

        const timestamp2 = Date.now();
        logFor('detailed', 'ProductFilterResolver::getFilteredProductsFromCategory time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        const filtered: TFilteredList<TProduct> = {
            ...paged,
            filterMeta
        }
        return filtered;
    }

    private applyProductFilter(qb: SelectQueryBuilder<TProduct>, filterParams: TProductFilter, shouldApplyPriceFilter = true) {
        let isFirstAttr = true;

        const qbAddWhere: typeof qb.where = (where, params) => {
            if (isFirstAttr) {
                isFirstAttr = false;
                return qb.where(where, params);
            } else {
                return qb.andWhere(where as any, params);
            }
        }

        // // Improper filter via LIKE operator (won't work with attributes that have intersections in values)
        if (filterParams.attributes) {
            filterParams.attributes.forEach(attr => {
                if (attr.values.length > 0) {
                    const brackets = new Brackets(subQb => {
                        let isFirstVal = true;
                        attr.values.forEach(val => {
                            const likeStr = `%{"key":"${attr.key}","values":[%{"value":"${val}"%]}%`;
                            const valKey = `${attr.key}_${val}`;
                            const query = `${DBTableNames.Product}.attributesJSON LIKE :${valKey}`;
                            if (isFirstVal) {
                                isFirstVal = false;
                                subQb.where(query, { [valKey]: likeStr });
                            } else {
                                subQb.orWhere(query, { [valKey]: likeStr });
                            }
                        })
                    });
                    qbAddWhere(brackets);
                }
            });
        }

        if (filterParams.nameSearch && filterParams.nameSearch !== '') {
            const likeStr = `%${filterParams.nameSearch}%`;
            const query = `${DBTableNames.Product}.name LIKE :likeStr`;
            qbAddWhere(query, { likeStr });
        }

        // // Attempt to make a proper json filtration for SQLite. Isn't finished. Works for only one attribute 
        // if (filterParams.attributes && filterParams.attributes.length > 0) {
        //     qb.disableEscaping()
        //     qb.innerJoin('json_each(product.attributesJSON)', 't_attributes')
        //     qb.innerJoin("json_each(json_extract(t_attributes.value, '$.values'))", 't_attrValues')
        //     filterParams.attributes.forEach(attr => {
        //         if (attr.values.length > 0) {
        //             const brackets = new Brackets(subQb => {
        //                 const attrKey = `attr_${attr.key}`
        //                 subQb.andWhere(`json_extract(t_attributes.value, '$.key') = :${attrKey}`, { [attrKey]: attr.key })
        //                 subQb.andWhere(new Brackets(subQb2 => {
        //                     let isFirstVal = true;
        //                     attr.values.forEach(val => {
        //                         const valKey = `val_${attr.key}_${val}`;
        //                         const query = `json_extract(t_attrValues .value , '$.value') = :${valKey}`;
        //                         if (isFirstVal) {
        //                             isFirstVal = false;
        //                             subQb2.where(query, { [valKey]: val })
        //                         } else {
        //                             subQb2.orWhere(query, { [valKey]: val })
        //                         }
        //                     })
        //                 }))
        //             });
        //             qbAddWhere(brackets);
        //         }
        //     });
        // }


        if (shouldApplyPriceFilter) {
            if (filterParams.maxPrice) {
                const query = `${DBTableNames.Product}.price <= :maxPrice`;
                qbAddWhere(query, { maxPrice: filterParams.maxPrice })
            }
            if (filterParams.minPrice) {
                const query = `${DBTableNames.Product}.price >= :minPrice`;
                qbAddWhere(query, { minPrice: filterParams.minPrice })
            }
        }

    }
}
