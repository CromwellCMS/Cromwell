import {
    bundledModulesDirName,
    moduleLibBuildFileName,
    moduleMainBuildFileName,
    moduleMetaInfoFileName,
    moduleNodeBuildFileName,
    TCromwellNodeModules,
    TScriptMetaInfo,
    getStore, isServer
} from '@cromwell/core';

/**
 * Bundled node modules (Frontend dependencies) loading script 
 */
export class Importer implements Required<TCromwellNodeModules> {

    public importStatuses = {};
    public imports = {};
    public moduleExternals = {};
    public scriptStatuses = {};
    public modules: Record<string, any>;
    public canShowInfo = false;
    public prefix: string;
    public hasBeenExecuted = false;

    private serverPublicDir?: string;
    private normalizePath: any;
    private nodeRequire: any;
    private resolve: any;


    constructor() {
        const checkLib = (store, libName) => {
            if (!store[libName]) {
                store[libName] = {
                    libName,
                };
            }
        }

        this.modules = new Proxy({}, {
            get(obj, prop) {
                // checkLib(obj, prop);
                return obj[prop];
            },
            set(obj, prop, value) {
                checkLib(obj, prop);

                if (typeof value === 'object' && !value['default']) {
                    value = {
                        ...value,
                        default: obj[prop]['default'] ?? obj[prop],
                    }
                }
                // console.log('Set lib: ' + String(prop), obj[prop], 'new value: ', value);
                if (typeof value === 'object') {
                    obj[prop] = Object.assign(obj[prop], value);
                } else if (typeof value === 'function') {
                    obj[prop] = value;
                    value.default = value;
                } else {
                    obj[prop] = Object.assign(obj[prop], {
                        default: value
                    });
                }
                return true;
            }
        });
    }

    public setPrefix = (prefix) => this.prefix = prefix;
    public setServerPublicDir = (dir) => this.serverPublicDir = dir;


    /**
     * Import single module with its dependencies
     * @param moduleName 
     * @param namedExports 
     * @returns 
     */
    public importModule(moduleName, namedExports = ['default']): Promise<boolean> | boolean {
        const canShowInfo = this.canShowInfo;
        this.hasBeenExecuted = true;
        if (canShowInfo) console.log('Cromwell:importer: importModule ' + moduleName + ' named: ' + namedExports);

        if (namedExports.includes('default')) {
            namedExports = ['default'];
        }

        const metaFilepath = `${this.prefix ? `${this.prefix}/` : ''}${bundledModulesDirName}/${moduleName}/${moduleMetaInfoFileName}`;
        const importerFilepath = `${this.prefix ? `/${this.prefix}` : ''}/${bundledModulesDirName}/${moduleName}/${moduleMainBuildFileName}`;
        const importerEntireLibFilepath = `${this.prefix ? `/${this.prefix}` : ''}/${bundledModulesDirName}/${moduleName}/${moduleLibBuildFileName}`;
        const importerNodeFilepath = `${bundledModulesDirName}/${moduleName}/${moduleNodeBuildFileName}`;

        let moduleVer: string | undefined;
        if (/@\d+\.\d+\.\d+/.test(moduleName)) {
            const modChunks = moduleName.split('@');
            moduleVer = modChunks.pop();
            moduleName = modChunks.join('@');
        }
        if (canShowInfo) console.log('moduleName', moduleName, 'moduleVer', moduleVer)

        if (isServer()) {
            try {
                return this.serverImport({
                    moduleName,
                    metaFilepath,
                    importerNodeFilepath,
                })
            } catch (error) {
                console.error(error);
            }
            return false;
        } else {
            return this.browserImport({
                moduleName,
                moduleVer,
                metaFilepath,
                importerNodeFilepath,
                namedExports,
                importerEntireLibFilepath,
                importerFilepath,
            }).then(success => {
                if (canShowInfo) console.log('Cromwell:importer: Processed module: ' + moduleName, success);
                return success;
            });
        }
    }


