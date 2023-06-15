import { ApiProperty } from '@nestjs/swagger';

export class GenerateThumbnailDto {
  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  src: string;

  @ApiProperty()
  quality?: number;
}
