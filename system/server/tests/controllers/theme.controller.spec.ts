import { INestApplication } from '@nestjs/common';
import { TModuleConfig, TPackageCromwellConfig } from '@cromwell/core';
import request from 'supertest';

import { setupController, tearDownController } from '../controller.helpers';

describe('Theme Controller', () => {
  let server;
  let app: INestApplication;
  let testDir;

  const defaultPage = 'product/[slug]';
  const themeName = '@cromwell/theme-store';

  beforeAll(async () => {
    const state = await setupController('theme');
    server = state.server;
    app = state.app;
    testDir = state.testDir;
  });

  it(`/GET page`, () => {
    return request(server)
      .get(`/v1/theme/page?pageRoute=${defaultPage}&themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body?.route).toBeTruthy();
      });
  });

  it(`/POST page`, async () => {
    const config = await request(server)
      .get(`/v1/theme/page?pageRoute=${defaultPage}&themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body?.route).toBeTruthy();
        return response.body;
      });

    await request(server)
      .post(`/v1/theme/page?pageRoute=${defaultPage}&themeName=${themeName}`)
      .send({ ...config, title: '_test_' })
      .expect(201)
      .then((response) => {
        expect(response.body).toBeTruthy();
      });

    await new Promise((done) => setTimeout(done, 10));

    return request(server)
      .get(`/v1/theme/page?pageRoute=${defaultPage}&themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body?.title === '_test_').toBeTruthy();
      });
  });

  it(`/GET plugins`, () => {
    return request(server)
      .get(`/v1/theme/plugins?pageRoute=${defaultPage}&themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect(Object.keys(response.body).length).toBeTruthy();
      });
  });

  it(`/GET plugin-names`, () => {
    return request(server)
      .get(`/v1/theme/plugin-names?themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBeTruthy();
      });
  });

  it(`/GET pages/info`, () => {
    return request(server)
      .get(`/v1/theme/pages/info?themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBeTruthy();
      });
  });

  it(`/GET pages/configs`, () => {
    return request(server)
      .get(`/v1/theme/pages/configs?themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBeTruthy();
      });
  });

  it(`/GET config`, () => {
    return request(server)
      .get(`/v1/theme/config?themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect((response.body as TModuleConfig).pages).toBeTruthy();
      });
  });

  it(`/GET info`, () => {
    return request(server)
      .get(`/v1/theme/info?themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect((response.body as TPackageCromwellConfig).name).toBeTruthy();
      });
  });

  it(`/GET custom-config`, () => {
    return request(server)
      .get(`/v1/theme/custom-config?themeName=${themeName}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeTruthy();
      });
  });

  afterAll(async () => {
    await tearDownController(app, testDir);
  });
});
