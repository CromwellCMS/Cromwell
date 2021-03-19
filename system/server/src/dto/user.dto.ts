import { ApiProperty } from '@nestjs/swagger';
import { TUser, TUserRole } from '@cromwell/core';

export class UserDto implements TUser {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    bio?: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    address?: string;
    
    @ApiProperty()
    role?: TUserRole;

    @ApiProperty()
    password?: string;
}
