import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { setupController, tearDownController } from '../controller.helpers';

describe('Plugin Controller', () => {
    let server;
    let app: INestApplication;
    let testDir;

    beforeAll(async () => {
        [server, app, testDir] = await setupController('plugin');
    });

    const defaultPlugin = '@cromwell/plugin-main-menu';

    it(`/GET settings`, () => {
        return request(server)
            .get(`/plugin/settings?pluginName=${defaultPlugin}`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            })
    });

    it(`/POST settings`, async () => {
        await request(server)
            .post(`/plugin/settings?pluginName=${defaultPlugin}`)
            .send({ _test_: '_test_' })
            .expect(201)
            .then(response => {
                expect(response.body).toBeTruthy();
            });

        return request(server)
            .get(`/plugin/settings?pluginName=${defaultPlugin}`)
            .expect(200)
            .then(response => {
                expect(response.body['_test_']).toEqual('_test_');
            })
    });

    it(`/GET frontend-bundle`, () => {
        return request(server)
            .get(`/plugin/frontend-bundle?pluginName=${defaultPlugin}`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            })
    });

    it(`/GET admin-bundle`, () => {
        return request(server)
            .get(`/plugin/admin-bundle?pluginName=${defaultPlugin}`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            })
    });

    it(`/GET list`, () => {
        return request(server)
            .get(`/plugin/list`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
                expect(response.body.length).toBeTruthy();
            })
    });


    afterAll(async () => {
        await tearDownController(app, testDir);
    });
});