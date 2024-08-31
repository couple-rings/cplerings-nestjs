import {
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
    return this.filesService.create(data, file);
  }

  @Post('attachment')
  @ResponseMessage('Upload attachment successfully')
  @UseInterceptors(FileInterceptor('attachment'))
  uploadAttachment(
    @Body() data: UploadFileDto,
    @UploadedFile(attachmentValidation) file: Express.Multer.File,
  ) {
    return this.filesService.create(data, file);
  }

  @Delete(':id')
  @ResponseMessage('Delete file successfully')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
