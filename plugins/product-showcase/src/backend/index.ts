import { TBackendModule, registerAction, getLogger } from '@cromwell/core-backend';

import ProductShowcaseResolver from './resolvers/ProductShowcaseResolver';


const backendModule: TBackendModule = {
    resolvers: [ProductShowcaseResolver],
}

export default backendModule;