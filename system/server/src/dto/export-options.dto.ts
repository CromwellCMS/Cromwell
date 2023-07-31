import { ApiProperty } from '@nestjs/swagger';

export class ExportOptionsDto {
  @ApiProperty()
  tables?: string[];
}
