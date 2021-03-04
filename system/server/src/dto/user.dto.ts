import { ApiProperty } from '@nestjs/swagger';
import { TUser } from '@cromwell/core';

export class UserDto implements TUser {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    avatar?: string;
}
