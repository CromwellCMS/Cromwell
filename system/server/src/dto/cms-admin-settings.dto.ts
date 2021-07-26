import { TCmsAdminSettings } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class CmsAdminSettingsDto implements TCmsAdminSettings {
    @ApiProperty()
    smtpConnectionString?: string;

    @ApiProperty()
    sendFromEmail?: string;

    @ApiProperty()
    stripeApiKey?: string
}