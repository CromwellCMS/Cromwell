import { EDBEntity, TPagedList, TPermissionName, TStoreListItem } from './data';

export type TBasePageEntity = {
  /**
   * DB id
   */
  id: number;
  /**
   * Slug for page route
   */
  slug?: string | null;
  /**
   * Page meta title (SEO)
   */
  pageTitle?: string | null;
  /**
   * Page meta description (SEO)
   */
  pageDescription?: string | null;
  /**
   * Other meta (SEO) data
   */
  meta?: TBasePageMeta | null;
  /**
   * DB createDate
   */
  createDate?: Date | null;
  /**
   * DB updateDate
   */
  updateDate?: Date | null;
  /**
   * Is displaying at frontend
   */
  isEnabled?: boolean | null;
  /**
   * Entity meta data from "{Entity}Meta" table
   */
  customMeta?: Record<string, string | null> | null;
  /**
   * Qnt of page requests
   */
  views?: number | null;
};

export type TBasePageMeta = {
  keywords?: string[];
  socialImage?: string;
};

export type TDBAuxiliaryColumns = 'id' | 'createDate' | 'updateDate';

export type TBasePageEntityInput = Omit<TBasePageEntity, TDBAuxiliaryColumns>;

export type TBaseFilter = {
  filters?: {
    key?: string;
    value?: string | number | boolean | Date | null;
    from?: string | number | boolean | Date | null;
    to?: string | number | boolean | Date | null;
    in?: (string | number | boolean | Date)[] | null;
    exact?: boolean;
    inMeta?: boolean;
  }[];
  sorts?: {
    key?: string;
    sort?: 'ASC' | 'DESC';
    inMeta?: boolean;
  }[];
};

/**
 * ProductCategory
 */
export type TProductCategoryCore = {
  /**
   * Name of the category (h1)
   */
  name?: string | null;
  /**
   * Href of main image
   */
  mainImage?: string | null;
  /**
   * Description (HTML allowed)
   */
  description?: string | null;
  /**
   * Description in JSON format
   */
  descriptionDelta?: string | null;
  /**
   * DB children
   */
  children?: TProductCategory[] | null;
  /**
   * DB parent
   */
  parent?: TProductCategory | null;
  /**
   * Products in category
   */
  products?: TPagedList<TProduct> | null;
  /**
   * Qnt of page requests
   */
  views?: number | null;
  /**
   * Level in category tree counting from top (root category)
   */
  nestedLevel?: number | null;
};

export type TProductCategory = TProductCategoryCore & TBasePageEntity;

export type TProductCategoryInput = TBasePageEntityInput &
  Omit<TProductCategoryCore, 'children' | 'parent' | 'products'> & {
    parentId?: number | null;
  };

export type TProductCategoryFilter = TBaseFilter & {
  nameSearch?: string;
  parentName?: string;
};

/**
 * PRODUCT
 */
export type TProduct = TBasePageEntity & {
  /**
   * Name of the product (h1)
   */
  name?: string | null;
  /**
   * Main category of product
   */
  mainCategoryId?: number | null;
  /**
   * Categories of the product
   */
  categories?: TProductCategory[] | null;
  /**
   * Price. Will be discount price if oldPrice is specified
   */
  price?: number | null;
  /**
   * Price before sale, optional
   */
  oldPrice?: number | null;
  /**
   * SKU
   */
  sku?: string | null;
  /**
   * Href of main image
   */
  mainImage?: string | null;
  /**
   * Hrefs of images
   */
  images?: string[] | null;
  /**
   * Description (HTML allowed)
   */
  description?: string | null;
  /**
   * Description in JSON format
   */
  descriptionDelta?: string | null;
  /**
   * Rating data
   */
  rating?: TProductRating | null;
  /**
   * Customer reviews
   */
  reviews?: TProductReview[] | null;
  /**
   * Custom attributes
   */
  attributes?: TAttributeInstance[] | null;
  /**
   * Qnt of page requests
   */
  views?: number | null;
  /**
   * Total amount of items in stock
   */
  stockAmount?: number | null;
  /**
   * Should store automatically deduct stockAmount when order is placed?
   */
  manageStock?: boolean | null;
  /**
   * Manually set this product availability in the stock
   */
  stockStatus?: TStockStatus | null;
  /**
   * Product variants
   */
  variants?: TProductVariant[] | null;
};

export type TStockStatus = 'In stock' | 'Out of stock' | 'On backorder';

