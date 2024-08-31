import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/decorator.custom';
import { MessagesService } from './messages.service';
import {
  LOAD_MESSAGE_SUCCESS,
  UPDATE_MESSAGE_SUCCESS,
} from 'src/util/constants';
import { MessageFilterDto } from './dto/filter-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get()
  @ResponseMessage(LOAD_MESSAGE_SUCCESS)
  findList(@Query() query: MessageFilterDto) {
    return this.messageService.findMessages(query);
  }

  @Put(':id')
  @ResponseMessage(UPDATE_MESSAGE_SUCCESS)
  update(@Body() updateMessageDto: UpdateMessageDto, @Param('id') id: string) {
    return this.messageService.update(updateMessageDto, id);
  }

  //   @Get(':id')
  //   @ResponseMessage(ROLE_LOAD_SUCCESS)
  //   findOne(@Param('id') id: string) {
  //     return this.roleService.findOneById(+id);
  //   }
}
