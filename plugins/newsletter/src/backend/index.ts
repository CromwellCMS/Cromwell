import { TBackendModule, registerAction, getLogger } from '@cromwell/core-backend';

import PluginNewsletterController from './controllers/PluginNewsletterController';
import PluginNewsletter from './entities/PluginNewsletter';
import PluginNewsletterResolver from './resolvers/PluginNewsletterResolver';
import { init1623451249312 } from './migrations/1623451249312-init';

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
    migrations: [init1623451249312],
}

export default backendModule;