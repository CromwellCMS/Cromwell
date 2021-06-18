import { TCmsStatus, TNotification } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

import { UpdateInfoDto } from './update-info.dto';

export class NotificationDto implements TNotification {
    @ApiProperty()
    message: string;

    @ApiProperty()
    type: 'info' | 'warning' | 'error';

    @ApiProperty()
    documentationLink?: string;

    @ApiProperty()
    pageLink?: string
}

export class CmsStatusDto implements TCmsStatus {

    @ApiProperty()
    currentVersion?: string;

    @ApiProperty()
    updateAvailable: boolean;

    @ApiProperty({ type: UpdateInfoDto })
    updateInfo?: UpdateInfoDto;

    @ApiProperty({ type: [NotificationDto] })
    notifications?: NotificationDto[];

    @ApiProperty()
    isUpdating?: boolean;
}

