import { TBackendModule, registerAction, getLogger } from '@cromwell/core-backend';

import PluginNewsletterContoller from './controllers/PluginNewsletterContoller';
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
    controllers: [PluginNewsletterContoller],
    entities: [PluginNewsletter],
    resolvers: [PluginNewsletterResolver],
}

export default backendModule;