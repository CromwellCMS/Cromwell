import { TAdminCustomField, TCmsInfo, TCmsSettings } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { CmsConfigDto } from './cms-config.dto';

export class AdminCmsConfigDto extends CmsConfigDto {
    @ApiProperty()
    smtpConnectionString?: string;

    @ApiProperty()
    sendFromEmail?: string;

    @ApiProperty()
    cmsInfo?: TCmsInfo;

    @ApiProperty()
    robotsContent?: string;

    @ApiProperty()
    customFields?: TAdminCustomField[];

    parseConfig(config: TCmsSettings) {
        super.parseConfig(config);

        this.smtpConnectionString = config.smtpConnectionString;
        this.sendFromEmail = config.sendFromEmail;
        this.customFields = config.customFields;
        return this;
    }

}

