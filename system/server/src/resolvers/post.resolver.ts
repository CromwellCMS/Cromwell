import { GraphQLPaths, TAuthRole, TPagedList, TPost, TTag, TUser } from '@cromwell/core';
import {
    CreatePost,
    DeleteManyInput,
    getLogger,
    PagedParamsInput,
    PagedPost,
    Post,
    PostFilterInput,
    PostRepository,
    Tag,
    UpdatePost,
    User,
    UserRepository,
} from '@cromwell/core-backend';
import { Arg, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { mainFireAction } from '../helpers/mainFireAction';

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
const logger = getLogger('detailed');

@Resolver(Post)
export class PostResolver {

    private repository = getCustomRepository(PostRepository);
    private userRepository = getCustomRepository(UserRepository);

    @Query(() => PagedPost)
    async [getManyPath](@Arg("pagedParams") pagedParams: PagedParamsInput<Post>):
        Promise<TPagedList<TPost>> {
        return this.repository.getPosts(pagedParams);
    }

    @Query(() => Post)
    async [getOneBySlugPath](@Arg("slug") slug: string): Promise<Post | undefined> {
        return this.repository.getPostBySlug(slug);
    }

    @Query(() => Post)
    async [getOneByIdPath](@Arg("id") id: string): Promise<Post | undefined> {
        return this.repository.getPostById(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Post)
    async [createPath](@Arg("data") data: CreatePost): Promise<Post> {
        const post = await this.repository.createPost(data);
        mainFireAction('create_post', post);
        return post;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Post)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: UpdatePost): Promise<Post> {
        const post = await this.repository.updatePost(id, data);
        mainFireAction('update_post', post);
        return post;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        const success = await this.repository.deletePost(id);
        mainFireAction('delete_post', { id });
        return success;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        return this.repository.deleteMany(data);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: PostFilterInput,
    ): Promise<boolean | undefined> {
        return this.repository.deleteManyFilteredPosts(input, filterParams);
    }

    @Query(() => PagedPost)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TPost>,
        @Arg("filterParams", { nullable: true }) filterParams?: PostFilterInput,
    ): Promise<TPagedList<TPost> | undefined> {
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
}

