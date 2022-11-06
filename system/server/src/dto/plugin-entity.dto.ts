import { TPluginEntity } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class PluginEntityDto implements TPluginEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  slug?: string | null;

  @ApiProperty()
  pageTitle?: string | null;

  @ApiProperty()
  pageDescription?: string | null;

  @ApiProperty()
  meta?: any;

  @ApiProperty()
  createDate?: Date | null;

  @ApiProperty()
  updateDate?: Date | null;

  @ApiProperty()
  isEnabled?: boolean | null;

  @ApiProperty()
  name?: string | null;

  @ApiProperty()
  version?: string | null;

  @ApiProperty()
  title?: string | null;

  @ApiProperty()
  isInstalled?: boolean | null;

  @ApiProperty()
  hasAdminBundle?: boolean | null;

  @ApiProperty()
  settings?: string | null;

  @ApiProperty()
  defaultSettings?: string | null;

  @ApiProperty()
  moduleInfo?: string | null;

  @ApiProperty()
  isUpdating?: boolean | null;

  parse(entity?: TPluginEntity | undefined | null) {
    if (!entity) return undefined;
    this.id = entity.id;
    this.slug = entity.slug;
    this.pageTitle = entity.pageTitle;
    this.pageDescription = entity.pageDescription;
    this.meta = entity.meta;
    this.createDate = entity.createDate;
    this.updateDate = entity.updateDate;
    this.isEnabled = entity.isEnabled;
    this.name = entity.name;
    this.version = entity.version;
    this.title = entity.title;
    this.isInstalled = entity.isInstalled;
    this.hasAdminBundle = entity.hasAdminBundle;
    this.settings = entity.settings;
    this.defaultSettings = entity.defaultSettings;
    this.moduleInfo = entity.moduleInfo;
    this.isUpdating = entity.isUpdating;
    return this;
  }
}
