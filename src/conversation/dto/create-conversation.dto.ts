import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  participants: number[];
}
