import { collectPlugins, GenericPluginResolver, GenericThemeResolver, getCmsSettings } from '@cromwell/core-backend';

import { AttributeResolver } from '../resolvers/attribute.resolver';
import { CouponResolver } from '../resolvers/coupon.resolver';
import { CustomEntityResolver } from '../resolvers/custom-entity.resolver';
import { OrderResolver } from '../resolvers/order.resolver';
import { PostResolver } from '../resolvers/post.resolver';
import { ProductCategoryResolver } from '../resolvers/product-category.resolver';
import { ProductReviewResolver } from '../resolvers/product-review.resolver';
import { ProductVariantResolver } from '../resolvers/product-variant.resolver';
import { ProductResolver } from '../resolvers/product.resolver';
import { RoleResolver } from '../resolvers/role.resolver';
import { TagResolver } from '../resolvers/tag.resolver';
import { UserResolver } from '../resolvers/user.resolver';

export const getResolvers = async (): Promise<any> => {
  const ecommerce = [
    AttributeResolver,
    ProductCategoryResolver,
    ProductResolver,
    ProductReviewResolver,
    OrderResolver,
    CouponResolver,
    ProductVariantResolver,
  ];
  const blog = [PostResolver, TagResolver];
  const core = [UserResolver, RoleResolver, GenericPluginResolver, GenericThemeResolver, CustomEntityResolver];

  const settings = await getCmsSettings();

  return [
    ...core,
    ...(settings?.modules?.ecommerce ? ecommerce : []),
    ...(settings?.modules?.blog ? blog : []),
    ...((await collectPlugins()).resolvers ?? []),
  ];
};
