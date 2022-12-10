import {
  ApolloClient,
  ApolloQueryResult,
  createHttpLink,
  DocumentNode,
  gql,
  InMemoryCache,
  MutationOptions,
  NormalizedCacheObject,
  QueryOptions,
} from '@apollo/client';
import {
  getStoreItem,
  GraphQLPaths,
  isServer,
  serviceLocator,
  setStoreItem,
  TAttribute,
  TAttributeInput,
  TBaseFilter,
  TCoupon,
  TCouponInput,
  TCreateUser,
  TCustomEntity,
  TCustomEntityFilter,
  TCustomEntityInput,
  TDBEntity,
  TDeleteManyInput,
  TFilteredProductList,
  TOrder,
  TOrderFilter,
  TOrderInput,
  TPagedList,
  TPagedParams,
  TPost,
  TPostFilter,
  TPostInput,
  TProduct,
  TProductCategory,
  TProductCategoryFilter,
  TProductCategoryInput,
  TProductFilter,
  TProductInput,
  TProductReview,
  TProductReviewFilter,
  TProductReviewInput,
  TRole,
  TRoleInput,
  TTag,
  TTagInput,
  TUpdateUser,
  TUser,
  TUserFilter,
} from '@cromwell/core';
import clone from 'rfdc';

import { getServiceSecret } from '../helpers/getServiceSecret';
import { fetch as isomorphicFetch } from '../helpers/isomorphicFetch';

export type TGraphQLErrorInfo = {
  message?: string;
  status?: string;
  statusCode?: number;
  path?: string;
  stacktrace?: string;
};

export type TGetFilteredOptions<TEntity, TFilter> = {
  pagedParams?: TPagedParams<TEntity>;
  filterParams?: TFilter;
  customFragment?: DocumentNode;
  customFragmentName?: string;
};

const getGraphQLErrorInfo = (error: any): TGraphQLErrorInfo => {
  return {
    message: error?.message,
    status: error?.status,
    statusCode: error?.statusCode,
    path: error?.path,
    stacktrace: error?.stacktrace,
  };
};

/**
 * CGraphQLClient - CromwellCMS GraphQL API Client
 */
export class CGraphQLClient {
  /** @internal */
  private apolloClient: ApolloClient<NormalizedCacheObject>;
  /** @internal */
  private onUnauthorizedCallbacks: Record<string, () => any> = {};
  /** @internal */
  private onErrorCallbacks: Record<string, (info: TGraphQLErrorInfo) => any> = {};
  /** @internal */
  private fetch;
  /** @internal */
  private lastBaseUrl: string | undefined;
  /** @internal */
  private serviceSecret;
  /** @internal */
  private initializePromise?: Promise<void>;

  /** @internal */
  public getBaseUrl = () => {
    const typeUrl = serviceLocator.getApiUrl();
    return `${typeUrl}/api/graphql`;
  };

  /** @internal */
  constructor(fetch?: any) {
    if (isServer() && !fetch) {
      fetch = isomorphicFetch;
    }
    this.fetch = fetch;
    this.checkUrl();
  }

  /** @internal */
  private async checkUrl() {
    if (this.initializePromise) await this.initializePromise;
    const baseUrl = this.getBaseUrl();
    if (!baseUrl) return;
    if (this.lastBaseUrl === baseUrl) return;

    this.lastBaseUrl = baseUrl;
    await this.createClient();
  }

