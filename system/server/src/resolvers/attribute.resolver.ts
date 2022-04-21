import { EDBEntity, GraphQLPaths, TAttribute, TPermissionName } from '@cromwell/core';
import { Attribute, AttributeInput, AttributeRepository, entityMetaRepository } from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const getOneByIdPath = GraphQLPaths.Attribute.getOneById;
const getManyPath = GraphQLPaths.Attribute.getMany;
const createPath = GraphQLPaths.Attribute.create;
const updatePath = GraphQLPaths.Attribute.update;
const deletePath = GraphQLPaths.Attribute.delete;

@Resolver(Attribute)
export class AttributeResolver {

    private repository = getCustomRepository(AttributeRepository)

    @Query(() => [Attribute])
    async [getManyPath](): Promise<TAttribute[]> {
        return await this.repository.getAttributes();
    }

    @Query(() => Attribute)
    async [getOneByIdPath](@Arg("id", () => Int) id: number): Promise<Attribute | undefined> {
        return await this.repository.getAttribute(id);
    }

    @Authorized<TPermissionName>('create_attribute')
    @Mutation(() => Attribute)
    async [createPath](@Arg("data") data: AttributeInput): Promise<TAttribute> {
        const attr = await this.repository.createAttribute(data);
        serverFireAction('create_attribute', attr);
        return attr;
    }

    @Authorized<TPermissionName>('update_attribute')
    @Mutation(() => Attribute)
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: AttributeInput): Promise<Attribute> {
        const attr = await this.repository.updateAttribute(id, data);
        serverFireAction('update_attribute', attr);
        resetAllPagesCache();
        return attr;
    }

    @Authorized<TPermissionName>('delete_attribute')
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
        const attr = await this.repository.deleteAttribute(id);
        serverFireAction('delete_attribute', { id });
        resetAllPagesCache();
        return attr;
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: Attribute, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Attribute, entity.id, fields);
    }
}