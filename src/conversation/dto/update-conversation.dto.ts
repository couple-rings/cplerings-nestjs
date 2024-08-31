import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateConversationDto {
  @IsOptional()
  @IsMongoId()
  latestMessage: Types.ObjectId;

  @IsOptional()
  @IsString()
  userId: string;
}
