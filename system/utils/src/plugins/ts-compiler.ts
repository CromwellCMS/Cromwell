import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { dirname, isAbsolute, join, resolve } from 'path';
import { Plugin } from 'rollup';
import ts from 'typescript';

import { isExternalForm } from '../shared';

type State = {
    program: ts.BuilderProgram;
    hasChanes: boolean;
    hasStarted: boolean;
    host: ts.CompilerHost;
    compilerOptions: ts.CompilerOptions;
    rootFileNames: string[];
    hostFiles: Map<string, ts.SourceFile>;
    builtFiles: Map<string, string>;
    tsBuildInfoFile?: string;
    tsBuildInfoFilePath?: string;
}

export const tsCompilerPlugin = (settings?: {
    compilerOptions?: ts.CompilerOptions;
    sharedState?: Object;
}): Plugin => {

    const state: State = settings?.sharedState as State ?? {};
    state.hostFiles = new Map<string, ts.SourceFile>();
    state.builtFiles = new Map<string, string>();

    return {
        name: 'rollup-plugin-ts-compiler',
        async resolveId(source, importer) {
            // console.log('resolveId source', source, importer)
            if (!importer) {
                return null;
            }
            if (isExternalForm(source)) return null;

            const resolvedFileName = ts.resolveModuleName(source, importer, state.compilerOptions,
                state.host)?.resolvedModule?.resolvedFileName;

            // console.log('resolveId resolvedFileName', resolvedFileName)

            if (resolvedFileName) return resolvedFileName;
            if (isAbsolute(source)) return { id: source };

            source = normalizePath(source);
            const globFileName = source.split('/').pop();
            const regexp = new RegExp(globFileName + '\\.(m?jsx?|tsx?)$');
            const fileDir = normalizePath(dirname(resolve(dirname(importer), source)));
            const fileName = fs.readdirSync(fileDir).find(fileName => {
                return regexp.test(fileName);
            })

            if (!fileName) return null;

            return { id: normalizePath(join(fileDir, fileName)) };
        },

        buildStart(options) {
            startCompiler(state, settings?.compilerOptions);
        },

        watchChange(id: string) {
            id = normalizePath(id);
            state.hostFiles.delete(id);
            state.hasChanes = true;
        },

        async transform(code, id): Promise<string | null> {
            id = normalizePath(id);
            if (!/\.(m?jsx?|tsx?)$/.test(id)) return null;

            // console.log('transform id:', id, code)
            if (state.hasChanes) rebuild(state);

            const cached = state.builtFiles.get(id);
            if (cached) return cached;

            const sourceFile = state.program.getSourceFile(id);
            if (sourceFile) {
                await new Promise<void>(done => {
                    state.program.emit(sourceFile, emitFile(state, () => {
                        done();
                    }));
                })
            }
            return state.builtFiles.get(id) ?? null;
        },
    }
}


const startCompiler = (state: State, compilerOptionsOverwrite?: Object) => {
    if (state.hasStarted) return;
    state.hasStarted = true;

    // console.log('startCompiler')

    const configPath = ts.findConfigFile(
        "./",
        ts.sys.fileExists,
        "tsconfig.json"
    );
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    // const configJson = Object.assign({}, configFile.config, compilerOptionsOverwrite)
    const { options, fileNames } = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        "./"
    );
    if (options.importHelpers === null || options.importHelpers === undefined) {
        options.importHelpers = true;
    }

    state.compilerOptions = Object.assign({}, options, compilerOptionsOverwrite);
    state.rootFileNames = fileNames;

    const tsBuildInfoFile = state.compilerOptions.tsBuildInfoFile ?? '.tsbuildinfo'
    let outDir = state.compilerOptions.outDir ?? process.cwd();
    if (!isAbsolute(outDir)) outDir = resolve(process.cwd(), outDir);
    const tsBuildInfoFilePath = normalizePath(isAbsolute(tsBuildInfoFile) ? tsBuildInfoFile : resolve(outDir, tsBuildInfoFile));
    state.compilerOptions.tsBuildInfoFile = tsBuildInfoFilePath;


    state.host = ts.createIncrementalCompilerHost(state.compilerOptions);
    const originalGetSourceFile = state.host.getSourceFile as Function;

    state.host = Object.assign(state.host, {
        getSourceFile(fileName: string, languageVersion: ts.ScriptTarget) {
            const normalizedFileName = normalizePath(!isAbsolute(fileName) ? resolve(process.cwd(), fileName) : fileName);
            const cached = state.hostFiles.get(normalizedFileName);
            if (cached) return cached;

            const newFile = originalGetSourceFile(...arguments);
            state.hostFiles.set(normalizedFileName, newFile);
            return newFile;
        }
    });

    state.program = ts.createIncrementalProgram({
        rootNames: state.rootFileNames,
        host: state.host,
        options: {
            ...(state.compilerOptions),
            incremental: true,
        }
    });

    // console.log('startCompiler end')
    compile(state);
}

