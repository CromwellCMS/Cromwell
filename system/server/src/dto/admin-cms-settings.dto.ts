import { TAdminCustomEntity, TAdminCustomField, TCmsInfo, TCmsSettings, TCmsEnabledModules } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { CmsSettingsDto } from './cms-settings.dto';

export class AdminCmsSettingsDto extends CmsSettingsDto {
  @ApiProperty()
  smtpConnectionString?: string;

  @ApiProperty()
  sendFromEmail?: string;

  @ApiProperty()
  sendMailFromName?: string;

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

  @ApiProperty()
  showUnapprovedReviews?: boolean;

  @ApiProperty()
  revalidateCacheAfter?: number;

  @ApiProperty()
  clearCacheOnDataUpdate?: boolean;

  parseSettings(config: TCmsSettings) {
    super.parseSettings(config);

    this.smtpConnectionString = config.smtpConnectionString;
    this.sendFromEmail = config.sendFromEmail;
    this.sendMailFromName = config.sendMailFromName;
    this.customFields = config.customFields;
    this.customEntities = config.customEntities;
    this.signupEnabled = config.signupEnabled;
    this.signupRoles = config.signupRoles;
    this.showUnapprovedReviews = config.showUnapprovedReviews;
    this.revalidateCacheAfter = config.revalidateCacheAfter;
    this.clearCacheOnDataUpdate = config.clearCacheOnDataUpdate;
    return this;
  }
}
