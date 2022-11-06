import { bundledModulesDirName, moduleMetaInfoFileName, moduleNodeBuildFileName, TPackageJson } from '@cromwell/core';
import { getBundledModulesDir, getPublicDir } from '@cromwell/core-backend';
import * as fs from 'fs-extra';
import { join, resolve } from 'path';
import symlinkDir from 'symlink-dir';

import { getModuleImporter } from '../../src/helpers/importer';
import { mockWorkingDirectory, tearDown } from '../helpers';

const testDir = mockWorkingDirectory('importer');
const moduleName = 'object-assign';
const pckg: TPackageJson = require(`${moduleName}/package.json`);
if (!pckg) {
  console.error('Failed to require package of module: ' + moduleName);
}

describe('importer', () => {
  it('requires single module', async () => {
    const moduleFullName = `${pckg.name}@${pckg.version}`;
    const buildDir = getBundledModulesDir();
    const moduleBuildDir = resolve(buildDir, `${pckg.name}@${pckg.version}`);
    if (await fs.pathExists(moduleBuildDir)) {
      await fs.remove(moduleBuildDir);
    }
    const nodeBundlePath = join(moduleBuildDir, moduleNodeBuildFileName);
    await fs.outputFile(
      nodeBundlePath,
      `global.CromwellStore.nodeModules.modules["${moduleName}"] = 'test';
            module.exports = '_test_';`,
    );

    const nodeMetaPath = join(moduleBuildDir, moduleMetaInfoFileName);
    await fs.outputFile(nodeMetaPath, `{"name":"${moduleFullName}","import":"lib","externalDependencies":{}}`);

    const publicDir = getPublicDir();
    const publicBuildLink = resolve(publicDir, bundledModulesDirName);
    if (!(await fs.pathExists(publicBuildLink))) await symlinkDir(buildDir, publicBuildLink);

    const importer = getModuleImporter(undefined, true);

    const success = await importer?.importModule?.(moduleFullName);
    expect(success).toBeTruthy();
    expect(importer?.modules?.[moduleName]).toBeTruthy();
  });

  it('requires script module', async () => {
    const moduleFullName = `${pckg.name}@${pckg.version}`;
    const buildDir = getBundledModulesDir();
    const moduleBuildDir = resolve(buildDir, `${pckg.name}@${pckg.version}`);
    if (await fs.pathExists(moduleBuildDir)) {
      await fs.remove(moduleBuildDir);
    }
    const nodeBundlePath = join(moduleBuildDir, moduleNodeBuildFileName);
    await fs.outputFile(
      nodeBundlePath,
      `global.CromwellStore.nodeModules.modules["${moduleName}"] = 'test';
            module.exports = '_test_';`,
    );

    const nodeMetaPath = join(moduleBuildDir, moduleMetaInfoFileName);
    await fs.outputFile(nodeMetaPath, `{"name":"${moduleFullName}","import":"lib","externalDependencies":{}}`);

    const publicDir = getPublicDir();
    const publicBuildLink = resolve(publicDir, bundledModulesDirName);
    if (!(await fs.pathExists(publicBuildLink))) await symlinkDir(buildDir, publicBuildLink);

    const importer = getModuleImporter(undefined, true);

    const success = await importer?.importScriptExternals?.({
      name: '_tets1_',
      externalDependencies: {
        [moduleFullName]: ['default'],
      },
    });

    expect(success).toBeTruthy();
    expect(importer?.modules?.[moduleName]).toBeTruthy();
  });

  afterAll(async () => {
    await tearDown(testDir);
  });
});
