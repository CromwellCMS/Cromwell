import {
    ApolloClient,
    ApolloQueryResult,
    createHttpLink,
    gql,
    InMemoryCache,
    NormalizedCacheObject,
    QueryOptions,
    MutationOptions,
    DocumentNode
} from '@apollo/client';
import {
    apiMainRoute,
    apiExtensionRoute,
    getStoreItem,
    GraphQLPaths,
    serviceLocator,
    setStoreItem,
    TAttribute,
    TAttributeInput,
    TPagedList,
    TPagedParams,
    TProduct,
    TProductCategory,
    TProductInput,
    TProductReview,
    TProductReviewInput,
    TPost,
    TPostInput,
    TProductCategoryInput,
    TProductFilter,
    TFilteredProductList,
    TPostFilter,
    TDBEntity,
    TUser,
    TCreateUser,
    TUpdateUser,
    TProductCategoryFilter,
    TOrder,
    TOrderInput,
    TDeleteManyInput,
    TOrderFilter,
    TUserFilter,
    TTag,
    TProductReviewFilter,
    TTagInput,
    isServer,
} from '@cromwell/core';
import { fetch as isomorphicFetch } from '../helpers/isomorphicFetch'

class CGraphQLClient {

    private readonly apolloClient: ApolloClient<NormalizedCacheObject>;
    private onUnauthorized: (() => any) | null = null;
    private onErrorCallbacks: Record<string, ((message: string) => any)> = {};

    constructor(private baseUrl: string, fetch?: any) {

        if (isServer() && !fetch) {
            fetch = isomorphicFetch;
        }

        const cache = new InMemoryCache();
        const link = createHttpLink({
            uri: this.baseUrl,
            credentials: 'include',
            fetch
        });
        this.apolloClient = new ApolloClient({
            cache: cache,
            link: link,
            name: 'cromwell-core-client',
            queryDeduplication: false,
            defaultOptions: {
                query: {
                    fetchPolicy: 'network-only',
                },
                watchQuery: {
                    fetchPolicy: 'cache-and-network',
                },
            },
        });
    }

    public async query<T = any>(options: QueryOptions, path: string): Promise<T>;
    public async query<T = any>(options: QueryOptions): Promise<ApolloQueryResult<T>>;

    public async query(options: QueryOptions, path?: string) {
        const res = await this.handleError(() => this.apolloClient.query(options))
        if (path) return this.returnData(res, path);
        return res;
    }


    public async mutate<T = any>(options: MutationOptions, path: string): Promise<T>;
    public async mutate<T = any>(options: MutationOptions): Promise<ReturnType<ApolloClient<T>['mutate']>>;

    public async mutate(options: MutationOptions, path?: string) {
        const res = await this.handleError(() => this.apolloClient.mutate(options))
        if (path) return this.returnData(res, path);
        return res;
    }

    private async handleError<T>(func: () => Promise<T>): Promise<T> {
        try {
            return await func();
        } catch (e) {
            Object.values(this.onErrorCallbacks).forEach(cb => cb(e?.message));

            if (e?.message?.includes?.('Access denied') && !isServer()) {
                if (this.onUnauthorized) this.onUnauthorized();
            }

            throw new Error(e);
        }
    }

    public returnData = (res: any, path: string) => {
        const data = res?.data?.[path];
        if (data) {
            // Data may be cached, and if it is modified somewhere in the app, 
            // next request can possibly return modified data instead of original.
            // Just to make sure all object references inside are new:
            return JSON.parse(JSON.stringify(data));
        }
        const errors = res?.errors;
        return errors ?? null;
    }

    public setOnUnauthorized(func: (() => any) | null) {
        this.onUnauthorized = func;
    }

    public onError(cb: ((message: string) => any), id?: string) {
        if (!id) id = Object.keys(this.onErrorCallbacks).length + '';
        this.onErrorCallbacks[id] = cb;
    }

    public PagedMetaFragment = gql`
        fragment PagedMetaFragment on PagedMeta {
            pageNumber
            pageSize
            totalPages
            totalElements
        }
    `;


