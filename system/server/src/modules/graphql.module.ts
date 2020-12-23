import { Module, DynamicModule } from '@nestjs/common';

import { AttributeResolver } from '../resolvers/AttributeResolver';
import { AuthorResolver } from '../resolvers/AuthorResolver';
import { PostResolver } from '../resolvers/PostResolver';
import { ProductCategoryResolver } from '../resolvers/ProductCategoryResolver';
import { ProductResolver } from '../resolvers/ProductResolver';
import { ProductReviewResolver } from '../resolvers/ProductReviewResolver';
import { GenericTheme, GenericPlugin } from '../helpers/genericEntities';
import { collectPlugins } from '../helpers/collectPlugins';
import { projectRootDir } from '../constants';

@Module({
    providers: [
        AttributeResolver,
        AuthorResolver,
        PostResolver,
        ProductCategoryResolver,
        ProductResolver,
        ProductReviewResolver,
        GenericPlugin.resolver,
        GenericTheme.resolver,
    ],
})
export class GraphqlModule {
    static forRoot(): DynamicModule {
        const pluginsExports = collectPlugins(projectRootDir);
        return {
            module: GraphqlModule,
            providers: pluginsExports.resolvers,
        };
    }
}