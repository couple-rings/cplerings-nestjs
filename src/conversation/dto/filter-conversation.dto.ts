import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ConversationFilterDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId: number;

  //   @IsOptional()
  //   @Type(() => Number)
  //   @IsNumber()
  //   current?: number;

  //   @IsOptional()
  //   @Type(() => Number)
  //   @IsNumber()
  //   pageSize?: number;
}