const readBuildInfo = (state: State) => {
    state.tsBuildInfoFile = state.compilerOptions.tsBuildInfoFile ?? '.tsbuildinfo'
    let outDir = state.compilerOptions.outDir ?? process.cwd();
    if (!isAbsolute(outDir)) outDir = resolve(process.cwd(), outDir);
    state.tsBuildInfoFilePath = normalizePath(isAbsolute(state.tsBuildInfoFile) ?
        state.tsBuildInfoFile : resolve(outDir, state.tsBuildInfoFile));
}

const logErrors = (allDiagnostics: ts.Diagnostic[]) => {
    allDiagnostics.forEach(diagnostic => {
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start!
            );
            console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.log(`  Error: ${message}`);
        }
    });
}

const compile = (state: State) => {
    // console.log('emit start');

    readBuildInfo(state);

    const diagnostics = [
        ...state.program.getConfigFileParsingDiagnostics(),
        ...state.program.getSyntacticDiagnostics(),
        ...state.program.getOptionsDiagnostics(),
        ...state.program.getGlobalDiagnostics(),
        ...state.program.getSemanticDiagnostics()
    ];

    const output = state.program.emit(undefined, emitFile(state));

    const allDiagnostics = diagnostics.concat(output.diagnostics);


    if (!output.emitSkipped) {
        // console.log(`TS Build succeeded`);
    } else {
        console.log(`TS Build failed`);
        logErrors(allDiagnostics);
    }

    // console.log('emit finish');
}

const writeAsync = (path: string, data: string) => {
    path = normalizePath(path);
    setTimeout(() => {
        fs.outputFile(path, data);
    }, 300);
}

const emitFile = (state: State, callback?: () => void) => (fileName: string, data: string, writeByteOrderMark, onError, sourceFiles) => {
    if (/\.map$/.test(fileName)) {
        writeAsync(resolve(process.cwd(), fileName), data)
        return;
    }

    if (/\.d\.ts$/.test(fileName)) {
        writeAsync(resolve(process.cwd(), fileName), data)
        return;
    }

    if (state.compilerOptions.incremental &&
        fileName === state.tsBuildInfoFile &&
        state.tsBuildInfoFilePath
    ) {
        writeAsync(state.tsBuildInfoFilePath, data)
        return;
    }

    const sourceFileName = sourceFiles?.[0]?.fileName;

    let normalizedFileName;
    if (sourceFileName) {
        normalizedFileName = normalizePath(!isAbsolute(sourceFileName) ? resolve(process.cwd(), sourceFileName) : sourceFileName);
        state.builtFiles.set(normalizedFileName, data);
    }

    // console.log('emitFile', fileName, normalizedFileName)

    callback?.();
}


const rebuild = (state: State) => {
    if (!state.hasChanes) return
    state.hasChanes = false;

    const newProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram(state.rootFileNames,
        state.compilerOptions, state.host, state.program as ts.EmitAndSemanticDiagnosticsBuilderProgram);
    state.program = newProgram;

    compile(state);
}
