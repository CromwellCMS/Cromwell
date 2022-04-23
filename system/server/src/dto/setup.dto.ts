import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class SetupDto {
    @ApiProperty()
    url: string;

    @ApiProperty()
    user: CreateUserDto;
}