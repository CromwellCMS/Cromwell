import { TExternal, TPackageJson, TSciprtMetaInfo } from '@cromwell/core';
import fs from 'fs-extra';
import { resolve } from 'path';
import { Compiler } from 'webpack';
import ExternalModuleFactoryPlugin from 'webpack/lib/ExternalModuleFactoryPlugin';

import { getGlobalModuleStr, jsOperators, moduleMetaInfoFileName } from '../constants';
import { getDepVersion, getModuleInfo, isExternalForm } from '../shared';

// Marks every node_module as external and collects import bindings for them in meta.json
export class CromwellWebpackPlugin {

    private usedExternals: Record<string, string[]>;
    private filteredUsedExternals: Record<string, string[]>;
    private handleStatement;
    private modulePackageJson: TPackageJson;

    constructor(private options: {
        usedExternals?: Record<string, string[]>;
        filteredUsedExternals?: Record<string, string[]>;
        configuredExternals?: TExternal[];
        moduleBuiltins?: Record<string, string[]>;
        moduleName?: string;
        moduleVer?: string;
        modulePackageJson?: TPackageJson;
        buildDir?: string;
        packageExternals?: string[];
        metaInfoPath?: string;
    } = {}) {

        // Decryption of webpack's actually used node_modules via AST to define externals list
        const configuredExternalsObj: Record<string, TExternal> = options.configuredExternals ?
            Object.assign({},
                ...options.configuredExternals.map(ext => ({
                    [ext.usedName]: ext
                }))
            ) : {};

        if (!this.options.buildDir) this.options.buildDir = process.cwd();
        this.usedExternals = options.usedExternals ?? {};;
        this.filteredUsedExternals = options.filteredUsedExternals ?? {};
        const usedExternals = this.usedExternals;
        const moduleBuiltins = options.moduleBuiltins;
        const moduleName = options.moduleName;
        if (!options.modulePackageJson) {
            this.modulePackageJson = require(resolve(process.cwd(), 'package.json'));
        } else this.modulePackageJson = options.modulePackageJson;


        this.handleStatement = (statement, source: string, exportName: string, identifierName: string) => {
            if (!isExternalForm(source)) return;

            const configuredSource = configuredExternalsObj[source];
            if (configuredSource && configuredSource.moduleName) {
                if (configuredSource.importName) {
                    if (!usedExternals[configuredSource.moduleName]) usedExternals[configuredSource.moduleName] = [];
                    usedExternals[configuredSource.moduleName].push(configuredSource.importName);
                } else {
                    if (!usedExternals[configuredSource.moduleName]) usedExternals[configuredSource.moduleName] = [];
                    const usedKey = exportName ?? identifierName;
                    if (!usedExternals[configuredSource.moduleName].includes(usedKey))
                        usedExternals[configuredSource.moduleName].push(usedKey);
                }
                return;
            }

            if (moduleName && moduleBuiltins && moduleBuiltins[moduleName] && moduleBuiltins[moduleName].includes(source)) return;

            const depVersion = getDepVersion(this.modulePackageJson, source);

            // if (!depVersion) return;

            const exportKeys = getModuleInfo(source, depVersion, options.buildDir)?.exportKeys;

            if (!exportKeys) {
                return;
            }

            if (!exportName && identifierName) {
                if (exportKeys.includes(identifierName)) exportName = identifierName;
                else exportName = 'default';
            }

            if (!exportKeys.includes(exportName)) exportName = 'default';

            if (!usedExternals[source]) usedExternals[source] = [];

            if (exportName && exportKeys.includes(exportName) &&
                !usedExternals[source].includes(exportName)) {

                // Properties exported via "module.exports" can be the same as JS operators, we cannot code-split them
                // with the current implementation via "import { prop } from '...';"
                // so just replace for 'default' to include whole lib instead 
                if (jsOperators.includes(exportName)) {
                    exportName = 'default';
                }

                usedExternals[source].push(exportName);
            }
        }

    }

