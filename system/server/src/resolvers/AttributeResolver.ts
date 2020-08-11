import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from "type-graphql";
import { Attribute, AttributeInput } from '@cromwell/core-backend';
import { AttributeRepository } from '@cromwell/core-backend';
import { getCustomRepository } from "typeorm";
import { TAttribute, TPagedList } from "@cromwell/core";

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