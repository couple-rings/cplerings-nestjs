import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Conversation } from 'src/conversation/conversation.schema';
import * as mongoose from 'mongoose';
import { File } from 'src/file/file.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop()
  sender: number;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  imageId: File;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  attachmentId: File;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversationId: Conversation;

  @Prop({ type: mongoose.Schema.Types.Date })
  sentAt: mongoose.Date;

  @Prop({ default: false })
  read: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
