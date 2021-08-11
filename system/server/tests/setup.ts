
import { Container } from 'typedi';
import { getServerTempDir } from '@cromwell/core-backend';
import { MockService } from '../src/services/mock.service';
import { join } from 'path';
import fs from 'fs-extra';
import { connectDatabase } from '../src/helpers/connectDataBase';

export default async function () {
    const testDir = join(getServerTempDir());
    if (fs.pathExistsSync(testDir)) fs.removeSync(testDir);

    await connectDatabase({ synchronize: true, migrationsRun: false }, true);

    const mockService = Container.get(MockService);
    await mockService.mockUsers();
    await mockService.mockTags(12);
    await mockService.mockPosts(12);
    await mockService.mockAttributes();
    await mockService.mockCategories(20);
    await mockService.mockProducts(12);
    await mockService.mockReviews(12);
    await mockService.mockOrders(12);
}
