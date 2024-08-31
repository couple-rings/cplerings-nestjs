import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({ timestamps: true })
export class File {
  @Prop()
  url: string;

  @Prop()
  key: string;

  @Prop()
  size: number;

  @Prop()
  originalName: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
