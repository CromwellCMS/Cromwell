import { Resolver, Query, Mutation, Arg, FieldResolver } from "type-graphql";
import { Post } from '@cromwell/core/es/backend';
import { CreateAuthorInput } from '@cromwell/core/es/backend';
import { UpdatePostInput } from '@cromwell/core/es/backend';
import { Author } from '@cromwell/core/es/backend';

@Resolver(Author)
export class AuthorResolver {
    @Query(() => [Author])
    authors() {
        return Author.find();
    }

    @Query(() => Author)
    author(@Arg("id") id: string) {
        return Author.findOne({ where: { id } });
    }

    @Mutation(() => Post)
    async createAuthor(@Arg("data") data: CreateAuthorInput) {
        const author = Author.create(data);
        await author.save();
        return author;
    }

    @FieldResolver()
    views(): number {
        return Math.floor(Math.random() * 10);
    }

}