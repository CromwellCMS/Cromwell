import fs from 'fs-extra';
import { resolve } from 'path';

import {
  getCoreCommonDir,
  getCmsConfigPath,
  getModulePackage,
  getNodeModuleDir,
  getNodeModuleDirSync,
  getCmsConfigPathSync,
  resolvePackageJsonPath,
} from '../../src/helpers/paths';
import { mockWorkingDirectory } from '../helpers';

const pckgName = '@cromwell/core-backend';

describe('paths', () => {
  beforeAll(async () => {
    await mockWorkingDirectory('paths');
  });

  it('resolvePackageJsonPath', () => {
    const path = resolvePackageJsonPath(pckgName);
    expect(path && path.includes('package.json')).toBeTruthy();
  });

  it('getNodeModuleDirSync', () => {
    const path = getNodeModuleDirSync(pckgName);
    expect(path).toBeTruthy();
  });

  it('getNodeModuleDir', async () => {
    const path = await getNodeModuleDir(pckgName);
    expect(path).toBeTruthy();
  });

  it('getCoreCommonDir', () => {
    const path = getCoreCommonDir();
    expect(path).toBeTruthy();
  });

  it('getModulePackage', async () => {
    const pckg = await getModulePackage(pckgName);
    expect(pckg?.name).toEqual(pckgName);
  });

  it('getCmsConfigPath', async () => {
    const configMockPath = resolve(process.cwd(), '../cmsconfig.json');
    fs.outputJSONSync(configMockPath, {
      env: 'dev',
    });
    const configPath = await getCmsConfigPath();
    expect(configPath).toEqual(configMockPath);
  });

  it('getCmsConfigPathSync', async () => {
    const configMockPath = resolve(process.cwd(), '../cmsconfig.json');
    fs.outputJSONSync(configMockPath, {
      env: 'dev',
    });
    const configPath = getCmsConfigPathSync();
    expect(configPath).toEqual(configMockPath);
  });
});
