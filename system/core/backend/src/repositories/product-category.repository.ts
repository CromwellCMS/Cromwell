import {
    getStoreItem,
    TDeleteManyInput,
    TPagedList,
    TPagedParams,
    TProductCategory,
    TProductCategoryInput,
} from '@cromwell/core';
import {
    Brackets,
    ConnectionOptions,
    DeleteQueryBuilder,
    EntityRepository,
    getConnection,
    getCustomRepository,
    SelectQueryBuilder,
    TreeRepository,
} from 'typeorm';

import {
    applyGetManyFromOne,
    applyGetPaged,
    checkEntitySlug,
    getPaged,
    getSqlBoolStr,
    getSqlLike,
    handleBaseInput,
    wrapInQuotes,
} from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { ProductCategory } from '../models/entities/product-category.entity';
import { ProductCategoryFilterInput } from '../models/filters/product-category.filter';
import { PagedParamsInput } from '../models/inputs/paged-params.input';
import { CreateProductCategory } from '../models/inputs/product-category.create';
import { UpdateProductCategory } from '../models/inputs/product-category.update';
import { ProductRepository } from './product.repository';

const logger = getLogger();

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {

    public dbType: ConnectionOptions['type'];

    constructor() {
        super();
        this.dbType = getStoreItem('dbInfo')?.dbType as ConnectionOptions['type']
            ?? getConnection().options.type;
    }

    getSqlBoolStr = (b: boolean) => getSqlBoolStr(this.dbType, b);
    getSqlLike = () => getSqlLike(this.dbType);
    quote = (str: string) => wrapInQuotes(this.dbType, str);

    async getProductCategories(params: TPagedParams<TProductCategory>): Promise<TPagedList<TProductCategory>> {
        logger.log('ProductCategoryRepository::getProductCategories');
        const qb = this.createQueryBuilder(this.metadata.tablePath);

        return getPaged(qb, this.metadata.tablePath, params);
    }

    async getProductCategoriesById(ids: string[]): Promise<ProductCategory[]> {
        logger.log('ProductCategoryRepository::getProductCategoriesById ids: ' + ids.join(', '));
        return this.findByIds(ids);
    }

    async getProductCategoryById(id: string): Promise<ProductCategory> {
        logger.log('ProductCategoryRepository::getProductCategoryById id: ' + id);
        const product = await this.findOne({
            where: { id }
        });
        if (!product) throw new Error(`ProductCategory ${id} not found!`);
        return product;
    }

    async getProductCategoryBySlug(slug: string): Promise<ProductCategory> {
        logger.log('ProductCategoryRepository::getProductCategoryBySlug slug: ' + slug);
        const product = await this.findOne({
            where: { slug }
        });
        if (!product) throw new Error(`ProductCategory ${slug} not found!`);
        return product;
    }

    async handleProductCategoryInput(productCategory: ProductCategory, input: TProductCategoryInput) {
        handleBaseInput(productCategory, input);

        productCategory.name = input.name;
        productCategory.mainImage = input.mainImage;
        productCategory.description = input.description;
        productCategory.descriptionDelta = input.descriptionDelta;

        const newParent: ProductCategory | undefined | null = input.parentId ? await this.getProductCategoryById(input.parentId) : undefined;

        if (newParent?.id) {
            productCategory.parent = newParent;
        }

        if (!newParent) {
            productCategory.parent = null;
        }
    }

    async createProductCategory(createProductCategory: CreateProductCategory, id?: string): Promise<ProductCategory> {
        logger.log('ProductCategoryRepository::createProductCategory');
        const productCategory = new ProductCategory();
        if (id) productCategory.id = id;

        await this.handleProductCategoryInput(productCategory, createProductCategory);

        await this.save(productCategory);
        await checkEntitySlug(productCategory, ProductCategory);

        return productCategory;
    }

    async updateProductCategory(id: string, updateProductCategory: UpdateProductCategory): Promise<ProductCategory> {
        logger.log('ProductCategoryRepository::updateProductCategory id: ' + id);
        const productCategory = await this.getProductCategoryById(id);
        if (!productCategory) throw new Error(`ProductCategory ${id} not found!`);

        await this.handleProductCategoryInput(productCategory, updateProductCategory);

        await this.save(productCategory);
        await checkEntitySlug(productCategory, ProductCategory);
        return productCategory;
    }

    async deleteProductCategory(id: string): Promise<boolean> {
        logger.log('ProductCategoryRepository::deleteProductCategory id: ' + id);
        const productCategory = await this.getProductCategoryById(id);
        if (!productCategory) throw new Error('Product category not found');

        const children = await this.getChildCategories(productCategory);
        if (children?.length) {
            await Promise.all(children.map(async child => {
                child.parent = null;
                await this.save(child);
            }));
        }

        await this.remove(productCategory);
        return true;
    }

    async deleteManyCategories(input: TDeleteManyInput, filterParams?: ProductCategoryFilterInput) {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select(['id']);
        if (filterParams) this.applyCategoryFilter(qb, filterParams);

        if (input.all) {
            if (input.ids?.length) {
                qb.andWhere(`${this.metadata.tablePath}.id NOT IN (:...ids)`, { ids: input.ids ?? [] })
            } else {
                // no WHERE needed
            }
        } else {
            if (input.ids?.length) {
                qb.andWhere(`${this.metadata.tablePath}.id IN (:...ids)`, { ids: input.ids ?? [] })
            } else {
                throw new Error(`applyDeleteMany: You have to specify ids to delete for ${this.metadata.tablePath}`);
            }
        }

        const categories = await qb.execute();
        for (const category of categories) {
            await this.deleteProductCategory(category?.id);
        }
        return true;
    }

    async getCategoriesOfProduct(productId: string, params?: TPagedParams<TProductCategory>): Promise<TProductCategory[]> {
        logger.log('ProductCategoryRepository::getCategoriesOfProduct id: ' + productId);
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        applyGetManyFromOne(qb, this.metadata.tablePath, 'products',
            getCustomRepository(ProductRepository).metadata.tablePath, productId);

        applyGetPaged(qb, this.metadata.tablePath, params);
        return await qb.getMany();
    }

    async getChildCategories(category: ProductCategory): Promise<ProductCategory[]> {
        logger.log('ProductCategoryRepository::getChildCategories id: ' + category.id);
        return (await this.findDescendantsTree(category))?.children ?? [];
    }

    async getParentCategory(category: ProductCategory): Promise<ProductCategory | undefined | null> {
        logger.log('ProductCategoryRepository::getParentCategory id: ' + category.id);
        return (await this.findAncestorsTree(category))?.parent;
    }

    async getRootCategories(): Promise<TPagedList<ProductCategory>> {
        const parentColumn = this.metadata.treeParentRelation?.joinColumns[0].databaseName;
        const qb = this.createQueryBuilder(this.metadata.tablePath).select();
        if (parentColumn) {
            qb.where(`${this.metadata.tablePath}.${this.quote(parentColumn)} IS NULL`);
        }

        const [rootCategories, total] = await Promise.all([
            qb.getMany(),
            qb.getCount(),
        ]);

        return {
            elements: rootCategories,
            pagedMeta: {
                totalElements: total,
            }
        }
    }

    applyCategoryFilter(qb: SelectQueryBuilder<ProductCategory> | DeleteQueryBuilder<ProductCategory>, filterParams?: ProductCategoryFilterInput) {
        // Search by category name or id
        if (filterParams?.nameSearch && filterParams.nameSearch !== '') {
            const likeStr = `%${filterParams.nameSearch}%`;

            const brackets = new Brackets(subQb => {
                subQb.where(`${this.metadata.tablePath}.name ${this.getSqlLike()} :likeStr`, { likeStr });

                if (!isNaN(parseInt(filterParams.nameSearch + '')))
                    subQb.orWhere(`${this.metadata.tablePath}.id = :idSearch`, {
                        idSearch: filterParams.nameSearch
                    });
            });
            qb.andWhere(brackets);
        }
    }

    async getFilteredCategories(pagedParams?: PagedParamsInput<ProductCategory>, filterParams?: ProductCategoryFilterInput):
        Promise<TPagedList<TProductCategory>> {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyCategoryFilter(qb, filterParams);
        return await getPaged(qb, this.metadata.tablePath, pagedParams);
    }

}