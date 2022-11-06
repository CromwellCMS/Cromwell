import { EDBEntity } from '@cromwell/core';
import { entityMetaRepository, ProductVariant } from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, FieldResolver, Resolver, Root } from 'type-graphql';

@Resolver(ProductVariant)
export class ProductVariantResolver {
  @FieldResolver(() => GraphQLJSONObject, { nullable: true })
  async customMeta(@Root() entity: ProductVariant, @Arg('keys', () => [String]) fields: string[]): Promise<any> {
    return entityMetaRepository.getEntityMetaByKeys(EDBEntity.ProductVariant, entity.id, fields);
  }
}
