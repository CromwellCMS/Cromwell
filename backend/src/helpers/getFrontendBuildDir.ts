import { resolve } from 'path';
const fs = require('fs-extra');

export const getRootBuildDir = (): string | undefined => {
    const distDir = '.next'
    const rootBuildDir = resolve(__dirname, '../../../renderer', distDir).replace(/\\/g, '/');
    console.log('PageBuilder rootBuildDir: ', rootBuildDir);
    if (!fs.existsSync(rootBuildDir)) {
        console.error('PageBuilder: cannot find frontend nextjs build folder: ' + rootBuildDir);
        return;
    }
    return rootBuildDir;
}

export const getBuildId = (): string | undefined => {
    const rootBuildDir = getRootBuildDir();
    if (!rootBuildDir) return;

    const buildIdPath = rootBuildDir + '/BUILD_ID';
    if (!fs.existsSync(buildIdPath)) {
        console.error('PageBuilder: cannot find frontend nextjs BUILD_ID file: ' + buildIdPath);
        return;
    }
    const buildId = fs.readFileSync(buildIdPath, { encoding: 'utf8', flag: 'r' });
    return buildId;
}

export const getFrontendBuildDir = (): string | undefined => {
    const rootBuildDir = getRootBuildDir();
    if (!rootBuildDir) return;

    const buildId = getBuildId();

    const buildStaticDir = `${rootBuildDir}/server/static/${buildId}/pages`
    console.log('PageBuilder buildStaticDir: ', buildStaticDir);
    if (!fs.existsSync(buildStaticDir)) {
        console.error('PageBuilder: cannot find frontend nextjs static build folder: ' + buildStaticDir);
        return;
    }
    return buildStaticDir;
}

