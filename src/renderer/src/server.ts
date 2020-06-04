import { CMSconfigType } from '@cromwell/core';
const fs = require('fs');
const config: CMSconfigType = require('../cmsconfig.json');

const content = `
import dynamic from "next/dynamic";
export const DynamicIndexPage = dynamic(() => import('@cromwell/templates/${config.templateName}/src/pages/index'));
export const DynamicProductPage = dynamic(() => import('@cromwell/templates/${config.templateName}/src/pages/product'));
`

fs.writeFileSync('./src/generatedImports.ts', content);