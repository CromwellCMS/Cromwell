import { TPagedList, TPagedParams, TTag, TTagInput } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { Tag } from '../models/entities/tag.entity';
import { getLogger } from '../helpers/logger';
import { checkEntitySlug, handleBaseInput } from '../helpers/base-queries';
import { BaseRepository } from './base.repository';

const logger = getLogger();

@EntityRepository(Tag)
export class TagRepository extends BaseRepository<Tag> {

    constructor() {
        super(Tag);
    }

    async getTags(params?: TPagedParams<TTag>): Promise<TPagedList<Tag>> {
        logger.log('TagRepository::getTags');
        return this.getPaged(params)
    }

    async getTagById(id: string): Promise<Tag | undefined> {
        logger.log('TagRepository::getTagById id: ' + id);
        return this.getById(id);
    }

    async getTagsByIds(ids: string[]): Promise<Tag[]> {
        logger.log('ProductCategoryRepository::getTagsByIds ids: ' + ids.join(', '));
        return this.findByIds(ids);
    }

    async getTagBySlug(slug: string): Promise<Tag | undefined> {
        logger.log('TagRepository::getTagBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    private async handleBaseTagInput(tag: Tag, input: TTagInput) {
        await handleBaseInput(tag, input);

        tag.name = input.name;
        tag.color = input.color;
        tag.image = input.image;
        tag.description = input.description;
        tag.descriptionDelta = input.descriptionDelta;
    }

    async createTag(inputData: TTagInput, id?: string): Promise<Tag> {
        logger.log('TagRepository::createTag');
        let tag = new Tag();
        if (id) tag.id = id;

        await this.handleBaseTagInput(tag, inputData);
        tag = await this.save(tag);
        await checkEntitySlug(tag, Tag);

        return tag;
    }

    async updateTag(id: string, inputData: TTagInput): Promise<Tag> {
        logger.log('TagRepository::updateTag id: ' + id);

        let tag = await this.findOne({
            where: { id }
        });
        if (!tag) throw new Error(`Tag ${id} not found!`);

        await this.handleBaseTagInput(tag, inputData);
        tag = await this.save(tag);
        await checkEntitySlug(tag, Tag);

        return tag;
    }

    async deleteTag(id: string): Promise<boolean> {
        logger.log('TagRepository::deleteTag; id: ' + id);

        const tag = await this.getTagById(id);
        if (!tag) {
            logger.error('TagRepository::deleteTag failed to find Tag by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

}