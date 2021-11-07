import { EDBEntity, GraphQLPaths, TAuthRole, TPagedList, TPost, TTag, TUser } from '@cromwell/core';
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
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const getOneBySlugPath = GraphQLPaths.Post.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Post.getOneById;
const getManyPath = GraphQLPaths.Post.getMany;
const createPath = GraphQLPaths.Post.create;
const updatePath = GraphQLPaths.Post.update;
const deletePath = GraphQLPaths.Post.delete;
const deleteManyPath = GraphQLPaths.Post.deleteMany;
const deleteManyFilteredPath = GraphQLPaths.Post.deleteManyFiltered;
const getFilteredPath = GraphQLPaths.Post.getFiltered;

const authorKey: keyof TPost = 'author';
const tagsKey: keyof TPost = 'tags';
const viewsKey: keyof TPost = 'views';
const logger = getLogger();

@Resolver(Post)
export class PostResolver {

    private repository = getCustomRepository(PostRepository);
    private userRepository = getCustomRepository(UserRepository);

    private canGetDraft(ctx?: TGraphQLContext) {
        if (ctx?.user?.role && (ctx.user.role === 'guest' || ctx.user.role === 'administrator' ||
            ctx.user.role === 'author')) {
            return true;
        } else {
            return false;
        }
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

    @Query(() => PagedPost)
    async [getManyPath](@Arg("pagedParams") pagedParams: PagedParamsInput<Post>,
        @Ctx() ctx: TGraphQLContext):
        Promise<TPagedList<TPost>> {
        if (!this.canGetDraft(ctx)) {
            // No auth, return only published posts
            return this.repository.getFilteredPosts(pagedParams, {
                published: true
            });
        }
        return this.repository.getPosts(pagedParams);
    }

    @Query(() => Post)
    async [getOneBySlugPath](@Arg("slug") slug: string, @Ctx() ctx: TGraphQLContext): Promise<Post | undefined> {
        const post = this.filterDrafts([await this.repository.getPostBySlug(slug)], ctx)[0];
        if (!post) throw new Error(`Post ${slug} not found!`);
        return post;
    }

    @Query(() => Post)
    async [getOneByIdPath](@Arg("id", () => Int) id: number, @Ctx() ctx: TGraphQLContext): Promise<Post | undefined> {
        const post = this.filterDrafts([await this.repository.getPostById(id)], ctx)[0];
        if (!post) throw new Error(`Post ${id} not found!`);
        return post;
    }

    @Authorized<TAuthRole>("administrator", 'author')
    @Mutation(() => Post)
    async [createPath](@Arg("data") data: CreatePost): Promise<Post> {
        const post = await this.repository.createPost(data);
        serverFireAction('create_post', post);
        resetAllPagesCache();
        return post;
    }

    @Authorized<TAuthRole>("administrator", 'author')
    @Mutation(() => Post)
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: UpdatePost): Promise<Post> {
        const post = await this.repository.updatePost(id, data);
        serverFireAction('update_post', post);
        resetAllPagesCache();
        return post;
    }

    @Authorized<TAuthRole>("administrator", 'author')
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
        const success = await this.repository.deletePost(id);
        serverFireAction('delete_post', { id });
        resetAllPagesCache();
        return success;
    }

    @Authorized<TAuthRole>("administrator", 'author')
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        const res = await this.repository.deleteMany(data);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TAuthRole>("administrator", 'author')
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: PostFilterInput,
    ): Promise<boolean | undefined> {
        const res = await this.repository.deleteManyFilteredPosts(input, filterParams);
        resetAllPagesCache();
        return res;
    }

    @Query(() => PagedPost)
    async [getFilteredPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TPost>,
        @Arg("filterParams", { nullable: true }) filterParams?: PostFilterInput,
    ): Promise<TPagedList<TPost> | undefined> {
        if (!this.canGetDraft(ctx)) {
            // No auth, return only published posts
            if (!filterParams) filterParams = {};
            filterParams.published === true;
        }
        return this.repository.getFilteredPosts(pagedParams, filterParams);
    }

    @FieldResolver(() => User, { nullable: true })
    async [authorKey](@Root() post: Post): Promise<TUser | undefined> {
        try {
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
    async customMeta(@Root() entity: Post, @Arg("fields", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Post, entity.id, fields);
    }

    @FieldResolver(() => Int, { nullable: true })
    async [viewsKey](@Root() entity: Post): Promise<number | undefined> {
        return this.repository.getEntityViews(entity.id, EDBEntity.Post);
    }
}