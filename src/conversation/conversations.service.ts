import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './conversation.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationFilterDto } from './dto/filter-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    const { participants } = createConversationDto;

    const conversation = await this.conversationModel.find({
      participants: { $all: participants },
    });
    if (conversation.length > 0) return conversation[0];

    return this.conversationModel.create(createConversationDto);
  }

  async findConversations(queryObj: ConversationFilterDto) {
    const { userId } = queryObj;

    return this.conversationModel
      .find({ participants: userId })
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'attachmentId',
          model: 'File',
        },
      })
      .exec();
  }

  async update(updateConversationDto: UpdateConversationDto, id: string) {
    const { latestMessage, userId } = updateConversationDto;

    if (latestMessage)
      return this.conversationModel.findByIdAndUpdate(id, {
        latestMessage: new Types.ObjectId(updateConversationDto.latestMessage),
      });

    if (userId) {
      // Add user if not present in notify list of conversation, otherwise remove user
      const conversation = await this.conversationModel.findById(id);
      if (!conversation.notifiedUsers.includes(userId))
        conversation.notifiedUsers.push(userId);
      else {
        conversation.notifiedUsers = conversation.notifiedUsers.filter(
          (user) => user !== userId,
        );
      }

      return conversation.save();
    }
  }
}
