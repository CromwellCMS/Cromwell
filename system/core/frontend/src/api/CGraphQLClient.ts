import {
    ApolloClient,
    ApolloQueryResult,
    createHttpLink,
    gql,
    InMemoryCache,
    NormalizedCacheObject,
    QueryOptions,
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
    TTagInput,
} from '@cromwell/core';

class CGraphQLClient {

    public readonly apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(private baseUrl: string, fetch?: any) {

        const cache = new InMemoryCache();
        const link = createHttpLink({
            uri: this.baseUrl,
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

    public query = <T = any>(options: QueryOptions): Promise<ApolloQueryResult<T>> =>
        this.apolloClient.query(options);

    public returnData = (res: any, path: string) => {
        const data = res?.data?.[path];
        if (data) {
            // Data may be cached, and if it is modified somewhere in the app, 
            // next request can possibly return modified data instead of original.
            // Just to make sure all object references inside are new:
            return JSON.parse(JSON.stringify(data));
        };
        const errors = res?.errors;
        return errors ?? null;
    }

    public PagedMetaFragment = gql`
        fragment PagedMetaFragment on PagedMeta {
            pageNumber
            pageSize
            totalPages
            totalElements
        }
    `;

    // <Generic>
    public getAllEntities = async <EntityType>(entityName: string, fragment: DocumentNode, fragmentName: string): Promise<EntityType[]> => {
        const path = GraphQLPaths.Generic.getMany + entityName;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGenericGetEntities {
                    ${path} {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `
        })
        return this.returnData(res, path);
    }

    public getEntityById = async <EntityType>(entityName: string, fragment: DocumentNode, fragmentName: string, entityId: string)
        : Promise<EntityType | undefined> => {
        const path = GraphQLPaths.Generic.getOneById + entityName;
        const res = await this.apolloClient.query({
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
        });
        return this.returnData(res, path);
    }

    public updateEntity = async <EntityType, EntityInputType>(entityName: string, entityInputName: string, fragment: DocumentNode,
        fragmentName: string, entityId: string, data: EntityInputType): Promise<EntityType | undefined> => {
        const path = GraphQLPaths.Generic.update + entityName;
        const res = await this.apolloClient.mutate({
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
        });
        return this.returnData(res, path);
    }

    public createEntity = async <EntityType, EntityInputType>(entityName: string, entityInputName: string, fragment: DocumentNode,
        fragmentName: string, data: EntityInputType): Promise<EntityType | undefined> => {
        const path = GraphQLPaths.Generic.create + entityName;
        const res = await this.apolloClient.mutate({
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
        });
        return this.returnData(res, path);
    }

    // </Generic>


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

    public getProducts = async (pagedParams?: TPagedParams<TProduct>,
        customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TProduct>> => {

        const productFragment = customFragment ?? this.ProductFragment;
        const productFragmentName = customFragmentName ?? 'ProductFragment';

        const path = GraphQLPaths.Product.getMany;

        const variables: Record<string, any> = {
            pagedParams: pagedParams ?? {},
        };

        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProducts($pagedParams: PagedParamsInput!) {
                    ${path}(pagedParams: $pagedParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...${productFragmentName}
                        }
                    }
                }
                ${productFragment}
                ${this.PagedMetaFragment}
            `,
            variables
        })
        return this.returnData(res, path);
    }

    public getProductById = async (productId: string, customFragment?: DocumentNode, customFragmentName?: string)
        : Promise<TProduct | undefined> => {
        const path = GraphQLPaths.Product.getOneById;

        const productFragment = customFragment ?? this.ProductFragment;
        const productFragmentName = customFragmentName ?? 'ProductFragment';

        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductById($productId: String!) {
                    ${path}(id: $productId) {
                        ...${productFragmentName}
                    }
                }
                ${productFragment}
            `,
            variables: {
                productId,
            }
        });
        return this.returnData(res, path);
    }

    public getProductBySlug = async (slug: string): Promise<TProduct | undefined> => {
        const path = GraphQLPaths.Product.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductBySlug($slug: String!) {
                    ${path}(slug: $slug) {
                        ...ProductFragment
                    }
                }
                ${this.ProductFragment}
            `,
            variables: {
                slug,
            }
        });
        return this.returnData(res, path);
    }

    public updateProduct = async (id: string, product: TProductInput): Promise<TProduct> => {
        const path = GraphQLPaths.Product.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreUpdateProduct($id: String!, $data: UpdateProduct!) {
                    ${path}(id: $id, data: $data) {
                        ...ProductFragment
                    }
                }
                ${this.ProductFragment}
            `,
            variables: {
                id,
                data: product,
            }
        });
        return this.returnData(res, path);
    }

    public createProduct = async (product: TProductInput): Promise<TProduct> => {
        const path = GraphQLPaths.Product.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreCreateProduct($data: CreateProduct!) {
                    ${path}(data: $data) {
                        ...ProductFragment
                    }
                }
                ${this.ProductFragment}
            `,
            variables: {
                data: product,
            }
        });
        return this.returnData(res, path);
    }

    public getProductsFromCategory = async (categoryId: string, pagedParams?: TPagedParams<TProduct>): Promise<TPagedList<TProduct>> => {
        const path = GraphQLPaths.Product.getFromCategory;
        const res = await this.apolloClient.query({
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
        })
        return this.returnData(res, path);
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

        const res = await this.apolloClient.query({
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
        })
        return this.returnData(res, path);
    }

    public deleteProduct = async (productId: string) => {
        const path = GraphQLPaths.Product.delete;

        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteProduct($id: String!) {
                    ${path}(id: $id)
                }
            `,
            variables: {
                id: productId,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyProducts = async (input: TDeleteManyInput) => {
        const path = GraphQLPaths.Product.deleteMany;

        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyProducts($data: DeleteManyInput!) {
                    ${path}(data: $data)
                }
            `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyFilteredProducts = async (input: TDeleteManyInput, filterParams?: TProductFilter) => {
        const path = GraphQLPaths.Product.deleteManyFiltered;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyFilteredProducts($input: DeleteManyInput!, $filterParams: ProductFilterInput) {
                    ${path}(input: $input, filterParams: $filterParams)
                }
            `,
            variables: {
                input,
                filterParams
            }
        });
        return this.returnData(res, path);
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

    public getProductCategories = async (pagedParams?: TPagedParams<TProductCategory>,
        customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TProductCategory>> => {

        const fragment = customFragment ?? this.ProductCategoryFragment;
        const fragmentName = customFragmentName ?? 'ProductCategoryFragment';

        const path = GraphQLPaths.ProductCategory.getMany;

        const variables: Record<string, any> = {
            pagedParams: pagedParams ?? {},
        };

        const res = await this.apolloClient.query({
            query: gql`
            query coreGetProductCategories($pagedParams: PagedParamsInput!) {
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
            variables
        })
        return this.returnData(res, path);
    }

    public getProductCategoryById = async (id: string, customFragment?: DocumentNode, customFragmentName?: string)
        : Promise<TProductCategory | undefined> => {
        const path = GraphQLPaths.ProductCategory.getOneById;
        const fragment = customFragment ?? this.ProductCategoryFragment;
        const fragmentName = customFragmentName ?? 'ProductCategoryFragment';

        const res = await this.apolloClient.query({
            query: gql`
            query coreGetProductCategoryById($id: String!) {
                ${path}(id: $id) {
                    ...${fragmentName}
                }
            }
            ${fragment}
        `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }

    public getProductCategoryBySlug = async (slug: string): Promise<TProductCategory | undefined> => {
        const path = GraphQLPaths.ProductCategory.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductCategory($slug: String!) {
                    ${path}(slug: $slug) {
                        ...ProductCategoryFragment
                    }
                }
                ${this.ProductCategoryFragment}
            `,
            variables: {
                slug,
            }
        });

        return this.returnData(res, path);
    }

    public updateProductCategory = async (id: string, productCategory: TProductCategoryInput) => {
        const path = GraphQLPaths.ProductCategory.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
            mutation coreUpdateProductCategory($id: String!, $data: UpdateProductCategory!) {
                ${path}(id: $id, data: $data) {
                    ...ProductCategoryFragment
                }
            }
            ${this.ProductCategoryFragment}
        `,
            variables: {
                id,
                data: productCategory,
            }
        });
        return this.returnData(res, path);
    }

    public createProductCategory = async (productCategory: TProductCategoryInput) => {
        const path = GraphQLPaths.ProductCategory.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
            mutation coreCreateProductCategory($data: CreateProductCategory!) {
                ${path}(data: $data) {
                    ...ProductCategoryFragment
                }
            }
            ${this.ProductCategoryFragment}
        `,
            variables: {
                data: productCategory,
            }
        });
        return this.returnData(res, path);
    }

    public deleteProductCategory = async (id: string) => {
        const path = GraphQLPaths.ProductCategory.delete;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteProductCategory($id: String!) {
                    ${path}(id: $id)
                }
            `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyProductCategories = async (input: TDeleteManyInput) => {
        const path = GraphQLPaths.ProductCategory.deleteMany;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyProductCategories($data: DeleteManyInput!) {
                    ${path}(data: $data)
                }
            `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyFilteredProductCategories = async (input: TDeleteManyInput, filterParams?: TProductCategoryFilter) => {
        const path = GraphQLPaths.ProductCategory.deleteManyFiltered;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyFilteredProductCategories($input: DeleteManyInput!, $filterParams: ProductCategoryFilterInput) {
                    ${path}(input: $input, filterParams: $filterParams)
                }
            `,
            variables: {
                input,
                filterParams
            }
        });
        return this.returnData(res, path);
    }

    public getRootCategories = async (customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TProductCategory> | undefined> => {
        const path = GraphQLPaths.ProductCategory.getRootCategories;
        const fragment = customFragment ?? this.ProductCategoryFragment;
        const fragmentName = customFragmentName ?? 'ProductCategoryFragment';

        const res = await this.apolloClient.query({
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
        });
        return this.returnData(res, path);
    }

    public getFilteredProductCategories = async ({ pagedParams, filterParams, customFragment, customFragmentName }: {
        pagedParams?: TPagedParams<TProductCategory>;
        filterParams?: TProductCategoryFilter;
        customFragment?: DocumentNode;
        customFragmentName?: string;
    }): Promise<TPagedList<TProductCategory>> => {
        const path = GraphQLPaths.ProductCategory.getFiltered;

        const fragment = customFragment ?? this.ProductCategoryFragment;
        const fragmentName = customFragmentName ?? 'ProductCategoryFragment';

        const res = await this.apolloClient.query({
            query: gql`
                query coreGetFilteredProductCategories($pagedParams: PagedParamsInput, $filterParams: ProductCategoryFilterInput) {
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
        })
        return this.returnData(res, path);
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
       }
   `;

    public getAttributes = async (): Promise<TAttribute[] | undefined> => {
        const path = GraphQLPaths.Attribute.getMany;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetAttributes {
                    ${path} {
                        ...AttributeFragment
                    }
                }
                ${this.AttributeFragment}
           `
        })
        return this.returnData(res, path);
    }

    public getAttributeById = async (attributeId: string): Promise<TAttribute | undefined> => {
        const path = GraphQLPaths.Attribute.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
               query coreGetAttributeById($attributeId: String!) {
                ${path}(id: $attributeId) {
                       ...AttributeFragment
                    }           
               }
               ${this.AttributeFragment}
           `,
            variables: {
                attributeId
            }
        });
        return this.returnData(res, path);
    }

    public updateAttribute = async (id: string, attribute: TAttributeInput) => {
        const path = GraphQLPaths.Attribute.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
               mutation coreUpdateAttribute($id: String!, $data: AttributeInput!) {
                ${path}(id: $id, data: $data) {
                       ...AttributeFragment
                   }
               }
               ${this.AttributeFragment}
           `,
            variables: {
                id,
                data: attribute,
            }
        });
        return this.returnData(res, path);
    }

    public createAttribute = async (attribute: TAttributeInput) => {
        const path = GraphQLPaths.Attribute.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
               mutation coreCreateAttribute($data: AttributeInput!) {
                ${path}(data: $data) {
                       ...AttributeFragment
                   }
               }
               ${this.AttributeFragment}
           `,
            variables: {
                data: attribute,
            }
        });
        return this.returnData(res, path);
    }

    public deleteAttribute = async (id: string) => {
        const path = GraphQLPaths.Attribute.delete;
        const res = await this.apolloClient.mutate({
            mutation: gql`
               mutation coreDeleteAttribute($id: String!) {
                ${path}(id: $id)
               }
           `,
            variables: {
                id
            }
        });
        return this.returnData(res, path);
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
            isEnabled
        }
  `

    public getProductReview = async (productReviewId: string): Promise<TProductReview | undefined> => {
        const path = GraphQLPaths.ProductReview.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
              query coreGetProductReviewById($id: String!) {
                ${path}(id: $id) {
                      ...ProductReviewFragment
                   }           
              }
              ${this.ProductReviewFragment}
          `,
            variables: {
                id: productReviewId
            }
        });
        return this.returnData(res, path);
    }

    public getProductReviews = async (pagedParams?: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> => {
        const path = GraphQLPaths.ProductReview.getMany;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductReviews($pagedParams: PagedParamsInput!) {
                    ${path}(pagedParams: $pagedParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...ProductReviewFragment
                        }
                    }
                }
                ${this.ProductReviewFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                pagedParams: pagedParams ?? {},
            }
        })
        return this.returnData(res, path);
    }

    public getProductReviewsOfProduct = async (productId: string, pagedParams?: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> => {
        const path = GraphQLPaths.ProductReview.getFromProduct;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductReviewsOfProduct($productId: String!, $pagedParams: PagedParamsInput!) {
                    ${path}(productId: $productId, pagedParams: $pagedParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...ProductReviewFragment
                        }
                    }
                }
                ${this.ProductReviewFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                productId,
                pagedParams: pagedParams ?? {},
            }
        })
        return this.returnData(res, path);
    }


    public updateProductReview = async (id: string, productReview: TProductReviewInput): Promise<TProductReview | undefined> => {
        const path = GraphQLPaths.ProductReview.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreUpdateAttribute($id: String!, $data: ProductReviewInput!) {
                ${path}(id: $id, data: $data) {
                      ...ProductReviewFragment
                  }
              }
              ${this.ProductReviewFragment}
          `,
            variables: {
                id,
                data: productReview,
            }
        });
        return this.returnData(res, path);
    }

    public createProductReview = async (productReview: TProductReviewInput): Promise<TProductReview | undefined> => {
        const path = GraphQLPaths.ProductReview.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreCreateProductReview($data: ProductReviewInput!) {
                ${path}(data: $data) {
                      ...ProductReviewFragment
                  }
              }
              ${this.ProductReviewFragment}
          `,
            variables: {
                data: productReview,
            }
        });
        return this.returnData(res, path);
    }

    public deleteProductReview = async (productId: string) => {
        const path = GraphQLPaths.ProductReview.delete;

        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteProductReview($id: String!) {
                    ${path}(id: $id)
                }
            `,
            variables: {
                id: productId,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyProductReviews = async (input: TDeleteManyInput) => {
        const path = GraphQLPaths.ProductReview.deleteMany;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyProductReviews($data: DeleteManyInput!) {
                    ${path}(data: $data)
                }
            `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }


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
            tags {
                id
                slug
                name
                color
            }
            content
            isPublished
      }
  `

    public getPosts = async (pagedParams?: TPagedParams<TPost>,
        customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TPost>> => {

        const postFragment = customFragment ?? this.PostFragment;
        const postFragmentName = customFragmentName ?? 'PostFragment';

        const path = GraphQLPaths.Post.getMany;

        const variables: Record<string, any> = {
            pagedParams: pagedParams ?? {},
        };

        const res = await this.apolloClient.query({
            query: gql`
              query coreGetPosts($pagedParams: PagedParamsInput!) {
                  ${path}(pagedParams: $pagedParams) {
                      pagedMeta {
                          ...PagedMetaFragment
                      }
                      elements {
                          ...${postFragmentName}
                      }
                  }
              }
              ${postFragment}
              ${this.PagedMetaFragment}
          `,
            variables
        })
        return this.returnData(res, path);
    }

    public getPostById = async (postId: string,
        customFragment?: DocumentNode, customFragmentName?: string)
        : Promise<TPost | undefined> => {
        const path = GraphQLPaths.Post.getOneById;

        const fragment = customFragment ?? this.PostFragment;
        const fragmentName = customFragmentName ?? 'PostFragment';

        const res = await this.apolloClient.query({
            query: gql`
              query coreGetPostById($postId: String!) {
                  ${path}(id: $postId) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
            variables: {
                postId,
            }
        });
        return this.returnData(res, path);
    }

    public getPostBySlug = async (slug: string,
        customFragment?: DocumentNode, customFragmentName?: string): Promise<TPost | undefined> => {
        const path = GraphQLPaths.Post.getOneBySlug;

        const fragment = customFragment ?? this.PostFragment;
        const fragmentName = customFragmentName ?? 'PostFragment';

        const res = await this.apolloClient.query({
            query: gql`
              query coreGetPostBySlug($slug: String!) {
                  ${path}(slug: $slug) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
            variables: {
                slug,
            }
        });
        return this.returnData(res, path);
    }

    public updatePost = async (id: string, post: TPostInput): Promise<TPost> => {
        const path = GraphQLPaths.Post.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreUpdatePost($id: String!, $data: UpdatePost!) {
                  ${path}(id: $id, data: $data) {
                      ...PostFragment
                  }
              }
              ${this.PostFragment}
          `,
            variables: {
                id,
                data: post,
            }
        });
        return this.returnData(res, path);
    }

    public createPost = async (post: TPostInput): Promise<TPost> => {
        const path = GraphQLPaths.Post.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreCreatePost($data: CreatePost!) {
                  ${path}(data: $data) {
                      ...PostFragment
                  }
              }
              ${this.PostFragment}
          `,
            variables: {
                data: post,
            }
        });
        return this.returnData(res, path);
    }

    public deletePost = async (postId: string) => {
        const path = GraphQLPaths.Post.delete;

        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeletePost($id: String!) {
                    ${path}(id: $id)
                }
            `,
            variables: {
                id: postId,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyPosts = async (input: TDeleteManyInput) => {
        const path = GraphQLPaths.Post.deleteMany;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyPosts($data: DeleteManyInput!) {
                    ${path}(data: $data)
                }
            `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyFilteredPosts = async (input: TDeleteManyInput, filterParams?: TPostFilter) => {
        const path = GraphQLPaths.Post.deleteManyFiltered;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyFilteredPosts($input: DeleteManyInput!, $filterParams: PostFilterInput) {
                    ${path}(input: $input, filterParams: $filterParams)
                }
            `,
            variables: {
                input,
                filterParams
            }
        });
        return this.returnData(res, path);
    }

    public getFilteredPosts = async ({ pagedParams, filterParams, customFragment, customFragmentName }: {
        pagedParams?: TPagedParams<TPost>;
        filterParams?: TPostFilter;
        customFragment?: DocumentNode;
        customFragmentName?: string;
    }): Promise<TPagedList<TPost>> => {
        const path = GraphQLPaths.Post.getFiltered;

        const fragment = customFragment ?? this.PostFragment;
        const fragmentName = customFragmentName ?? 'PostFragment';

        const res = await this.apolloClient.query({
            query: gql`
                query coreGetFilteredPosts($pagedParams: PagedParamsInput, $filterParams: PostFilterInput) {
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
        })
        return this.returnData(res, path);
    }

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

    public getUsers = async (pagedParams?: TPagedParams<TUser>,
        customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TUser>> => {

        const fragment = customFragment ?? this.UserFragment;
        const fragmentName = customFragmentName ?? 'UserFragment';

        const path = GraphQLPaths.User.getMany;

        const variables: Record<string, any> = {
            pagedParams: pagedParams ?? {},
        };

        const res = await this.apolloClient.query({
            query: gql`
            query coreGetUsers($pagedParams: PagedParamsInput) {
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
            variables
        })
        return this.returnData(res, path);
    }

    public getUserById = async (id: string)
        : Promise<TUser | undefined> => {
        const path = GraphQLPaths.User.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
            query coreGetUserById($id: String!) {
                ${path}(id: $id) {
                    ...UserFragment
                }
            }
            ${this.UserFragment}
        `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }

    public getUserBySlug = async (slug: string): Promise<TUser | undefined> => {
        const path = GraphQLPaths.User.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetUser($slug: String!) {
                    ${path}(slug: $slug) {
                    ...UserFragment
                    }
                }
                ${this.UserFragment}
            `,
            variables: {
                slug,
            }
        });

        return this.returnData(res, path);
    }

    public updateUser = async (id: string, input: TUpdateUser) => {
        const path = GraphQLPaths.User.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
            mutation coreUpdateUser($id: String!, $data: UpdateUser!) {
                ${path}(id: $id, data: $data) {
                    ...UserFragment
                }
            }
            ${this.UserFragment}
        `,
            variables: {
                id,
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public createUser = async (input: TCreateUser) => {
        const path = GraphQLPaths.User.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
            mutation coreCreateUser($data: CreateUser!) {
                ${path}(data: $data) {
                    ...UserFragment
                }
            }
            ${this.UserFragment}
        `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public deleteUser = async (id: string) => {
        const path = GraphQLPaths.User.delete;

        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteUser($id: String!) {
                    ${path}(id: $id)
                }
            `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }


    public getFilteredUsers = async ({ pagedParams, filterParams, customFragment, customFragmentName }: {
        pagedParams?: TPagedParams<TUser>;
        filterParams?: TUserFilter;
        customFragment?: DocumentNode;
        customFragmentName?: string;
    }): Promise<TPagedList<TUser>> => {
        const path = GraphQLPaths.User.getFiltered;

        const fragment = customFragment ?? this.UserFragment;
        const fragmentName = customFragmentName ?? 'UserFragment';

        const res = await this.apolloClient.query({
            query: gql`
                query coreGetFilteredUsers($pagedParams: PagedParamsInput, $filterParams: UserFilterInput) {
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
        })
        return this.returnData(res, path);
    }

    public deleteManyFilteredUsers = async (input: TDeleteManyInput, filterParams?: TUserFilter) => {
        const path = GraphQLPaths.User.deleteManyFiltered;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyFilteredUsers($input: DeleteManyInput!, $filterParams: UserFilterInput) {
                    ${path}(input: $input, filterParams: $filterParams)
                }
            `,
            variables: {
                input,
                filterParams
            }
        });
        return this.returnData(res, path);
    }


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
            deliveryPrice
            totalQnt
            userId
            customerName
            customerPhone
            customerAddress
            customerComment
            shippingMethod
        }
    `;

    public getOrders = async (pagedParams?: TPagedParams<TOrder>,
        customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TOrder>> => {

        const fragment = customFragment ?? this.OrderFragment;
        const fragmentName = customFragmentName ?? 'OrderFragment';

        const path = GraphQLPaths.Order.getMany;

        const variables: Record<string, any> = {
            pagedParams: pagedParams ?? {},
        };

        const res = await this.apolloClient.query({
            query: gql`
                query coreGetOrders($pagedParams: PagedParamsInput) {
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
            variables
        })
        return this.returnData(res, path);
    }

    public getOrderById = async (id: string)
        : Promise<TOrder | undefined> => {
        const path = GraphQLPaths.Order.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
        query coreGetOrderById($id: String!) {
            ${path}(id: $id) {
                ...OrderFragment
            }
        }
        ${this.OrderFragment}
    `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }

    public getOrderBySlug = async (slug: string): Promise<TOrder | undefined> => {
        const path = GraphQLPaths.Order.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetOrder($slug: String!) {
                    ${path}(slug: $slug) {
                    ...OrderFragment
                    }
                }
                ${this.OrderFragment}
            `,
            variables: {
                slug,
            }
        });

        return this.returnData(res, path);
    }

    public updateOrder = async (id: string, input: TOrderInput) => {
        const path = GraphQLPaths.Order.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreUpdateOrder($id: String!, $data: InputOrder!) {
                    ${path}(id: $id, data: $data) {
                        ...OrderFragment
                    }
                }
                ${this.OrderFragment}
            `,
            variables: {
                id,
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public createOrder = async (input: TOrderInput) => {
        const path = GraphQLPaths.Order.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreCreateOrder($data: InputOrder!) {
                    ${path}(data: $data) {
                        ...OrderFragment
                    }
                }
                ${this.OrderFragment}
            `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public deleteOrder = async (id: string) => {
        const path = GraphQLPaths.Order.delete;

        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteOrder($id: String!) {
                    ${path}(id: $id)
                }
            `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyOrders = async (input: TDeleteManyInput) => {
        const path = GraphQLPaths.Order.deleteMany;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyOrders($data: DeleteManyInput!) {
                    ${path}(data: $data)
                }
            `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyFilteredOrders = async (input: TDeleteManyInput, filterParams?: TOrderFilter) => {
        const path = GraphQLPaths.Order.deleteManyFiltered;
        const res = await this.apolloClient.mutate({
            mutation: gql`
                mutation coreDeleteManyFilteredOrders($input: DeleteManyInput!, $filterParams: OrderFilterInput) {
                    ${path}(input: $input, filterParams: $filterParams)
                }
            `,
            variables: {
                input,
                filterParams
            }
        });
        return this.returnData(res, path);
    }

    public getFilteredOrders = async ({ pagedParams, filterParams, customFragment, customFragmentName }: {
        pagedParams?: TPagedParams<TOrder>;
        filterParams?: TOrderFilter;
        customFragment?: DocumentNode;
        customFragmentName?: string;
    }): Promise<TPagedList<TOrder>> => {
        const path = GraphQLPaths.Order.getFiltered;

        const fragment = customFragment ?? this.OrderFragment;
        const fragmentName = customFragmentName ?? 'OrderFragment';

        const res = await this.apolloClient.query({
            query: gql`
                query coreGetFilteredOrders($pagedParams: PagedParamsInput, $filterParams: OrderFilterInput) {
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
        })
        return this.returnData(res, path);
    }


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

    public getTags = async (pagedParams?: TPagedParams<TTag>,
        customFragment?: DocumentNode, customFragmentName?: string): Promise<TPagedList<TTag>> => {

        const fragment = customFragment ?? this.TagFragment;
        const fragmentName = customFragmentName ?? 'TagFragment';

        const path = GraphQLPaths.Tag.getMany;

        const variables: Record<string, any> = {
            pagedParams: pagedParams ?? {},
        };

        const res = await this.apolloClient.query({
            query: gql`
              query coreGetTags($pagedParams: PagedParamsInput) {
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
            variables
        })
        return this.returnData(res, path);
    }

    public getTagById = async (id: string)
        : Promise<TTag | undefined> => {
        const path = GraphQLPaths.Tag.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetTagById($id: String!) {
                    ${path}(id: $id) {
                        ...TagFragment
                    }
                }
                    ${this.TagFragment}
                `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }

    public getTagBySlug = async (slug: string): Promise<TTag | undefined> => {
        const path = GraphQLPaths.Tag.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
              query coreGetTag($slug: String!) {
                  ${path}(slug: $slug) {
                  ...TagFragment
                  }
              }
              ${this.TagFragment}
             `,
            variables: {
                slug,
            }
        });

        return this.returnData(res, path);
    }

    public updateTag = async (id: string, input: TTagInput) => {
        const path = GraphQLPaths.Tag.update;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreUpdateTag($id: String!, $data: InputTag!) {
                  ${path}(id: $id, data: $data) {
                      ...TagFragment
                  }
              }
              ${this.TagFragment}
          `,
            variables: {
                id,
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public createTag = async (input: TTagInput) => {
        const path = GraphQLPaths.Tag.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreCreateTag($data: InputTag!) {
                  ${path}(data: $data) {
                      ...TagFragment
                  }
              }
              ${this.TagFragment}
          `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }

    public deleteTag = async (id: string) => {
        const path = GraphQLPaths.Tag.delete;

        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreDeleteTag($id: String!) {
                  ${path}(id: $id)
              }
          `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }

    public deleteManyTags = async (input: TDeleteManyInput) => {
        const path = GraphQLPaths.Tag.deleteMany;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreDeleteManyTags($data: DeleteManyInput!) {
                  ${path}(data: $data)
              }
          `,
            variables: {
                data: input,
            }
        });
        return this.returnData(res, path);
    }


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

export const getGraphQLClient = (serverType: 'main' | 'plugin' = 'main', fetch?: any): CGraphQLClient | undefined => {
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