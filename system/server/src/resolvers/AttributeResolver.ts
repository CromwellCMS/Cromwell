import { TAttribute } from '@cromwell/core';
import { Attribute, AttributeInput, AttributeRepository } from '@cromwell/core-backend';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

@Resolver(Attribute)
export class AttributeResolver {

    private get repo() { return getCustomRepository(AttributeRepository) }

    @Query(() => [Attribute])
    async attributes(): Promise<TAttribute[]> {
        return await this.repo.getAttributes();
    }


    @Query(() => Attribute)
    async attribute(@Arg("id") id: string): Promise<Attribute> {
        return await this.repo.getAttribute(id);
    }

    @Mutation(() => Attribute)
    async createAttribute(@Arg("data") data: AttributeInput): Promise<TAttribute> {
        return await this.repo.createAttribute(data);
    }

    @Mutation(() => Attribute)
    async updateAttribute(@Arg("id") id: string, @Arg("data") data: AttributeInput): Promise<Attribute> {
        return await this.repo.updateAttribute(id, data);
    }

    @Mutation(() => Boolean)
    async deleteAttribute(@Arg("id") id: string): Promise<boolean> {
        return await this.repo.deleteAttribute(id);
    }

}