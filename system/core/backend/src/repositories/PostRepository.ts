import { DBTableNames, logFor, TPagedList, TPagedParams, TPostInput } from '@cromwell/core';
import { EntityRepository, getCustomRepository } from 'typeorm';

import { Post } from '../entities/Post';
import { handleBaseInput } from './BaseQueries';
import { BaseRepository } from './BaseRepository';
import { UserRepository } from './UserRepository';

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {

    constructor() {
        super(DBTableNames.Post, Post)
    }

    async getPosts(params: TPagedParams<Post>): Promise<TPagedList<Post>> {
        logFor('detailed', 'PostRepository::getPosts');
        return this.getPaged(params)
    }

    async getPostById(id: string): Promise<Post | undefined> {
        logFor('detailed', 'PostRepository::getPostById id: ' + id);
        return this.getById(id);
    }

    async getPostBySlug(slug: string): Promise<Post | undefined> {
        logFor('detailed', 'PostRepository::getPostBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    private async handleBasePostInput(post: Post, input: TPostInput) {
        const author = await getCustomRepository(UserRepository).getUserById(input.authorId);
        if (!author) throw new Error(`Author for the new post was not found`);

        handleBaseInput(post, input);

        post.title = input.title;
        post.mainImage = input.mainImage;
        post.content = input.content;
        post.isPublished = input.isPublished;
        post.authorId = input.authorId;
    }

    async createPost(createPost: TPostInput): Promise<Post> {
        logFor('detailed', 'PostRepository::createPost');
        let post = new Post();

        await this.handleBasePostInput(post, createPost);

        post = await this.save(post);

        if (!post.slug) {
            post.slug = post.id;
            await this.save(post);
        }

        return post;
    }

    async updatePost(id: string, updatePost: TPostInput): Promise<Post> {
        logFor('detailed', 'PostRepository::updatePost id: ' + id);

        let post = await this.findOne({
            where: { id }
        });
        if (!post) throw new Error(`Post ${id} not found!`);

        await this.handleBasePostInput(post, updatePost);

        post = await this.save(post);
        return post;
    }

    async deletePost(id: string): Promise<boolean> {
        logFor('detailed', 'PostRepository::deletePost; id: ' + id);

        const post = await this.getPostById(id);
        if (!post) {
            console.log('PostRepository::deletePost failed to find post by id');
            return false;
        }
        const res = await this.delete(id);
        return true;

    }

}