import { ApiProperty } from '@nestjs/swagger';
import { TCmsEnabledModules } from '../../../core/common/es/_index';

import { CreateUserDto } from './create-user.dto';

export class SetupFirstStepDto {
    @ApiProperty()
    user: CreateUserDto;
}

export class SetupSecondStepDto {
    @ApiProperty()
    url: string;

    @ApiProperty({ type: Object })
    modules: TCmsEnabledModules;
}