export type TProductRating = {
  /**
   * Rating 1-5
   */
  average?: number | null;
  /**
   * Number of customer reviews
   */
  reviewsNumber?: number | null;
};

export type TProductInput = Omit<TProduct, TDBAuxiliaryColumns | 'categories' | 'rating' | 'reviews' | 'variants'> & {
  categoryIds?: number[] | null;
  variants?: TProductVariantInput[] | null;
};

export type TProductFilter = TBaseFilter & {
  minPrice?: number;
  maxPrice?: number;
  attributes?: TProductFilterAttribute[];
  nameSearch?: string;
  categoryId?: number;
};
export type TProductFilterAttribute = TBaseFilter & {
  key: string;
  values: string[];
};

export type TFilteredProductList = TPagedList<TProduct> & {
  filterMeta: TProductFilterMeta;
};

export type TProductFilterMeta = {
  minPrice?: number;
  maxPrice?: number;
};

/**
 * POST
 */
export type TPost = {
  /**
   * Title of post (h1)
   */
  title?: string | null;
  /**
   * User-author
   */
  author?: TUser | null;
  /**
   * Id of user-author
   */
  authorId?: number | null;
  /**
   * Href of main image
   */
  mainImage?: string | null;
  /**
   * Estimated time in minutes to read the post
   */
  readTime?: string | null;
  /**
   * Tags / categories to show post
   */
  tags?: TTag[] | null;
  /**
   * Post content, HTML
   */
  content?: string | null;
  /**
   * Post content, stringified JSON from text editor
   */
  delta?: string | null;
  /**
   * Short description to display in blog list
   */
  excerpt?: string | null;
  /**
   * Is published?
   */
  published?: boolean | null;
  /**
   * Publish date
   */
  publishDate?: Date | null;
  /**
   * Is post featured?
   */
  featured?: boolean | null;
} & TBasePageEntity;

export type TPostInput = Omit<TPost, TDBAuxiliaryColumns | 'author' | 'tags'> & {
  authorId?: number | null;
  tagIds?: number[] | null;
};

export type TPostFilter = TBaseFilter & {
  authorId?: number;
  titleSearch?: string;
  tagIds?: number[];
  published?: boolean;
  featured?: boolean | null;
};

export type TTag = TBasePageEntity & {
  name?: string | null;
  color?: string | null;
  image?: string | null;
  description?: string | null;
  descriptionDelta?: string | null;
  views?: number | null;
};

export type TTagInput = Omit<TTag, TDBAuxiliaryColumns>;

/**
 * USER / AUTHOR
 */
export type TUser = TBasePageEntity & {
  /**
   * Name
   */
  fullName?: string | null;
  /**
   * E-mail
   */
  email?: string | null;
  /**
   * Avatar image
   */
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  roles?: TRole[] | null;
};

export type TCreateUser = Omit<TUser, TDBAuxiliaryColumns | 'roles'> & {
  password?: string;
  roles?: string[];
};

export type TUpdateUser = Omit<TUser, TDBAuxiliaryColumns | 'roles'> & {
  roles?: string[];
};

export type TUserFilter = TBaseFilter & {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  roles?: string[];
  permissions?: TPermissionName[];
};

/**
 * Attribute
 */
export type TAttribute = TBasePageEntity & {
  key?: string | null;
  title?: string | null;
  values?: TAttributeValue[] | null;
  type?: 'radio' | 'checkbox' | 'text_input' | null;
  icon?: string | null;
  required?: boolean | null;
};

export type TAttributeInput = Omit<TAttribute, TDBAuxiliaryColumns>;

export type TAttributeValue = {
  value: string;
  title?: string;
  icon?: string;
};

export type TAttributeInstance = {
  key: string;
  values: TAttributeInstanceValue[];
};

export type TAttributeInstanceValue = {
  value: string;
};

export type TProductVariant = TBasePageEntity & {
  name?: string | null;
  price?: number | null;
  oldPrice?: number | null;
  sku?: string | null;
  mainImage?: string | null;
  images?: string[] | null;
  description?: string | null;
  descriptionDelta?: string | null;
  stockAmount?: number | null;
  manageStock?: boolean | null;
  stockStatus?: TStockStatus | null;
  attributes?: Record<string, string | number | 'any'> | null;
};

export type TProductVariantInput = Omit<TProductVariant, TDBAuxiliaryColumns> & {
  id?: number | null;
  productId?: number | null;
};

/**
 * ProductReview
 */
