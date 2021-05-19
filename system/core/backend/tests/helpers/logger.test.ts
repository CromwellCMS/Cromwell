import { sleep } from '@cromwell/core';
import fs from 'fs-extra';

import { getLogger } from '../../src/helpers/logger';
import { getErrorLogPath } from '../../src/helpers/paths';
import { mockWorkingDirectory } from '../helpers';

describe('logger', () => {

    beforeAll(async () => {
        await mockWorkingDirectory('logger');
    });

    it('logs into file', async () => {
        const logger = getLogger();
        logger.error('test');
        await sleep(1);

        expect(await fs.pathExists(getErrorLogPath())).toBeTruthy();
    });
})