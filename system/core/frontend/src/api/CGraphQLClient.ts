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
    apiV1BaseRoute,
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
        if (data) return data;
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

    public getProductById = async (productId: string)
        : Promise<TProduct | undefined> => {
        const path = GraphQLPaths.Product.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductById($productId: String!) {
                    ${path}(id: $productId) {
                        ...ProductFragment
                    }
                }
                ${this.ProductFragment}
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

    public updateProduct = async (id: string, product: TProductInput) => {
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

    public createProduct = async (product: TProductInput) => {
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

        const productFragment = customFragment ?? this.ProductCategoryFragment;
        const productFragmentName = customFragmentName ?? 'ProductCategoryFragment';

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

    public getProductCategoryById = async (id: string)
        : Promise<TProductCategory | undefined> => {
        const path = GraphQLPaths.ProductCategory.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
            query coreGetProductCategoryById($id: String!) {
                ${path}(id: $id) {
                    ...ProductCategoryFragment
                }
            }
            ${this.ProductCategoryFragment}
        `,
            variables: {
                id,
            }
        });
        return this.returnData(res, path);
    }

    public getProductCategoryBySlug = async (slug: string, pagedParams?: TPagedParams<TProductCategory>): Promise<TProductCategory | undefined> => {
        const path = GraphQLPaths.ProductCategory.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
                query coreGetProductCategory($slug: String!) {
                    ${path}(slug: $slug) {
                    ...ProductCategoryFragment
                    }
                }
                ${this.ProductCategoryFragment}
                ${this.PagedMetaFragment}
            `,
            variables: {
                slug,
                pagedParams: pagedParams ?? {},
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
            content
            delta
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

    public getPostById = async (postId: string)
        : Promise<TPost | undefined> => {
        const path = GraphQLPaths.Post.getOneById;
        const res = await this.apolloClient.query({
            query: gql`
              query coreGetPostById($postId: String!) {
                  ${path}(id: $postId) {
                      ...PostFragment
                  }
              }
              ${this.PostFragment}
          `,
            variables: {
                postId,
            }
        });
        return this.returnData(res, path);
    }

    public getPostBySlug = async (slug: string): Promise<TPost | undefined> => {
        const path = GraphQLPaths.Post.getOneBySlug;
        const res = await this.apolloClient.query({
            query: gql`
              query coreGetPostBySlug($slug: String!) {
                  ${path}(slug: $slug) {
                      ...PostFragment
                  }
              }
              ${this.PostFragment}
          `,
            variables: {
                slug,
            }
        });
        return this.returnData(res, path);
    }

    public updatePost = async (id: string, post: TPostInput) => {
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

    public createPost = async (post: TPostInput) => {
        const path = GraphQLPaths.Post.create;
        const res = await this.apolloClient.mutate({
            mutation: gql`
              mutation coreCreatePost($data: CreatePost!) {
                  ${path}(id: $id, data: $data) {
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


    // </Post>


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

export const getGraphQLClient = (fetch?: any): CGraphQLClient | undefined => {
    let client = getStoreItem('graphQLClient');
    if (client) return client;

    const baseUrl = `${serviceLocator.getApiUrl()}/${apiV1BaseRoute}/graphql`;

    client = new CGraphQLClient(baseUrl, fetch);
    setStoreItem('graphQLClient', client);
    return client;
}