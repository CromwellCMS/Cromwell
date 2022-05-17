import { TCreateUser } from '@cromwell/core';
import * as coreBackend from '@cromwell/core-backend';

const sendEmail = jest.spyOn(coreBackend, 'sendEmail');
sendEmail.mockImplementation(async () => true);

const usedEmailTemplates: Record<string, any> = {};
const getEmailTemplate = jest.spyOn(coreBackend, 'getEmailTemplate');
getEmailTemplate.mockImplementation(async (name: string, content: any) => {
    usedEmailTemplates[name] = content;
    return 'mail';
});

import { RoleRepository, UserRepository } from '@cromwell/core-backend';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getCustomRepository } from 'typeorm';
import { AccessTokensDto } from '../../src/dto/access-tokens.dto';
// import { authSettings } from '../../src/helpers/settings';

import { setupController, tearDownController } from '../controller.helpers';

describe('auth Controller', () => {
    let server;
    let app: INestApplication;
    let testDir;

    beforeAll(async () => {
        const state = await setupController('auth');
        server = state.server;
        app = state.app;
        testDir = state.testDir;
        const adminRole = await getCustomRepository(RoleRepository).createRole({
            name: 'administrator',
            permissions: ['all'],
        });

        await getCustomRepository(UserRepository).createUser({
            password: 'test',
            email: 'test@test.test',
            roles: [adminRole.name!],
            fullName: 'test',
        });

        await getCustomRepository(UserRepository).createUser({
            password: 'test3',
            email: 'test3@test.test',
            roles: [adminRole.name!],
            fullName: 'test3',
        });
    });

    afterAll(async () => {
        await tearDownController(app, testDir);
    });


    it(`/POST login`, () => {
        return request(server)
            .post('/v1/auth/login')
            .send({ email: 'test@test.test', password: 'test' })
            .expect(200);
    });


    it(`/POST log-out`, () => {
        return request(server)
            .post('/v1/auth/log-out')
            .expect(200);
    });


    it(`/POST get-tokens`, () => {
        return request(server)
            .post('/v1/auth/get-tokens')
            .send({ email: 'test@test.test', password: 'test' })
            .expect(201)
            .then(response => {
                expect(response.body).toBeTruthy();
                expect(response.body?.accessToken).toBeTruthy();
                expect(response.body?.refreshToken).toBeTruthy();
                expect(response.body?.user?.email).toEqual('test@test.test');
            });
    });


    it(`/POST update-access-token`, async () => {
        const tokens: AccessTokensDto = await request(server)
            .post('/v1/auth/get-tokens')
            .send({ email: 'test@test.test', password: 'test' })
            .expect(201)
            .then(response => {
                expect(response.body?.accessToken).toBeTruthy();
                expect(response.body?.refreshToken).toBeTruthy();
                expect(response.body?.user?.email).toEqual('test@test.test');
                return response.body;
            });

        await request(server)
            .post('/v1/auth/update-access-token')
            .send({ refreshToken: tokens.refreshToken })
            .expect(201)
            .then(response => {
                expect(response.body?.accessToken).toBeTruthy();
            });
    });


    it(`/POST sign-up`, () => {
        const input: TCreateUser = {
            email: 'test2@test.test',
            password: 'test',
            fullName: 'test',
            roles: ['customer'],
        };
        return request(server)
            .post('/v1/auth/sign-up')
            .send(input)
            .expect(201)
            .then(response => {
                expect(response.body?.fullName).toEqual('test');
                expect(response.body?.email).toEqual('test2@test.test');
                expect(!response.body?.password).toBeTruthy();
            });
    });


    it(`/POST forgot-password`, () => {
        return request(server)
            .post('/v1/auth/forgot-password')
            .send({
                email: 'test@test.test',
            })
            .expect(201)
            .then(response => {
                expect(response.body).toBeTruthy();
                expect(usedEmailTemplates['forgot-password.hbs']?.resetCode).toBeTruthy();
            });
    });


    it(`/POST reset-password`, async () => {
        await request(server)
            .post('/v1/auth/forgot-password')
            .send({
                email: 'test@test.test',
            })
            .expect(201)
            .then(response => {
                expect(response.body).toBeTruthy();
                expect(usedEmailTemplates['forgot-password.hbs']?.resetCode).toBeTruthy();
            });

        await request(server)
            .post('/v1/auth/reset-password')
            .send({
                email: 'test@test.test',
                code: usedEmailTemplates['forgot-password.hbs']?.resetCode,
                newPassword: 'test2'
            })
            .expect(201)
            .then(response => {
                expect(response.body).toBeTruthy();
            });

        return request(server)
            .post('/v1/auth/login')
            .send({ email: 'test@test.test', password: 'test2' })
            .expect(200);
    });



    // // @TODO: Fix test
    // it(`/GET user-info`, async () => {
    //     const tokens: AccessTokensDto = await request(server)
    //         .post('/v1/auth/get-tokens')
    //         .send({ email: 'test3@test.test', password: 'test3' })
    //         .expect(201)
    //         .then(response => {
    //             expect(response.body).toBeTruthy();
    //             expect(response.body?.accessToken).toBeTruthy();
    //             expect(response.body?.refreshToken).toBeTruthy();
    //             return response.body;
    //         });


    //     // Server doesn't read set cookies, probably because they are HttpOnly
    //     await request(server)
    //         .get('/v1/auth/user-info')
    //         .set('Cookie', `${authSettings.accessTokenCookieName}=${tokens.accessToken}; HttpOnly; Path=/; Max-Age=${authSettings.expirationAccessTime}`)
    //         .expect(200)
    //         .then(response => {
    //             expect(response.body?.email).toEqual('test3@test.test');
    //             expect(response.body?.fullName).toEqual('test3');
    //         });
    // });

})