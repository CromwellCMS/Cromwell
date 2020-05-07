import { PageName } from '@cromwell/core';

export const importPage = async (templateName: string, pageName: PageName) => {
    return await import(`./${templateName}/src/pages/${pageName}`);
}

export const importComponent = async (templateName: string, componentName: string) => {
    return await import(`./${templateName}/src/components/${componentName}`);
}

export const importComponentsConfig = async (templateName: string) => {
    return await import(`./${templateName}/src/components/componentsConfig.json`);
}