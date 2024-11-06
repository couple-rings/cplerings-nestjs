import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadFileDto } from './dto/upload-file.dto';
import { ResponseMessage } from 'src/decorator/decorator.custom';
import imageValidation from './config/image.validation';
import attachmentValidation from './config/attachment.validation';
import { FileType } from 'src/util/enum';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('image')
  @ResponseMessage('Upload image successfully')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Body() data: UploadFileDto,
    @UploadedFile(imageValidation) file: Express.Multer.File,
  ) {
    if (!file && !data.type)
      throw new BadRequestException('Must specify file type');
    if (!file && data.type && data.type !== FileType.Image)
      throw new BadRequestException('Invalid file type');
    if (!file && !data.base64Image)
      throw new BadRequestException('No image data found');

    return this.filesService.create(data, file);
  }

  @Post('attachment')
  @ResponseMessage('Upload attachment successfully')
  @UseInterceptors(FileInterceptor('attachment'))
  uploadAttachment(
    @Body() data: UploadFileDto,
    @UploadedFile(attachmentValidation) file: Express.Multer.File,
  ) {
    if (!file && !data.type)
      throw new BadRequestException('Must specify file type');
    if (!file && data.type && data.type !== FileType.Attachment)
      throw new BadRequestException('Invalid file type');
    if (!file && !data.base64Attachment)
      throw new BadRequestException('No attachment data found');

    return this.filesService.create(data, file);
  }

  @Delete(':id')
  @ResponseMessage('Delete file successfully')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
