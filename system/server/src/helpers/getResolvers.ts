import { collectPlugins } from '../helpers/collectPlugins';
import { GenericPluginResolver, GenericThemeResolver } from '../helpers/genericEntities';
import { AttributeResolver } from '../resolvers/attribute.resolver';
import { OrderResolver } from '../resolvers/order.resolver';
import { PostResolver } from '../resolvers/post.resolver';
import { ProductCategoryResolver } from '../resolvers/product-category.resolver';
import { ProductReviewResolver } from '../resolvers/product-review.resolver';
import { ProductResolver } from '../resolvers/product.resolver';
import { TagResolver } from '../resolvers/tag.resolver';
import { UserResolver } from '../resolvers/user.resolver';

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
];

export const getResolvers = (sType: 'main' | 'plugin'): any => sType === 'main' ? [
    ...nativeResolvers,
] : [
    ...nativeResolvers,
    ...(collectPlugins().resolvers),
]