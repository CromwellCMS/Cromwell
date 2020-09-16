const { resolve } = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const { getConfig } = require('./webpack.config');
const { appBuildDev, appBuildProd, contentDir, localProjectBuildDir, projectRootDir, localProjectDir, staticDir } = require('./src/constants');

// buildService | buildWeb
const scriptName = process.argv[2];
const watch = (process.argv[3] === 'watch');
const buildMode = process.argv[4] ? process.argv[4] : 'production';
const isWebProduction = buildMode === 'production' && scriptName === 'buildWeb';

const config = getConfig(scriptName, buildMode);
// if isWebProduction start build in temp folder and if build succeeded, 
// clear and replace old build in appBuildProd
const tempPath = resolve(staticDir, '.tempBuild');
if (isWebProduction) {
    config.output.path = tempPath;
}
const compiler = webpack(config);

const onEnd = (err, stats) => {
    const toText = () => stats.toString({
        chunks: false,
        colors: true
    });
    if (stats.hasErrors()) {
        console.error(toText());
    } else {
        console.log(toText());
        if (isWebProduction) {
            // Build successfull 
            try {
                // Clear appBuildProd
                if (fs.existsSync(appBuildProd)) {
                    console.log('AdminPanel:webpack:: Build successfull, removing previous build...');
                    fs.removeSync(appBuildProd);
                }
                // Copy temp new build in appBuildProd
                if (fs.existsSync(tempPath)) {
                    console.log(`AdminPanel:webpack:: Coping new build in appBuildProd...`);
                    fs.copySync(tempPath, appBuildProd);
                }
            } catch (e) {
                console.error('AdminPanel:webpack:: Failed to copy files of new build');
                // Bad case. Now user has no GUI to rebuild it.
                // @TODO: restore from some backup.
            }
        }
    }

    if (isWebProduction) {
        // Remove temp build dir
        if (fs.existsSync(tempPath)) {
            console.log('AdminPanel:webpack:: Removing temp build dir...');
            fs.removeSync(tempPath);
        }
    }
}

if (watch) compiler.watch({}, onEnd);
else compiler.run(onEnd);