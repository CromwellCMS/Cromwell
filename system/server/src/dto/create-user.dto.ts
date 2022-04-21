import { ApiProperty } from '@nestjs/swagger';
import { TCreateUser } from '@cromwell/core';

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
    roles?: string[];

    @ApiProperty()
    password?: string;
}