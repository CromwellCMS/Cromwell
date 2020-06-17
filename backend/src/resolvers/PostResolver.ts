import { Resolver, Query, Mutation, Arg, FieldResolver } from "type-graphql";
import { Post } from '@cromwell/core/es/backend';
import { CreatePostInput } from '@cromwell/core/es/backend';
import { UpdatePostInput } from '@cromwell/core/es/backend';
import { Author } from '@cromwell/core/es/backend';
import { AuthorResolver } from './AuthorResolver';

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  posts() {
    return Post.find();
  }

  @Query(() => Post)
  post(@Arg("id") id: string) {
    return Post.findOne({ where: { id } });
  }

  @Mutation(() => Post)
  async createPost(@Arg("data") data: CreatePostInput) {
    const post = Post.create(data);
    await post.save();
    return post;
  }

  @Mutation(() => Post)
  async updatePost(@Arg("id") id: string, @Arg("data") data: UpdatePostInput) {
    const post = await Post.findOne({ where: { id } });
    if (!post) throw new Error("Post not found!");
    Object.assign(post, data);
    await post.save();
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: string) {
    const post = await Post.findOne({ where: { id } });
    if (!post) throw new Error("Post not found!");
    await post.remove();
    return true;
  }

  @FieldResolver()
  views(): number {
    return Math.floor(Math.random() * 10);
  }

  @FieldResolver({ nullable: true })
  async author() {
    // const author = await new AuthorResolver().author("1")
    const author: Author = await Author.findOne({ where: { id: 1 } }) || { name: 'no author' } as Author;
    if (author) {
      return author;
    }
  }
}