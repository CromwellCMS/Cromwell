
import dynamic from "next/dynamic";
/**
 * Configs 
 */
export const moduleImports = {"ProductShowcaseDemo":"C:/Users/a.glebov/projects/cromwell/modules/ProductShowcaseDemo/es/frontend/index.js","ProductShowcase":"C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/modules/ProductShowcase/index.js"};
export const templateConfig = {"modules":{"ProductShowcase":{"pages":["index","some_page"],"options":{}},"ProductShowcaseDemo":{"pages":["index","product"],"options":{}}}};
export const CMSconfig = {"apiPort":4032,"adminPanelPort":4064,"templatePort":4128,"templateName":"cromwell-demoshop","defaultPageSize":15};

export const importTemplateConfig = () => {
    return templateConfig;
}
export const importCMSConfig = () => {
    return CMSconfig;
}

/**
 * Basic pages 
 */
export const IndexPage = import('C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/pages/index');
export const DynamicIndexPage = dynamic(() => import('C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/pages/index'));

export const ProductPage = import('C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/pages/product');
export const DynamicProductPage = dynamic(() => import('C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/pages/product'));

/**
 * Custom pages
 */

const some_page_Page = import('C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/customPages/some_page.js')

const some_page_DynamicPage = dynamic(() => import('C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/customPages/some_page.js'));

/**
 * Combined page imports
 */
export const importPage = (pageName) => {
    if (pageName === 'index') return IndexPage;
    if (pageName === 'product') return ProductPage;
    
    if (pageName === 'some_page') return some_page_Page;

    return undefined;
}

export const importDynamicPage = (pageName) => {
    if (pageName === 'index') return DynamicIndexPage;
    if (pageName === 'product') return DynamicProductPage;

    if (pageName === 'some_page') return some_page_DynamicPage;
   
    return undefined;
}

/**
 * Modules
 */

const ProductShowcaseDemo = import('C:/Users/a.glebov/projects/cromwell/modules/ProductShowcaseDemo/es/frontend/index.js')
const ProductShowcase = import('C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/modules/ProductShowcase/index.js')

export const importModule = (moduleName) => {
    if (moduleName === 'ProductShowcaseDemo') return ProductShowcaseDemo;
if (moduleName === 'ProductShowcase') return ProductShowcase;

    return undefined;
}

const DynamicProductShowcaseDemo = dynamic(() => import('C:/Users/a.glebov/projects/cromwell/modules/ProductShowcaseDemo/es/frontend/index.js'));
const DynamicProductShowcase = dynamic(() => import('C:/Users/a.glebov/projects/cromwell/templates/cromwell-demoshop/es/modules/ProductShowcase/index.js'));

export const importDynamicModule = (moduleName) => {
    if (moduleName === 'ProductShowcaseDemo') return DynamicProductShowcaseDemo;
   if (moduleName === 'ProductShowcase') return DynamicProductShowcase;
   
    return undefined;
}
