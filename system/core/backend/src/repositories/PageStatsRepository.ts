import { EntityRepository } from 'typeorm';

import { PageStats } from '../entities/PageStats';
import { getLogger } from '../helpers/constants';
import { BaseRepository } from './BaseRepository';

const logger = getLogger('detailed');

@EntityRepository(PageStats)
export class PageStatsRepository extends BaseRepository<PageStats> {

    constructor() {
        super(PageStats)
    }


}