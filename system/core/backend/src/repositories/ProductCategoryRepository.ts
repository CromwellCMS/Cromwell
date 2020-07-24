import { EntityRepository, TreeRepository } from "typeorm";
import { ProductCategory } from '../entities/ProductCategory'
import { UpdateProductCategory } from '../inputs/UpdateProductCategory';
import { CreateProductCategory } from '../inputs/CreateProductCategory';
import { TProductCategory, TPagedParams } from '@cromwell/core';
import { DBTableNames } from '@cromwell/core';
import { getPaged, applyGetPaged, applyInnerJoinById } from './BaseQueries';

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {

    async getProductCategories(params: TPagedParams<TProductCategory>): Promise<TProductCategory[]> {
        const qb = this.createQueryBuilder(DBTableNames.Product);
        applyGetPaged(qb, DBTableNames.Product, params);
        return await qb.getMany();
    }

    async getProductCategoriesById(ids: string[]): Promise<ProductCategory[]> {
        const categories: ProductCategory[] = [];
        for (const id of ids) {
            const category = await this.getProductCategoryById(id);
            categories.push(category);
        }
        return categories;
    }

    async getProductCategoryById(id: string): Promise<ProductCategory> {
        const product = await this.findOne({
            where: { id }
        });
        if (!product) throw new Error(`ProductCategory ${id} not found!`);
        return product;
    }

    async getProductCategoryBySlug(slug: string): Promise<ProductCategory> {
        const product = await this.findOne({
            where: { slug }
        });
        if (!product) throw new Error(`ProductCategory ${slug} not found!`);
        return product;
    }


    async createProductCategory(createProduct: CreateProductCategory): Promise<ProductCategory> {
        const productCategory = new ProductCategory();
        productCategory.name = createProduct.name;
        productCategory.name = createProduct.name;
        productCategory.mainImage = createProduct.mainImage;
        productCategory.description = createProduct.description;
        productCategory.isEnabled = createProduct.isEnabled;
        productCategory.pageTitle = createProduct.pageTitle;
        productCategory.slug = createProduct.slug;

        if (createProduct.parentId) {
            productCategory.parent = await this.getProductCategoryById(createProduct.parentId);
        }
        if (createProduct.childIds && Array.isArray(createProduct.childIds)) {
            productCategory.children = await this.getProductCategoriesById(createProduct.childIds);
        }

        await this.save(productCategory);
        if (!productCategory.slug) {
            productCategory.slug = productCategory.id;
            await this.save(productCategory);
        }
        return productCategory;
    }

    async updateProductCategory(id: string, updateProductCategory: UpdateProductCategory): Promise<ProductCategory> {
        const productCategory = await this.getProductCategoryById(id);
        if (!productCategory) throw new Error(`ProductCategory ${id} not found!`);

        productCategory.name = updateProductCategory.name;
        productCategory.mainImage = updateProductCategory.mainImage;
        productCategory.description = updateProductCategory.description;
        productCategory.isEnabled = updateProductCategory.isEnabled;
        productCategory.pageTitle = updateProductCategory.pageTitle;
        productCategory.slug = updateProductCategory.slug ? updateProductCategory.slug : productCategory.id;

        if (updateProductCategory.parentId) {
            productCategory.parent = await this.getProductCategoryById(updateProductCategory.parentId);
        }
        if (updateProductCategory.childIds && Array.isArray(updateProductCategory.childIds)) {
            productCategory.children = await this.getProductCategoriesById(updateProductCategory.childIds);
        }
        await this.save(productCategory);
        return productCategory;
    }

    async deleteProductCategory(id: string): Promise<boolean> {
        const productCategory = await this.getProductCategoryById(id);
        if (!productCategory) return false;
        await this.delete(productCategory.id);
        return true;
    }

    async getCategoriesOfProduct(productId: string, params?: TPagedParams<TProductCategory>): Promise<TProductCategory[]> {
        const qb = this.createQueryBuilder(DBTableNames.ProductCategory);
        applyInnerJoinById(qb, DBTableNames.ProductCategory, 'products', DBTableNames.Product, productId);
        applyGetPaged(qb, DBTableNames.ProductCategory, params);
        return await qb.getMany();
    }
}
