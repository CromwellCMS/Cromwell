import { EntityRepository, getCustomRepository, TreeRepository } from "typeorm";
import { ProductCategory } from '../entities/ProductCategory'
import { UpdateProductCategory } from '../inputs/UpdateProductCategory';
import { CreateProductCategory } from '../inputs/CreateProductCategory';
import { TProductCategory, TPagedParams, TProductCategoryInput, logFor, TPagedList } from '@cromwell/core';
import { getPaged, applyGetPaged, applyGetManyFromOne, handleBaseInput } from './BaseQueries';
import { ProductRepository } from "./ProductRepository";

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {

    async getProductCategories(params: TPagedParams<TProductCategory>): Promise<TPagedList<TProductCategory>> {
        logFor('detailed', 'ProductCategoryRepository::getProductCategories');
        const qb = this.createQueryBuilder(this.metadata.tablePath);

        return getPaged(qb, this.metadata.tablePath, params);
    }

    async getProductCategoriesById(ids: string[]): Promise<ProductCategory[]> {
        logFor('detailed', 'ProductCategoryRepository::getProductCategoriesById ids: ' + ids.join(', '));
        const categories: ProductCategory[] = [];
        for (const id of ids) {
            const category = await this.getProductCategoryById(id);
            categories.push(category);
        }
        return categories;
    }

    async getProductCategoryById(id: string): Promise<ProductCategory> {
        logFor('detailed', 'ProductCategoryRepository::getProductCategoryById id: ' + id);
        const product = await this.findOne({
            where: { id }
        });
        if (!product) throw new Error(`ProductCategory ${id} not found!`);
        return product;
    }

    async getProductCategoryBySlug(slug: string): Promise<ProductCategory> {
        logFor('detailed', 'ProductCategoryRepository::getProductCategoryBySlug slug: ' + slug);
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

        if (input.parentId) {
            productCategory.parent = await this.getProductCategoryById(input.parentId);
        }
        if (input.childIds && Array.isArray(input.childIds)) {
            productCategory.children = await this.getProductCategoriesById(input.childIds);
        }
    }

    async createProductCategory(createProductCategory: CreateProductCategory): Promise<ProductCategory> {
        logFor('detailed', 'ProductCategoryRepository::createProductCategory');
        const productCategory = new ProductCategory();

        this.handleProductCategoryInput(productCategory, createProductCategory);

        await this.save(productCategory);
        if (!productCategory.slug) {
            productCategory.slug = productCategory.id;
            await this.save(productCategory);
        }
        return productCategory;
    }

    async updateProductCategory(id: string, updateProductCategory: UpdateProductCategory): Promise<ProductCategory> {
        logFor('detailed', 'ProductCategoryRepository::updateProductCategory id: ' + id);
        const productCategory = await this.getProductCategoryById(id);
        if (!productCategory) throw new Error(`ProductCategory ${id} not found!`);

        this.handleProductCategoryInput(productCategory, updateProductCategory);

        await this.save(productCategory);
        return productCategory;
    }

    async deleteProductCategory(id: string): Promise<boolean> {
        logFor('detailed', 'ProductCategoryRepository::deleteProductCategory id: ' + id);
        const productCategory = await this.getProductCategoryById(id);
        if (!productCategory) return false;

        const descendantColumn = this.metadata.closureJunctionTable.descendantColumns[0].databasePath;
        const tableName = this.metadata.tablePath;
        const parentPropertyName = this.metadata.treeParentRelation?.joinColumns[0].propertyName;
        const parentColumn = this.metadata.treeParentRelation?.joinColumns[0].databaseName;
        const primaryColumn = this.metadata.primaryColumns[0].databasePath;

        const children = await this.getChildrenCategories(productCategory);

        const descendantNodeIds = children.map((c) => c.id);
        descendantNodeIds.push(id);

        // Delete all the nodes from the closure table
        const closureTableName = this.metadata.closureJunctionTable.tablePath;
        await this.createQueryBuilder()
            .delete()
            .from(closureTableName)
            .where(`${descendantColumn} IN (:...ids)`, { ids: descendantNodeIds })
            .execute();


        // Set parent FK to null in the main table
        if (parentPropertyName && parentColumn) {
            await this.createQueryBuilder()
                .update(tableName, { [parentPropertyName]: null })
                .where(`${parentColumn} IN (:...ids)`, { ids: descendantNodeIds })
                .execute();
        }

        await this.delete(productCategory.id);
        return true;
    }

    async getCategoriesOfProduct(productId: string, params?: TPagedParams<TProductCategory>): Promise<TProductCategory[]> {
        logFor('detailed', 'ProductCategoryRepository::getCategoriesOfProduct id: ' + productId);
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        applyGetManyFromOne(qb, this.metadata.tablePath, 'products',
            getCustomRepository(ProductRepository).metadata.tablePath, productId);

        applyGetPaged(qb, this.metadata.tablePath, params);
        return await qb.getMany();
    }

    async getChildrenCategories(category: ProductCategory): Promise<ProductCategory[]> {
        logFor('detailed', 'ProductCategoryRepository::getChildrenCategories id: ' + category.id);
        return (await this.findDescendantsTree(category)).children ?? [];
    }

    async getParentCategory(category: ProductCategory): Promise<ProductCategory | undefined | null> {
        logFor('detailed', 'ProductCategoryRepository::getParentCategory id: ' + category.id);
        const ancestorsTree = await this.findAncestorsTree(category);
        return ancestorsTree.parent;
    }
}