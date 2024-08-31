import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import AWS from 'aws-sdk';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './file.schema';
import { Model } from 'mongoose';

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

    const fileContent = file.buffer;
    const fileName = this.createFileName(file.originalname);
    const BUCKET = this.configService.get<string>('BUCKET');

    return s3
      .upload({
        Body: fileContent,
        Bucket: BUCKET,
        Key: `${folderName}/${fileName}`,
      })
      .promise();
  }

  async create(data: UploadFileDto, file: Express.Multer.File) {
    const res = await this.uploadAWS(data, file);

    const { Location, Key } = res;

    return this.fileModel.create({
      url: Location,
      key: Key,
      originalName: file.originalname,
      size: file.size,
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
