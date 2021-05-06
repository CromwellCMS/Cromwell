import { getCoreCommonDir, getNodeModuleDir, getNodeModuleDirSync, resolvePackageJsonPath } from '../../src/helpers/paths';
import { mockWorkingDirectory } from '../helpers';


describe('paths', () => {

    beforeAll(async () => {
        await mockWorkingDirectory('paths');
    });

    it('resolvePackageJsonPath', () => {
        const path = resolvePackageJsonPath('@cromwell/core-backend');
        expect(path && path.includes('package.json')).toBeTruthy();
    });

    it('getNodeModuleDirSync', () => {
        const path = getNodeModuleDirSync('@cromwell/core-backend');
        expect(path).toBeTruthy();
    });

    it('getNodeModuleDir', async () => {
        const path = await getNodeModuleDir('@cromwell/core-backend');
        expect(path).toBeTruthy();
    });

    it('getCoreCommonDir', () => {
        const path = getCoreCommonDir();
        expect(path).toBeTruthy();
    });

});