    /**
     * Server-side import. Sync, require()
     */
    private serverImport(options: {
        moduleName: string;
        metaFilepath: string;
        importerNodeFilepath: string;
    }) {
        const canShowInfo = this.canShowInfo;
        const { moduleName, metaFilepath, importerNodeFilepath } = options;

        if (this.importStatuses[moduleName]) return true;

        if (!this.normalizePath) this.normalizePath = eval(`require('normalize-path');`);
        if (!this.nodeRequire) this.nodeRequire = (name) => eval(`require('${this.normalizePath(name)}');`);
        if (!this.resolve) this.resolve = this.nodeRequire('path').resolve;


        try {
            // Try to require from bundled modules
            try {
                const fullPath = this.resolve(this.serverPublicDir ? this.serverPublicDir :
                    this.resolve(process.cwd(), 'public'), metaFilepath);

                const metaInfo: TScriptMetaInfo = this.nodeRequire(fullPath);
                // { [moduleName]: namedExports }
                if (metaInfo) this.importScriptExternals(metaInfo);
            } catch (e) {
                console.error('Cromwell:importer: Failed to require meta info of module server-side: ' + metaFilepath, e);
            }

            try {
                const fullPath = this.resolve(this.serverPublicDir ? this.serverPublicDir :
                    this.resolve(process.cwd(), 'public'), importerNodeFilepath);

                this.nodeRequire(fullPath);

                const mock = Function('require', "return require('mock-require/index');")(this.nodeRequire)
                const reqModule = this.modules?.[moduleName];

                if (!reqModule) throw new Error('!reqModule');

                this.modules[moduleName] = reqModule;
                this.importStatuses[moduleName] = 'default';
                mock(moduleName, reqModule);

            } catch (e) {
                console.error('Cromwell:importer: Failed to require module server-side: ' + importerNodeFilepath, e);
                this.importStatuses[moduleName] = 'failed';
                throw new Error();
            }

        } catch (e) {
            // If failed, try to use Node.js resolution
            const reqModule = this.nodeRequire(moduleName);

            if (canShowInfo) console.log('reqModule: ' + moduleName + ' keys: ' + Object.keys(reqModule).length);

            this.modules[moduleName] = reqModule;
            this.importStatuses[moduleName] = 'default';
        }

        if (canShowInfo) console.log('Cromwell:importer: Successfully loaded module: ' + moduleName);

        return true;
    }


    /**
     * Browser-side import. Async, fetch
     */
    private browserImport = async (options: {
        moduleName: string;
        moduleVer: string | undefined;
        metaFilepath: string;
        importerNodeFilepath: string;
        namedExports: string[];
        importerEntireLibFilepath: string;
        importerFilepath: string;
    }): Promise<boolean> => {
        const canShowInfo = this.canShowInfo;
        const { moduleName, moduleVer, metaFilepath, namedExports,
            importerEntireLibFilepath, importerFilepath } = options;

        let isDefaultImport = false;
        let isLibImport = false;
        if (namedExports.includes('default')) {
            isDefaultImport = true;
        }

        const useImporter = async (namedExport: string): Promise<boolean> => {
            if (!this.imports?.[moduleName]?.[namedExport]) {
                console.error(`loading:!Cromwell.imports[moduleName][namedExport]: import {${namedExport}} from ${moduleName}`);
                return false;
            }
            if (this.imports && this.imports[moduleName]) {
                try {
                    await this.imports[moduleName][namedExport]();
                    return true;
                } catch (error) {
                    console.error(`Cromwell:importer: An error occurred while loading the library: import { ${namedExport} } from '${moduleName}'`, error);
                    return false;
                }
            }
            return false;
        }

        const importAllNamed = async (): Promise<boolean[]> => {
            if (isLibImport) {
                return [true];
            }

            const promises: Promise<boolean>[] = [];
            namedExports.forEach(named => {
                promises.push(useImporter(named));
            });
            const success = await Promise.all(promises);
            return success;
        }

        // Module has been requested for the first time. Load main importer script of the module.
        if (!this.importStatuses[moduleName]) {
            if (isDefaultImport) isLibImport = true;

            const scriptId = `${moduleName}@${moduleVer}-main-module-importer`;
            if (document.getElementById(scriptId)) return true;

            let onLoad;
            const importPromise = new Promise<"failed" | "ready" | "default">(done => onLoad = done);
            this.importStatuses[moduleName] = importPromise;

            // Load meta and externals if it has any

            try {
                const metaInfoStr = await fetch(`/${metaFilepath}`).then(res => res.text());
                if (metaInfoStr) {
                    const metaInfo: TScriptMetaInfo = JSON.parse(metaInfoStr);
                    // { [moduleName]: namedExports }
                    if (metaInfo) {
                        if (metaInfo.import === 'lib') {
                            isLibImport = true;
                        }
                        await this.importScriptExternals?.(metaInfo);

                        if (canShowInfo) console.log('Cromwell:importer: Successfully loaded all script externals for module: ' + moduleName, metaInfo);
                    }
                } else {
                    throw new Error('Failed to fetch file:  /' + metaFilepath)
                }
            } catch (e) {
                console.error('Cromwell:importer: Failed to load meta info about importer of the module: ' + moduleName, e);
            }

            const filePath = isLibImport ? importerEntireLibFilepath : importerFilepath;
            try {
                const success = await new Promise(done => {
                    const domScript = document.createElement('script');
                    domScript.id = scriptId;
                    domScript.src = filePath;
                    domScript.onload = () => done(true);
                    domScript.onerror = (e) => {
                        console.error('Cromwell:importer: Failed to load importer for module: ' + moduleName, e);
                        done(false);
                    }
                    document.head.appendChild(domScript);
                });
                if (!success) throw new Error('');

                if (canShowInfo) console.log(`Cromwell:importer: Importer for module "${moduleName}" executed`);

                if (isLibImport && this.modules?.[moduleName]) {
                    this.imports[moduleName] = { 'default': () => null } as any;
                }
                if (canShowInfo) console.log(`Cromwell:importer: isLibImport:`, isLibImport, 'Cromwell?.modules?.[moduleName]',
                    this.modules?.[moduleName], ' Cromwell.imports[moduleName] ', this.imports[moduleName]);

            } catch (e) {
                console.error('Cromwell:importer: Failed to execute importer for module: ' + moduleName, e);
                this.importStatuses[moduleName] = 'failed';
                onLoad('failed');
                return false;
            }


            if (!this.imports[moduleName]) {
                console.error('Cromwell:importer: Failed to load importer for module: ' + moduleName);
                this.importStatuses[moduleName] = 'failed';
                onLoad('failed');
                return false;
            }

            if (canShowInfo) console.log('Cromwell:importer: Successfully loaded importer for module: ' + moduleName);

            const success = await importAllNamed();

            if (success.includes(false)) {
                console.error('Cromwell:importer: Failed to import one of named exports');
                this.importStatuses[moduleName] = 'failed';
                onLoad('failed');
                return false;
            } else {
                if (canShowInfo) console.log('Cromwell:importer: All initially requested named exports for module "' + moduleName + '" have been successfully loaded', namedExports);
            }

            if (isLibImport) {
                this.importStatuses[moduleName] = 'default';
                onLoad('default');
            } else {
                this.importStatuses[moduleName] = 'ready';
                onLoad('ready');
            }

            return true;
        }

        // check if this module is being imported by another async request
        // await for another and then start
        const importWithCheck = async () => {
            if (typeof this.importStatuses?.[moduleName] === 'object') {
                if (canShowInfo) console.log('awaiting... ' + moduleName);
                const status = await this.importStatuses[moduleName];
                if (status === 'default') return true;

                await importWithCheck();
            }

            if (this.importStatuses?.[moduleName] === 'default') {
                return true;
            }

            if (typeof this.importStatuses[moduleName] === 'string') {
                if (!this.imports?.[moduleName]) throw new Error('ready:!Cromwell.imports[moduleName]' + moduleName);

                const lastStatus = this.importStatuses[moduleName];

                let onLoad;
                const importPromise = new Promise<"failed" | "ready" | "default">(done => onLoad = done);
                this.importStatuses[moduleName] = importPromise;

                const success = await importAllNamed();

                this.importStatuses[moduleName] = lastStatus;

                if (success.includes(false)) onLoad(lastStatus);
                else onLoad(lastStatus);
                return true;
            }

            return false;
        }

        return importWithCheck();
    }


