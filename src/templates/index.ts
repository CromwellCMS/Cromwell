import { PageName } from '@cromwell/core';

export const importPage = async (templateName: string, pageName: PageName) => {
    return await import(`./${templateName}/src/pages/${pageName}`);
}

export const importModule = async (templateName: string, moduleName: string) => {
    return await import(`./${templateName}/src/modules/${moduleName}`);
}

export const importConfig = async (templateName: string) => {
    return await import(`./${templateName}/cromwell.config.json`);
}