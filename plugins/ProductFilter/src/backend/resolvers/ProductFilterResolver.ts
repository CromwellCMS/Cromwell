import { DBTableNames, TProduct } from '@cromwell/core';
import {
    applyInnerJoinById,
    getPaged,
    PagedParamsInput,
    PagedProduct,
    Product,
    ProductCategoryRepository,
    ProductRepository,
} from '@cromwell/core-backend';
import { Arg, Query, Resolver } from 'type-graphql';
import { Brackets, getCustomRepository, SelectQueryBuilder } from 'typeorm';
import { TProductFilterAttribute, TProductFilter } from '../../types';
import { ProductFilter } from '../entities/ProductFilter'

@Resolver(Product)
export default class ProductFilterResolver {

    @Query(() => PagedProduct)
    async getFilteredProductsFromCategory(
        @Arg("slug") slug: string,
        @Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>,
        @Arg("filterParams", { nullable: true }) filterParams: ProductFilter
    ) {
        const categoryRepo = getCustomRepository(ProductCategoryRepository);
        const category = await categoryRepo.getProductCategoryBySlug(slug);
        if (category) {
            const productRepo = getCustomRepository(ProductRepository);
            const qb = productRepo.createQueryBuilder(DBTableNames.Product);
            applyInnerJoinById(qb, DBTableNames.Product, 'categories',
                DBTableNames.ProductCategory, category.id);

            if (filterParams) {
                this.applyProductFilter(qb, filterParams);
            }

            const paged = await getPaged(qb, DBTableNames.Product, pagedParams);
            return paged;
        }

    }

    private applyProductFilter(qb: SelectQueryBuilder<TProduct>, filterParams: TProductFilter) {
        if (filterParams.attributes) {
            filterParams.attributes.forEach(attr => {
                qb.andWhere(new Brackets(subQb => {
                    let isFirstVal = true;
                    attr.values.forEach(val => {
                        const likeStr = `%{"key":"${attr.key}","values":[%{"value":"${val}"}%]}%`;
                        const query = `${DBTableNames.Product}.attributesJSON LIKE :likeStr`;
                        if (isFirstVal) {
                            isFirstVal = false;
                            subQb.where(query, { likeStr })
                        } else {
                            subQb.orWhere(query, { likeStr })
                        }
                    })
                }))
            })
        }
    }
}
