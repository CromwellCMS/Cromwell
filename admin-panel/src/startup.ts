import { generateAdminPanelImports } from './generator';
import { startDevServer } from './devServer';
import shell from 'shelljs';

const scriptName = process.env.SCRIPT;


const main = async () => {
    console.log('scriptName', scriptName)
    if (scriptName === 'gen') {
        await generateAdminPanelImports();
    }
    if (scriptName === 'dev') {
        process.env.NODE_ENV = 'development';
        await generateAdminPanelImports();
        startDevServer(true);
    }
    if (scriptName === 'buildDev') {
        process.env.NODE_ENV = 'development';
        await generateAdminPanelImports();
        shell.exec('npx cross-env NODE_ENV=development npx webpack')
    }
    if (scriptName === 'buildProd') {
        process.env.NODE_ENV = 'production';
        await generateAdminPanelImports();
        shell.exec('npx cross-env NODE_ENV=production npx webpack')
    }
}

main();