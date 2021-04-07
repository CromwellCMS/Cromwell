import { CmsController } from '../controllers/cms.controller';
import { MockController } from '../controllers/mock.controller';
import { PluginController } from '../controllers/plugin.controller';
import { ThemeController } from '../controllers/theme.controller';
import { CmsService } from '../services/cms.service';
import { MockService } from '../services/mock.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';

export const getControllers = (sType: 'main' | 'plugin') => sType === 'main' ? [
    CmsController,
    PluginController,
    ThemeController,
    MockController] : [
        // ...(collectPlugins().resolvers),
    ];

export const getServices = (sType: 'main' | 'plugin') => sType === 'main' ? [
    CmsService, MockService, PluginService, ThemeService] : [
        // ...(collectPlugins().resolvers),
    ];