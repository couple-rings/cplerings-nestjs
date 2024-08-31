import { Controller, Get, Post, Body, Put, Param, Query } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ResponseMessage } from 'src/decorator/decorator.custom';
import {
  CREATE_CONVERSATION_SUCCESS,
  LOAD_CONVERSATION_SUCCESS,
  UPDATE_CONVERSATION_SUCCESS,
} from 'src/util/constants';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationFilterDto } from './dto/filter-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) {}

  @Post()
  @ResponseMessage(CREATE_CONVERSATION_SUCCESS)
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Get()
  @ResponseMessage(LOAD_CONVERSATION_SUCCESS)
  findList(@Query() query: ConversationFilterDto) {
    return this.conversationService.findConversations(query);
  }

  @Put(':id')
  @ResponseMessage(UPDATE_CONVERSATION_SUCCESS)
  update(
    @Body() updateConversationDto: UpdateConversationDto,
    @Param('id') id: string,
  ) {
    return this.conversationService.update(updateConversationDto, id);
  }

  //   @Get(':id')
  //   @ResponseMessage(ROLE_LOAD_SUCCESS)
  //   findOne(@Param('id') id: string) {
  //     return this.roleService.findOneById(+id);
  //   }
}
