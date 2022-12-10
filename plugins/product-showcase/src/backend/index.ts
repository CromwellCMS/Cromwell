import { TBackendModule } from '@cromwell/core-backend';

import ProductShowcaseResolver from './resolvers/product-showcase.resolver';

const backendModule: TBackendModule = {
  resolvers: [ProductShowcaseResolver],
};

export default backendModule;
