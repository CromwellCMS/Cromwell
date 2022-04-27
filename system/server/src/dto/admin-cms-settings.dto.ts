import { TAdminCustomEntity, TAdminCustomField, TCmsInfo, TCmsSettings } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { CmsSettingsDto } from './cms-settings.dto';

export class AdminCmsSettingsDto extends CmsSettingsDto {
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

    @ApiProperty()
    customEntities?: TAdminCustomEntity[];

    @ApiProperty()
    signupEnabled?: boolean;

    @ApiProperty()
    signupRoles?: string[];

    parseSettings(config: TCmsSettings) {
        super.parseSettings(config);

        this.smtpConnectionString = config.smtpConnectionString;
        this.sendFromEmail = config.sendFromEmail;
        this.customFields = config.customFields;
        this.customEntities = config.customEntities;
        this.signupEnabled = config.signupEnabled;
        this.signupRoles = config.signupRoles;
        return this;
    }
}

