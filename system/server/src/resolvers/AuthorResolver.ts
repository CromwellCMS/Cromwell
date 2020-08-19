import { Author, CreateAuthorInput, Post } from '@cromwell/core-backend';
import { Arg, FieldResolver, Mutation, Query, Resolver } from 'type-graphql';

@Resolver(Author)
export class AuthorResolver {
    @Query(() => [Author])
    authors(): Promise<Author[]> {
        return Author.find();
    }

    @Query(() => Author)
    author(@Arg("id") id: string): Promise<Author | undefined> {
        return Author.findOne({ where: { id } });
    }

    @Mutation(() => Post)
    async createAuthor(@Arg("data") data: CreateAuthorInput): Promise<Author> {
        const author = Author.create(data);
        await author.save();
        return author;
    }

    @FieldResolver()
    views(): number {
        return Math.floor(Math.random() * 10);
    }

}