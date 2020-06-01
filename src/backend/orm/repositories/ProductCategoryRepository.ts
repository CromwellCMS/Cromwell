import { EntityRepository, TreeRepository } from "typeorm";
import { ProductCategory } from '../models/entities/ProductCategory';
import { UpdateProductCategory } from '../models/inputs/UpdateProductCategory';
import { CreateProductCategory } from '../models/inputs/CreateProductCategory';
import { ProductCategoryType, PagedParamsType, DBTableNames } from "@cromwell/core";
import { getPaged, innerJoinById } from './BaseRepository';

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {

    async getProductCategories(): Promise<ProductCategory[]> {
        let products = await this.find();
        return products;
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

    // async getProducts(params: CategoryParamsType): Promise<ProductType[]> {

    //     if (!params.pageNumber) params.pageNumber = 1;
    //     if (!params.pageSize) params.pageSize = 2;

    //     // const res = await this.query(`
    //     //     SELECT * FROM product AS p 
    //     //     INNER JOIN product_categories_product_category AS cat_index 
    //     //     ON cat_index.productId=p.id 
    //     //     AND cat_index.productCategoryId = $1 
    //     //     ORDER BY p.id 
    //     //     LIMIT -1 OFFSET $2 * ($3 - 1) ROWS 
    //     //     FETCH NEXT $2 ROWS ONLY`,
    //     //     [params.categoryId, params.pageSize, params.pageNumber])

    //     // console.log('res', res)

    //     // const productCategory = await this.createQueryBuilder("product_category")
    //     //     .where("product_category.id = :id", { id: params.categoryId })
    //     //     .leftJoinAndSelect("product_category.products", "product")
    //     //     .getOne();

    //     // if (!productCategory) throw new Error(`ProductCategory ${params.categoryId} not found!`);

    //     // return productCategory.products;
    //     // return res;


    // }

    async getCategoriesOfProduct(productId: string, params?: PagedParamsType<ProductCategoryType>): Promise<ProductCategoryType[]> {
        const qb = this.createQueryBuilder(DBTableNames.ProductCategory);
        innerJoinById(qb, DBTableNames.ProductCategory, 'products', DBTableNames.Product, productId);
        getPaged(qb, DBTableNames.ProductCategory, params);
        return await qb.getMany();
    }
}
