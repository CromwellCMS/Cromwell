import { downloader } from '@App/downloader';
import { moduleArchiveFileName, moduleLibBuildFileName, moduleMetaInfoFileName, TPackageJson } from '@cromwell/core';
import { getBundledModulesDir } from '@cromwell/core-backend';
import * as fs from 'fs-extra';
import { join, resolve } from 'path';

import { mockWorkingDirectory, tearDown } from './helpers';

const testDir = mockWorkingDirectory('downloader');
const moduleToDownload = 'object-assign';
const pckg: TPackageJson = require(`${moduleToDownload}/package.json`);
if (!pckg) {
  console.error('Failed to require package of module: ' + moduleToDownload);
}

describe('downloader', () => {
  it('downloads package', async () => {
    const buildDir = getBundledModulesDir();
    const moduleBuildDir = resolve(buildDir, `${pckg.name}@${pckg.version}`);

    if (await fs.pathExists(moduleBuildDir)) {
      await fs.remove(moduleBuildDir);
    }

    await downloader({
      targetModule: {
        name: moduleToDownload,
        version: '4.1.1',
      },
    });
    expect(await fs.pathExists(moduleBuildDir)).toBeTruthy();
    expect(await fs.pathExists(join(moduleBuildDir, moduleArchiveFileName))).toBeTruthy();
    expect(await fs.pathExists(join(moduleBuildDir, moduleMetaInfoFileName))).toBeTruthy();
    expect(await fs.pathExists(join(moduleBuildDir, moduleLibBuildFileName))).toBeTruthy();
  });

  afterAll(async () => {
    await tearDown(testDir);
  });
});
