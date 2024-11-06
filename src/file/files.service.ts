import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import AWS from 'aws-sdk';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './file.schema';
import { Model } from 'mongoose';
import { FileType } from 'src/util/enum';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<File>,
    private configService: ConfigService,
  ) {}

  createFileName = (originalName: string) => {
    const extName = path.extname(originalName);
    const baseName = path.basename(originalName, extName);

    const fileName = baseName + '_' + new Date().getTime() + extName;

    return fileName;
  };

  async uploadAWS(data: UploadFileDto, file: Express.Multer.File) {
    const { folderName } = data;

    const s3 = new AWS.S3();
    const BUCKET = this.configService.get<string>('BUCKET');

    let fileContent = null;
    let fileName = '';
    let contentType = '';

    if (file) {
      fileContent = file.buffer;
      fileName = this.createFileName(file.originalname);
    }

    if (!file && data.base64Image && data.type === FileType.Image) {
      fileContent = Buffer.from(data.base64Image.data as string, 'base64');
      fileName = this.createFileName(data.base64Image.name);
      contentType = data.base64Image.mimetype;
    }

    if (!file && data.base64Attachment && data.type === FileType.Attachment) {
      fileContent = Buffer.from(data.base64Attachment.data as string, 'base64');
      fileName = this.createFileName(data.base64Attachment.name);
      contentType = data.base64Attachment.mimetype;
    }

    return s3
      .upload({
        Body: fileContent,
        Bucket: BUCKET,
        Key: `${folderName}/${fileName}`,
        ContentType: contentType ? contentType : undefined,
        ContentEncoding: file ? undefined : 'base64',
      })
      .promise();
  }

  async create(data: UploadFileDto, file: Express.Multer.File) {
    const res = await this.uploadAWS(data, file);

    const { Location, Key } = res;

    let originalName = '';
    let size = 0;

    if (file) {
      originalName = file.originalname;
      size = file.size;
    }
    if (!file && data.type === FileType.Image) {
      originalName = data.base64Image.name;
      size = data.base64Image.size;
    }
    if (!file && data.type === FileType.Attachment) {
      originalName = data.base64Attachment.name;
      size = data.base64Attachment.size;
    }

    return this.fileModel.create({
      url: Location,
      key: Key,
      originalName,
      size,
    });
  }

  removeFileAWS = async (key: string) => {
    const s3 = new AWS.S3();

    const BUCKET = this.configService.get<string>('BUCKET');

    const params = {
      Bucket: BUCKET,
      Key: key,
    };

    try {
      // check file exist
      await s3.headObject(params).promise();

      return await s3.deleteObject(params).promise();
    } catch (error) {
      console.log('>>> Check AWS error', error);

      return null;
    }
  };

  async remove(id: string) {
    const file = await this.fileModel.findById(id);
    if (!file) throw new NotFoundException('File not found');

    await this.removeFileAWS(file.key);

    return this.fileModel.findByIdAndDelete(id);
  }
}
