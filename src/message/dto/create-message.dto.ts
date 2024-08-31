import { Transform, Type } from 'class-transformer';
import { Allow, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @Allow()
  sender: string;

  @Allow()
  content: string;

  @IsOptional()
  @Type(() => Types.ObjectId)
  @Transform(toMongoObjectId)
  imageId?: Types.ObjectId;

  @IsOptional()
  @Type(() => Types.ObjectId)
  @Transform(toMongoObjectId)
  attachmentId?: Types.ObjectId;

  @Allow()
  @Type(() => Types.ObjectId)
  @Transform(toMongoObjectId)
  conversationId: Types.ObjectId;

  @Allow()
  sentAt: string;
}

export function toMongoObjectId({ value }): Types.ObjectId {
  if (Types.ObjectId.isValid(value)) {
    return new Types.ObjectId(value as string);
  } else return new Types.ObjectId();
}
