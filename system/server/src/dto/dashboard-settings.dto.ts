import { TCmsDashboardLayout, TCmsDashboardSettings } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardSettingsDto implements TCmsDashboardSettings {
  @ApiProperty()
  type?: 'user' | 'template' | undefined;

  @ApiProperty()
  layout?: TCmsDashboardLayout | undefined;
}