export type TProductReviewCore = {
  productId?: number | null;
  title?: string | null;
  description?: string | null;
  rating?: number | null;
  userName?: string | null;
  userEmail?: string | null;
  userId?: number | null;
  approved?: boolean | null;
};

export type TProductReview = TProductReviewCore & TBasePageEntity;

export type TProductReviewInput = TProductReviewCore & TBasePageEntityInput;

export type TProductReviewFilter = TBaseFilter & {
  productId?: number;
  userName?: string;
  userId?: number;
  approved?: boolean;
};

/**
 * Store order
 */
export type TOrderCore = {
  id: number;
  createDate?: Date | null;
  updateDate?: Date | null;
  isEnabled?: boolean | null;
  status?: TOrderStatus | null;
  cart?: string | TStoreListItem[] | null;
  orderTotalPrice?: number | null;
  cartTotalPrice?: number | null;
  cartOldTotalPrice?: number | null;
  shippingPrice?: number | null;
  totalQnt?: number | null;
  userId?: number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  customerAddress?: string | null;
  customerComment?: string | null;
  shippingMethod?: string | null;
  paymentMethod?: string | null;
  fromUrl?: string | null;
  currency?: string | null;
  customMeta?: Record<string, string | null> | null;
};

export type TOrder = TOrderCore & {
  coupons?: TCoupon[] | null;
};

export type TOrderStatus = 'Pending' | 'Awaiting shipment' | 'Shipped' | 'Refunded' | 'Cancelled' | 'Completed';

export type TOrderInput = Omit<TOrderCore, 'id'> & {
  couponCodes?: string[] | null;
};

