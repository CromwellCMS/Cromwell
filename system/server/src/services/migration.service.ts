import {
    EDBEntity,
    TAttributeInput,
    TBasePageEntity,
    TCustomEntityInput,
    TDBEntity,
    TOrderInput,
    TPluginEntity,
    TPostInput,
    TProductCategoryInput,
    TProductInput,
    TProductReviewInput,
    TStockStatus,
    TTagInput,
    TThemeEntity,
    TUpdateUser,
} from '@cromwell/core';
import {
    Attribute,
    AttributeRepository,
    BasePageEntity,
    CmsEntity,
    CustomEntity,
    CustomEntityRepository,
    entityMetaRepository,
    GenericPlugin,
    GenericTheme,
    getCmsEntity,
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

enum ESheetNames {
    Attribute = 'Attributes',
    CMS = 'CMS settings',
    CustomEntity = 'Custom entities',
    Order = 'Orders',
    Plugin = 'Plugins',
    Post = 'Posts',
    PostComment = 'Post comments',
    Product = 'Products',
    ProductCategory = 'Product categories',
    ProductReview = 'Product reviews',
    Tag = 'Post tags',
    Theme = 'Themes',
    User = 'Users',
}
type TBaseEntityRecord = Omit<TBasePageEntity, 'id'> & { id?: number | null };
type TEntityRecord<TEntity> = Record<keyof (TEntity & { id }), string | null | undefined>;
type TImportOptions = {
    workbook: any;
    removeSurplus?: boolean | null;
}

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
            await this.exportCmsSettings(workbook);
        }
        if (entityTypes.includes('CustomEntity') || exportAll) {
            await this.exportCustomEntities(workbook);
        }

        try {
            workbook.deleteSheet("Sheet1");
        } catch (error) { }

        return await workbook.outputAsync();
    }

    public async importDB(req: any, removeSurplus?: string | null | boolean) {
        if (!req.isMultipart()) {
            return
        }
        removeSurplus = this.parseBoolean(removeSurplus);
        const files: any[] = [];

        const parts = req.files();
        for await (const part of parts) {
            files.push(await this.streamToString(part.file));
        }
        if (!files?.length) return;

        for (const file of files) {
            const uint8Array = new Uint8Array(file);
            const workbook = await this.xlsxPopulate.fromDataAsync(uint8Array);

            await this.importUsers({ workbook, removeSurplus });
            await this.importTags({ workbook, removeSurplus });
            await this.importPosts({ workbook, removeSurplus });

            await this.importCategories({ workbook, removeSurplus });
            await this.importAttributes({ workbook, removeSurplus });
            await this.importProducts({ workbook, removeSurplus });
            await this.importReviews({ workbook, removeSurplus });

            await this.importOrders({ workbook, removeSurplus });
            await this.importPlugins({ workbook, removeSurplus });
            await this.importThemes({ workbook, removeSurplus });
            await this.importCmsSettings({ workbook, removeSurplus });
            await this.importCustomEntities({ workbook, removeSurplus });
        }
    }

    private stringifyValue = (value: any): string => {
        if (value === undefined || value === null || value === '' ||
            typeof value === 'undefined') return '';
        if (typeof value === 'object') {
            if (value instanceof Date) {
                if (isNaN(value.getTime())) return '';
                try {
                    return value.toISOString();
                } catch (error) {
                    getLogger().error(error);
                    return '';
                }
            }
            if (Array.isArray(value)) {
                if (!value.length) return '';
            }

            try {
                return JSON.stringify(value);
            } catch (error) {
                getLogger().error(error);
            }
        }
        return String(value);
    }

    private fillSheet(workbook: any, sheetName: ESheetNames, data: Record<string, string | null | undefined | number>[]) {
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
                const cellData = this.stringifyValue(rowData[colName]);
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
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.Post) ?? [];

        const postSheet: Record<keyof TPostInput, any>[] = await Promise.all(posts.map(async ent => ({
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
            customMeta: await entityMetaRepository.getEntityMetaByKeys(EDBEntity.Post, ent.id, metaKeys),
            views: undefined,
        })));

        this.fillSheet(workbook, ESheetNames.Post, postSheet);
    }

    // TAGS
    private async exportTags(workbook: any) {
        const tags = await getCustomRepository(TagRepository).find();
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.Tag) ?? [];

        const tagsSheet: Record<keyof TTagInput, any>[] = await Promise.all(tags.map(async ent => ({
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
            customMeta: await entityMetaRepository.getEntityMetaByKeys(EDBEntity.Tag, ent.id, metaKeys),
            views: undefined,
        })));

        this.fillSheet(workbook, ESheetNames.Tag, tagsSheet);
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
        }));

        this.fillSheet(workbook, ESheetNames.PostComment, commentsSheet);
    }

    // PRODUCTS
    private async exportProducts(workbook: any) {
        const products = await getCustomRepository(ProductRepository).find({
            relations: ['categories', 'attributeValues']
        });
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.Product) ?? [];

        const productsSheet: Record<keyof TProductInput, any>[] = await Promise.all(products.map(async ent => ({
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
            stockStatus: ent.stockStatus,
            stockAmount: ent.stockAmount,
            mainCategoryId: ent.mainCategoryId,
            description: ent.description,
            descriptionDelta: ent.descriptionDelta,
            attributes: this.stringifyValue(await getCustomRepository(ProductRepository).getProductAttributes(ent.id, ent.attributeValues)),
            customMeta: this.stringifyValue(await entityMetaRepository.getEntityMetaByKeys(EDBEntity.Product, ent.id, metaKeys)),
            views: undefined,
        })));

        this.fillSheet(workbook, ESheetNames.Product, productsSheet);
    }

    // CATEGORIES
    private async exportCategories(workbook: any) {
        const categoryRepo = getCustomRepository(ProductCategoryRepository);
        const categories = await getCustomRepository(ProductCategoryRepository).find();
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.ProductCategory) ?? [];

        const categoriesSheet: Record<keyof TProductCategoryInput, any>[] = await Promise.all(categories.map(async ent => ({
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
            customMeta: this.stringifyValue(await entityMetaRepository.getEntityMetaByKeys(EDBEntity.ProductCategory, ent.id, metaKeys)),
            views: undefined,
        })));

        this.fillSheet(workbook, ESheetNames.ProductCategory, categoriesSheet);
    }

    // ATTRIBUTES
    private async exportAttributes(workbook: any) {
        const attributes = await getCustomRepository(AttributeRepository).find({
            relations: ['values']
        });
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.Attribute) ?? [];

        const attributesSheet: Record<keyof TAttributeInput, any>[] = await Promise.all(attributes.map(async ent => ({
            id: ent.id,
            slug: ent.slug,
            title: ent.title,
            pageTitle: ent.pageTitle,
            pageDescription: ent.pageDescription,
            meta: ent.meta,
            createDate: ent.createDate,
            updateDate: ent.updateDate,
            isEnabled: ent.isEnabled,
            key: ent.key,
            values: this.stringifyValue(ent.values),
            type: ent.type,
            icon: ent.icon,
            required: ent.required,
            customMeta: this.stringifyValue(await entityMetaRepository.getEntityMetaByKeys(EDBEntity.Attribute, ent.id, metaKeys)),
            views: undefined,
        })));

        this.fillSheet(workbook, ESheetNames.Attribute, attributesSheet);
    }

    // REVIEWS
    private async exportReviews(workbook: any) {
        const reviews = await getCustomRepository(ProductReviewRepository).find();
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.ProductReview) ?? [];

        const reviewsSheet: Record<keyof TProductReviewInput, any>[] = await Promise.all(reviews.map(async ent => ({
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
            customMeta: await entityMetaRepository.getEntityMetaByKeys(EDBEntity.ProductReview, ent.id, metaKeys),
            views: undefined,
        })));

        this.fillSheet(workbook, ESheetNames.ProductReview, reviewsSheet);
    }

    // ORDERS
    private async exportOrders(workbook: any) {
        const orders = await getCustomRepository(OrderRepository).find();
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.Order) ?? [];

        const ordersSheet: Record<keyof Omit<TOrderInput, 'fromUrl'>, any>[] = await Promise.all(
            orders.map(async ent => ({
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
                customMeta: await entityMetaRepository.getEntityMetaByKeys(EDBEntity.Order, ent.id, metaKeys),
                views: undefined,
            })));

        this.fillSheet(workbook, ESheetNames.Order, ordersSheet);
    }

    // USERS
    private async exportUsers(workbook: any) {
        const users = await getCustomRepository(UserRepository).find();
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.User) ?? [];

        const usersSheet: Record<keyof TUpdateUser, any>[] = await Promise.all(users.map(async ent => ({
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
            customMeta: await entityMetaRepository.getEntityMetaByKeys(EDBEntity.User, ent.id, metaKeys),
            views: undefined,
        })));

        this.fillSheet(workbook, ESheetNames.User, usersSheet);
    }

    // PLUGINS
    private async exportPlugins(workbook: any) {
        const plugins = await PluginEntity.find();
        const pluginsSheet: Record<keyof TPluginEntity, any>[] = plugins.map(ent => ({
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
            customMeta: undefined,
            views: undefined,
        }));

        this.fillSheet(workbook, ESheetNames.Plugin, pluginsSheet);
    }

    // THEMES
    private async exportThemes(workbook: any) {
        const themes = await ThemeEntity.find();
        const themesSheet: Record<keyof TThemeEntity, any>[] = themes.map(ent => ({
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
            customMeta: undefined,
            views: undefined,
        }));

        this.fillSheet(workbook, ESheetNames.Theme, themesSheet);
    }

    // CUSTOM ENTITIES
    private async exportCustomEntities(workbook: any) {
        const customEntities = await getCustomRepository(CustomEntityRepository).find();
        const metaKeys = await entityMetaRepository.getAllEntityMetaKeys(EDBEntity.CustomEntity) ?? [];

        const customEntitiesSheet: Record<keyof TCustomEntityInput, any>[] =
            await Promise.all(customEntities.map(async ent => ({
                id: ent.id,
                slug: ent.slug,
                pageTitle: ent.pageTitle,
                pageDescription: ent.pageDescription,
                meta: ent.meta,
                createDate: ent.createDate,
                updateDate: ent.updateDate,
                isEnabled: ent.isEnabled,
                name: ent.name,
                entityType: ent.entityType,
                customMeta: await entityMetaRepository.getEntityMetaByKeys(EDBEntity.CustomEntity, ent.id, metaKeys),
                views: undefined,
            })));

        this.fillSheet(workbook, ESheetNames.CustomEntity, customEntitiesSheet);
    }

    // CMS
    private async exportCmsSettings(workbook: any) {
        const ent = await getCmsEntity();

        const cmsSheet: Record<string, string | number> = {
            id: ent.id,
            createDate: this.stringifyValue(ent.createDate) ?? '',
            updateDate: this.stringifyValue(ent.updateDate) ?? '',
            publicSettings: this.stringifyValue(ent.publicSettings) ?? '',
            adminSettings: this.stringifyValue(ent.adminSettings) ?? '',
            internalSettings: this.stringifyValue(ent.internalSettings) ?? '',
        }

        this.fillSheet(workbook, ESheetNames.CMS, [cmsSheet]);
    }

    private streamToString(stream) {
        const chunks: any[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        })
    }

    private readSheet<TEntity>(workbook: any, sheetName: ESheetNames): (TEntityRecord<TEntity>)[] | undefined {
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
                let val: string | number | null | boolean = row[j];
                if (val === '' || !val) val = null;
                entity[header[j]] = val;
            }
            entities.push(entity);
        }
        return entities;
    }

    private async importBase<TEntity extends TBaseEntityRecord>({ workbook, sheetName,
        EntityClass, transformInput, update, create, sequentially, modifyInputs, removeSurplus
    }: {
        sheetName: ESheetNames;
        EntityClass: typeof BasePageEntity;
        transformInput: (input: TEntityRecord<TEntity>) => Required<TEntity> | undefined | null | boolean;
        update: (input: TEntity & TBaseEntityRecord) => Promise<any>;
        create: (input: TEntity & TBaseEntityRecord) => Promise<any>;
        sequentially?: boolean;
        modifyInputs?: (inputs: TEntity[] & TBaseEntityRecord) => (TEntity & TBaseEntityRecord)[];
    } & TImportOptions) {
        const sheet = this.readSheet<TEntity>(workbook, sheetName);
        if (!sheet) return;

        let inputs = sheet.map(input => {
            try {
                return transformInput(input);
            } catch (error) {
                getLogger().error(error);
            }
            return null;
        }).filter(Boolean) as TEntity[];
        if (!inputs?.length) return;

        if (modifyInputs) {
            inputs = modifyInputs(inputs);
        }

        let dbEntityIds: { id: number }[] = await EntityClass.find({ select: ['id'] });

        if (removeSurplus) {
            // Remove from DB that aren't in the sheet
            dbEntityIds = (await Promise.all(dbEntityIds.map(async entity => {
                if (!inputs.find(input => input.id + '' === entity.id + '')) {
                    try {
                        await EntityClass.delete(entity.id);
                    } catch (error) {
                        getLogger().error(error);
                    }
                    return null;
                }
                return entity;
            }))).filter(Boolean) as { id: number }[];
        }

        const importEntity = async (input: TEntity) => {
            const dbEntity = input.id && dbEntityIds.find(ent => ent.id + '' === input.id + '');
            if (dbEntity && dbEntity.id) {
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
        }

        if (sequentially) {
            for (const input of inputs) {
                await importEntity(input);
            }
        } else {
            await Promise.all(inputs.map(importEntity));
        }

    }

    private parseJson(json: any) {
        if (!json) return null;
        if (typeof json === 'object') return json;
        if (typeof json === 'string') {
            try {
                return JSON.parse(json);
            } catch (error) {
                getLogger().error(error);
            }
        }
        return null;
    }

    private parseIds(ids: any): number[] | null {
        if (!ids) return null;
        if (typeof ids === 'number') return [ids];
        if (typeof ids === 'string') return ids.split(',').map(Number).filter(Boolean);
        if (Array.isArray(ids)) return ids.map(Number).filter(Boolean);
        return null;
    }

    private parseDate = (input: string | number | null | undefined): Date | null => {
        if (!input) return null;
        try {
            const date = new Date(input);
            if (isNaN(date.getTime())) return null;
            return date;
        } catch (error) {
            getLogger().error(error);
        }
        return null;
    }

    private parseBoolean(input: string | null | undefined | boolean): boolean | null {
        if (typeof input === 'boolean') return input;
        if (!input) return null;
        if (input === 'true') return true;
        if (input === 'false') return false;
        return null;
    }

    private parseNumber(input: string | null | undefined): number | null {
        if (typeof input === 'number') return input;
        if (!input) return null;
        const num = Number(input);
        if (isNaN(num)) return null;
        return num;
    }

    private parseBaseInput<TEntity extends TBaseEntityRecord>
        (input: TEntityRecord<TEntity>): Required<TBaseEntityRecord> {
        return {
            id: this.parseNumber(input.id),
            slug: input.slug || null,
            pageTitle: input.pageTitle || null,
            pageDescription: input.pageDescription || null,
            meta: this.parseJson(input.meta),
            createDate: this.parseDate(input.createDate),
            updateDate: this.parseDate(input.updateDate),
            isEnabled: this.parseBoolean(input.isEnabled),
            customMeta: this.parseJson(input.customMeta),
            views: null,
        }
    }

    private async importTags(options: TImportOptions) {
        await this.importBase<TTagInput>({
            ...options,
            sheetName: ESheetNames.Tag,
            EntityClass: Tag,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                name: input.name || null,
                color: input.color || null,
                image: input.image || null,
                description: input.description || null,
                descriptionDelta: input.descriptionDelta || null,
                views: null,
            }),
            update: async (input) => input.id && getCustomRepository(TagRepository).updateTag(input.id, input),
            create: (input) => getCustomRepository(TagRepository).createTag(input, input.id),
        })
    }

    private async importPosts(options: TImportOptions) {
        await this.importBase<TPostInput>({
            ...options,
            sheetName: ESheetNames.Post,
            EntityClass: Post,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                title: input.title || null,
                authorId: this.parseNumber(input.authorId),
                mainImage: input.mainImage || null,
                readTime: input.readTime || null,
                content: input.content || null,
                delta: input.delta || null,
                excerpt: input.excerpt || null,
                published: this.parseBoolean(input.published),
                publishDate: this.parseDate(input.publishDate),
                featured: this.parseBoolean(input.featured),
                tagIds: this.parseIds(input.tagIds),
            }),
            update: async (input) => input.id && getCustomRepository(PostRepository).updatePost(input.id, input),
            create: (input) => getCustomRepository(PostRepository).createPost(input, input.id),
        })
    }

    private async importCategories(options: TImportOptions) {
        await this.importBase<TProductCategoryInput>({
            ...options,
            sheetName: ESheetNames.ProductCategory,
            EntityClass: ProductCategory,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                parentId: this.parseNumber(input.parentId),
                name: input.name || null,
                mainImage: input.mainImage || null,
                description: input.description || null,
                descriptionDelta: input.descriptionDelta || null,
                views: null,
            }),
            update: async (input) => input.id && getCustomRepository(ProductCategoryRepository).updateProductCategory(input.id, input),
            create: (input) => getCustomRepository(ProductCategoryRepository).createProductCategory(input, input.id),
            sequentially: true,
            modifyInputs: (inputs: (TProductCategoryInput & { id?: number | null })[]) => {
                // Sort inputs the way a parent always go before a child
                const modified: TProductCategoryInput[] = [];

                const collectParentsChain = (input: TProductCategoryInput, parents: TProductCategoryInput[]): TProductCategoryInput[] => {
                    if (!input?.parentId || input.parentId + '' == '') {
                        input.parentId = null;
                        return parents;
                    }
                    const parent = inputs.find(elem => elem.id === input.parentId);
                    if (!parent) {
                        input.parentId = null;
                    }
                    if (parent) {
                        collectParentsChain(parent, parents);
                        parents.push(parent);
                    }
                    return parents;
                }

                for (const input of inputs) {
                    if (!input.parentId || input.parentId + '' == '') {
                        modified.push(input);
                        continue;
                    }
                    const parents = collectParentsChain(input, []);

                    if (!parents?.length) {
                        modified.push(input);
                        continue;
                    }

                    for (const parent of parents) {
                        if (!modified.includes(parent)) {
                            modified.push(parent);
                        }
                    }
                    modified.push(input);
                }

                return modified;
            }
        });
    }

    private async importAttributes(options: TImportOptions) {
        await this.importBase<TAttributeInput>({
            ...options,
            sheetName: ESheetNames.Attribute,
            EntityClass: Attribute,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                key: input.key || null,
                title: input.title || null,
                type: input.type as any || null,
                icon: input.icon || null,
                required: this.parseBoolean(input.required),
                values: this.parseJson(input.values),
            }),
            update: async (input) => input.id && getCustomRepository(AttributeRepository).updateAttribute(input.id, input),
            create: (input) => getCustomRepository(AttributeRepository).createAttribute(input, input.id),
        })
    }

    private async importProducts(options: TImportOptions) {
        await this.importBase<TProductInput>({
            ...options,
            sheetName: ESheetNames.Product,
            EntityClass: Product,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                categoryIds: this.parseIds(input.categoryIds),
                attributes: this.parseJson(input.attributes),
                images: this.parseJson(input.images),
                name: input.name || null,
                mainCategoryId: this.parseNumber(input.mainCategoryId),
                price: this.parseNumber(input.price),
                oldPrice: this.parseNumber(input.oldPrice),
                sku: input.sku || null,
                mainImage: input.mainImage || null,
                description: input.description || null,
                descriptionDelta: input.descriptionDelta || null,
                stockAmount: this.parseNumber(input.stockAmount),
                stockStatus: input.stockStatus as TStockStatus || null,
                views: null,

            }),
            update: async (input) => input.id && getCustomRepository(ProductRepository).updateProduct(input.id, input),
            create: (input) => getCustomRepository(ProductRepository).createProduct(input, input.id),
        })
    }

    private async importReviews(options: TImportOptions) {
        await this.importBase<TProductReviewInput>({
            ...options,
            sheetName: ESheetNames.ProductReview,
            EntityClass: ProductReview,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                productId: this.parseNumber(input.productId),
                title: input.title || null,
                description: input.description || null,
                rating: this.parseNumber(input.rating),
                userName: input.userName || null,
                userEmail: input.userEmail || null,
                userId: this.parseNumber(input.userId),
                approved: this.parseBoolean(input.approved),
            }),
            update: async (input) => input.id && getCustomRepository(ProductReviewRepository).updateProductReview(input.id, input),
            create: (input) => getCustomRepository(ProductReviewRepository).createProductReview(input, input.id),
        })
    }

    private async importOrders(options: TImportOptions) {
        await this.importBase<TOrderInput>({
            ...options,
            sheetName: ESheetNames.Order,
            EntityClass: Order as any,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                status: input.status || null,
                cart: input.cart || null,
                orderTotalPrice: this.parseNumber(input.orderTotalPrice),
                cartTotalPrice: this.parseNumber(input.cartTotalPrice),
                cartOldTotalPrice: this.parseNumber(input.cartOldTotalPrice),
                shippingPrice: this.parseNumber(input.shippingPrice),
                totalQnt: this.parseNumber(input.totalQnt),
                userId: this.parseNumber(input.userId),
                customerName: input.customerName || null,
                customerPhone: input.customerPhone || null,
                customerEmail: input.customerEmail || null,
                customerAddress: input.customerAddress || null,
                customerComment: input.customerComment || null,
                shippingMethod: input.shippingMethod || null,
                paymentMethod: input.paymentMethod || null,
                fromUrl: input.fromUrl || null,
                currency: input.currency || null,
            }),
            update: async (input) => input.id && getCustomRepository(OrderRepository).updateOrder(input.id, input),
            create: (input) => getCustomRepository(OrderRepository).createOrder(input, input.id),
        })
    }

    private async importUsers(options: TImportOptions) {
        await this.importBase<TUpdateUser>({
            ...options,
            sheetName: ESheetNames.User,
            EntityClass: User,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                fullName: input.fullName || null,
                email: input.email || null,
                avatar: input.avatar || null,
                bio: input.bio || null,
                phone: input.phone || null,
                address: input.address || null,
                role: input.role as any || null,
            }),
            update: async (input) => input.id && getCustomRepository(UserRepository).updateUser(input.id, input),
            create: (input) => getCustomRepository(UserRepository).createUser({
                ...input,
                password: cryptoRandomString({ length: 14, type: 'url-safe' }),
            }, input.id),
        })
    }

    private async importPlugins(options: TImportOptions) {
        await this.importBase<Omit<TPluginEntity, 'id'>>({
            ...options,
            sheetName: ESheetNames.Plugin,
            EntityClass: PluginEntity,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                name: input.name ?? null,
                version: input.version ?? null,
                title: input.title ?? null,
                isInstalled: this.parseBoolean(input.isInstalled),
                hasAdminBundle: this.parseBoolean(input.hasAdminBundle),
                settings: input.settings ?? null,
                defaultSettings: input.defaultSettings ?? null,
                moduleInfo: input.moduleInfo ?? null,
                isUpdating: null,
            }),
            update: async (input) => input.id && getCustomRepository(GenericPlugin.repository).updateEntity(input.id, input),
            create: (input) => getCustomRepository(GenericPlugin.repository).createEntity(input, input.id),
        })
    }

    private async importThemes(options: TImportOptions) {
        await this.importBase<Omit<TThemeEntity, 'id'>>({
            ...options,
            sheetName: ESheetNames.Theme,
            EntityClass: ThemeEntity,
            transformInput: (input) => ({
                ...this.parseBaseInput(input),
                name: input.name ?? null,
                version: input.version ?? null,
                title: input.title ?? null,
                isInstalled: this.parseBoolean(input.isInstalled),
                hasAdminBundle: this.parseBoolean(input.hasAdminBundle),
                settings: input.settings ?? null,
                defaultSettings: input.defaultSettings ?? null,
                moduleInfo: input.moduleInfo ?? null,
                isUpdating: null,
            }),
            update: async (input) => input.id && getCustomRepository(GenericTheme.repository).updateEntity(input.id, input),
            create: (input) => getCustomRepository(GenericTheme.repository).createEntity(input, input.id),
        });
    }

    private async importCustomEntities(options: TImportOptions) {
        await this.importBase<TCustomEntityInput>({
            ...options,
            sheetName: ESheetNames.CustomEntity,
            EntityClass: CustomEntity,
            transformInput: (input) => !!input.entityType && ({
                ...this.parseBaseInput(input),
                entityType: input.entityType,
                name: input.name || null,
            }),
            update: async (input) => input.id && getCustomRepository(CustomEntityRepository).updateCustomEntity(input.id, input),
            create: (input) => getCustomRepository(CustomEntityRepository).createCustomEntity(input, input.id),
        });
    }


    private async importCmsSettings(options: TImportOptions) {
        const inputs = this.readSheet<Record<keyof CmsEntity, string | null | undefined | boolean>>(options.workbook,
            ESheetNames.CMS);
        if (!inputs?.[0]) return;
        try {
            const entity = await getCmsEntity();
            if (!entity) throw new Error('importCmsSettings: !entity');
            entity.publicSettings = this.parseJson(inputs[0].publicSettings);
            entity.adminSettings = this.parseJson(inputs[0].adminSettings);
            entity.internalSettings = this.parseJson(inputs[0].internalSettings);

            await entity.save();
        } catch (error) {
            getLogger().error(error);
        }
    }
}