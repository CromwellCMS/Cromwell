
export type TCromwellaConfig = {
    packages: string[];
    frontendDependencies?: (string | {
        name: string;
        builtins?: string[];
        externals?: string[];
        excludeExports?: string[];
        ignore?: string[];
        addExports?: TAdditionalExports[];
    })[];
}

export type TSciprtMetaInfo = {
    name: string;
    // { [moduleName]: namedImports }
    externalDependencies: Record<string, string[]>
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

export type TPackage = {
    name?: string;
    path?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
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

export type TCromwellNodeModules = {
    importStatuses?: Record<string, 'failed' | 'ready' | Promise<'failed' | 'ready'>>;
    imports?: Record<string, () => void>;
    modules?: Record<string, Object>;
    moduleExternals?: Record<string, string[]>;
    importModule?: (moduleName: string, namedExports?: string[]) => Promise<boolean>;
    importSciptExternals?: (metaInfo: TSciprtMetaInfo) => Promise<boolean>;
};

export type TGetDepsCb = (
    packages: TPackage[],
    hoistedDependencies?: THoistedDeps,
    hoistedDevDependencies?: THoistedDeps) => void;