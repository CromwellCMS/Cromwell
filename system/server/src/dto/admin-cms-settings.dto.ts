import { TAdminCustomEntity, TAdminCustomField, TCmsInfo, TCmsSettings, TCmsEnabledModules } from '@cromwell/core';
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
    modules?: TCmsEnabledModules;

    @ApiProperty()
    signupEnabled?: boolean;

    @ApiProperty()
    signupRoles?: string[];

    parseSettings(settings: TCmsSettings) {
        super.parseSettings(settings);

        this.smtpConnectionString = settings.smtpConnectionString;
        this.sendFromEmail = settings.sendFromEmail;
        this.customFields = settings.customFields;
        this.customEntities = settings.customEntities;
        this.signupEnabled = settings.signupEnabled;
        this.signupRoles = settings.signupRoles;
        return this;
    }
}

