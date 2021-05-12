import { EntityRepository } from 'typeorm';

import { PageStats } from '../entities/PageStats';
import { BaseRepository } from './BaseRepository';

@EntityRepository(PageStats)
export class PageStatsRepository extends BaseRepository<PageStats> {

    constructor() {
        super(PageStats)
    }
}