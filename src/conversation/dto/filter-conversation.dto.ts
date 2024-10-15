import { IsNotEmpty } from 'class-validator';

export class ConversationFilterDto {
  @IsNotEmpty()
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
