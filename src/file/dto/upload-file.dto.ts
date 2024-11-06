import { Transform, Type } from 'class-transformer';
import {
  IsBase64,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  Max,
  ValidateNested,
} from 'class-validator';
import { ValidateFile } from 'src/decorator/decorator.custom';
import { attachmentMimeType, imageMimeType, maxSize } from 'src/util/constants';
import { FileType } from 'src/util/enum';

class base64File {
  @IsBase64()
  data: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Max(maxSize, { message: 'Size must not be greater than 30MB' })
  size: number;

  @IsNotEmpty()
  name: string;
}

class base64Image extends base64File {
  @ValidateFile(imageMimeType, { message: 'Must be image/png or image/jpeg' })
  mimetype: string;
}

class base64Attachment extends base64File {
  @ValidateFile(attachmentMimeType, { message: 'Invalid mime type' })
  mimetype: string;
}

export class UploadFileDto {
  @IsNotEmpty()
  folderName: string;

  @IsOptional()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(FileType)
  type?: FileType;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => base64Image)
  base64Image?: base64Image;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => base64Attachment)
  base64Attachment?: base64Attachment;
}
