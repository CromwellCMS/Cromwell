import React from 'react';
export declare const getModulesData: () => Record<string, any> | undefined;
export declare const setModulesData: (modulesData: Record<string, any>) => void;
export declare function CromwellModule<Data>(Component: React.ComponentType<Data>, moduleName: string): () => JSX.Element;
