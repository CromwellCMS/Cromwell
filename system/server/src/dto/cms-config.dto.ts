import { ApiProperty } from '@nestjs/swagger';
import { TCmsSettings, TCurrency } from '@cromwell/core';
import { CurrencyDto } from './currency.dto';

export class CmsConfigDto implements TCmsSettings {
    @ApiProperty()
    domain?: string;

    @ApiProperty()
    protocol?: 'http' | 'https';

    @ApiProperty()
    mainApiPort?: number;

    @ApiProperty()
    pluginApiPort?: number;

    @ApiProperty()
    adminPanelPort?: number;

    @ApiProperty()
    frontendPort?: number;

    @ApiProperty()
    managerPort?: number;

    @ApiProperty()
    themeName?: string;

    @ApiProperty()
    defaultPageSize?: number;

    @ApiProperty({ type: [CurrencyDto] })
    currencies?: TCurrency[];

    @ApiProperty()
    timezone?: number;

    @ApiProperty()
    language?: string;

    @ApiProperty()
    favicon?: string;

    @ApiProperty()
    logo?: string;

    @ApiProperty()
    headerHtml?: string;

    @ApiProperty()
    footerHtml?: string;

    @ApiProperty()
    installed?: boolean;

    @ApiProperty()
    defaultShippingPrice?: number;

    parseConfig(config: TCmsSettings) {
        this.domain = config.domain;
        this.protocol = config.protocol;
        this.mainApiPort = config.mainApiPort;
        this.pluginApiPort = config.pluginApiPort;
        this.adminPanelPort = config.adminPanelPort;
        this.frontendPort = config.frontendPort;
        this.managerPort = config.managerPort;
        this.themeName = config.themeName;
        this.defaultPageSize = config.defaultPageSize;
        this.currencies = config.currencies;
        this.timezone = config.timezone;
        this.language = config.language;
        this.favicon = config.favicon;
        this.logo = config.logo;
        this.headerHtml = config.headerHtml;
        this.footerHtml = config.footerHtml;
        this.installed = config.installed;
        this.defaultShippingPrice = config.defaultShippingPrice;
        return this;
    }
}

