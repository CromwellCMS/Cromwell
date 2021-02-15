import { AttributeResolver } from '../resolvers/attribute.resolver';
import { PostResolver } from '../resolvers/post.resolver';
import { ProductCategoryResolver } from '../resolvers/product-category.resolver';
import { ProductResolver } from '../resolvers/product.resolver';
import { ProductReviewResolver } from '../resolvers/product-review.resolver';
import { GenericPluginResolver, GenericThemeResolver } from '../helpers/genericEntities';
import { collectPlugins } from '../helpers/collectPlugins';


export const getResolvers = () => [
    AttributeResolver,
    PostResolver,
    ProductCategoryResolver,
    ProductResolver,
    ProductReviewResolver,
    GenericPluginResolver,
    GenericThemeResolver,
    ...(collectPlugins().resolvers),
]