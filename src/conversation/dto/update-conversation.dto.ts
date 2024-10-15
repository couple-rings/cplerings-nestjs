import { IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateConversationDto {
  @IsOptional()
  @IsMongoId()
  latestMessage: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  userId: number;
}
