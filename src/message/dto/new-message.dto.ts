import { Allow } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';
import { OmitType } from '@nestjs/mapped-types';

export interface IFile {
  _id: string;

  url: string;

  key: string;

  originalName: string;
}

export class NewMessageDto extends OmitType(CreateMessageDto, [
  'imageId',
  'attachmentId',
] as const) {
  @Allow()
  imageId: IFile;

  @Allow()
  attachmentId: IFile;
}
