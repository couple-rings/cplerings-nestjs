import { Controller, Post, Body } from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/decorator.custom';
import { LoginRequestDto } from './dto/login-request.dto';
import { NetworkService } from './network.service';
import { LOGIN_SUCCESS } from 'src/util/constants';

@Controller('network')
export class NetWorkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('login')
  @ResponseMessage(LOGIN_SUCCESS)
  create(@Body() loginRequestDto: LoginRequestDto) {
    return this.networkService.postLogin(loginRequestDto);
  }

  //   @Get()
  //   @ResponseMessage(LOAD_CONVERSATION_SUCCESS)
  //   findList(@Query() query: ConversationFilterDto) {
  //     return this.conversationService.findConversations(query);
  //   }

  //   @Put(':id')
  //   @ResponseMessage(UPDATE_CONVERSATION_SUCCESS)
  //   update(
  //     @Body() updateConversationDto: UpdateConversationDto,
  //     @Param('id') id: string,
  //   ) {
  //     return this.conversationService.update(updateConversationDto, id);
  //   }
}
