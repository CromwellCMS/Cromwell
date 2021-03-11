import { logFor, TPagedList, TPagedParams, TPostInput, TPost, TDeleteManyInput } from '@cromwell/core';
import sanitizeHtml from 'sanitize-html';
import { EntityRepository, getCustomRepository, Brackets, SelectQueryBuilder, DeleteQueryBuilder } from 'typeorm';
import { PagedParamsInput } from './../inputs/PagedParamsInput';

import { Post } from '../entities/Post';
import { handleBaseInput, checkEntitySlug, getPaged } from './BaseQueries';
import { BaseRepository } from './BaseRepository';
import { UserRepository } from './UserRepository';
import { PostFilterInput } from '../entities/filter/PostFilterInput';
import { getLogger } from '../helpers/constants';

const logger = getLogger('detailed');

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {

    constructor() {
        super(Post)
    }

    async getPosts(params: TPagedParams<Post>): Promise<TPagedList<Post>> {
        logger.log('PostRepository::getPosts');
        return this.getPaged(params)
    }

    async getPostById(id: string): Promise<Post | undefined> {
        logger.log('PostRepository::getPostById id: ' + id);
        return this.getById(id);
    }

    async getPostBySlug(slug: string): Promise<Post | undefined> {
        logger.log('PostRepository::getPostBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    private async handleBasePostInput(post: Post, input: TPostInput) {
        const author = await getCustomRepository(UserRepository).getUserById(input.authorId);
        if (!author) throw new Error(`Author for the new post was not found`);

        handleBaseInput(post, input);

        post.title = input.title;
        post.mainImage = input.mainImage ?? null;
        post.content = sanitizeHtml(input.content);
        post.delta = input.delta;
        post.isPublished = input.isPublished;
        post.authorId = input.authorId;
        post.tags = input.tags;
    }

    async createPost(createPost: TPostInput): Promise<Post> {
        logger.log('PostRepository::createPost');
        let post = new Post();

        await this.handleBasePostInput(post, createPost);
        post = await this.save(post);
        await checkEntitySlug(post);

        return post;
    }

    async updatePost(id: string, updatePost: TPostInput): Promise<Post> {
        logger.log('PostRepository::updatePost id: ' + id);

        let post = await this.findOne({
            where: { id }
        });
        if (!post) throw new Error(`Post ${id} not found!`);

        await this.handleBasePostInput(post, updatePost);
        post = await this.save(post);
        await checkEntitySlug(post);

        return post;
    }

    async deletePost(id: string): Promise<boolean> {
        logger.log('PostRepository::deletePost; id: ' + id);

        const post = await this.getPostById(id);
        if (!post) {
            console.log('PostRepository::deletePost failed to find post by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

    applyPostFilter(qb: SelectQueryBuilder<TPost> | DeleteQueryBuilder<TPost>, filterParams?: PostFilterInput) {
        // Search by product name
        if (filterParams?.titleSearch && filterParams.titleSearch !== '') {
            const titleSearch = `%${filterParams.titleSearch}%`;
            const query = `${this.metadata.tablePath}.title LIKE :titleSearch`;
            qb.andWhere(query, { titleSearch });
        }

        if (filterParams?.authorId && filterParams.authorId !== '') {
            const authorId = filterParams.authorId;
            const query = `${this.metadata.tablePath}.authorId = :authorId`;
            qb.andWhere(query, { authorId });
        }

        if (filterParams?.tags && filterParams.tags.length > 0) {
            const brackets = new Brackets(subQb => {
                let isFirstVal = true;
                filterParams!.tags!.forEach(tag => {
                    const likeStr = `%${tag}%`;
                    const tagKey = `tag_${tag}`;
                    const query = `${this.metadata.tablePath}.tags LIKE :${tagKey}`;
                    if (isFirstVal) {
                        isFirstVal = false;
                        subQb.where(query, { [tagKey]: likeStr });
                    } else {
                        subQb.orWhere(query, { [tagKey]: likeStr });
                    }
                })
            });
            qb.andWhere(brackets);
        }
        return qb;
    }

    async getFilteredPosts(pagedParams?: PagedParamsInput<Post>, filterParams?: PostFilterInput): Promise<TPagedList<TPost>> {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyPostFilter(qb, filterParams);
        return await getPaged(qb, this.metadata.tablePath, pagedParams);
    }

    async deleteManyFilteredPosts(input: TDeleteManyInput, filterParams?: PostFilterInput): Promise<boolean | undefined> {
        const qb = this.createQueryBuilder()
            .delete().from<Post>(this.metadata.tablePath);

        this.applyPostFilter(qb, filterParams);
        this.applyDeletMany(qb, input);
        await qb.execute();
        return true;
    }

    async getAllPostTags(): Promise<string[]> {
        const tags: string[] = [];
        const postTags: { tags: string }[] = await this.createQueryBuilder().select('tags' as (keyof TPost)).getRawMany();
        for (let post of postTags) {
            if (post.tags && post.tags !== '') {
                const tagsArr = post.tags.split(',');
                for (let tag of tagsArr) {
                    if (!tags.includes(tag)) tags.push(tag);
                }
            }
        }
        return tags;
    }

}