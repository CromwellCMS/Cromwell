import { TCmsSettings, TPackageCromwellConfig } from '@cromwell/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthService } from '@App/services/auth.service';
import { setupController, tearDownController } from '../controller.helpers';

describe('CMS Controller', () => {
    let server;
    let app: INestApplication;
    let testDir;

    beforeAll(async () => {
        const state = await setupController('cms');
        server = state.server;
        app = state.app;
        testDir = state.testDir;
    });

    it(`/GET config`, () => {
        return request(server)
            .get('/cms/config')
            .expect(200)
            .then(response => {
                const { mainApiPort, themeName } = response.body as TCmsSettings;
                expect(typeof mainApiPort).toBe('number');
                expect(typeof themeName).toBe('string');
            })
    });

    it(`/GET themes`, () => {
        return request(server)
            .get('/cms/themes')
            .expect(200)
            .then(response => {
                const configs = response.body as TPackageCromwellConfig[];
                expect(configs.length >= 1).toBeTruthy();
                expect(configs[0].type === 'theme').toBeTruthy();
            })
    });

    it(`/GET plugins`, () => {
        return request(server)
            .get('/cms/plugins')
            .expect(200)
            .then(response => {
                const configs = response.body as TPackageCromwellConfig[];
                expect(configs.length >= 1).toBeTruthy();
                expect(configs[0].type === 'plugin').toBeTruthy();
            });
    });

    it(`/GET read-public-dir`, async () => {
        return request(server)
            .get('/cms/read-public-dir')
            .expect(200)
            .then(response => {
                expect(response.body.length >= 1).toBeTruthy();
            });
    });

    it(`/GET create-public-dir`, async () => {
        const dirNum1 = await request(server)
            .get('/cms/read-public-dir')
            .expect(200)
            .then(response => {
                return response.body.length;
            });

        await request(server)
            .get('/cms/create-public-dir?dirName=test1')
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            });

        const dirNum2 = await request(server)
            .get('/cms/read-public-dir')
            .expect(200)
            .then(response => {
                return response.body.length;
            });

        expect(dirNum1 < dirNum2).toBeTruthy();
    });

    it(`/GET remove-public-dir`, async () => {
        const dirNum1 = await request(server)
            .get('/cms/read-public-dir')
            .expect(200)
            .then(response => {
                return response.body.length;
            });

        await request(server)
            .get('/cms/remove-public-dir?dirName=test1')
            .expect(200)
            .then(response => {
                expect(response.body).toBeTruthy();
            });

        const dirNum2 = await request(server)
            .get('/cms/read-public-dir')
            .expect(200)
            .then(response => {
                return response.body.length;
            });

        expect(dirNum1 > dirNum2).toBeTruthy();
    });


    // it(`/GET upload-public-file`, async () => {
    //     const dirNum1 = await request(server)
    //         .get('/cms/read-public-dir')
    //         .expect(200)
    //         .then(response => {
    //             return response.body.length;
    //         });

    //     const fileName = 'test_file1';

    //     await request(server)
    //         .post('/cms/upload-public-file?fileName=' + fileName)
    //         .attach('image', fs.readFileSync(resolve(__dirname, 'cms.controller.spec.ts')))
    //         .expect(200)
    //         .then(response => {
    //             expect(response.body).toBeTruthy();
    //         });

    //     const dirNum2 = await request(server)
    //         .get('/cms/read-public-dir')
    //         .expect(200)
    //         .then(response => {
    //             return response.body.length;
    //         });

    //     expect(dirNum1 < dirNum2).toBeTruthy();
    // });

    afterAll(async () => {
        await tearDownController(app, testDir);
    });
});