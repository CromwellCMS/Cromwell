import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { setupController, tearDownController } from '../helpers';

describe('Plugin Controller', () => {
    let server;
    let app: INestApplication;
    let testDir;

    beforeAll(async () => {
        [server, app, testDir] = await setupController('plugin');
    });

    it(`/GET settings`, () => {
        const pluginName = '@cromwell/plugin-main-menu';
        return request(server)
            .get(`/plugin/settings?pluginName=${pluginName}`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            })
    });


    afterAll(async () => {
        await tearDownController(app, testDir);
    });
});