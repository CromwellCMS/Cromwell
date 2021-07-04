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
    CmsEntity,
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
import { Container, Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { BasePageEntity } from '../../../core/backend/es/entities/BasePageEntity';
import { GenericPlugin, GenericTheme } from '../helpers/genericEntities';
import { CmsService } from './cms.service';

@Injectable()
@Service()
export class MigrationService {

    private get cmsService() {
        return Container.get(CmsService);
    }

    fillSheet(workbook: any, sheetName: string, data: Record<string, unknown>[]) {
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

    async exportDB(entityType?: TDBEntity) {
        const XlsxPopulate = require('xlsx-populate');
        const workbook = await XlsxPopulate.fromBlankAsync();

        if (entityType === 'Attribute') {
            await this.exportAttributes(workbook);

        } else if (entityType === 'Order') {
            await this.exportOrders(workbook);

        } else if (entityType === 'Post') {
            await this.exportPosts(workbook);

        } else if (entityType === 'Product') {
            await this.exportProducts(workbook);

        } else if (entityType === 'ProductCategory') {
            await this.exportCategories(workbook);

        } else if (entityType === 'ProductReview') {
            await this.exportReviews(workbook);

        } else if (entityType === 'Tag') {
            await this.exportTags(workbook);

        } else if (entityType === 'User') {
            await this.exportUsers(workbook);

        } else if (entityType === 'Plugin') {
            await this.exportPlugins(workbook);

        } else if (entityType === 'PostComment') {
            await this.exportComments(workbook);

        } else if (entityType === 'Theme') {
            await this.exportThemes(workbook);

        } else if (entityType === 'CMS') {
            await this.exportCMSSettings(workbook);

        } else {
            await this.exportProducts(workbook);
            await this.exportCategories(workbook);
            await this.exportAttributes(workbook);
            await this.exportReviews(workbook);
            await this.exportOrders(workbook);

            await this.exportPosts(workbook);
            await this.exportTags(workbook);
            await this.exportComments(workbook);

            await this.exportUsers(workbook);
            await this.exportPlugins(workbook);
            await this.exportThemes(workbook);
            await this.exportCMSSettings(workbook);
        }

        try {
            workbook.deleteSheet("Sheet1");
        } catch (error) { }

        await workbook.toFileAsync("./out.xlsx");

        return {
            file: await workbook.outputAsync("base64"),
        }
    }


    // POSTS
    async exportPosts(workbook: any) {
        const posts = await getCustomRepository(PostRepository).find({
            relations: ['tags', 'comments']
        });
        const postSheet: Record<keyof TPostInput, any>[] = posts.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
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
            publishDate: ent.publishDate,
            commentIds: ent.comments?.map(comment => comment.id)?.join(','),
        }));

        this.fillSheet(workbook, 'Posts', postSheet);
    }

    // TAGS
    async exportTags(workbook: any) {
        const tags = await getCustomRepository(TagRepository).find();
        const tagsSheet: Record<keyof TTagInput, any>[] = tags.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            name: ent.name,
            color: ent.color,
            image: ent.image,
            description: ent.description,
            descriptionDelta: ent.descriptionDelta,
        }));

        this.fillSheet(workbook, 'Tags', tagsSheet);
    }

    // COMMENTS
    async exportComments(workbook: any) {
        const comments = await PostComment.find();
        const commentsSheet: Record<string, any>[] = comments.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
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
        }));

        this.fillSheet(workbook, 'Comments', commentsSheet);
    }

    // PRODUCTS
    async exportProducts(workbook: any) {
        const products = await getCustomRepository(ProductRepository).find({
            relations: ['categories']
        });
        const productsSheet: Record<keyof TProductInput, any>[] = products.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
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
            description: ent.description,
            descriptionDelta: ent.descriptionDelta,
            attributes: JSON.stringify(ent.attributes),
            views: ent.views,
        }));

        this.fillSheet(workbook, 'Products', productsSheet);
    }

    // CATEGORIES
    async exportCategories(workbook: any) {
        const categoryRepo = getCustomRepository(ProductCategoryRepository);
        const categories = await getCustomRepository(ProductCategoryRepository).find();
        const categoriesSheet: Record<keyof TProductCategoryInput, any>[] = await Promise.all(categories.map(async ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            name: ent.name,
            mainImage: ent.mainImage,
            description: ent.description,
            descriptionDelta: ent.descriptionDelta,
            parentId: (await categoryRepo.getParentCategory(ent))?.id,
        })));

        this.fillSheet(workbook, 'Categories', categoriesSheet);
    }

    // ATTRIBUTES
    async exportAttributes(workbook: any) {
        const attributes = await getCustomRepository(AttributeRepository).find();
        const attributesSheet: Record<keyof TAttributeInput, any>[] = attributes.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            key: ent.key,
            values: JSON.stringify(ent.values),
            type: ent.type,
            icon: ent.icon,
            required: ent.required,
        }));

        this.fillSheet(workbook, 'Attributes', attributesSheet);
    }

    // REVIEWS
    async exportReviews(workbook: any) {
        const reviews = await getCustomRepository(ProductReviewRepository).find();
        const reviewsSheet: Record<keyof TProductReviewInput, any>[] = reviews.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
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
        }));

        this.fillSheet(workbook, 'Reviews', reviewsSheet);
    }

    // ORDERS
    async exportOrders(workbook: any) {
        const orders = await getCustomRepository(OrderRepository).find();
        const ordersSheet: Record<keyof Omit<TOrderInput, 'fromUrl'>, any>[] = orders.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
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
        }));

        this.fillSheet(workbook, 'Orders', ordersSheet);
    }

    // USERS
    async exportUsers(workbook: any) {
        const users = await getCustomRepository(UserRepository).find();
        const usersSheet: Record<keyof TUpdateUser, any>[] = users.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
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
        }));

        this.fillSheet(workbook, 'Users', usersSheet);
    }

    // PLUGINS
    async exportPlugins(workbook: any) {
        const plugins = await PluginEntity.find();
        const pluginsSheet: Record<keyof TPluginEntity, any>[] = plugins.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
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
        }));

        this.fillSheet(workbook, 'Plugins', pluginsSheet);
    }

    // THEMES
    async exportThemes(workbook: any) {
        const themes = await ThemeEntity.find();
        const themesSheet: Record<keyof TThemeEntity, any>[] = themes.map(ent => ({
            id: ent.id,
            slug: ent.slug,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
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
        }));

        this.fillSheet(workbook, 'Themes', themesSheet);
    }

    // CMS
    async exportCMSSettings(workbook: any) {
        const cms = await CmsEntity.find();
        const cmsSheet: Record<string, any>[] = cms.map(ent => ({
            id: ent.id,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            protocol: ent.protocol,
            themeName: ent.themeName,
            defaultPageSize: ent.defaultPageSize,
            currencies: JSON.stringify(ent.currencies),
            timezone: ent.timezone,
            language: ent.language,
            favicon: ent.favicon,
            logo: ent.logo,
            defaultShippingPrice: ent.defaultShippingPrice,
            headHtml: ent.headHtml,
            footerHtml: ent.footerHtml,
            smtpConnectionString: ent.smtpConnectionString,
            sendFromEmail: ent.sendFromEmail,
            version: ent.version,
            versions: ent.versions,
            installed: ent.installed,
            beta: ent.beta,
        }));

        this.fillSheet(workbook, 'CMS settings', cmsSheet);
    }

    streamToString(stream) {
        const chunks: any[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        })
    }

    readSheet<TEntity = any>(workbook: any, sheetName: string): TEntity[] | undefined {
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
                if (val === '' || val == 'null' || val == 'undefined') val = null;
                if (val == 'true') val = true;
                if (val == 'false') val = false;
                entity[header[j]] = val;
            }
            entities.push(entity);
        }

        return entities;
    }

    async importBase<TEntity extends TBasePageEntityInput & { id?: string }>(
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

        // Remove from DB that aren't in sheet
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
        }))).filter(Boolean) as BasePageEntity[];

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

    async importDB(req: any) {
        if (!req.isMultipart()) {
            return
        }
        const files: any[] = [];

        const parts = req.files();
        for await (const part of parts) {
            files.push(await this.streamToString(part.file));
        }
        if (!files?.length) return;

        const XlsxPopulate = require('xlsx-populate');

        for (const file of files) {
            const uint8Array = new Uint8Array(file);
            const workbook = await XlsxPopulate.fromDataAsync(uint8Array);

            await this.importTags(workbook);
            await this.importPosts(workbook);

            await this.importCategories(workbook);
            await this.importAttributes(workbook);
            await this.importProducts(workbook);
            await this.importReviews(workbook);

            await this.importOrders(workbook);
            await this.importUsers(workbook);
            await this.importPlugins(workbook);
            await this.importThemes(workbook);
            await this.importCMSSettings(workbook);
        }
    }

    async importTags(workbook: any) {
        await this.importBase<TTagInput>(workbook,
            'Tags',
            Tag,
            (input) => input,
            async (input) => input.id && getCustomRepository(TagRepository).updateTag(input.id, input),
            (input) => getCustomRepository(TagRepository).createTag(input),
        )
    }

    async importPosts(workbook: any) {
        await this.importBase<TPostInput>(workbook,
            'Posts',
            Post,
            (input) => ({
                ...input, tagIds: typeof input.tagIds === 'string' ?
                    (input.tagIds as string).split(',') : input.tagIds
            }),
            async (input) => input.id && getCustomRepository(PostRepository).updatePost(input.id, input),
            (input) => getCustomRepository(PostRepository).createPost(input),
        )
    }

    async importCategories(workbook: any) {
        await this.importBase<TProductCategoryInput>(workbook,
            'Categories',
            ProductCategory,
            (input) => input,
            async (input) => input.id && getCustomRepository(ProductCategoryRepository).updateProductCategory(input.id, input),
            (input) => getCustomRepository(ProductCategoryRepository).createProductCategory(input),
        )
    }

    async importAttributes(workbook: any) {
        await this.importBase<TAttributeInput>(workbook,
            'Attributes',
            Attribute,
            (input) => ({
                ...input, values: typeof input.values === 'string' ?
                    JSON.parse(input.values) : input.values,
            }),
            async (input) => input.id && getCustomRepository(AttributeRepository).updateAttribute(input.id, input),
            (input) => getCustomRepository(AttributeRepository).createAttribute(input),
        )
    }

    async importProducts(workbook: any) {
        await this.importBase<TProductInput>(workbook,
            'Products',
            Product,
            (input) => ({
                ...input, categoryIds: typeof input.categoryIds === 'string' ?
                    (input.categoryIds as string).split(',') : input.categoryIds,
                attributes: typeof input.attributes === 'string' ?
                    JSON.parse(input.attributes as string) : input.attributes,
            }),
            async (input) => input.id && getCustomRepository(ProductRepository).updateProduct(input.id, input),
            (input) => getCustomRepository(ProductRepository).createProduct(input),
        )
    }

    async importReviews(workbook: any) {
        await this.importBase<TProductReviewInput>(workbook,
            'Reviews',
            ProductReview,
            (input) => input,
            async (input) => input.id && getCustomRepository(ProductReviewRepository).updateProductReview(input.id, input),
            (input) => getCustomRepository(ProductReviewRepository).createProductReview(input),
        )
    }

    async importOrders(workbook: any) {
        await this.importBase<TOrderInput>(workbook,
            'Orders',
            Order,
            (input) => input,
            async (input) => input.id && getCustomRepository(OrderRepository).updateOrder(input.id, input),
            (input) => getCustomRepository(OrderRepository).createOrder(input),
        )
    }

    async importUsers(workbook: any) {
        await this.importBase<TUpdateUser>(workbook,
            'Users',
            User,
            (input) => input,
            async (input) => input.id && getCustomRepository(UserRepository).updateUser(input.id, input),
            (input: TCreateUser) => getCustomRepository(UserRepository).createUser(input),
        )
    }

    async importPlugins(workbook: any) {
        await this.importBase<PluginEntity>(workbook,
            'Plugins',
            PluginEntity,
            (input) => input,
            async (input) => input.id && getCustomRepository(GenericPlugin.repository).updateEntity(input.id, input),
            (input) => getCustomRepository(GenericPlugin.repository).createEntity(input),
        )
    }

    async importThemes(workbook: any) {
        await this.importBase<ThemeEntity>(workbook,
            'Themes',
            ThemeEntity,
            (input) => input,
            async (input) => input.id && getCustomRepository(GenericTheme.repository).updateEntity(input.id, input),
            (input) => getCustomRepository(GenericTheme.repository).createEntity(input),
        )
    }

    async importCMSSettings(workbook: any) {
        const inputs = this.readSheet(workbook, 'CMS settings');
        if (!inputs?.[0]) return;
        try {
            await this.cmsService.updateCmsConfig(inputs[0]);
        } catch (error) {
            getLogger().error(error);
        }
    }
}