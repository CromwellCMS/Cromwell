import { Module } from '@nestjs/common';

import { CmsController } from '../controllers/cms.controller';
import { MockController } from '../controllers/mock.controller';
import { PluginController } from '../controllers/plugin.controller';
import { ThemeController } from '../controllers/theme.controller';
import { ManagerController } from '../controllers/manager.controller';
import { CmsService } from '../services/cms.service';
import { MockService } from '../services/mock.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';
import { AuthModule } from './auth.module';

@Module({
    controllers: [CmsController, PluginController, ThemeController, ManagerController, MockController],
    providers: [CmsService, MockService, PluginService, ThemeService],
    // imports: [AuthModule],
})
export class RestApiModule { }