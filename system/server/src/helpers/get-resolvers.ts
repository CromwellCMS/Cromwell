import { collectPlugins, GenericPluginResolver, GenericThemeResolver } from '@cromwell/core-backend';

import { AttributeResolver } from '../resolvers/attribute.resolver';
import { CustomEntityResolver } from '../resolvers/custom-entity.resolver';
import { OrderResolver } from '../resolvers/order.resolver';
import { PostResolver } from '../resolvers/post.resolver';
import { ProductCategoryResolver } from '../resolvers/product-category.resolver';
import { ProductReviewResolver } from '../resolvers/product-review.resolver';
import { ProductResolver } from '../resolvers/product.resolver';
import { ProductVariantResolver } from '../resolvers/product-variant.resolver';
import { TagResolver } from '../resolvers/tag.resolver';
import { UserResolver } from '../resolvers/user.resolver';
import { CouponResolver } from '../resolvers/coupon.resolver';

const nativeResolvers = [
    AttributeResolver,
    PostResolver,
    ProductCategoryResolver,
    ProductResolver,
    ProductReviewResolver,
    OrderResolver,
    UserResolver,
    GenericPluginResolver,
    GenericThemeResolver,
    TagResolver,
    CustomEntityResolver,
    CouponResolver,
    ProductVariantResolver,
];

export const getResolvers = async (): Promise<any> => [
    ...nativeResolvers,
    ...((await collectPlugins()).resolvers ?? []),
];