import { GraphQLPaths, TAttribute, TAuthRole } from '@cromwell/core';
import { Attribute, AttributeInput, AttributeRepository } from '@cromwell/core-backend';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { mainFireAction } from '../helpers/mainFireAction';

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
    async [getOneByIdPath](@Arg("id") id: string): Promise<Attribute | undefined> {
        return await this.repository.getAttribute(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Attribute)
    async [createPath](@Arg("data") data: AttributeInput): Promise<TAttribute> {
        const attr = await this.repository.createAttribute(data);
        mainFireAction('create_attribute', attr);
        return attr;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Attribute)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: AttributeInput): Promise<Attribute> {
        const attr = await this.repository.updateAttribute(id, data);
        mainFireAction('update_attribute', attr);
        return attr;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        const attr = await this.repository.deleteAttribute(id);
        mainFireAction('delete_attribute', { id });
        return attr;
    }

}