export type TOrderFilter = TBaseFilter & {
  userId?: number;
  status?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type TPaymentOption = {
  key?: string;
  name?: string;
  link?: string;
};

export type TShippingOption = {
  key: string;
  name?: string;
  price?: number;
  label?: string;
};

export type TOrderPaymentSession = TOrderInput & {
  paymentOptions?: TPaymentOption[];
  shippingOptions?: TShippingOption[];
  successUrl?: string;
  cancelUrl?: string;
  appliedCoupons?: string[];
  paymentSessionId?: string;
};

/**
 * Blog comment
 */
export type TPostCommentCore = {
  postId: number;
  title?: string;
  comment?: string;
  userName?: string;
  userEmail?: string;
  userId?: number;
  approved?: boolean;
};

export type TPostComment = TPostCommentCore & TBasePageEntity;

export type TPostCommentInput = TPostCommentCore & TBasePageEntityInput;

/**
 * Store discount coupon
 */
export type TCouponCore = {
  /**
   * How to apply coupon: subtract a fixed value from cart/product price or a percent of it.
   */
  discountType?: 'fixed' | 'percentage' | null;
  /**
   * How much to subtract
   */
  value?: number | null;
  /**
   * A secret code that customer will use to apply coupon
   */
  code?: string | null;
  /**
   * Describe coupon
   */
  description?: string | null;
  /**
   * Set zero shipping price
   */
  allowFreeShipping?: boolean | null;
  /**
   * Minimum cart total to apply this coupon
   */
  minimumSpend?: number | null;
  /**
   * Maximum cart total to apply this coupon
   */
  maximumSpend?: number | null;
  /**
   * Specific categories where coupon can be applied. Applied to all if not set
   */
  categoryIds?: number[] | null;
  /**
   * Specific products on what coupon can be applied. Applied to all if not set
   */
  productIds?: number[] | null;
  /**
   * Date after which coupon will no longer be applicable
   */
  expiryDate?: Date | null;
  /**
   * Limit usage times of this coupon
   */
  usageLimit?: number | null;
  /**
   * How many time this coupon was applied to orders
   */
  usedTimes?: number | null;
};

export type TCoupon = TCouponCore & TBasePageEntity;

export type TCouponInput = TCouponCore & TBasePageEntityInput;

export type TCmsModuleEntity = {
  name?: string | null;
  version?: string | null;
  title?: string | null;
  isInstalled?: boolean | null;
  hasAdminBundle?: boolean | null;
  settings?: string | null;
  defaultSettings?: string | null;
  moduleInfo?: string | null;
  isUpdating?: boolean | null;
};

export type TThemeEntity = TCmsModuleEntity & TBasePageEntity;

export type TThemeEntityInput = TCmsModuleEntity & TBasePageEntityInput;

/**
 * Plugin entity
 */

export type TPluginEntity = TCmsModuleEntity & TBasePageEntity;

export type TPluginEntityInput = TCmsModuleEntity & TBasePageEntityInput;

/**
 * DB CMS entity
 */
export type TCmsEntityCore = {
  /**
   * Pubic settings. Available from REST API endpoint without authentication.
   */
  publicSettings?: TCmsPublicSettings;

  /**
   * Admin settings. Available from REST API endpoint with administrator role authorization
   */
  adminSettings?: TCmsAdminSettings;

  /**
   * Internal settings.
   */
  internalSettings?: TCmsInternalSettings;

  dashboardSettings?: TCmsDashboardSettings;
};

/**
 * Public CMS settings
 */
export type TCmsPublicSettings = {
  /**
   * Website's URL
   */
  url?: string;
  /**
   * Package name of currently used theme
   */
  themeName?: string;
  /**
   * Page size to use in lists, eg. at Product Category page
   */
  defaultPageSize?: number;
  /**
   * Available currencies in the store and rates between them to convert
   */
  currencies?: TCurrency[];
  /**
   * Default timezone in GMT, number +-
   */
  timezone?: number;
  /**
   * Default language
   */
  language?: string;
  /**
   * Website favicon
   */
  favicon?: string;
  /**
   * Website logo
   */
  logo?: string;
  /**
   * Standard shipping price if no shipment methods specified
   */
  defaultShippingPrice?: number;
  /**
   * Enable "pay later" option (by default) or a customer must use one of payment services
   * to finish order checkout
   */
  disablePayLater?: boolean;
  /**
   * Custom HTML code injection
   */
  headHtml?: string;
  footerHtml?: string;

  /**
   * HTTP Redirects for Next.js server
   */
  redirects?: TCmsRedirect[];

  /**
   * HTTP rewrites for Next.js server
   */
  rewrites?: TCmsRedirect[];

  /**
   * Data of custom fields
   */
  customMeta?: Record<string, string>;

  /**
   * Enabled CMS core modules
   */
  modules?: TCmsEnabledModules;
};

/**
 * CMS Enabled core Modules
 */
export type TCmsEnabledModules = {
  /**
   * is E-Commerce Shopping Module enabled?
   */
  ecommerce?: boolean;

  /**
   * is Blogging Module enabled?
   */
  blog?: boolean;
};

export type TCmsDashboardSingleLayout = {
  h?: number;
  i?: string;
  minH?: number;
  minW?: number;
  moved?: boolean;
  static?: boolean;
  w?: number;
  x?: number;
  y?: number;
}[];

export type TCmsDashboardLayout = {
  lg: TCmsDashboardSingleLayout;
  md: TCmsDashboardSingleLayout;
  sm: TCmsDashboardSingleLayout;
  xs: TCmsDashboardSingleLayout;
  xxs: TCmsDashboardSingleLayout;
};

export type TCmsDashboardSettings = {
  type?: 'user' | 'template';
  for?: 'user' | 'role' | 'system';
  userId?: number;
  user?: TUser;
  layout?: TCmsDashboardLayout;
};

/**
 * Admin (private) CMS settings
 */
export type TCmsAdminSettings = {
  /**
   * SMTP connection string to e-mail service provider
   */
  smtpConnectionString?: string;
  /**
   * E-mail to send mails from
   */
  sendFromEmail?: string;
  /**
   * Name to send mails from
   */
  sendMailFromName?: string;
  /**
   * Custom fields data
   */
  customFields?: TAdminCustomField[];

  /**
   * Custom fields data
   */
  customEntities?: TAdminCustomEntity[];

  /**
   * Enable sign-up public REST API v1/api/auth/sign-up (everyone can register on the website)
   */
  signupEnabled?: boolean;

  /**
   * Role names available for sign-up public API.
   */
  signupRoles?: string[];

  /**
   * Show unapproved product reviews. Hide by default
   */
  showUnapprovedReviews?: boolean;

  /**
   * Invalidate next.js frontend cache after this time (in seconds).
   * Basically it's `revalidate` prop for next.js: https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration
   */
  revalidateCacheAfter?: number;

  /**
   * Clear next.js frontend cache on any CMS data update.
   */
  clearCacheOnDataUpdate?: boolean;
};

/**
 * Internal CMS settings
 */
export type TCmsInternalSettings = {
  /**
   * Internal. CMS version, used for updates
   */
  version?: string;
  /**
   * Internal. https://github.com/CromwellCMS/Cromwell/blob/55046c48d9da0a44e4b11e7918c73876fcd1cfc1/system/manager/src/managers/baseManager.ts#L194:L206
   */
  versions?: TServiceVersions;
  /**
   * Internal. If false or not set, will launch installation at first Admin Panel visit.
   */
  installed?: boolean;
  /**
   * Internal. Receive unstable beta-updates
   */
  beta?: boolean;
  /**
   * Internal. Is currently under update
   */
  isUpdating?: boolean;
};

export type TServiceVersions = {
  renderer?: number;
  server?: number;
  'api-server'?: number;
  admin?: number;
};

export type TCustomFieldType =
  | 'Simple text'
  | 'Text editor'
  | 'Select'
  | 'Image'
  | 'Gallery'
  | 'Color'
  | 'Date'
  | 'Time'
  | 'Datetime'
  | 'Currency'
  | 'Rating'
  | 'Checkbox';

export type TCustomFieldSimpleTextType = 'string' | 'textarea' | 'float' | 'integer' | 'currency' | 'password';

export type TAdminCustomField = {
  entityType: EDBEntity | string;
  fieldType: TCustomFieldType;
  simpleTextType?: TCustomFieldSimpleTextType;
  key: string;
  id: string;
  options?: (
    | {
        value: string | number | undefined;
        label: string;
      }
    | string
    | number
    | undefined
  )[];
  label?: string;
  order?: number;
  column?: TCustomEntityColumn;
};

export type TAdminCustomEntity = {
  entityType: string;
  columns?: TCustomEntityColumn[];
  listLabel: string;
  entityLabel?: string;
  route?: string;
  icon?: string;
  entityBaseRoute?: string;
  entityListRoute?: string;
  permissions?: {
    read?: string;
    create?: string;
    update?: string;
    delete?: string;
  };
};

export type TCustomEntityColumn = {
  name: string;
  label: string;
  meta?: boolean;
  type?: TCustomFieldType;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  order?: number;
  visible?: boolean;
  disableTooltip?: boolean;
  exactSearch?: boolean;
  multipleOptions?: boolean;
  searchOptions?: {
    value: any;
    label: string;
  }[];
  customGraphQlFragment?: string;
  // Uses json-to-graphql-query to translate object into graphql fragment
  customGraphQlProperty?: TCustomGraphQlProperty;
  disableSort?: boolean;
  disableSearch?: boolean;
  getValueView?: (value: any, entity: any) => React.ReactNode;
  getTooltipValueView?: (value: any, entity: any) => React.ReactNode;
  applyFilter?: <TFilter extends TBaseFilter>(value: any, filter: TFilter) => TFilter;
};

export type TCustomGraphQlProperty = { [k: string]: TCustomGraphQlProperty | boolean } | string;

export type TCmsEntity = TCmsEntityCore & TBasePageEntity;

export type TCurrency = {
  id: string;
  tag: string;
  title?: string;
  /** Local currency symbols that will be added to price in getPriceWithCurrency method */
  symbol?: string;
  /** Ratio for currencies to compare: "USD": 1,"EURO": 0.83, "GBP": 0.72 etc. */
  ratio?: number;
};

export type TDeleteManyInput = {
  ids: number[];
  all?: boolean;
};

export type TCmsRedirectObject = {
  from?: string;
  to?: string;
  permanent?: boolean;
  statusCode?: number;
};

export type TCmsRedirectFunction = (pathname: string, search?: string | null) => TCmsRedirectObject | undefined | void;

export type TCmsRedirect = TCmsRedirectObject | TCmsRedirectFunction;

export type TCustomEntity = TBasePageEntity & {
  entityType: string;
  name?: string | null;
};

export type TCustomEntityInput = Omit<TCustomEntity, TDBAuxiliaryColumns>;

export type TCustomEntityFilter = TBaseFilter & {
  entityType: string;
  name?: string;
};

export type TCustomPermission = {
  name: string;
  title?: string;
  description?: string;
  categoryName?: string;
};

export type TPermission = TCustomPermission & {
  source?: 'cms' | 'plugin';
  categoryTitle?: string;
  categoryDescription?: string;
  moduleName?: string;
  moduleTitle?: string;
};

export type TPermissionCategory = {
  name: string;
  title?: string;
  description?: string;
  moduleName?: string;
  moduleTitle?: string;
};

export type TRole = TBasePageEntity & {
  /* Role name/key */
  name?: string | null;
  /** Title for role to display */
  title?: string | null;
  /* Set of pre-defined by CMS permissions */
  permissions: TPermissionName[] | null;
  /** Role icon */
  icon?: string | null;
};

export type TRoleInput = Omit<TRole, TDBAuxiliaryColumns>;
