import { TPagedList, TPagedParams, TProductCategory, TProductCategoryInput, TDeleteManyInput } from '@cromwell/core';
import { PagedParamsInput } from 'src/inputs/PagedParamsInput';
import { EntityRepository, getConnection, getCustomRepository, TreeRepository } from 'typeorm';

import { ProductCategoryFilterInput } from '../entities/filter/ProductCategoryFilterInput';
import { ProductCategory } from '../entities/ProductCategory';
import { getLogger } from '../helpers/constants';
import { CreateProductCategory } from '../inputs/CreateProductCategory';
import { UpdateProductCategory } from '../inputs/UpdateProductCategory';
import { applyGetManyFromOne, applyGetPaged, checkEntitySlug, getPaged, handleBaseInput } from './BaseQueries';
import { ProductRepository } from './ProductRepository';

const logger = getLogger('detailed');

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {

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

        const descendantColumn = this.metadata.closureJunctionTable.descendantColumns[0].databasePath;
        const ancestorColumn = this.metadata.closureJunctionTable.ancestorColumns[0].databasePath;
        const closureTableName = this.metadata.closureJunctionTable.tablePath;
        const ancestorReferencedColumn = this.metadata.closureJunctionTable.ancestorColumns[0].referencedColumn?.databasePath as string;
        const descendanReferencedColumn = this.metadata.closureJunctionTable.descendantColumns[0].referencedColumn?.databasePath;
        const parentPropertyName = this.metadata.treeParentRelation?.propertyName as string;

        let newParent: ProductCategory | undefined | null = input.parentId ? await this.getProductCategoryById(input.parentId) : undefined;

        let currentParentId;
        try {
            const currentParent = await getConnection().createQueryBuilder()
                .select([descendantColumn, ancestorColumn])
                .from(closureTableName, closureTableName)
                .where(`${descendantColumn} = :descendantId`, { descendantId: productCategory[ancestorReferencedColumn] })
                .andWhere(`${ancestorColumn} <> :descendantId`)
                .execute();
            currentParentId = currentParent?.[0]?.[ancestorColumn];
        } catch (e) {
            logger.error(e);
        }

        if (newParent) {
            const children = await this.findDescendants(productCategory);
            if (children.some(child => child.id === newParent?.id)) {
                // if new assigned parent also is a child, it'll make an infinite loop
                // don't assign such parents
                newParent = undefined;
                currentParentId = undefined;
            }
        }

        if (newParent?.id) {

            if (!productCategory[ancestorReferencedColumn] || !currentParentId) {
                // create action
                if (productCategory[ancestorReferencedColumn]) {
                    await getConnection().createQueryBuilder()
                        .insert()
                        .into(closureTableName, [ancestorColumn, descendantColumn])
                        .values({
                            [ancestorColumn]: { [ancestorReferencedColumn]: parseInt(newParent[ancestorReferencedColumn]) },
                            [descendantColumn]: { [ancestorReferencedColumn]: parseInt(productCategory[ancestorReferencedColumn]) },
                        })
                        .execute();
                }

                productCategory[parentPropertyName] = newParent;
            }

            if (productCategory.id && currentParentId && newParent.id !== productCategory.id) {
                // update action
                if (newParent.id !== currentParentId) {
                    await this.createQueryBuilder()
                        .update(closureTableName)
                        .set({
                            [ancestorColumn]: { [ancestorReferencedColumn]: newParent[ancestorReferencedColumn] },
                        })
                        .where(`${descendantColumn} = :descendantId`, { descendantId: productCategory[ancestorReferencedColumn] })
                        .andWhere(`${ancestorColumn} = :ancestorId`, { ancestorId: currentParentId })
                        .execute();
                }

                productCategory[parentPropertyName] = newParent;
            }
        }

        if (!newParent && currentParentId) {
            // delete action
            await this.createQueryBuilder()
                .delete()
                .from(closureTableName)
                .where(`${descendantColumn} = :descendantId`, { descendantId: productCategory[ancestorReferencedColumn] })
                .andWhere(`${ancestorColumn} = :ancestorId`, { ancestorId: currentParentId })
                .execute();

            productCategory[parentPropertyName] = null;
        }

        if (input.childIds && Array.isArray(input.childIds)) {
            productCategory.children = await this.getProductCategoriesById(input.childIds);
        }
    }

    async createProductCategory(createProductCategory: CreateProductCategory): Promise<ProductCategory> {
        logger.log('ProductCategoryRepository::createProductCategory');
        const productCategory = new ProductCategory();

        await this.handleProductCategoryInput(productCategory, createProductCategory);

        await this.save(productCategory);
        await checkEntitySlug(productCategory);

        return productCategory;
    }

    async updateProductCategory(id: string, updateProductCategory: UpdateProductCategory): Promise<ProductCategory> {
        logger.log('ProductCategoryRepository::updateProductCategory id: ' + id);
        const productCategory = await this.getProductCategoryById(id);
        if (!productCategory) throw new Error(`ProductCategory ${id} not found!`);

        await this.handleProductCategoryInput(productCategory, updateProductCategory);

        await this.save(productCategory);
        await checkEntitySlug(productCategory);
        return productCategory;
    }

    async deleteProductCategory(id: string): Promise<boolean> {
        logger.log('ProductCategoryRepository::deleteProductCategory id: ' + id);
        const productCategory = await this.getProductCategoryById(id);
        if (!productCategory) return false;

        const descendantColumn = this.metadata.closureJunctionTable.descendantColumns[0].databasePath;
        const ancestorColumn = this.metadata.closureJunctionTable.ancestorColumns[0].databasePath;
        const tableName = this.metadata.tablePath;
        const parentPropertyName = this.metadata.treeParentRelation?.joinColumns[0].propertyName;
        const parentColumn = this.metadata.treeParentRelation?.joinColumns[0].databaseName;
        const closureTableName = this.metadata.closureJunctionTable.tablePath;

        await getConnection().transaction(async transactionalEntityManager => {
            // Delete all the nodes from the closure table
            await transactionalEntityManager.createQueryBuilder(ProductCategory, tableName)
                .delete()
                .from(closureTableName)
                .where(`${descendantColumn} = :id`, { id })
                .orWhere(`${ancestorColumn} = :id`, { id })
                .execute();

            // Set parent to null in the main table
            if (parentPropertyName && parentColumn) {
                await transactionalEntityManager.createQueryBuilder(ProductCategory, tableName)
                    .update(tableName, { [parentPropertyName]: null })
                    .where(`${parentPropertyName} = :id`, { id })
                    .execute();
            }

            // Delete entity
            await transactionalEntityManager.createQueryBuilder(ProductCategory, tableName)
                .delete()
                .from(tableName)
                .where(`id = :id`, { id })
                .execute();

        });

        return true;
    }


    async deleteManyCategories(input: TDeleteManyInput) {
        if (input.all) {
            const allEntities = await this.find({
                select: ['id']
            });
            for (const entity of allEntities) {
                const entityId = entity.id + '';
                if (input.ids.includes(entityId)) continue;
                try {
                    await this.deleteProductCategory(entity.id);
                } catch (e) {
                    logger.error(e);
                }
            }
        } else {
            for (const entityId of input.ids) {
                try {
                    await this.deleteProductCategory(entityId);
                } catch (e) {
                    logger.error(e);
                }
            }
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

    async getChildrenCategories(category: ProductCategory): Promise<ProductCategory[]> {
        logger.log('ProductCategoryRepository::getChildrenCategories id: ' + category.id);
        return (await this.findDescendantsTree(category)).children ?? [];
    }

    async getParentCategory(category: ProductCategory): Promise<ProductCategory | undefined | null> {
        logger.log('ProductCategoryRepository::getParentCategory id: ' + category.id);

        const ancestorsTree = await this.findAncestorsTree(category);
        return ancestorsTree.parent;
    }

    async getRootCategories(): Promise<TPagedList<ProductCategory>> {
        const parentColumn = this.metadata.treeParentRelation?.joinColumns[0].databaseName;
        const [rootCategories, total] = await Promise.all([
            this.createQueryBuilder().select().where(
                `${parentColumn} IS NULL`
            ).getMany(),
            this.createQueryBuilder().getCount(),
        ]);

        return {
            elements: rootCategories,
            pagedMeta: {
                totalElements: total,
            }
        }
    }

    async getFilteredCategories(pagedParams?: PagedParamsInput<ProductCategory>, filterParams?: ProductCategoryFilterInput):
        Promise<TPagedList<TProductCategory>> {

        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();

        let isFirstAttr = true;
        const qbAddWhere: typeof qb.where = (where, params) => {
            if (isFirstAttr) {
                isFirstAttr = false;
                return qb.where(where, params);
            } else {
                return qb.andWhere(where as any, params);
            }
        }

        // Search by product name
        if (filterParams?.nameSearch && filterParams.nameSearch !== '') {
            const nameSearch = `%${filterParams.nameSearch}%`;
            const query = `${this.metadata.tablePath}.name LIKE :nameSearch`;
            qbAddWhere(query, { nameSearch });
        }

        return await getPaged(qb, this.metadata.tablePath, pagedParams);
    }

}