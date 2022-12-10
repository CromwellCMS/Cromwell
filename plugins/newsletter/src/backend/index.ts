import { TBackendModule } from '@cromwell/core-backend';

import PluginNewsletterController from './controllers/plugin-newsletter.controller';
import PluginNewsletter from './entities/newsletter-form.entity';
import PluginNewsletterResolver from './resolvers/plugin-newsletter.resolver';

const backendModule: TBackendModule = {
  controllers: [PluginNewsletterController],
  entities: [PluginNewsletter],
  resolvers: [PluginNewsletterResolver],
};

export default backendModule;
