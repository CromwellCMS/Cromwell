import { EntityRepository } from 'typeorm';

import { PageStats } from '../models/entities/page-stats.entity';
import { BaseRepository } from './base.repository';

@EntityRepository(PageStats)
export class PageStatsRepository extends BaseRepository<PageStats> {

    constructor() {
        super(PageStats)
    }
}