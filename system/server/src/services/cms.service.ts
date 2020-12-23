import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { GenericCms } from '../helpers/genericEntities';
import { TCmsEntity } from '@cromwell/core';

@Injectable()
export class CmsService {

    async getConfig(): Promise<TCmsEntity | undefined> {
        const cmsRepo = getCustomRepository(GenericCms.repository);
        const all = await cmsRepo.find();
        if (all && all[0]) return all[0];
    }

}