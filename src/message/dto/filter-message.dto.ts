// import { Transform, Type } from 'class-transformer';
import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class MessageFilterDto {
  @IsMongoId()
  conversationId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  current?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}
