import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';

const typeorm = require('typeorm');
typeorm.getManager = () => ({
    find: () => [1, 2],
    save: jest.fn(),
    findOne: () => null,
});

import PluginNewsletterController from '../../src/backend/controllers/plugin-newsletter.controller';

describe('plugin-newsletter.controller', () => {

    let controller: PluginNewsletterController;

    beforeAll(async () => {
        controller = new PluginNewsletterController();

        const moduleRef = await Test.createTestingModule({
            controllers: [PluginNewsletterController],
            imports: [ThrottlerModule.forRoot({
                ttl: 30,
                limit: 100,
            })],
        }).compile();

        controller = moduleRef.get<PluginNewsletterController>(PluginNewsletterController);
    })

    it(`/GET stats`, async () => {
        const stats = await controller.getStats({
            user: {
                role: 'administrator'
            }
        } as any);

        expect(stats + '').toBe('2')
    });

    it(`/POST subscribe`, async () => {
        const success = await controller.placeSubscription({
            email: '_test_@test.test'
        });

        expect(success).toBe(true);
    });
})