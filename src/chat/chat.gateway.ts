import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessagesService } from 'src/message/messages.service';
import { NewMessageDto } from 'src/message/dto/new-message.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from 'src/conversation/conversation.schema';

config();

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class ChatGateway {
  constructor(
    private messagesService: MessagesService,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  joinRoom(
    @MessageBody() data: string[],
    @ConnectedSocket() client: Socket,
  ): string {
    client.join(data);

    return `Joined ${data.length} Rooms`;
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() newMessage: NewMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const data: CreateMessageDto = {
      ...newMessage,
      imageId: newMessage.imageId
        ? new Types.ObjectId(newMessage.imageId._id)
        : undefined,
      attachmentId: newMessage.attachmentId
        ? new Types.ObjectId(newMessage.attachmentId._id)
        : undefined,
    };
    const createdMessage = await this.messagesService.create(data);

    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      newMessage.conversationId,
      {
        latestMessage: createdMessage._id,
      },
    );

    client
      .to(newMessage.conversationId.toString())
      .emit('receive_message', { ...newMessage, _id: createdMessage._id });

    return updatedConversation;
  }
}