    public createGetMany<TEntity>(entityName: TDBEntity, nativeFragment: DocumentNode, nativeFragmentName: string) {
        const path = GraphQLPaths[entityName].getMany;

        return (pagedParams?: TPagedParams<TEntity>, customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TEntity>> => {
            const fragment = customFragment ?? nativeFragment;
            const fragmentName = customFragmentName ?? nativeFragmentName;

            return this.query({
                query: gql`
              query core${path}($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...${fragmentName}
                      }
                  }
              }
              ${fragment}
              ${this.PagedMetaFragment}
          `,
                variables: {
                    pagedParams: pagedParams ?? {},
                }
            }, path);
        }
    }


    public createGetById<TEntity>(entityName: TDBEntity, nativeFragment: DocumentNode, nativeFragmentName: string) {
        const path = GraphQLPaths[entityName].getOneById;

        return (id: string, customFragment?: DocumentNode, customFragmentName?: string): Promise<TEntity | undefined> => {
            const fragment = customFragment ?? nativeFragment;
            const fragmentName = customFragmentName ?? nativeFragmentName;

            return this.query({
                query: gql`
              query core${path}($id: String!) {
                  ${path}(id: $id) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
                variables: {
                    id,
                }
            }, path);
        }
    }

    public createGetBySlug<TEntity>(entityName: TDBEntity, nativeFragment: DocumentNode, nativeFragmentName: string) {
        const path = GraphQLPaths[entityName].getOneBySlug;

        return (slug: string, customFragment?: DocumentNode, customFragmentName?: string): Promise<TEntity | undefined> => {
            const fragment = customFragment ?? nativeFragment;
            const fragmentName = customFragmentName ?? nativeFragmentName;

            return this.query({
                query: gql`
              query core${path}($slug: String!) {
                  ${path}(slug: $slug) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
                variables: {
                    slug,
                }
            }, path);
        }
    }

    public createUpdateEntiy<TEntity, TInput>(entityName: TDBEntity, inputName: string, nativeFragment: DocumentNode, nativeFragmentName: string) {
        const path = GraphQLPaths[entityName].update;

        return (id: string, data: TInput, customFragment?: DocumentNode, customFragmentName?: string): Promise<TEntity> => {
            const fragment = customFragment ?? nativeFragment;
            const fragmentName = customFragmentName ?? nativeFragmentName;

            return this.mutate({
                mutation: gql`
                mutation core${path}($id: String!, $data: ${inputName}!) {
                    ${path}(id: $id, data: $data) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
                variables: {
                    id,
                    data,
                }
            }, path);
        }
    }


    public createCreateEntity<TEntity, TInput>(entityName: TDBEntity, inputName: string, nativeFragment: DocumentNode, nativeFragmentName: string) {
        const path = GraphQLPaths[entityName].create;

        return (data: TInput, customFragment?: DocumentNode, customFragmentName?: string): Promise<TEntity> => {
            const fragment = customFragment ?? nativeFragment;
            const fragmentName = customFragmentName ?? nativeFragmentName;

            return this.mutate({
                mutation: gql`
                mutation core${path}($data: ${inputName}!) {
                    ${path}(data: $data) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
                variables: {
                    data,
                }
            }, path);
        }
    }

    public createDeleteEntity(entityName: TDBEntity) {
        const path = GraphQLPaths[entityName].delete;
        return (id: string) => {
            return this.mutate({
                mutation: gql`
                mutation core${path}($id: String!) {
                    ${path}(id: $id)
                }
            `,
                variables: {
                    id,
                }
            }, path);
        }
    }

    public createDeleteMany(entityName: TDBEntity) {
        const path = GraphQLPaths[entityName].deleteMany;
        return (input: TDeleteManyInput) => {
            return this.mutate({
                mutation: gql`
                mutation core${path}($data: DeleteManyInput!) {
                    ${path}(data: $data)
                }
            `,
                variables: {
                    data: input,
                }
            }, path);
        }
    }

    public createDeleteManyFiltered<TFilter>(entityName: TDBEntity, filterName: string) {
        const path = GraphQLPaths[entityName].deleteManyFiltered;

        return (input: TDeleteManyInput, filterParams?: TFilter) => {
            return this.mutate({
                mutation: gql`
                mutation core${path}($input: DeleteManyInput!, $filterParams: ${filterName}) {
                    ${path}(input: $input, filterParams: $filterParams)
                }
            `,
                variables: {
                    input,
                    filterParams
                }
            }, path);
        }
    }

    public createGetFiltered<TEntity, TFilter>(entityName: TDBEntity, nativeFragment: DocumentNode,
        nativeFragmentName: string, filterName: string) {
        const path = GraphQLPaths[entityName].getFiltered;

        return ({ pagedParams, filterParams, customFragment, customFragmentName }: {
            pagedParams?: TPagedParams<TEntity>;
            filterParams?: TFilter;
            customFragment?: DocumentNode;
            customFragmentName?: string;
        }) => {
            const fragment = customFragment ?? nativeFragment;
            const fragmentName = customFragmentName ?? nativeFragmentName;

            return this.query({
                query: gql`
                query core${path}($pagedParams: PagedParamsInput, $filterParams: ${filterName}) {
                    ${path}(pagedParams: $pagedParams, filterParams: $filterParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...${fragmentName}
                        }
                    }
                }
                ${fragment}
                ${this.PagedMetaFragment}
            `,
                variables: {
                    pagedParams: pagedParams ?? {},
                    filterParams,
                }
            }, path);
        }
    }


    // < Generic CRUD >

    public getAllEntities = async <EntityType>(entityName: string, fragment: DocumentNode, fragmentName: string): Promise<EntityType[]> => {
        const path = GraphQLPaths.Generic.getMany + entityName;
        return this.query({
            query: gql`
                query coreGenericGetEntities {
                    ${path} {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `
        }, path);
    }

    public getEntityById = async <EntityType>(entityName: string, fragment: DocumentNode, fragmentName: string, entityId: string)
        : Promise<EntityType | undefined> => {
        const path = GraphQLPaths.Generic.getOneById + entityName;
        return this.query({
            query: gql`
                query coreGenericGetEntityById($entityId: String!) {
                    ${path}(id: $entityId) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
            variables: {
                entityId,
            }
        }, path);
    }

    public updateEntity = async <EntityType, EntityInputType>(entityName: string, entityInputName: string, fragment: DocumentNode,
        fragmentName: string, entityId: string, data: EntityInputType): Promise<EntityType | undefined> => {
        const path = GraphQLPaths.Generic.update + entityName;
        return this.mutate({
            mutation: gql`
                mutation coreGenericUpdateEntity($entityId: String!, $data: ${entityInputName}!) {
                    ${path}(id: $entityId, data: $data) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
            variables: {
                entityId,
                data,
            }
        }, path);
    }

    public createEntity = async <EntityType, EntityInputType>(entityName: string, entityInputName: string, fragment: DocumentNode,
        fragmentName: string, data: EntityInputType): Promise<EntityType | undefined> => {
        const path = GraphQLPaths.Generic.create + entityName;
        return this.mutate({
            mutation: gql`
                mutation coreGenericCreateEntity($data: ${entityInputName}!) {
                    ${path}(data: $data) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
            variables: {
                data,
            }
        }, path);
    }

    // < Generic CRUD >


    // <Product>

    public ProductFragment = gql`
        fragment ProductFragment on Product {
            id
            slug
            createDate
            updateDate
            isEnabled
            pageTitle
            name
            price
            oldPrice
            mainImage
            images
            description
            views
            rating {
                average
                reviewsNumber
            }
            attributes {
                key
                values {
                    value
                    productVariant {
                        name
                        price
                        oldPrice
                        mainImage
                        images
                        description
                    }
                }
            }
        }
    `;

    public getProducts = this.createGetMany<TProduct>('Product', this.ProductFragment, 'ProductFragment');
    public getProductById = this.createGetById<TProduct>('Product', this.ProductFragment, 'ProductFragment');
    public getProductBySlug = this.createGetBySlug<TProduct>('Product', this.ProductFragment, 'ProductFragment');
    public updateProduct = this.createUpdateEntiy<TProduct, TProductInput>('Product', 'UpdateProduct', this.ProductFragment, 'ProductFragment')
    public createProduct = this.createCreateEntity<TProduct, TProductInput>('Product', 'CreateProduct', this.ProductFragment, 'ProductFragment');
    public deleteProduct = this.createDeleteEntity('Product');
    public deleteManyProducts = this.createDeleteMany('Product');
    public deleteManyFilteredProducts = this.createDeleteManyFiltered<TProductFilter>('Product', 'ProductFilterInput');



    public getProductsFromCategory = async (categoryId: string, pagedParams?: TPagedParams<TProduct>): Promise<TPagedList<TProduct>> => {
        const path = GraphQLPaths.Product.getFromCategory;
        return this.query({
            query: gql`
                query coreGetProductsFromCategory($categoryId: String!, $pagedParams: PagedParamsInput!) {
                    ${path}(categoryId: $categoryId, pagedParams: $pagedParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...ProductFragment
                        }
                    }
                }
                ${this.ProductFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                pagedParams: pagedParams ?? {},
                categoryId
            }
        }, path);
    }

    public getFilteredProducts = async (
        { categoryId, pagedParams, filterParams, customFragment, customFragmentName }: {
            categoryId?: string
            pagedParams?: TPagedParams<TProduct>;
            filterParams?: TProductFilter;
            customFragment?: DocumentNode;
            customFragmentName?: string;
        }): Promise<TFilteredProductList> => {
        const path = GraphQLPaths.Product.getFiltered;

        const fragment = customFragment ?? this.ProductFragment;
        const fragmentName = customFragmentName ?? 'ProductFragment';

        return this.query({
            query: gql`
                query getFilteredProducts($pagedParams: PagedParamsInput, $filterParams: ProductFilterInput, $categoryId: String) {
                    ${path}(categoryId: $categoryId, pagedParams: $pagedParams, filterParams: $filterParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        filterMeta {
                            minPrice
                            maxPrice
                        }
                        elements {
                            ...${fragmentName}
                        }
                    }
                }
                ${fragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                pagedParams: pagedParams ?? {},
                filterParams,
                categoryId,
            }
        }, path);
    }

    // </Product>


    // <ProductCategory>

    public ProductCategoryFragment = gql`
        fragment ProductCategoryFragment on ProductCategory {
            id
            slug
            createDate
            updateDate
            isEnabled
            pageTitle
            name
            mainImage
            description
            children {
                id
                slug
            }
            parent {
                id
                slug
            }
        }
    `;

    public getProductCategories = this.createGetMany<TProductCategory>('ProductCategory', this.ProductCategoryFragment, 'ProductCategoryFragment');
    public getProductCategoryById = this.createGetById<TProductCategory>('ProductCategory', this.ProductCategoryFragment, 'ProductCategoryFragment');
    public getProductCategoryBySlug = this.createGetBySlug<TProductCategory>('ProductCategory', this.ProductCategoryFragment, 'ProductCategoryFragment');
    public updateProductCategory = this.createUpdateEntiy<TProductCategory, TProductCategoryInput>('ProductCategory', 'UpdateProductCategory', this.ProductCategoryFragment, 'ProductCategoryFragment')
    public createProductCategory = this.createCreateEntity<TProductCategory, TProductCategoryInput>('ProductCategory', 'CreateProductCategory', this.ProductCategoryFragment, 'ProductCategoryFragment');
    public deleteProductCategory = this.createDeleteEntity('ProductCategory');
    public deleteManyProductCategories = this.createDeleteMany('ProductCategory');
    public deleteManyFilteredProductCategories = this.createDeleteManyFiltered<TProductCategoryFilter>('ProductCategory', 'ProductCategoryFilterInput');
    public getFilteredProductCategories = this.createGetFiltered<TProductCategory, TProductCategoryFilter>('ProductCategory', this.ProductCategoryFragment, 'ProductCategoryFragment', 'ProductCategoryFilterInput');

    public getRootCategories = async (customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TProductCategory> | undefined> => {
        const path = GraphQLPaths.ProductCategory.getRootCategories;
        const fragment = customFragment ?? this.ProductCategoryFragment;
        const fragmentName = customFragmentName ?? 'ProductCategoryFragment';

        return this.query({
            query: gql`
            query coreGetRootCategories {
                ${path} {
                    pagedMeta {
                        ...PagedMetaFragment
                    }
                    elements {
                        ...${fragmentName}
                    }
                }
            }
            ${fragment}
            ${this.PagedMetaFragment}
        `,
        }, path);
    }

    // </ProductCategory>


    // <Attribute>

    public AttributeFragment = gql`
       fragment AttributeFragment on Attribute {
            id
            slug
            pageTitle
            createDate
            updateDate
            isEnabled
            key
            values {
                value
                icon
            }
            type
            required
       }
   `;

    public getAttributeById = this.createGetById<TAttribute>('Attribute', this.AttributeFragment, 'AttributeFragment');
    public updateAttribute = this.createUpdateEntiy<TAttribute, TAttributeInput>('Attribute', 'AttributeInput', this.AttributeFragment, 'AttributeFragment')
    public createAttribute = this.createCreateEntity<TAttribute, TAttributeInput>('Attribute', 'AttributeInput', this.AttributeFragment, 'AttributeFragment');
    public deleteAttribute = this.createDeleteEntity('Attribute');

    public getAttributes = async (): Promise<TAttribute[] | undefined> => {
        const path = GraphQLPaths.Attribute.getMany;
        return this.query({
            query: gql`
                query coreGetAttributes {
                    ${path} {
                        ...AttributeFragment
                    }
                }
                ${this.AttributeFragment}
           `
        }, path);
    }

    // </Attribute>


    // <ProductReview>

    public ProductReviewFragment = gql`
        fragment ProductReviewFragment on ProductReview {
            id
            productId
            title
            description
            rating
            userName
            userId
            approved
            isEnabled
            createDate
            updateDate
        }
  `

    public getProductReviews = this.createGetMany<TProductReview>('ProductReview', this.ProductReviewFragment, 'ProductReviewFragment');
    public getProductReviewById = this.createGetById<TProductReview>('ProductReview', this.ProductReviewFragment, 'ProductReviewFragment');
    public updateProductReview = this.createUpdateEntiy<TProductReview, TProductReviewInput>('ProductReview', 'ProductReviewInput', this.ProductReviewFragment, 'ProductReviewFragment')
    public createProductReview = this.createCreateEntity<TProductReview, TProductReviewInput>('ProductReview', 'ProductReviewInput', this.ProductReviewFragment, 'ProductReviewFragment');
    public deleteProductReview = this.createDeleteEntity('ProductReview');
    public deleteManyProductReviews = this.createDeleteMany('ProductReview');
    public deleteManyFilteredProductReviews = this.createDeleteManyFiltered<TProductReviewFilter>('ProductReview', 'ProductReviewFilter');
    public getFilteredProductReviews = this.createGetFiltered<TProductReview, TProductReviewFilter>('ProductReview', this.ProductReviewFragment, 'ProductReviewFragment', 'ProductReviewFilter');

    // </ProductReview>


    // <Post>

    public PostFragment = gql`
        fragment PostFragment on Post {
            id
            slug
            pageTitle
            createDate
            updateDate
            isEnabled
            title
            author {
                id
                fullName
                email
                avatar
            }
            mainImage
            readTime
            tags {
                id
                slug
                name
                color
            }
            content
            publishDate
            published
      }
    `;

    public getPosts = this.createGetMany<TPost>('Post', this.PostFragment, 'PostFragment');
    public getPostById = this.createGetById<TPost>('Post', this.PostFragment, 'PostFragment');
    public getPostBySlug = this.createGetBySlug<TPost>('Post', this.PostFragment, 'PostFragment');
    public updatePost = this.createUpdateEntiy<TPost, TPostInput>('Post', 'UpdatePost', this.PostFragment, 'PostFragment')
    public createPost = this.createCreateEntity<TPost, TPostInput>('Post', 'CreatePost', this.PostFragment, 'PostFragment');
    public deletePost = this.createDeleteEntity('Post');
    public deleteManyPosts = this.createDeleteMany('Post');
    public deleteManyFilteredPosts = this.createDeleteManyFiltered<TPostFilter>('Post', 'PostFilterInput');
    public getFilteredPosts = this.createGetFiltered<TPost, TPostFilter>('Post', this.PostFragment, 'PostFragment', 'PostFilterInput');




    // </Post>



    // <User>

    public UserFragment = gql`
        fragment UserFragment on User {
            id
            slug
            createDate
            updateDate
            isEnabled
            pageTitle
            fullName
            email
            avatar
            bio
            phone
            address
            role
        }
    `;

    public getUsers = this.createGetMany<TUser>('User', this.UserFragment, 'UserFragment');
    public getUserById = this.createGetById<TUser>('User', this.UserFragment, 'UserFragment');
    public getUserBySlug = this.createGetBySlug<TUser>('User', this.UserFragment, 'UserFragment');
    public updateUser = this.createUpdateEntiy<TUser, TUpdateUser>('User', 'UpdateUser', this.UserFragment, 'UserFragment')
    public createUser = this.createCreateEntity<TUser, TCreateUser>('User', 'CreateUser', this.UserFragment, 'UserFragment');
    public deleteUser = this.createDeleteEntity('User');
    public deleteManyUsers = this.createDeleteMany('User');
    public deleteManyFilteredUsers = this.createDeleteManyFiltered<TUserFilter>('User', 'UserFilterInput');
    public getFilteredUsers = this.createGetFiltered<TUser, TUserFilter>('User', this.UserFragment, 'UserFragment', 'UserFilterInput');

    // </User>


    // <Order>

    public OrderFragment = gql`
        fragment OrderFragment on Order {
            id
            slug
            createDate
            updateDate
            isEnabled
            status
            cart
            orderTotalPrice
            cartTotalPrice
            cartOldTotalPrice
            shippingPrice
            totalQnt
            userId
            customerEmail
            customerName
            customerPhone
            customerAddress
            customerComment
            shippingMethod
        }
    `;


    public getOrders = this.createGetMany<TOrder>('Order', this.OrderFragment, 'OrderFragment');
    public getOrderById = this.createGetById<TOrder>('Order', this.OrderFragment, 'OrderFragment');
    public getOrderBySlug = this.createGetBySlug<TOrder>('Order', this.OrderFragment, 'OrderFragment');
    public updateOrder = this.createUpdateEntiy<TOrder, TOrderInput>('Order', 'InputOrder', this.OrderFragment, 'OrderFragment')
    public createOrder = this.createCreateEntity<TOrder, TOrderInput>('Order', 'InputOrder', this.OrderFragment, 'OrderFragment');
    public deleteOrder = this.createDeleteEntity('Order');
    public deleteManyOrders = this.createDeleteMany('Order');
    public deleteManyFilteredOrders = this.createDeleteManyFiltered<TOrderFilter>('Order', 'OrderFilterInput');
    public getFilteredOrders = this.createGetFiltered<TOrder, TOrderFilter>('Order', this.OrderFragment, 'OrderFragment', 'OrderFilterInput');

    // </Order>


    // <Tag>

    public TagFragment = gql`
        fragment TagFragment on Tag {
            id
            slug
            createDate
            updateDate
            isEnabled
            name
            color
            image
            description
        }
    `;

    public getTags = this.createGetMany<TTag>('Tag', this.TagFragment, 'TagFragment');
    public getTagById = this.createGetById<TTag>('Tag', this.TagFragment, 'TagFragment');
    public getTagBySlug = this.createGetBySlug<TTag>('Tag', this.TagFragment, 'TagFragment');
    public updateTag = this.createUpdateEntiy<TTag, TTagInput>('Tag', 'InputTag', this.TagFragment, 'TagFragment')
    public createTag = this.createCreateEntity<TTag, TTagInput>('Tag', 'InputTag', this.TagFragment, 'TagFragment');
    public deleteTag = this.createDeleteEntity('Tag');
    public deleteManyTags = this.createDeleteMany('Tag');


    // <Plugin>

    public PluginFragment = gql`
        fragment PluginFragment on Plugin {
            id
            slug
            pageTitle
            createDate
            updateDate
            isEnabled
            name
            title
            isInstalled
            hasAdminBundle
            settings
            defaultSettings
        }
    `;
    // </Plugin>


    // <Theme>

    public ThemeFragment = gql`
        fragment ThemeFragment on Theme {
            id
            slug
            pageTitle
            createDate
            updateDate
            isEnabled
            name
            isInstalled
            hasAdminBundle
            settings
            defaultSettings
        }
    `;
    // </Theme>

}

export type TCGraphQLClient = CGraphQLClient;

export const getGraphQLClient = (serverType: 'main' | 'plugin' = 'main', fetch?: any): CGraphQLClient => {
    let clients = getStoreItem('apiClients');
    if (serverType === 'main' && clients?.mainGraphQLClient) return clients.mainGraphQLClient;
    if (serverType === 'plugin' && clients?.pluginGraphQLClient) return clients.pluginGraphQLClient;

    const typeUrl = serverType === 'plugin' ? serviceLocator.getPluginApiUrl() : serviceLocator.getMainApiUrl();
    const baseUrl = `${typeUrl}/${serverType === 'main' ? apiMainRoute : apiExtensionRoute}/graphql`;

    const newClient = new CGraphQLClient(baseUrl, fetch);
    if (!clients) clients = {};
    if (serverType === 'main') clients.mainGraphQLClient = newClient;
    if (serverType === 'plugin') clients.pluginGraphQLClient = newClient;

    setStoreItem('apiClients', clients);
    return newClient;
}
