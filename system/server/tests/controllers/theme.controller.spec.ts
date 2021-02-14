import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { setupController, tearDownController } from '../helpers';

describe('Theme Controller', () => {
    let server;
    let app: INestApplication;
    let testDir;

    const defaultTheme = '@cromwell/theme-store';
    const defaultPage = 'product/[slug]';

    beforeAll(async () => {
        [server, app, testDir] = await setupController('theme');
    });

    it(`/GET page`, () => {
        return request(server)
            .get(`/theme/page?pageRoute=${defaultPage}`)
            .expect(200)
            .then(response => {
                expect(response.body?.route).toBeTruthy();
            })
    });


    it(`/POST page`, async () => {

        const config = await request(server)
            .get(`/theme/page?pageRoute=${defaultPage}`)
            .expect(200)
            .then(response => {
                expect(response.body?.route).toBeTruthy();
                return response.body;
            });

        await request(server)
            .post(`/theme/page?pageRoute=${defaultPage}`)
            .send({ ...config, title: '_test_' })
            .expect(201)
            .then(response => {
                expect(response.body).toBeTruthy();
            });

        return request(server)
            .get(`/theme/page?pageRoute=${defaultPage}`)
            .expect(200)
            .then(response => {
                expect(response.body?.title === '_test_').toBeTruthy();
            })
    });


    it(`/GET plugins`, () => {
        return request(server)
            .get(`/theme/plugins?pageRoute=${defaultPage}`)
            .expect(200)
            .then(response => {
                expect(Object.keys(response.body).length).toBeTruthy();
            })
    });


    it(`/GET plugin-names`, () => {
        return request(server)
            .get(`/theme/plugin-names`)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBeTruthy();
            })
    });


    it(`/GET pages/info`, () => {
        return request(server)
            .get(`/theme/pages/info`)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBeTruthy();
            })
    });


    it(`/GET pages/configs`, () => {
        return request(server)
            .get(`/theme/pages/configs`)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBeTruthy();
            })
    });


    it(`/GET main-config`, () => {
        return request(server)
            .get(`/theme/main-config`)
            .expect(200)
            .then(response => {
                expect(response.body.themeName).toBeTruthy();
            })
    });


    it(`/GET custom-config`, () => {
        return request(server)
            .get(`/theme/custom-config`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            })
    });


    it(`/GET page-bundle`, () => {
        return request(server)
            .get(`/theme/page-bundle?pageRoute=${defaultPage}`)
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            })
    });


    afterAll(async () => {
        await tearDownController(app, testDir);
    });
});