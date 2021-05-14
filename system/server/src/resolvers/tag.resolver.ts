import { GraphQLPaths, TAuthRole, TPagedList, TTag } from '@cromwell/core';
import { DeleteManyInput, InputTag, PagedParamsInput, PagedTag, Tag, TagRepository } from '@cromwell/core-backend';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { serverFireAction } from '../helpers/serverFireAction';

const getOneBySlugPath = GraphQLPaths.Tag.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Tag.getOneById;
const getManyPath = GraphQLPaths.Tag.getMany;
const createPath = GraphQLPaths.Tag.create;
const updatePath = GraphQLPaths.Tag.update;
const deletePath = GraphQLPaths.Tag.delete;
const deleteManyPath = GraphQLPaths.Tag.deleteMany;


@Resolver(Tag)
export class TagResolver {

    private repository = getCustomRepository(TagRepository);

    @Query(() => PagedTag)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TTag>):
        Promise<TPagedList<TTag>> {
        return this.repository.getTags(pagedParams);
    }

    @Query(() => Tag)
    async [getOneBySlugPath](@Arg("slug") slug: string): Promise<TTag | undefined> {
        return this.repository.getTagBySlug(slug);
    }

    @Query(() => Tag)
    async [getOneByIdPath](@Arg("id") id: string): Promise<TTag | undefined> {
        return this.repository.getTagById(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Tag)
    async [createPath](@Arg("data") data: InputTag): Promise<TTag> {
        const tag = await this.repository.createTag(data);
        serverFireAction('create_tag', tag);
        return tag;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Tag)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: InputTag): Promise<TTag | undefined> {
        const tag = await this.repository.updateTag(id, data);
        serverFireAction('update_tag', tag);
        return tag;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        const tag = await this.repository.deleteTag(id);
        serverFireAction('delete_tag', { id });
        return tag;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        return this.repository.deleteMany(data);
    }
}
