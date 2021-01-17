import { apiV1BaseRoute } from '@cromwell/core';
import { Module } from '@nestjs/common';
import { TypeGraphQLModule } from 'typegraphql-nestjs';

import { collectPlugins } from '../helpers/collectPlugins';
import { GenericPluginResolver, GenericThemeResolver } from '../helpers/genericEntities';
import { setEnv } from '../helpers/setEnv';
import { AttributeResolver } from '../resolvers/attribute.resolver';
import { PostResolver } from '../resolvers/post.resolver';
import { ProductCategoryResolver } from '../resolvers/product-category.resolver';
import { ProductResolver } from '../resolvers/product.resolver';
import { ProductReviewResolver } from '../resolvers/product-review.resolver';

const envMode = setEnv();

@Module({
    providers: [
        AttributeResolver,
        PostResolver,
        ProductCategoryResolver,
        ProductResolver,
        ProductReviewResolver,
        GenericPluginResolver,
        GenericThemeResolver,
        ...(collectPlugins().resolvers),
    ],
    imports: [
        TypeGraphQLModule.forRoot({
            cors: true,
            debug: envMode === 'dev',
            playground: envMode === 'dev',
            validate: false,
            dateScalarMode: "isoDate",
            path: `/${apiV1BaseRoute}/graphql`,
        })
    ]
})
export class GraphqlModule { }