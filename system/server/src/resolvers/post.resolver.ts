import { GraphQLPaths, TPagedList, TPost, TUser } from '@cromwell/core';
import { CreatePost, PagedParamsInput, PagedPost, Post, PostRepository, UpdatePost, User, UserRepository } from '@cromwell/core-backend';
import { PostFilterInput } from '@cromwell/core-backend';
import { Arg, Mutation, Query, Resolver, FieldResolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

const getOneBySlugPath = GraphQLPaths.Post.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Post.getOneById;
const getManyPath = GraphQLPaths.Post.getMany;
const createPath = GraphQLPaths.Post.create;
const updatePath = GraphQLPaths.Post.update;
const deletePath = GraphQLPaths.Post.delete;
const getFilteredPath = GraphQLPaths.Post.getFiltered;
const getTagsPath = GraphQLPaths.Post.getTags;

const authorKey: keyof TPost = 'author';

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

  @Query(() => PagedPost)
  async [getFilteredPath](
    @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TPost>,
    @Arg("filterParams", { nullable: true }) filterParams?: PostFilterInput,
  ): Promise<TPagedList<TPost> | undefined> {
    return this.repository.getFilteredPosts(pagedParams, filterParams);
  }

  @Query(() => [String])
  async [getTagsPath](): Promise<string[]> {
    return this.repository.getAllPostTags();
  }

  @FieldResolver(() => User)
  async [authorKey](@Root() post: Post): Promise<TUser | undefined> {
    return this.userRepository.getUserById(post.authorId);
  }

}