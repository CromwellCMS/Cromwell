import { ApiProperty } from '@nestjs/swagger';
import { TCreateUser, TUserRole } from '@cromwell/core';

export class CreateUserDto implements TCreateUser {
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