    public async importScriptExternals(metaInfo: TScriptMetaInfo | undefined): Promise<boolean> {
        this.hasBeenExecuted = true;
        if (this.canShowInfo) console.log('Cromwell:importScriptExternals: ' + metaInfo?.name, metaInfo);
        const externals = metaInfo?.externalDependencies;
        if (!metaInfo || !externals) return false;

        if (metaInfo.name && typeof this.scriptStatuses[metaInfo.name] === 'object') {
            await this.scriptStatuses[metaInfo.name];
            return true;
        }

        if (metaInfo.name && typeof this.scriptStatuses[metaInfo.name] === 'string') return true;
        if (metaInfo.name && this.modules?.[metaInfo.name]) {
            this.scriptStatuses[metaInfo.name] = 'failed';
            return true;
        }

        if (typeof externals === 'object' && Object.keys(externals).length > 0) {
            if (this.canShowInfo) console.log('Cromwell:importer: module ' + metaInfo.name + ' has externals: ' + JSON.stringify(externals, null, 4));
            if (this.canShowInfo) console.log('Cromwell:importer: loading externals first for module ' + metaInfo.name + ' ...');
            const promises: Promise<boolean>[] = []
            let success: boolean[] | undefined;

            Object.keys(externals).forEach(ext => {
                const result = this?.importModule?.(ext, externals[ext]);
                if (result !== undefined) {
                    if (typeof result === 'object') {
                        result.catch(e => {
                            console.error('Cromwell:importer: Failed to load external ' + ext + ' for module: ' + metaInfo.name, e);
                        });
                        promises.push(result);
                    } else if (typeof result === 'boolean') {
                        if (!success) success = [];
                        success.push(result);
                    }
                }
            });
            try {
                if (!isServer()) {
                    success = await Promise.all(promises);
                }
            } catch (e) {
                console.error('Cromwell:importer: Failed to load externals for module: ' + metaInfo.name, e);
            }
            let successNum = 0;
            if (success) {
                success.forEach(s => s && successNum++);
            }
            if (this.canShowInfo) console.log(`Cromwell:importer: ${successNum}/${Object.keys(externals).length} externals for module ${metaInfo.name} have been loaded`);

            if (metaInfo.name) this.scriptStatuses[metaInfo.name] = 'ready';
            if (success && !success.includes(false)) return true;
            return true;
        }

        if (metaInfo.name) this.scriptStatuses[metaInfo.name] = 'failed';
        return false;
    }
}

export const getModuleImporter = (serverPublicDir?: string): Importer => {
    const store = getStore();
    if (!store.nodeModules) store.nodeModules = new Importer();

    if (serverPublicDir) {
        (store.nodeModules as Importer)?.setServerPublicDir(serverPublicDir);
    }

    return store.nodeModules as Importer;
}
