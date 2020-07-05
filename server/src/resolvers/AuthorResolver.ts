import { Resolver, Query, Mutation, Arg, FieldResolver } from "type-graphql";
import { Post } from '@cromwell/core-backend';
import { CreateAuthorInput } from '@cromwell/core-backend';
import { Author } from '@cromwell/core-backend';

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