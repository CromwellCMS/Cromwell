import { Resolver, Query, Mutation, Arg, FieldResolver } from "type-graphql";
import { Post } from "../models/entities/Post";
import { CreateAuthorInput } from "../models/inputs/CreateAuthor";
import { UpdatePostInput } from "../models/inputs/UpdatePostInput";
import { Author } from "../models/entities/Author";

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