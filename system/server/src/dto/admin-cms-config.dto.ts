import { TCmsSettings } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { CmsAdminSettingsDto } from './cms-admin-settings.dto';
import { CmsConfigDto } from './cms-config.dto';

export class AdminCmsConfigDto extends CmsConfigDto {
    @ApiProperty()
    adminSettings?: CmsAdminSettingsDto;

    parseConfig(config: TCmsSettings) {
        super.parseConfig(config);

        this.adminSettings = config.adminSettings;
        return this;
    }

}

