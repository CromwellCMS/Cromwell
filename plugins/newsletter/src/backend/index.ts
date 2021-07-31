import { TBackendModule, registerAction, getLogger } from '@cromwell/core-backend';

import PluginNewsletterController from './controllers/PluginNewsletterController';
import PluginNewsletter from './entities/PluginNewsletter';
import PluginNewsletterResolver from './resolvers/PluginNewsletterResolver';

// registerAction({
//     pluginName: "@cromwell/plugin-newsletter",
//     actionName: 'update_post',
//     action: (payload) => {
//          getLogger().warn('Update post: ' + JSON.stringify(payload));
//     }
// })

const backendModule: TBackendModule = {
    controllers: [PluginNewsletterController],
    entities: [PluginNewsletter],
    resolvers: [PluginNewsletterResolver],
}

export default backendModule;