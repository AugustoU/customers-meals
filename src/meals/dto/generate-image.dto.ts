import { ApiProperty } from '@nestjs/swagger';

export class GenerateImageBody {
  @ApiProperty()
  ingredients: string;

  @ApiProperty()
  name: string;
}
