import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './conversation.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationFilterDto } from './dto/filter-conversation.dto';
import { NetworkService } from 'src/network/network.service';
import { GetDetailDto } from './dto/get-detail.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private networkService: NetworkService,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    const { participants } = createConversationDto;

    const conversation = await this.conversationModel.find({
      participants: { $all: participants },
    });
    if (conversation.length > 0) return conversation[0];

    return this.conversationModel.create(createConversationDto);
  }

  async createRandom(userId: number) {
    const response = await this.networkService.getRandomStaff();
    if (response.data) {
      const staffId = response.data.id;
      const participants = [userId, staffId];

      const conversation = await this.conversationModel.find({
        participants: { $all: participants },
      });
      if (conversation.length > 0) return conversation[0];

      return this.conversationModel.create({ participants });
    }

    throw new NotFoundException();
  }

  async findConversations(queryObj: ConversationFilterDto) {
    const { userId } = queryObj;

    const conversations = await this.conversationModel
      .find({ participants: userId })
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'attachmentId',
          model: 'File',
        },
      })
      .exec();

    if (conversations.length > 0) {
      const userIdArray: number[] = [];

      conversations.forEach((item) => {
        const partnerId = item.participants.find((id) => id !== userId);
        if (partnerId) userIdArray.push(partnerId);
      });

      if (userIdArray.length > 0) {
        const response = await this.networkService.getUsers(userIdArray);

        if (response.data) {
          return conversations.map((item) => {
            const partnerId = item.participants.find((id) => id !== userId);

            const partner = response.data.users.find(
              (item) => item.id === partnerId,
            );

            return {
              ...item.toObject(),
              partner: partner,
            };
          });
        }
      }
    }

    return conversations;
  }

  async getConversationDetail(query: GetDetailDto) {
    const { conversationId: id, userId } = query;

    const conversation = await this.conversationModel
      .findById(id)
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'attachmentId',
          model: 'File',
        },
      })
      .exec();

    if (conversation) {
      const userIdArray: number[] = [];

      const partnerId = conversation.participants.find((id) => id !== userId);
      if (partnerId) userIdArray.push(partnerId);

      if (userIdArray.length > 0) {
        const response = await this.networkService.getUsers(userIdArray);

        if (response.data) {
          const partner = response.data.users.find(
            (item) => item.id === partnerId,
          );

          return {
            ...conversation.toObject(),
            partner: partner,
          };
        }
      }
    }

    throw new NotFoundException();
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
