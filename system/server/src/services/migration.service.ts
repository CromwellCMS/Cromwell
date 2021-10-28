import {
    TAttributeInput,
    TBasePageEntityInput,
    TCreateUser,
    TDBEntity,
    TOrderInput,
    TPluginEntity,
    TPostInput,
    TProductCategoryInput,
    TProductInput,
    TProductReviewInput,
    TTagInput,
    TThemeEntity,
    TUpdateUser,
} from '@cromwell/core';
import {
    Attribute,
    AttributeRepository,
    BasePageEntity,
    CmsEntity,
    GenericPlugin,
    GenericTheme,
    getLogger,
    Order,
    OrderRepository,
    PluginEntity,
    Post,
    PostComment,
    PostRepository,
    Product,
    ProductCategory,
    ProductCategoryRepository,
    ProductRepository,
    ProductReview,
    ProductReviewRepository,
    Tag,
    TagRepository,
    ThemeEntity,
    User,
    UserRepository,
} from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import cryptoRandomString from 'crypto-random-string';
import { Container, Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { CmsService } from './cms.service';

@Injectable()
@Service()
export class MigrationService {

    private get cmsService() {
        return Container.get(CmsService);
    }

    private _xlsxPopulate;
    private get xlsxPopulate() {
        if (!this._xlsxPopulate) {
            this._xlsxPopulate = require('xlsx-populate');
        }
        return this._xlsxPopulate;
    }

    public async exportDB(entityTypes: TDBEntity[] = []) {
        const workbook = await this.xlsxPopulate.fromBlankAsync();

        const exportAll = (!entityTypes || entityTypes.length === 0);

        if (entityTypes.includes('Product') || exportAll) {
            await this.exportProducts(workbook);
        }
        if (entityTypes.includes('ProductCategory') || exportAll) {
            await this.exportCategories(workbook);
        }
        if (entityTypes.includes('Attribute') || exportAll) {
            await this.exportAttributes(workbook);
        }
        if (entityTypes.includes('ProductReview') || exportAll) {
            await this.exportReviews(workbook);
        }
        if (entityTypes.includes('Order') || exportAll) {
            await this.exportOrders(workbook);
        }
        if (entityTypes.includes('Post') || exportAll) {
            await this.exportPosts(workbook);
        }
        if (entityTypes.includes('Tag') || exportAll) {
            await this.exportTags(workbook);
        }
        if (entityTypes.includes('PostComment') || exportAll) {
            await this.exportComments(workbook);
        }
        if (entityTypes.includes('User') || exportAll) {
            await this.exportUsers(workbook);
        }
        if (entityTypes.includes('Plugin') || exportAll) {
            await this.exportPlugins(workbook);
        }
        if (entityTypes.includes('Theme') || exportAll) {
            await this.exportThemes(workbook);
        }
        if (entityTypes.includes('CMS') || exportAll) {
            await this.exportCMSSettings(workbook);
        }

        try {
            workbook.deleteSheet("Sheet1");
        } catch (error) { }

        return await workbook.outputAsync();
    }

    public async importDB(req: any) {
        if (!req.isMultipart()) {
            return
        }
        const files: any[] = [];

        const parts = req.files();
        for await (const part of parts) {
            files.push(await this.streamToString(part.file));
        }
        if (!files?.length) return;

        for (const file of files) {
            const uint8Array = new Uint8Array(file);
            const workbook = await this.xlsxPopulate.fromDataAsync(uint8Array);

            await this.importUsers(workbook);
            await this.importTags(workbook);
            await this.importPosts(workbook);

            await this.importCategories(workbook);
            await this.importAttributes(workbook);
            await this.importProducts(workbook);
            await this.importReviews(workbook);

            await this.importOrders(workbook);
            await this.importPlugins(workbook);
            await this.importThemes(workbook);
            await this.importCMSSettings(workbook);
        }
    }


    private fillSheet(workbook: any, sheetName: string, data: Record<string, unknown>[]) {
        if (!data?.[0] || !workbook || !sheetName) return;

        const header: string[] = Object.keys(data[0]);
        if (!header.length) return;

        const sheet = workbook.addSheet(sheetName);

        for (let i = 0; i < header.length; i++) {
            sheet.cell(1, i + 1).value(header[i]);
        }

        const range = {
            s: { c: 0, r: 1 },
            e: { c: header.length, r: data.length }
        };

        let rowIndex = 0;
        for (let R = range.s.r; R <= range.e.r; ++R) {
            const rowData = data[rowIndex];

            for (let C = range.s.c; C <= range.e.c; ++C) {
                const colName = header[C];
                let cellData = rowData[colName];
                if (cellData !== undefined && cellData !== null) cellData = String(cellData);
                else cellData = '';

                sheet.cell(R + 1, C + 1).value(cellData);
            }
            rowIndex++;
        }
    }

    // POSTS
    private async exportPosts(workbook: any) {
        const posts = await getCustomRepository(PostRepository).find({
            relations: ['tags', 'comments']
        });
        const postSheet: Partial<Record<keyof TPostInput, any>>[] = posts.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            title: ent.title,
            authorId: ent.authorId,
            content: ent.content,
            delta: ent.delta,
            excerpt: ent.excerpt,
            mainImage: ent.mainImage,
            readTime: ent.readTime,
            tagIds: ent.tags?.map(tag => tag.id)?.join(','),
            published: ent.published,
            featured: ent.featured,
            publishDate: ent.publishDate,
            commentIds: ent.comments?.map(comment => comment.id)?.join(','),
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Posts', postSheet);
    }

    // TAGS
    private async exportTags(workbook: any) {
        const tags = await getCustomRepository(TagRepository).find();
        const tagsSheet: Partial<Record<keyof TTagInput, any>>[] = tags.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            name: ent.name,
            color: ent.color,
            image: ent.image,
            description: ent.description,
            descriptionDelta: ent.descriptionDelta,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Tags', tagsSheet);
    }

    // COMMENTS
    private async exportComments(workbook: any) {
        const comments = await PostComment.find();
        const commentsSheet: Record<string, any>[] = comments.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            postId: ent.postId,
            title: ent.title,
            comment: ent.comment,
            userName: ent.userName,
            userEmail: ent.userEmail,
            userId: ent.userId,
            approved: ent.approved,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Comments', commentsSheet);
    }

    // PRODUCTS
    private async exportProducts(workbook: any) {
        const products = await getCustomRepository(ProductRepository).find({
            relations: ['categories']
        });
        const productsSheet: Partial<Record<keyof TProductInput, any>>[] = products.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            name: ent.name,
            categoryIds: ent.categories?.map(cat => cat.id)?.join(','),
            price: ent.price,
            oldPrice: ent.oldPrice,
            sku: ent.sku,
            mainImage: ent.mainImage,
            images: ent.images,
            mainCategoryId: ent.mainCategoryId,
            description: ent.description,
            descriptionDelta: ent.descriptionDelta,
            attributes: JSON.stringify(ent.attributes),
            views: ent.views,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Products', productsSheet);
    }

    // CATEGORIES
    private async exportCategories(workbook: any) {
        const categoryRepo = getCustomRepository(ProductCategoryRepository);
        const categories = await getCustomRepository(ProductCategoryRepository).find();
        const categoriesSheet: Partial<Record<keyof TProductCategoryInput, any>>[] = await Promise.all(categories.map(async ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            name: ent.name,
            mainImage: ent.mainImage,
            description: ent.description,
            descriptionDelta: ent.descriptionDelta,
            parentId: (await categoryRepo.getParentCategory(ent))?.id,
            metaId: ent.metaId,
        })));

        this.fillSheet(workbook, 'Categories', categoriesSheet);
    }

    // ATTRIBUTES
    private async exportAttributes(workbook: any) {
        const attributes = await getCustomRepository(AttributeRepository).find();
        const attributesSheet: Partial<Record<keyof TAttributeInput, any>>[] = attributes.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            key: ent.key,
            values: JSON.stringify(ent.values),
            type: ent.type,
            icon: ent.icon,
            required: ent.required,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Attributes', attributesSheet);
    }

    // REVIEWS
    private async exportReviews(workbook: any) {
        const reviews = await getCustomRepository(ProductReviewRepository).find();
        const reviewsSheet: Partial<Record<keyof TProductReviewInput, any>>[] = reviews.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            productId: ent.productId,
            title: ent.title,
            description: ent.description,
            rating: ent.rating,
            userName: ent.userName,
            userEmail: ent.userEmail,
            userId: ent.userId,
            approved: ent.approved,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Reviews', reviewsSheet);
    }

    // ORDERS
    private async exportOrders(workbook: any) {
        const orders = await getCustomRepository(OrderRepository).find();
        const ordersSheet: Partial<Record<keyof Omit<TOrderInput, 'fromUrl'>, any>>[] = orders.map(ent => ({
            id: ent.id,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            status: ent.status,
            cart: ent.cart,
            orderTotalPrice: ent.orderTotalPrice,
            cartTotalPrice: ent.cartTotalPrice,
            cartOldTotalPrice: ent.cartOldTotalPrice,
            shippingPrice: ent.shippingPrice,
            totalQnt: ent.totalQnt,
            userId: ent.userId,
            customerName: ent.customerName,
            customerPhone: ent.customerPhone,
            customerEmail: ent.customerEmail,
            customerAddress: ent.customerAddress,
            customerComment: ent.customerComment,
            shippingMethod: ent.shippingMethod,
            paymentMethod: ent.paymentMethod,
            currency: ent.currency,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Orders', ordersSheet);
    }

    // USERS
    private async exportUsers(workbook: any) {
        const users = await getCustomRepository(UserRepository).find();
        const usersSheet: Partial<Record<keyof TUpdateUser, any>>[] = users.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            fullName: ent.fullName,
            email: ent.email,
            avatar: ent.avatar,
            bio: ent.bio,
            phone: ent.phone,
            address: ent.address,
            role: ent.role,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Users', usersSheet);
    }

    // PLUGINS
    private async exportPlugins(workbook: any) {
        const plugins = await PluginEntity.find();
        const pluginsSheet: Partial<Record<keyof TPluginEntity, any>>[] = plugins.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            name: ent.name,
            version: ent.version,
            title: ent.title,
            isInstalled: ent.isInstalled,
            hasAdminBundle: ent.hasAdminBundle,
            settings: ent.settings,
            defaultSettings: ent.defaultSettings,
            moduleInfo: ent.moduleInfo,
            isUpdating: ent.isUpdating,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Plugins', pluginsSheet);
    }

    // THEMES
    private async exportThemes(workbook: any) {
        const themes = await ThemeEntity.find();
        const themesSheet: Partial<Record<keyof TThemeEntity, any>>[] = themes.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            name: ent.name,
            version: ent.version,
            title: ent.title,
            isInstalled: ent.isInstalled,
            hasAdminBundle: ent.hasAdminBundle,
            settings: ent.settings,
            defaultSettings: ent.defaultSettings,
            moduleInfo: ent.moduleInfo,
            isUpdating: ent.isUpdating,
            metaId: ent.metaId,
        }));

        this.fillSheet(workbook, 'Themes', themesSheet);
    }

    // CMS
    private async exportCMSSettings(workbook: any) {
        const cms = await CmsEntity.find();
        const cmsSheet: Record<string, any>[] = cms.map(ent => ({
            id: ent.id,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            publicSettings: ent.publicSettings,
            adminSettings: ent.adminSettings,
            internalSettings: ent.internalSettings,
        }));

        this.fillSheet(workbook, 'CMS settings', cmsSheet);
    }

    private streamToString(stream) {
        const chunks: any[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        })
    }

    private readSheet<TEntity = any>(workbook: any, sheetName: string): TEntity[] | undefined {
        const sheet = workbook.sheet(sheetName);
        if (!sheet) return;

        const data: string[][] = sheet.usedRange().value();
        const header = data?.[0];
        if (!header) return;
        const entities: any[] = [];

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const entity = {};
            for (let j = 0; j < row.length; j++) {
                let val: string | null | boolean = row[j];
                if (val === '' || val == 'null' || val == 'undefined' || val == undefined) val = null;
                if (val == 'true') val = true;
                if (val == 'false') val = false;
                entity[header[j]] = val;
            }
            entities.push(entity);
        }
        return entities;
    }

    private async importBase<TEntity extends TBasePageEntityInput & { id?: string }>(
        workbook: any,
        sheetName: string,
        EntityClass: typeof BasePageEntity,
        transformInput: (input: TEntity & { id?: string }) => TEntity,
        update: (input: TEntity & { id?: string }) => Promise<any>,
        create: (input: TEntity & { id?: string }) => Promise<any>,
    ) {
        const inputs = this.readSheet(workbook, sheetName)?.map(input => {
            try {
                return transformInput(input)
            } catch (error) {
                getLogger().error(error);
            }
            return input;
        });
        if (!inputs) return;

        let entities: { id: string }[] = await EntityClass.find({ select: ['id'] });

        // Remove from DB that aren't in the sheet
        entities = (await Promise.all(entities.map(async entity => {
            if (!inputs.find(input => input.id + '' === entity.id + '')) {
                try {
                    await EntityClass.delete(entity.id);
                } catch (error) {
                    getLogger().error(error);
                }
                return null;
            }
            return entity;
        }))).filter(Boolean) as { id: string }[];

        await Promise.all(inputs.map(async input => {
            const entity = entities.find(ent => ent.id + '' === input.id + '');
            if (input.id && input.id !== '' && entity) {
                // Update  
                try {
                    await update(input);
                } catch (error) {
                    getLogger().error(error);
                }
            } else {
                // Create
                try {
                    await create(input);
                } catch (error) {
                    getLogger().error(error);
                }
            }
        }));
    }

    private async importTags(workbook: any) {
        await this.importBase<TTagInput>(workbook,
            'Tags',
            Tag,
            (input) => input,
            async (input) => input.id && getCustomRepository(TagRepository).updateTag(input.id, input),
            (input) => getCustomRepository(TagRepository).createTag(input, input.id),
        )
    }

    private async importPosts(workbook: any) {
        await this.importBase<TPostInput>(workbook,
            'Posts',
            Post,
            (input) => ({
                ...input,
                tagIds: typeof input.tagIds === 'string' || typeof input.tagIds === 'number' ?
                    (input.tagIds + '').split(',') : input.tagIds
            }),
            async (input) => input.id && getCustomRepository(PostRepository).updatePost(input.id, input),
            (input) => getCustomRepository(PostRepository).createPost(input, input.id),
        )
    }

    private async importCategories(workbook: any) {
        await this.importBase<TProductCategoryInput>(workbook,
            'Categories',
            ProductCategory,
            (input) => input,
            async (input) => input.id && getCustomRepository(ProductCategoryRepository).updateProductCategory(input.id, input),
            (input) => getCustomRepository(ProductCategoryRepository).createProductCategory(input, input.id),
        )
    }

    private async importAttributes(workbook: any) {
        await this.importBase<TAttributeInput>(workbook,
            'Attributes',
            Attribute,
            (input) => ({
                ...input,
                values: typeof input.values === 'string' ?
                    JSON.parse(input.values) : input.values,
            }),
            async (input) => input.id && getCustomRepository(AttributeRepository).updateAttribute(input.id, input),
            (input) => getCustomRepository(AttributeRepository).createAttribute(input, input.id),
        )
    }

    private async importProducts(workbook: any) {
        await this.importBase<TProductInput>(workbook,
            'Products',
            Product,
            (input) => ({
                ...input,
                categoryIds: typeof input.categoryIds === 'string' || typeof input.categoryIds === 'number' ?
                    (input.categoryIds + '').split(',') : input.categoryIds,
                attributes: typeof input.attributes === 'string' ?
                    JSON.parse(input.attributes as string) : input.attributes,
            }),
            async (input) => input.id && getCustomRepository(ProductRepository).updateProduct(input.id, input),
            (input) => getCustomRepository(ProductRepository).createProduct(input, input.id),
        )
    }

    private async importReviews(workbook: any) {
        await this.importBase<TProductReviewInput>(workbook,
            'Reviews',
            ProductReview,
            (input) => input,
            async (input) => input.id && getCustomRepository(ProductReviewRepository).updateProductReview(input.id, input),
            (input) => getCustomRepository(ProductReviewRepository).createProductReview(input, input.id),
        )
    }

    private async importOrders(workbook: any) {
        await this.importBase<TOrderInput>(workbook,
            'Orders',
            Order as any,
            (input) => input,
            async (input) => input.id && getCustomRepository(OrderRepository).updateOrder(input.id, input),
            (input) => getCustomRepository(OrderRepository).createOrder(input, input.id),
        )
    }

    private async importUsers(workbook: any) {
        await this.importBase<TUpdateUser>(workbook,
            'Users',
            User,
            (input) => input,
            async (input) => input.id && getCustomRepository(UserRepository).updateUser(input.id, input),
            (input: TCreateUser & { id?: string }) => getCustomRepository(UserRepository).createUser({
                ...input,
                password: cryptoRandomString({ length: 14, type: 'url-safe' }),
            }, input.id),
        )
    }

    private async importPlugins(workbook: any) {
        await this.importBase<PluginEntity>(workbook,
            'Plugins',
            PluginEntity,
            (input) => input,
            async (input) => input.id && getCustomRepository(GenericPlugin.repository).updateEntity(input.id, input),
            (input) => getCustomRepository(GenericPlugin.repository).createEntity(input, input.id),
        )
    }

    private async importThemes(workbook: any) {
        await this.importBase<ThemeEntity>(workbook,
            'Themes',
            ThemeEntity,
            (input) => input,
            async (input) => input.id && getCustomRepository(GenericTheme.repository).updateEntity(input.id, input),
            (input) => getCustomRepository(GenericTheme.repository).createEntity(input, input.id),
        )
    }

    private async importCMSSettings(workbook: any) {
        const inputs = this.readSheet(workbook, 'CMS settings');
        if (!inputs?.[0]) return;
        try {
            await this.cmsService.updateCmsSettings(inputs[0]);
        } catch (error) {
            getLogger().error(error);
        }
    }
}