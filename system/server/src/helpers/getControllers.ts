import { AuthController } from '../controllers/auth.controller';
import { CmsController } from '../controllers/cms.controller';
import { MockController } from '../controllers/mock.controller';
import { PluginController } from '../controllers/plugin.controller';
import { ThemeController } from '../controllers/theme.controller';
import { collectPlugins } from '../helpers/collectPlugins';
import { CmsService } from '../services/cms.service';
import { MigrationService } from '../services/migration.service';
import { MockService } from '../services/mock.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';

export const getControllers = async (dev?: boolean) => {
    const def: any[] = [
        CmsController,
        PluginController,
        ThemeController,
        AuthController,
        ...((await collectPlugins()).controllers ?? []),
    ];
    if (dev) def.push(MockController);
    return def;
}

export const getServices = async (dev?: boolean) => {
    const def: any[] = [
        CmsService, PluginService, ThemeService,
        MigrationService,
        ...((await collectPlugins()).providers ?? [])
    ];
    if (dev) def.push(MockService);
    return def;
}

export const getExports = () => {
    return [CmsService];
}
