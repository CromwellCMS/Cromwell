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
};
