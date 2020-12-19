import { DBTableNames, TProduct, TPagedList, logLevelMoreThan } from '@cromwell/core';
import {
    applyGetManyFromOne,
    getPaged,
    PagedParamsInput,
    PagedProduct,
    Product,
    ProductCategoryRepository,
    ProductRepository,
} from '@cromwell/core-backend';
import { Arg, Query, Resolver } from 'type-graphql';
import { Brackets, getCustomRepository, SelectQueryBuilder, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { TProductFilterAttribute, TProductFilter, TFilteredList, TFilterMeta } from '../../types';
import ProductFilterInput from '../entities/ProductFilter';
import FilteredProduct from '../entities/FilteredProduct';

@Resolver(Product)
export default class ProductFilterResolver {

    @Query(() => FilteredProduct)
    async getFilteredProductsFromCategory(
        @Arg("categoryId") categoryId: string,
        @Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>,
        @Arg("filterParams", { nullable: true }) filterParams: ProductFilterInput
    ): Promise<TFilteredList<TProduct> | undefined> {
        if (logLevelMoreThan('detailed')) console.log('ProductFilterResolver::getFilteredProductsFromCategory categoryId:' + categoryId, ' pagedParams:', pagedParams);
        const timestamp = Date.now();

        const getQb = (shouldApplyPriceFilter = true): SelectQueryBuilder<Product> => {
            const productRepo = getCustomRepository(ProductRepository);
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
            let maxPrice = (await qb.select(`MAX(${DBTableNames.Product}.price)`, "maxPrice").getRawOne()).maxPrice;
            if (maxPrice && typeof maxPrice === 'string') maxPrice = parseInt(maxPrice);

            let minPrice = (await qb.select(`MIN(${DBTableNames.Product}.price)`, "minPrice").getRawOne()).minPrice;
            if (minPrice && typeof minPrice === 'string') minPrice = parseInt(minPrice);

            return {
                minPrice, maxPrice
            }
        }
        const getElements = async (): Promise<TPagedList<TProduct>> => {
            const qb = getQb();
            return await getPaged<TProduct>(qb, DBTableNames.Product, pagedParams);
        }

        const filterMeta = await getFilterMeta();
        const paged = await getElements();

        const timestamp2 = Date.now();
        if (logLevelMoreThan('detailed')) console.log('ProductFilterResolver::getFilteredProductsFromCategory time elapsed: ' + (timestamp2 - timestamp) + 'ms');

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
                                subQb.where(query, { [valKey]: likeStr })
                            } else {
                                subQb.orWhere(query, { [valKey]: likeStr })
                            }
                        })
                    });
                    qbAddWhere(brackets);
                }
            });
        }

        // // Attempt to make a proper filtration for SQLite. Isn't finished. Works for only one attribute 
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
