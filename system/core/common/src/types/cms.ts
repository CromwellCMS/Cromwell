
export type TPackageJson = {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    module?: string;
    cromwell?: {
        frontendDependencies?: (string | TFrontendDependency)[];
        themes?: string[];
        plugins?: string[];
    }
};


export type TCromwellaConfig = {
    packages: string[];
    frontendDependencies?: (string | TFrontendDependency)[];
}

export type TFrontendDependency = {
    name: string;
    version?: string;
    builtins?: string[];
    externals?: TExternal[];
    excludeExports?: string[];
    ignore?: string[];
    addExports?: TAdditionalExports[];
}

export type TExternal = {
    usedName: string;
    moduleName?: string;
    importName?: string;
}

export type TAdditionalExports = {
    name: string;
    path?: string;
    importType?: 'default' | 'named';
    saveAsModules?: string[];
}
