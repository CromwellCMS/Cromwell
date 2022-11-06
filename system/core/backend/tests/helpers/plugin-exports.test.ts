import { readPluginsExports } from '../../src/helpers/plugin-exports';

import { mockWorkingDirectory } from '../helpers';
import fs from 'fs-extra';
import { resolve } from 'path';

describe('plugin-exports', () => {
  beforeAll(() => {
    mockWorkingDirectory('plugin-exports');
  });

  it('reads exports of plugins', async () => {
    fs.outputJSONSync(resolve(process.cwd(), 'package.json'), {
      name: '@cromwell/core-backend',
      version: '1.0.0',
      cromwell: {
        themes: ['@cromwell/theme-store', '@cromwell/theme-blog'],
        plugins: ['@cromwell/plugin-main-menu'],
      },
    });

    const pExports = await readPluginsExports();
    pExports.find((ext) => ext.pluginName === '@cromwell/plugin-main-menu');
  });
});