  /** @internal */
  private async createClient() {
    let doneInit: (() => void) | undefined;
    this.initializePromise = new Promise<void>((done) => (doneInit = done));

    if (isServer()) {
      // If backend, try to find service secret key to make
      // authorized requests to the API server.
      this.serviceSecret = await getServiceSecret();
    }

    const cache = new InMemoryCache();
    const link = createHttpLink({
      uri: this.getBaseUrl(),
      credentials: 'include',
      fetch: this.fetch,
      headers: this.serviceSecret && { Authorization: `Service ${this.serviceSecret}` },
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

    doneInit?.();
    this.initializePromise = undefined;
  }

  public async query<T = any>(options: QueryOptions, path: string): Promise<T>;
  public async query<T = any>(options: QueryOptions): Promise<ApolloQueryResult<T>>;

  /**
   * Make a custom query via ApolloClient
   * @param path query name. Used to return data, if it's not provided
   * ApolloQueryResult will be returned
   */
  public async query(options: QueryOptions, path?: string) {
    await this.checkUrl();

    const res = await this.handleError(() => this.apolloClient.query(options));
    if (path) return this.returnData(res, path);
    return res;
  }

  public async mutate<T = any>(options: MutationOptions, path: string): Promise<T>;
  public async mutate<T = any>(options: MutationOptions): Promise<ReturnType<ApolloClient<T>['mutate']>>;

  /**
   * Make a custom mutation via ApolloClient
   * @param path query name. Used to return data, if it's not provided
   * ApolloQueryResult will be returned
   */
  public async mutate(options: MutationOptions, path?: string) {
    await this.checkUrl();

    const res = await this.handleError(() => this.apolloClient.mutate(options));
    if (path) return this.returnData(res, path);
    return res;
  }

  /** @internal */
  private async handleError<T>(func: () => Promise<T>): Promise<T> {
    let error;
    let data;

    try {
      data = await func();
      error = (data as any).errors?.[0];
    } catch (e: any) {
      error = e?.graphQLErrors?.[0] ?? e.message;
    }

    if (error) {
      const errInfo = getGraphQLErrorInfo(error);
      Object.values(this.onErrorCallbacks).forEach((cb) => cb(errInfo));

      if (errInfo.statusCode === 401 || errInfo.statusCode === 403) {
        Object.values(this.onUnauthorizedCallbacks).forEach((cb) => cb?.());
      }
      throw error;
    }

    return data;
  }

  /** @internal */
  public returnData = (res: any, path: string) => {
    const data = res?.data?.[path];
    if (data) {
      // Data may be cached, and if it is modified somewhere in the app,
      // next request can possibly return modified data instead of original.
      // Just to make sure all object references inside are new:
      return clone({ proto: true })(data);
    }
    return null;
  };

  /**
   * Add on unauthorized error callback. Triggers if any of methods of this
   * client get unauthorized error
   */
  public onUnauthorized(callback: () => any, id?: string) {
    if (!id) id = Object.keys(this.onErrorCallbacks).length + '';
    this.onUnauthorizedCallbacks[id] = callback;
  }

  /**
   * Remove on unauthorized error callback
   */
  public removeOnUnauthorized(id: string) {
    delete this.onUnauthorizedCallbacks[id];
  }

  /**
   * Add on error callback. Triggers if any of methods of this
   * client get any type of error
   */
  public onError(cb: (message: TGraphQLErrorInfo) => any, id?: string) {
    if (!id) id = Object.keys(this.onErrorCallbacks).length + '';
    this.onErrorCallbacks[id] = cb;
  }

  /**
   * Remove on error callback
   */
  public removeOnError(id: string) {
    delete this.onErrorCallbacks[id];
  }

  public PagedMetaFragment = gql`
    fragment PagedMetaFragment on PagedMeta {
      pageNumber
      pageSize
      totalPages
      totalElements
    }
  `;

  /** @internal */
  public createGetById<TEntity>(entityName: TDBEntity, nativeFragment: DocumentNode, nativeFragmentName: string) {
    const path = GraphQLPaths[entityName].getOneById;

    return (id: number, customFragment?: DocumentNode, customFragmentName?: string): Promise<TEntity | undefined> => {
      const fragment = customFragment ?? nativeFragment;
      const fragmentName = customFragmentName ?? nativeFragmentName;

      return this.query(
        {
          query: gql`
              query core${path}($id: Int!) {
                  ${path}(id: $id) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
          variables: {
            id,
          },
        },
        path,
      );
    };
  }

  /** @internal */
  public createGetBySlug<TEntity>(entityName: TDBEntity, nativeFragment: DocumentNode, nativeFragmentName: string) {
    const path = GraphQLPaths[entityName].getOneBySlug;

    return (slug: string, customFragment?: DocumentNode, customFragmentName?: string): Promise<TEntity | undefined> => {
      const fragment = customFragment ?? nativeFragment;
      const fragmentName = customFragmentName ?? nativeFragmentName;

      return this.query(
        {
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
          },
        },
        path,
      );
    };
  }

  /** @internal */
  public createGetMany<TEntity, TFilter>(
    entityName: TDBEntity,
    nativeFragment: DocumentNode,
    nativeFragmentName: string,
    filterName: string,
    path?: string,
  ): (options?: TGetFilteredOptions<TEntity, TFilter>) => Promise<TPagedList<TEntity>> {
    path = path ?? GraphQLPaths[entityName].getMany;

    return (options) => {
      const { pagedParams, filterParams, customFragment, customFragmentName } = options ?? {};
      const fragment = customFragment ?? nativeFragment;
      const fragmentName = customFragmentName ?? nativeFragmentName;

      return this.query(
        {
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
          },
        },
        path as string,
      );
    };
  }

  /** @internal */
  public createUpdateEntity<TEntity, TInput>(
    entityName: TDBEntity,
    inputName: string,
    nativeFragment: DocumentNode,
    nativeFragmentName: string,
  ) {
    const path = GraphQLPaths[entityName].update;

    return (id: number, data: TInput, customFragment?: DocumentNode, customFragmentName?: string): Promise<TEntity> => {
      const fragment = customFragment ?? nativeFragment;
      const fragmentName = customFragmentName ?? nativeFragmentName;

      return this.mutate(
        {
          mutation: gql`
                    mutation core${path}($id: Int!, $data: ${inputName}!) {
                        ${path}(id: $id, data: $data) {
                            ...${fragmentName}
                        }
                    }
                    ${fragment}
                `,
          variables: {
            id,
            data,
          },
        },
        path,
      );
    };
  }

  /** @internal */
  public createCreateEntity<TEntity, TInput>(
    entityName: TDBEntity,
    inputName: string,
    nativeFragment: DocumentNode,
    nativeFragmentName: string,
  ) {
    const path = GraphQLPaths[entityName].create;

    return (data: TInput, customFragment?: DocumentNode, customFragmentName?: string): Promise<TEntity> => {
      const fragment = customFragment ?? nativeFragment;
      const fragmentName = customFragmentName ?? nativeFragmentName;

      return this.mutate(
        {
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
          },
        },
        path,
      );
    };
  }

  /** @internal */
  public createDeleteEntity(entityName: TDBEntity) {
    const path = GraphQLPaths[entityName].delete;
    return (id: number) => {
      return this.mutate(
        {
          mutation: gql`
                mutation core${path}($id: Int!) {
                    ${path}(id: $id)
                }
            `,
          variables: {
            id,
          },
        },
        path,
      );
    };
  }

  /** @internal */
  public createDeleteMany<TFilter>(entityName: TDBEntity, filterName: string) {
    const path = GraphQLPaths[entityName].deleteMany;

    return (input: TDeleteManyInput, filterParams?: TFilter) => {
      return this.mutate(
        {
          mutation: gql`
                    mutation core${path}($input: DeleteManyInput!, $filterParams: ${filterName}) {
                        ${path}(input: $input, filterParams: $filterParams)
                    }
                `,
          variables: {
            input,
            filterParams,
          },
        },
        path,
      );
    };
  }

  // < Generic CRUD >

  /**
   * Get all records of a generic entity
   * @auth admin
   */
  public getAllEntities = async <EntityType>(
    entityName: string,
    fragment: DocumentNode,
    fragmentName: string,
  ): Promise<EntityType[]> => {
    const path = GraphQLPaths.Generic.getMany + entityName;
    return this.query(
      {
        query: gql`
                query coreGenericGetEntities {
                    ${path} {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
      },
      path,
    );
  };

  /**
   * Get a record by id of a generic entity
   * @auth admin
   */
  public getEntityById = async <EntityType>(
    entityName: string,
    fragment: DocumentNode,
    fragmentName: string,
    entityId: number,
  ): Promise<EntityType | undefined> => {
    const path = GraphQLPaths.Generic.getOneById + entityName;
    return this.query(
      {
        query: gql`
                query coreGenericGetEntityById($entityId: Int!) {
                    ${path}(id: $entityId) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
        variables: {
          entityId,
        },
      },
      path,
    );
  };

  /**
   * Update a record of a generic entity
   * @auth admin
   */
  public updateEntity = async <EntityType, EntityInputType>(
    entityName: string,
    entityInputName: string,
    fragment: DocumentNode,
    fragmentName: string,
    entityId: number,
    data: EntityInputType,
  ): Promise<EntityType | undefined> => {
    const path = GraphQLPaths.Generic.update + entityName;
    return this.mutate(
      {
        mutation: gql`
                mutation coreGenericUpdateEntity($entityId: Int!, $data: ${entityInputName}!) {
                    ${path}(id: $entityId, data: $data) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
        variables: {
          entityId,
          data,
        },
      },
      path,
    );
  };

  /**
   * Create a record by id of a generic entity
   * @auth admin
   */
  public createEntity = async <EntityType, EntityInputType>(
    entityName: string,
    entityInputName: string,
    fragment: DocumentNode,
    fragmentName: string,
    data: EntityInputType,
  ): Promise<EntityType | undefined> => {
    const path = GraphQLPaths.Generic.create + entityName;
    return this.mutate(
      {
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
        },
      },
      path,
    );
  };

  /**
   * Get filtered records of a generic entity
   * @auth admin
   */
  public getEntities<TEntity, TFilter extends TBaseFilter>(
    entityName: string,
    fragment: DocumentNode,
    fragmentName: string,
    options: TGetFilteredOptions<TEntity, TFilter>,
  ) {
    const path = GraphQLPaths.Generic.getFiltered + entityName;
    return this.createGetMany<TEntity, TBaseFilter>(
      'Generic',
      fragment,
      fragmentName,
      'BaseFilterInput',
      path,
    )(options);
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
      pageDescription
      meta {
        keywords
      }
      name
      price
      oldPrice
      sku
      mainImage
      images
      mainCategoryId
      description
      views
      stockAmount
      stockStatus
      manageStock
      rating {
        average
        reviewsNumber
      }
      attributes {
        key
        values {
          value
        }
      }
      variants {
        id
        name
        price
        oldPrice
        sku
        mainImage
        images
        description
        stockAmount
        stockStatus
        manageStock
        attributes
      }
    }
  `;

  public getProductById = this.createGetById<TProduct>('Product', this.ProductFragment, 'ProductFragment');
  public getProductBySlug = this.createGetBySlug<TProduct>('Product', this.ProductFragment, 'ProductFragment');
  public updateProduct = this.createUpdateEntity<TProduct, TProductInput>(
    'Product',
    'UpdateProduct',
    this.ProductFragment,
    'ProductFragment',
  );
  public createProduct = this.createCreateEntity<TProduct, TProductInput>(
    'Product',
    'CreateProduct',
    this.ProductFragment,
    'ProductFragment',
  );
  public deleteProduct = this.createDeleteEntity('Product');
  public deleteManyProducts = this.createDeleteMany<TProductFilter>('Product', 'ProductFilterInput');

  public getProducts = async ({
    pagedParams,
    filterParams,
    customFragment,
    customFragmentName,
  }: {
    pagedParams?: TPagedParams<TProduct>;
    filterParams?: TProductFilter;
    customFragment?: DocumentNode;
    customFragmentName?: string;
  }): Promise<TFilteredProductList> => {
    const path = GraphQLPaths.Product.getMany;

    const fragment = customFragment ?? this.ProductFragment;
    const fragmentName = customFragmentName ?? 'ProductFragment';

    return this.query(
      {
        query: gql`
                query getProducts($pagedParams: PagedParamsInput, $filterParams: ProductFilterInput) {
                    ${path}(pagedParams: $pagedParams, filterParams: $filterParams) {
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
        },
      },
      path,
    );
  };

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
      pageDescription
      meta {
        keywords
      }
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

  public getProductCategories = this.createGetMany<TProductCategory, TProductCategoryFilter>(
    'ProductCategory',
    this.ProductCategoryFragment,
    'ProductCategoryFragment',
    'ProductCategoryFilterInput',
  );
  public getProductCategoryById = this.createGetById<TProductCategory>(
    'ProductCategory',
    this.ProductCategoryFragment,
    'ProductCategoryFragment',
  );
  public getProductCategoryBySlug = this.createGetBySlug<TProductCategory>(
    'ProductCategory',
    this.ProductCategoryFragment,
    'ProductCategoryFragment',
  );
  public updateProductCategory = this.createUpdateEntity<TProductCategory, TProductCategoryInput>(
    'ProductCategory',
    'UpdateProductCategory',
    this.ProductCategoryFragment,
    'ProductCategoryFragment',
  );
  public createProductCategory = this.createCreateEntity<TProductCategory, TProductCategoryInput>(
    'ProductCategory',
    'CreateProductCategory',
    this.ProductCategoryFragment,
    'ProductCategoryFragment',
  );
  public deleteProductCategory = this.createDeleteEntity('ProductCategory');
  public deleteManyProductCategories = this.createDeleteMany<TProductCategoryFilter>(
    'ProductCategory',
    'ProductCategoryFilterInput',
  );

  public getRootCategories = async (
    customFragment?: DocumentNode,
    customFragmentName?: string,
  ): Promise<TPagedList<TProductCategory> | undefined> => {
    const path = GraphQLPaths.ProductCategory.getRootCategories;
    const fragment = customFragment ?? this.ProductCategoryFragment;
    const fragmentName = customFragmentName ?? 'ProductCategoryFragment';

    return this.query(
      {
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
      },
      path,
    );
  };

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
  public getAttributes = this.createGetMany<TAttribute, TBaseFilter>(
    'Attribute',
    this.AttributeFragment,
    'AttributeFragment',
    'BaseFilterInput',
  );
  public updateAttribute = this.createUpdateEntity<TAttribute, TAttributeInput>(
    'Attribute',
    'AttributeInput',
    this.AttributeFragment,
    'AttributeFragment',
  );
  public createAttribute = this.createCreateEntity<TAttribute, TAttributeInput>(
    'Attribute',
    'AttributeInput',
    this.AttributeFragment,
    'AttributeFragment',
  );
  public deleteAttribute = this.createDeleteEntity('Attribute');
  public deleteManyAttributes = this.createDeleteMany<TBaseFilter>('Attribute', 'BaseFilterInput');

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
  `;

  public getProductReviews = this.createGetMany<TProductReview, TProductReviewFilter>(
    'ProductReview',
    this.ProductReviewFragment,
    'ProductReviewFragment',
    'ProductReviewFilter',
  );
  public getProductReviewById = this.createGetById<TProductReview>(
    'ProductReview',
    this.ProductReviewFragment,
    'ProductReviewFragment',
  );
  public updateProductReview = this.createUpdateEntity<TProductReview, TProductReviewInput>(
    'ProductReview',
    'ProductReviewInput',
    this.ProductReviewFragment,
    'ProductReviewFragment',
  );
  public createProductReview = this.createCreateEntity<TProductReview, TProductReviewInput>(
    'ProductReview',
    'ProductReviewInput',
    this.ProductReviewFragment,
    'ProductReviewFragment',
  );
  public deleteProductReview = this.createDeleteEntity('ProductReview');
  public deleteManyProductReviews = this.createDeleteMany<TProductReviewFilter>('ProductReview', 'ProductReviewFilter');

  // </ProductReview>

  // <Post>

  public PostFragment = gql`
    fragment PostFragment on Post {
      id
      slug
      pageTitle
      pageDescription
      meta {
        keywords
      }
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
      featured
    }
  `;

  public getPosts = this.createGetMany<TPost, TPostFilter>(
    'Post',
    this.PostFragment,
    'PostFragment',
    'PostFilterInput',
  );
  public getPostById = this.createGetById<TPost>('Post', this.PostFragment, 'PostFragment');
  public getPostBySlug = this.createGetBySlug<TPost>('Post', this.PostFragment, 'PostFragment');
  public updatePost = this.createUpdateEntity<TPost, TPostInput>(
    'Post',
    'UpdatePost',
    this.PostFragment,
    'PostFragment',
  );
  public createPost = this.createCreateEntity<TPost, TPostInput>(
    'Post',
    'CreatePost',
    this.PostFragment,
    'PostFragment',
  );
  public deletePost = this.createDeleteEntity('Post');
  public deleteManyPosts = this.createDeleteMany<TPostFilter>('Post', 'PostFilterInput');

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
      pageDescription
      meta {
        keywords
      }
      fullName
      email
      avatar
      bio
      phone
      address
      roles {
        id
        name
        title
        permissions
      }
    }
  `;

  public getUsers = this.createGetMany<TUser, TUserFilter>(
    'User',
    this.UserFragment,
    'UserFragment',
    'UserFilterInput',
  );
  public getUserById = this.createGetById<TUser>('User', this.UserFragment, 'UserFragment');
  public getUserBySlug = this.createGetBySlug<TUser>('User', this.UserFragment, 'UserFragment');
  public updateUser = this.createUpdateEntity<TUser, TUpdateUser>(
    'User',
    'UpdateUser',
    this.UserFragment,
    'UserFragment',
  );
  public createUser = this.createCreateEntity<TUser, TCreateUser>(
    'User',
    'CreateUser',
    this.UserFragment,
    'UserFragment',
  );
  public deleteUser = this.createDeleteEntity('User');
  public deleteManyUsers = this.createDeleteMany<TUserFilter>('User', 'UserFilterInput');

  public getUserByEmail = (
    email: string,
    customFragment?: DocumentNode,
    customFragmentName?: string,
  ): Promise<TUser | undefined> => {
    const path = GraphQLPaths.User.getOneByEmail;
    const fragment = customFragment ?? this.UserFragment;
    const fragmentName = customFragmentName ?? 'UserFragment';

    return this.query(
      {
        query: gql`
              query core${path}($email: String!) {
                  ${path}(email: $email) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
        variables: {
          email,
        },
      },
      path,
    );
  };
  // </User>

  // <Role>

  public RoleFragment = gql`
    fragment RoleFragment on Role {
      id
      slug
      createDate
      updateDate
      pageTitle
      pageDescription
      isEnabled
      name
      title
      permissions
      icon
    }
  `;

  public getRoles = this.createGetMany<TRole, TBaseFilter>(
    'Role',
    this.RoleFragment,
    'RoleFragment',
    'BaseFilterInput',
  );
  public getRoleById = this.createGetById<TRole>('Role', this.RoleFragment, 'RoleFragment');
  public updateRole = this.createUpdateEntity<TRole, TRoleInput>(
    'Role',
    'RoleInput',
    this.RoleFragment,
    'RoleFragment',
  );
  public createRole = this.createCreateEntity<TRole, TRoleInput>(
    'Role',
    'RoleInput',
    this.RoleFragment,
    'RoleFragment',
  );
  public deleteRole = this.createDeleteEntity('Role');
  public deleteManyRoles = this.createDeleteMany<TBaseFilter>('Role', 'BaseFilterInput');

  // </Role>

  // <Coupon>

  public CouponFragment = gql`
    fragment CouponFragment on Coupon {
      id
      createDate
      updateDate
      pageTitle
      pageDescription
      meta {
        keywords
      }
      isEnabled
      discountType
      value
      code
      description
      allowFreeShipping
      minimumSpend
      maximumSpend
      categoryIds
      productIds
      expiryDate
      usageLimit
    }
  `;

  public getCoupons = this.createGetMany<TCoupon, TBaseFilter>(
    'Coupon',
    this.CouponFragment,
    'CouponFragment',
    'BaseFilterInput',
  );
  public getCouponById = this.createGetById<TCoupon>('Coupon', this.CouponFragment, 'CouponFragment');
  public getCouponBySlug = this.createGetBySlug<TCoupon>('Coupon', this.CouponFragment, 'CouponFragment');
  public updateCoupon = this.createUpdateEntity<TCoupon, TCouponInput>(
    'Coupon',
    'CouponInput',
    this.CouponFragment,
    'CouponFragment',
  );
  public createCoupon = this.createCreateEntity<TCoupon, TCouponInput>(
    'Coupon',
    'CouponInput',
    this.CouponFragment,
    'CouponFragment',
  );
  public deleteCoupon = this.createDeleteEntity('Coupon');
  public deleteManyCoupons = this.createDeleteMany<TBaseFilter>('Coupon', 'BaseFilterInput');

  public getCouponsByCodes = async (
    codes: string[],
    customFragment?: DocumentNode,
    customFragmentName?: string,
  ): Promise<TCoupon[] | undefined> => {
    const path = GraphQLPaths.Coupon.getCouponsByCodes;
    const fragment = customFragment ?? this.CouponFragment;
    const fragmentName = customFragmentName ?? 'CouponFragment';

    return this.query(
      {
        query: gql`
                query coreGetCouponsByCodes($codes: String[]!) {
                    ${path}(codes: $codes, pagedParams: $pagedParams) {
                        ...${fragmentName}
                    }
                }
                ${fragment}
            `,
        variables: {
          codes,
        },
      },
      path,
    );
  };

  // </Coupon>

  // <Order>

  public OrderFragment = gql`
    fragment OrderFragment on Order {
      id
      createDate
      updateDate
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
      paymentMethod
      currency
    }
  `;

  public getOrders = this.createGetMany<TOrder, TOrderFilter>(
    'Order',
    this.OrderFragment,
    'OrderFragment',
    'OrderFilterInput',
  );
  public getOrderById = this.createGetById<TOrder>('Order', this.OrderFragment, 'OrderFragment');
  public getOrderBySlug = this.createGetBySlug<TOrder>('Order', this.OrderFragment, 'OrderFragment');
  public updateOrder = this.createUpdateEntity<TOrder, TOrderInput>(
    'Order',
    'OrderInput',
    this.OrderFragment,
    'OrderFragment',
  );
  public createOrder = this.createCreateEntity<TOrder, TOrderInput>(
    'Order',
    'OrderInput',
    this.OrderFragment,
    'OrderFragment',
  );
  public deleteOrder = this.createDeleteEntity('Order');
  public deleteManyOrders = this.createDeleteMany<TOrderFilter>('Order', 'OrderFilterInput');

  public getOrdersOfUser = async (
    userId: number,
    pagedParams: TPagedParams<TOrder>,
    customFragment?: DocumentNode,
    customFragmentName?: string,
  ): Promise<TPagedList<TOrder> | undefined> => {
    const path = GraphQLPaths.Order.getOrdersOfUser;
    const fragment = customFragment ?? this.OrderFragment;
    const fragmentName = customFragmentName ?? 'OrderFragment';

    return this.query(
      {
        query: gql`
                query coreGetOrdersOfUser($userId: Int!, $pagedParams: PagedParamsInput) {
                    ${path}(userId: $userId, pagedParams: $pagedParams) {
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
          userId,
          pagedParams,
        },
      },
      path,
    );
  };

  // </Order>

  // <Tag>

  public TagFragment = gql`
    fragment TagFragment on Tag {
      id
      slug
      createDate
      updateDate
      pageTitle
      pageDescription
      meta {
        keywords
      }
      isEnabled
      name
      color
      image
      description
    }
  `;

  public getTags = this.createGetMany<TTag, TBaseFilter>('Tag', this.TagFragment, 'TagFragment', 'BaseFilterInput');
  public getTagById = this.createGetById<TTag>('Tag', this.TagFragment, 'TagFragment');
  public getTagBySlug = this.createGetBySlug<TTag>('Tag', this.TagFragment, 'TagFragment');
  public updateTag = this.createUpdateEntity<TTag, TTagInput>('Tag', 'TagInput', this.TagFragment, 'TagFragment');
  public createTag = this.createCreateEntity<TTag, TTagInput>('Tag', 'TagInput', this.TagFragment, 'TagFragment');
  public deleteTag = this.createDeleteEntity('Tag');
  public deleteManyTags = this.createDeleteMany<TBaseFilter>('Tag', 'BaseFilterInput');

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
      version
      isInstalled
      isUpdating
      hasAdminBundle
      settings
      defaultSettings
      moduleInfo
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
      version
      isInstalled
      isUpdating
      hasAdminBundle
      settings
      defaultSettings
      moduleInfo
    }
  `;
  // </Theme>

  // <CustomEntity>

  public CustomEntityFragment = gql`
    fragment CustomEntityFragment on CustomEntity {
      id
      slug
      createDate
      updateDate
      pageTitle
      pageDescription
      meta {
        keywords
      }
      isEnabled
      entityType
      name
    }
  `;

  public getCustomEntityById(
    entityType: string,
    id: number,
    customFragment?: DocumentNode,
    customFragmentName?: string,
  ): Promise<TCustomEntity | undefined> {
    const path = GraphQLPaths['CustomEntity'].getOneById;
    const fragment = customFragment ?? this.CustomEntityFragment;
    const fragmentName = customFragmentName ?? 'CustomEntityFragment';
    return this.query(
      {
        query: gql`
                query core${path}($entityType: String!, $id: Int!) {
                  ${path}(entityType: $entityType, id: $id) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
        variables: {
          entityType,
          id,
        },
      },
      path,
    );
  }

  public getCustomEntitySlug(
    entityType: string,
    slug: string,
    customFragment?: DocumentNode,
    customFragmentName?: string,
  ): Promise<TCustomEntity | undefined> {
    const path = GraphQLPaths['CustomEntity'].getOneBySlug;
    const fragment = customFragment ?? this.CustomEntityFragment;
    const fragmentName = customFragmentName ?? 'CustomEntityFragment';

    return this.query(
      {
        query: gql`
              query core${path}($entityType: String!, $slug: String!) {
                  ${path}(entityType: $entityType, slug: $slug) {
                      ...${fragmentName}
                  }
              }
              ${fragment}
          `,
        variables: {
          entityType,
          slug,
        },
      },
      path,
    );
  }

  public getCustomEntities = this.createGetMany<TCustomEntity, TCustomEntityFilter>(
    'CustomEntity',
    this.CustomEntityFragment,
    'CustomEntityFragment',
    'CustomEntityFilterInput',
  );
  public updateCustomEntity = this.createUpdateEntity<TCustomEntity, TCustomEntityInput>(
    'CustomEntity',
    'CustomEntityInput',
    this.CustomEntityFragment,
    'CustomEntityFragment',
  );
  public createCustomEntity = this.createCreateEntity<TCustomEntity, TCustomEntityInput>(
    'CustomEntity',
    'CustomEntityInput',
    this.CustomEntityFragment,
    'CustomEntityFragment',
  );

  public deleteCustomEntity(entityType: string, id: number) {
    const path = GraphQLPaths['CustomEntity'].delete;
    return this.mutate(
      {
        mutation: gql`
                    mutation core${path}($entityType: String!, $id: Int!) {
                        ${path}(entityType: $entityType, id: $id)
                    }
                `,
        variables: {
          entityType,
          id,
        },
      },
      path,
    );
  }

  public deleteManyCustomEntities = this.createDeleteMany<TCustomEntityFilter>(
    'CustomEntity',
    'CustomEntityFilterInput',
  );

  // </CustomEntity>
}

export type TCGraphQLClient = CGraphQLClient;

/**
 * Get CGraphQLClient instance from global store (singleton)
 */
export const getGraphQLClient = (fetch?: any): CGraphQLClient => {
  let clients = getStoreItem('apiClients');
  if (clients?.graphQLClient) return clients.graphQLClient;

  const newClient = new CGraphQLClient(fetch);
  if (!clients) clients = {};
  clients.graphQLClient = newClient;
  setStoreItem('apiClients', clients);
  return newClient;
};
