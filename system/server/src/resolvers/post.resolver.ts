import { EDBEntity, GraphQLPaths, matchPermissions, TPagedList, TPermissionName, TPost, TTag, TUser } from '@cromwell/core';
import {
    CreatePost,
    DeleteManyInput,
    entityMetaRepository,
    getLogger,
    PagedParamsInput,
    PagedPost,
    Post,
    PostFilterInput,
    PostRepository,
    Tag,
    TGraphQLContext,
    UpdatePost,
    User,
    UserRepository,
} from '@cromwell/core-backend';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import {
    createWithFilters,
    deleteManyWithFilters,
    deleteWithFilters,
    getByIdWithFilters,
    getBySlugWithFilters,
    getManyWithFilters,
    updateWithFilters,
} from '../helpers/data-filters';

const getOneBySlugPath = GraphQLPaths.Post.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Post.getOneById;
const getManyPath = GraphQLPaths.Post.getMany;
const createPath = GraphQLPaths.Post.create;
const updatePath = GraphQLPaths.Post.update;
const deletePath = GraphQLPaths.Post.delete;
const deleteManyPath = GraphQLPaths.Post.deleteMany;

const authorKey: keyof TPost = 'author';
const tagsKey: keyof TPost = 'tags';
const viewsKey: keyof TPost = 'views';
const logger = getLogger();

@Resolver(Post)
export class PostResolver {

    private repository = getCustomRepository(PostRepository);
    private userRepository = getCustomRepository(UserRepository);

    private canGetDraft(ctx?: TGraphQLContext) {
        if (!ctx?.user?.roles?.length) return false;
        if (matchPermissions(ctx?.user, ['read_post_drafts'])) return true;
        return false;
    }

    private filterDrafts(posts: (Post | undefined)[], ctx?: TGraphQLContext) {
        return posts.filter(post => {
            if (!post) return false;
            if (post.published === false) {
                if (this.canGetDraft(ctx)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        })
    }

    @Query(() => Post)
    async [getOneByIdPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
    ): Promise<TPost> {
        return getByIdWithFilters('Post', ctx, [], id,
            async (id) => {
                const post = this.filterDrafts([await this.repository.getPostById(id)], ctx)[0];
                if (!post) throw new HttpException(`Post ${id} not found!`, HttpStatus.NOT_FOUND);
                return post;
            });
    }

    @Query(() => Post)
    async [getOneBySlugPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("slug") slug: string,
    ): Promise<TPost | undefined> {
        return getBySlugWithFilters('Post', ctx, [], slug,
            async (slug) => {
                const post = this.filterDrafts([await this.repository.getPostBySlug(slug)], ctx)[0];
                if (!post) throw new HttpException(`Post ${slug} not found!`, HttpStatus.NOT_FOUND);
                return post;
            });
    }

    @Query(() => PagedPost)
    async [getManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TPost>,
        @Arg("filterParams", { nullable: true }) filterParams?: PostFilterInput,
    ): Promise<TPagedList<TPost> | undefined> {
        return getManyWithFilters('Post', ctx, [], pagedParams, filterParams,
            (pagedParams, filterParams) => {
                if (!this.canGetDraft(ctx)) {
                    // No auth, return only published posts
                    if (!filterParams) filterParams = {};
                    filterParams.published === true;
                }
                return this.repository.getFilteredPosts(pagedParams, filterParams);
            });
    }

    @Authorized<TPermissionName>('create_post')
    @Mutation(() => Post)
    async [createPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("data") data: CreatePost
    ): Promise<TPost> {
        return createWithFilters('Post', ctx, ['create_post'], data,
            (...args) => this.repository.createPost(...args));
    }

    @Authorized<TPermissionName>('update_post')
    @Mutation(() => Post)
    async [updatePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
        @Arg("data") data: UpdatePost
    ): Promise<TPost> {
        return updateWithFilters('Post', ctx, ['update_post'], data, id,
            (...args) => this.repository.updatePost(...args));
    }

    @Authorized<TPermissionName>('delete_post')
    @Mutation(() => Boolean)
    async [deletePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        return deleteWithFilters('Post', ctx, ['update_post'], id,
            (...args) => this.repository.deletePost(...args));
    }

    @Authorized<TPermissionName>('delete_post')
    @Mutation(() => Boolean)
    async [deleteManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: PostFilterInput,
    ): Promise<boolean | undefined> {
        return deleteManyWithFilters('Post', ctx, ['delete_post'], input, filterParams,
            (...args) => this.repository.deleteManyFilteredPosts(...args));
    }

    @FieldResolver(() => User, { nullable: true })
    async [authorKey](@Root() post: Post): Promise<TUser | undefined> {
        try {
            if (post.authorId)
                return await this.userRepository.getUserById(post.authorId);
        } catch (e) {
            logger.error(e);
        }
    }

    @FieldResolver(() => [Tag], { nullable: true })
    async [tagsKey](@Root() post: Post): Promise<TTag[] | undefined | null> {
        return this.repository.getTagsOfPost(post.id);
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: Post, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Post, entity.id, fields);
    }

    @FieldResolver(() => Int, { nullable: true })
    async [viewsKey](@Root() entity: Post): Promise<number | undefined> {
        return this.repository.getEntityViews(entity.id, EDBEntity.Post);
    }
}