    apply(compiler: Compiler) {
        const usedExternals = this.usedExternals;
        let filteredUsedExternals = this.filteredUsedExternals;
        const moduleName = this.options.moduleName ?? this.modulePackageJson?.name;
        const moduleVer = this.options.moduleVer ?? this.modulePackageJson?.version;
        const moduleBuiltins = this.options.moduleBuiltins;
        const packageExternals = this.options.packageExternals;
        const modulePackageJson = this.modulePackageJson;

        compiler.hooks.compile.tap('CromwellWebpackPlugin', params => {
            new ExternalModuleFactoryPlugin(
                undefined,
                function ({ context, request }, callback) {
                    if (!isExternalForm(request)) return callback();
                    if (moduleName && moduleBuiltins && moduleBuiltins[moduleName] &&
                        moduleBuiltins[moduleName].includes(request)) return callback();

                    let isExternal = false;
                    if (packageExternals && packageExternals.includes(request)) {
                        isExternal = true;
                    }
                    if (modulePackageJson?.cromwell?.frontendDependencies) {
                        modulePackageJson?.cromwell?.frontendDependencies.forEach(dep => {
                            if (typeof dep === 'object') {
                                if (dep.name === request) isExternal = true;
                            } else if (dep === request) isExternal = true;
                        })
                    }
                    if (isExternal) {
                        return callback(null, `root ${getGlobalModuleStr(request)}`);
                    }

                    return callback();
                }
            ).apply(params.normalModuleFactory);
        });

        compiler.hooks.normalModuleFactory.tap('CromwellaBundlerPlugin', factory => {
            factory.hooks.parser.for('javascript/auto').tap('CromwellaBundlerPlugin', (parser, options) => {
                parser.hooks.import.tap('CromwellaBundlerPlugin', this.handleStatement);
                parser.hooks.importSpecifier.tap('CromwellaBundlerPlugin', this.handleStatement);
                parser.hooks.exportImportSpecifier.tap('CromwellaBundlerPlugin', (statement, source, identifierName, exportName) => {
                    this.handleStatement(statement, source, exportName, identifierName);
                });
            });
        });

        compiler.hooks.done.tap('CromwellaBundlerPlugin', () => {
            // Optimize used externals:
            // If has "default" key with any other, leave only "default"
            Object.keys(usedExternals).forEach(extName => {
                if (usedExternals[extName].includes('default')) {
                    usedExternals[extName] = ['default'];
                }
            });
            // If imported more than 80% of keys, replace them by one "default"
            Object.keys(usedExternals).forEach(extName => {

                const depVersion = getDepVersion(this.modulePackageJson, extName);
                if (!depVersion) return;

                const exportKeys = getModuleInfo(extName, depVersion, this.options.buildDir)?.exportKeys;
                if (exportKeys) {
                    if (usedExternals[extName].length > exportKeys.length * 0.8) {
                        usedExternals[extName] = ['default'];
                    }
                }

            });

            if (this.options.packageExternals) {
                for (const extName of Object.keys(usedExternals)) {
                    if (this.options.packageExternals.includes(extName)) {
                        filteredUsedExternals[extName] = usedExternals[extName];
                    }
                };
            } else {
                filteredUsedExternals = usedExternals;
            }

            // Get versions
            const versionedExternals: Record<string, string[]> = {};
            Object.keys(filteredUsedExternals).forEach(depName => {
                const exactVersion = getModuleInfo(depName, undefined, this.options.buildDir)?.exactVersion;

                if (!exactVersion) return;

                versionedExternals[`${depName}@${exactVersion}`] = filteredUsedExternals[depName];
            });

            // Create meta info file with actually used dependencies
            const metaInfoContent: TSciprtMetaInfo = {
                name: `${moduleName}@${moduleVer}`,
                import: 'chunks',
                externalDependencies: versionedExternals,
            };

            const metaInfoPath = this.options.metaInfoPath ?? (compiler.options.output.path ?
                resolve(compiler.options.output.path, moduleMetaInfoFileName) : undefined);
            if (metaInfoPath) {
                fs.writeFileSync(metaInfoPath, JSON.stringify(metaInfoContent, null, 4));
            }
        })
    }
}
