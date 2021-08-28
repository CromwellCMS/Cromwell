import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { setupController, tearDownController } from '../controller.helpers';

describe('Plugin Controller', () => {
    let server;
    let app: INestApplication;
    let testDir;

    beforeAll(async () => {
        const state = await setupController('plugin');
        server = state.server;
        app = state.app;
        testDir = state.testDir;
    });

    const defaultPlugin = '@cromwell/plugin-main-menu';

    it(`/GET settings`, () => {
        return request(server)
            .get(`/v1/plugin/settings?pluginName=${defaultPlugin}`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            })
    });

    it(`/POST settings`, async () => {
        await request(server)
            .post(`/v1/plugin/settings?pluginName=${defaultPlugin}`)
            .send({ _test_: '_test_' })
            .expect(201)
            .then(response => {
                expect(response.body).toBeTruthy();
            });

        await new Promise(done => setTimeout(done, 10));

        return request(server)
            .get(`/v1/plugin/settings?pluginName=${defaultPlugin}`)
            .expect(200)
            .then(response => {
                expect(response.body['_test_']).toEqual('_test_');
            })
    });

    it(`/GET admin-bundle`, () => {
        return request(server)
            .get(`/v1/plugin/admin-bundle?pluginName=${defaultPlugin}`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            })
    });

    afterAll(async () => {
        await tearDownController(app, testDir);
    });
});