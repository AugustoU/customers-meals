import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CustomerMeal {
  @Expose()
  @ApiProperty({ type: String })
  name: string;

  @Expose()
  @ApiProperty({ type: String })
  userRate: string;

  @Expose()
  @ApiProperty({ type: String })
  instructions: string;

  @Expose()
  @ApiProperty({ type: String })
  ingredients: string;

  @Expose()
  @ApiProperty({ type: String })
  image: string;

  @Expose()
  @ApiProperty({ type: Number })
  likes: number;

  @Expose()
  @ApiProperty({ type: Number })
  dislikes: number;
}
