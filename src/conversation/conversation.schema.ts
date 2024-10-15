import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message } from 'src/message/message.schema';
import * as mongoose from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, type: [Number] })
  participants: number[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  latestMessage: Message;

  @Prop([Number])
  notifiedUsers: number[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
