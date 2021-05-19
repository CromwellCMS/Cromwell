import { getCoreCommonDir, getNodeModuleDir, getModulePackage, getNodeModuleDirSync, resolvePackageJsonPath } from '../../src/helpers/paths';
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

});
