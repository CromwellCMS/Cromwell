import { ApiProperty } from '@nestjs/swagger';

export class SetupDto {
    @ApiProperty()
    url: string;
}