import { TServiceVersions } from '@cromwell/core';

import { getServiceVersion, incrementServiceVersion } from '../../src/helpers/service-versions';
import { connectDatabase, mockWorkingDirectory } from '../helpers';

describe('service-versions', () => {
    beforeAll(async () => {
        mockWorkingDirectory('service-versions');
        await connectDatabase();
    });

    it('incrementServiceVersion', async () => {
        const serviceName: keyof TServiceVersions = 'admin';
        const currentVer = parseInt((await getServiceVersion(serviceName) ?? 0) + '');
        await incrementServiceVersion(serviceName);

        const nextVer = parseInt((await getServiceVersion(serviceName) ?? 0) + '');
        expect(nextVer).toEqual(currentVer + 1);
    });
});