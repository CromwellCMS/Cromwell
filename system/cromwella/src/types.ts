
export type TCromwellaConfig = {
    packages: string[];
    frontendDependencies?: (string | TFrontendDependency)[];
}

export type TFrontendDependency = {
    name: string;
    version: string;
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

export type TInstallationMode = 'development' | 'production';

export type TDependency = {
    name: string;
    // { [version] : number of matches }
    versions: Record<string, number>;
    // { [path to package.json] : version }
    packages: Record<string, string>;
};

export type TPackageJson = {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    module?: string;
};

export type TPackage = {
    name?: string;
    path?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    frontendDependencies?: (string | TFrontendDependency)[]
};

// { [project root dir]: info }
export type TNonHoisted = Record<string, {
    name: string; // project's package.json name
    modules: Record<string, string>; // { [moduleName]: moduleVersion }
}>;

export type THoistedDeps = {
    hoisted: Record<string, string>; // { [moduleName]: moduleVersion }
    nonHoisted: TNonHoisted;
    localSymlinks: TLocalSymlink[];
};

export type TLocalSymlink = {
    linkPath: string;
    referredDir: string;
}

export type TGetDepsCb = (
    packages: TPackage[],
    hoistedDependencies?: THoistedDeps,
    hoistedDevDependencies?: THoistedDeps
) => void;

export type TBundleInfo = {
    bundledDependencies?: Record<string, string[]>;
    libSize?: number;
    importerSize?: number;
    maxChunkSize?: number;
    chunksSumSize?: number;
    import?: 'lib' | 'chunks';
}