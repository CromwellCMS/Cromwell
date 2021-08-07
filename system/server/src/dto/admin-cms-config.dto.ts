import { TCmsInfo, TCmsSettings } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { CmsConfigDto } from './cms-config.dto';

export class AdminCmsConfigDto extends CmsConfigDto {
    @ApiProperty()
    smtpConnectionString?: string;

    @ApiProperty()
    sendFromEmail?: string;

    @ApiProperty()
    cmsInfo?: TCmsInfo;

    parseConfig(config: TCmsSettings) {
        super.parseConfig(config);

        this.smtpConnectionString = config.smtpConnectionString;
        this.sendFromEmail = config.sendFromEmail;
        return this;
    }

}

