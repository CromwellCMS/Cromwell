
import dynamic from "next/dynamic";
export const IndexPage = import('C:/Work/cromwell/templates/cromwell-demoshop/es/pages/index');
export const DynamicIndexPage = dynamic(() => import('C:/Work/cromwell/templates/cromwell-demoshop/es/pages/index'));

export const ProductPage = import('C:/Work/cromwell/templates/cromwell-demoshop/es/pages/product');
export const DynamicProductPage = dynamic(() => import('C:/Work/cromwell/templates/cromwell-demoshop/es/pages/product'));

export const moduleImports = {"ProductShowcase":"C:/Work/cromwell/templates/cromwell-demoshop/es/modules/ProductShowcase/index.js"};
export const templateConfig = {"modules":{"ProductShowcase":{"pages":["index"],"options":{}}}};
export const CMSconfig = {"apiPort":4032,"adminPanelPort":4064,"templatePort":4128,"templateName":"cromwell-demoshop","defaultPageSize":15};

export const importTemplateConfig = () => {
    return templateConfig;
}
export const importCMSConfig = () => {
    return CMSconfig;
}

export const importPage = (pageName) => {
    if (pageName === 'index') return IndexPage;
    if (pageName === 'product') return ProductPage;
    return undefined;
}

export const importDynamicPage = (pageName) => {
    if (pageName === 'index') return DynamicIndexPage;
    if (pageName === 'product') return DynamicProductPage;
    return undefined;
}


const ProductShowcase = import('C:/Work/cromwell/templates/cromwell-demoshop/es/modules/ProductShowcase/index.js')

export const importModule = (moduleName) => {
    if (moduleName === 'ProductShowcase') return ProductShowcase;

    return undefined;
}
