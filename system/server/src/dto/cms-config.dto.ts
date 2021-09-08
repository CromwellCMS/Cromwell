import { ApiProperty } from '@nestjs/swagger';
import { TCmsSettings, TCurrency, TServiceVersions, TCmsRedirect } from '@cromwell/core';
import { CurrencyDto } from './currency.dto';

export class CmsConfigDto implements TCmsSettings {
    @ApiProperty()
    url?: string;

    @ApiProperty()
    domain?: string;

    @ApiProperty()
    apiUrl?: string;

    @ApiProperty()
    adminUrl?: string;

    @ApiProperty()
    frontendUrl?: string;

    @ApiProperty()
    centralServerUrl?: string;

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
    headHtml?: string;

    @ApiProperty()
    footerHtml?: string;

    @ApiProperty()
    installed?: boolean;

    @ApiProperty()
    defaultShippingPrice?: number;

    @ApiProperty()
    versions?: TServiceVersions;

    @ApiProperty()
    redirects?: TCmsRedirect[];

    @ApiProperty()
    rewrites?: TCmsRedirect[];

    parseConfig(config: TCmsSettings) {
        this.domain = config.domain;
        this.url = config.url;
        this.apiUrl = config.apiUrl;
        this.adminUrl = config.adminUrl;
        this.frontendUrl = config.frontendUrl;
        this.centralServerUrl = config.centralServerUrl;
        this.themeName = config.themeName;
        this.defaultPageSize = config.defaultPageSize;
        this.currencies = config.currencies;
        this.timezone = config.timezone;
        this.language = config.language;
        this.favicon = config.favicon;
        this.logo = config.logo;
        this.headHtml = config.headHtml;
        this.footerHtml = config.footerHtml;
        this.installed = config.installed;
        this.defaultShippingPrice = config.defaultShippingPrice;
        this.versions = config.versions;
        this.rewrites = config.rewrites;
        this.redirects = config.redirects;
        return this;
    }
}
