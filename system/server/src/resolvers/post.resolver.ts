import { GraphQLPaths, TPagedList, TPost, TUser, TTag } from '@cromwell/core';
import {
    CreatePost,
    getLogger,
    PagedParamsInput,
    PagedPost,
    Post,
    PostFilterInput,
    PostRepository,
    UpdatePost,
    User,
    UserRepository,
    DeleteManyInput,
    Tag,
} from '@cromwell/core-backend';
import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

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

    @Mutation(() => Post)
    async [createPath](@Arg("data") data: CreatePost): Promise<Post> {
        return this.repository.createPost(data);
    }

    @Mutation(() => Post)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: UpdatePost): Promise<Post> {
        return this.repository.updatePost(id, data);
    }

    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        return this.repository.deletePost(id);
    }

    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        return this.repository.deleteMany(data);
    }

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
