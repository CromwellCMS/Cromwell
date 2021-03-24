import { GraphQLPaths, TTag, TPagedList } from '@cromwell/core';
import {
    DeleteManyInput,
    getLogger,
    InputTag,
    Tag,
    TagRepository,
    PagedTag,
    PagedParamsInput,
    ProductRepository,
} from '@cromwell/core-backend';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

const getOneBySlugPath = GraphQLPaths.Tag.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Tag.getOneById;
const getManyPath = GraphQLPaths.Tag.getMany;
const createPath = GraphQLPaths.Tag.create;
const updatePath = GraphQLPaths.Tag.update;
const deletePath = GraphQLPaths.Tag.delete;
const deleteManyPath = GraphQLPaths.Tag.deleteMany;

const logger = getLogger('detailed');

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

    @Mutation(() => Tag)
    async [createPath](@Arg("data") data: InputTag): Promise<TTag> {
        return this.repository.createTag(data);
    }

    @Mutation(() => Tag)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: InputTag): Promise<TTag | undefined> {
        return this.repository.updateTag(id, data);
    }

    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        return this.repository.deleteTag(id);
    }

    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        return this.repository.deleteMany(data);
    }
}
