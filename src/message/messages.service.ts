import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageFilterDto } from './dto/filter-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.messageModel.create(createMessageDto);
  }

  async findMessages(queryObj: MessageFilterDto) {
    const { conversationId, current, pageSize } = queryObj;

    const defaultLimit = pageSize ? pageSize : 10;
    const defaultPage = current ? current : 1;

    const totalItems = await this.messageModel.countDocuments({
      conversationId,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const skip = (defaultPage - 1) * defaultLimit;

    const items = await this.messageModel
      .find({ conversationId })
      .sort('-sentAt')
      .skip(skip)
      .limit(defaultLimit)
      .populate('imageId')
      .populate('attachmentId')
      .exec();

    items.reverse();

    return {
      currentPage: defaultPage,
      totalPages,
      pageSize: defaultLimit,
      totalItems: totalItems,
      items,
    };
  }

  async update(updateMessageDto: UpdateMessageDto, id: string) {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto);
  }
}
