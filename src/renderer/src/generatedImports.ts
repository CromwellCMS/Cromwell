
import dynamic from "next/dynamic";
export const DynamicIndexPage = dynamic(() => import('@cromwell/templates/cromwell-demoshop/src/pages/index'));
export const DynamicProductPage = dynamic(() => import('@cromwell/templates/cromwell-demoshop/src/pages/product'));
