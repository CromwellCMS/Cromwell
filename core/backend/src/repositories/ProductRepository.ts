import { EntityRepository, Repository } from "typeorm";
import { Product } from '../entities/Product'
import { CreateProduct } from '../inputs/CreateProduct';
import { UpdateProduct } from '../inputs/UpdateProduct';
import { ProductCategoryRepository } from './ProductCategoryRepository';
import { getPaged, innerJoinById } from './BaseQueries';
import { getCustomRepository } from "typeorm";
import { TPagedParams, TProduct } from '@cromwell/core';
import { DBTableNames, BasePagePaths } from '@cromwell/core';
import { getStoreItem } from '@cromwell/core';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

    constructor() {
        super();
        // this.mockCategories();
    }

    async mockCategories() {
        const cats = await getCustomRepository(ProductCategoryRepository).find();
        const prods = await this.find();
        prods.forEach(p => {
            p.categories = cats;
            p.save();
        })
    }

    async getProducts(params: TPagedParams<TProduct>): Promise<Product[]> {
        const qb = this.createQueryBuilder(DBTableNames.Product);
        getPaged(qb, DBTableNames.Product, params);
        return await qb.getMany();
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.findOne({
            where: { id }
        });
        if (!product) throw new Error(`Product ${id} not found!`);
        return product;
    }

    async getProductBySlug(slug: string): Promise<Product> {
        const product = await this.findOne({
            where: { slug }
        });
        if (!product) throw new Error(`Product ${slug} not found!`);
        return product;
    }


    async createProduct(createProduct: CreateProduct): Promise<Product> {
        const product = new Product();
        product.name = createProduct.name;
        product.price = createProduct.price;
        product.oldPrice = createProduct.oldPrice;
        product.mainImage = createProduct.mainImage;
        product.images = createProduct.images;
        product.description = createProduct.description;
        product.isEnabled = createProduct.isEnabled;
        product.pageTitle = createProduct.pageTitle;
        product.slug = createProduct.slug;
        if (createProduct.categoryIds) {
            product.categories = await getCustomRepository(ProductCategoryRepository)
                .getProductCategoriesById(createProduct.categoryIds);
        }

        await this.save(product);
        if (!product.slug) {
            product.slug = product.id;
            await this.save(product);
        }

        this.buildProductPage(product);

        return product;
    }

    async updateProduct(id: string, updateProduct: UpdateProduct): Promise<Product> {
        const product = await this.findOne({
            where: { id },
            relations: ["categories"]
        });
        if (!product) throw new Error(`Product ${id} not found!`);

        console.log('product', product)

        product.name = updateProduct.name;
        product.price = updateProduct.price;
        product.oldPrice = updateProduct.oldPrice;
        product.mainImage = updateProduct.mainImage;
        product.images = updateProduct.images;
        product.description = updateProduct.description;
        product.isEnabled = updateProduct.isEnabled;
        product.pageTitle = updateProduct.pageTitle;
        product.slug = updateProduct.slug ? updateProduct.slug : product.id;
        if (updateProduct.categoryIds) {
            product.categories = await getCustomRepository(ProductCategoryRepository)
                .getProductCategoriesById(updateProduct.categoryIds);
        }

        await this.save(product);

        this.buildProductPage(product);

        return product;
    }

    async deleteProduct(id: string): Promise<boolean> {
        const product = await this.getProductById(id);
        if (!product) return false;
        await this.delete(id);

        this.buildProductPage(product);
        return true;
    }

    async getProductsFromCategory(categoryId: string, params?: TPagedParams<TProduct>): Promise<TProduct[]> {
        const qb = this.createQueryBuilder(DBTableNames.Product);
        innerJoinById(qb, DBTableNames.Product, 'categories', DBTableNames.ProductCategory, categoryId);
        getPaged(qb, DBTableNames.Product, params);
        return await qb.getMany();
    }

    private buildProductPage(product: Product) {
        const rebuildPage = getStoreItem('rebuildPage');
        if (rebuildPage) {
            rebuildPage(`${BasePagePaths.Product}/${product.slug}`);
            if (product.categories) {
                product.categories.forEach(cat => {
                    rebuildPage(`${BasePagePaths.ProductCategory}/${cat.slug}`);
                })
            }
        }
    }

}