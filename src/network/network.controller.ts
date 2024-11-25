import { Controller, Post, Body, Get } from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/decorator.custom';
import { LoginRequestDto } from './dto/login-request.dto';
import { NetworkService } from './network.service';
import {
  GET_STAFF_SUCCESS,
  GET_USERS_SUCCESS,
  LOGIN_SUCCESS,
} from 'src/util/constants';

@Controller('network')
export class NetWorkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('login')
  @ResponseMessage(LOGIN_SUCCESS)
  create(@Body() loginRequestDto: LoginRequestDto) {
    return this.networkService.postLogin(loginRequestDto);
  }

  @Post('users')
  @ResponseMessage(GET_USERS_SUCCESS)
  getUsers(@Body() data: { userIds: number[] }) {
    return this.networkService.getUsers(data.userIds);
  }

  @Get('staff')
  @ResponseMessage(GET_STAFF_SUCCESS)
  getRandomStaff() {
    return this.networkService.getRandomStaff();
  }

  //   @Put(':id')
  //   @ResponseMessage(UPDATE_CONVERSATION_SUCCESS)
  //   update(
  //     @Body() updateConversationDto: UpdateConversationDto,
  //     @Param('id') id: string,
  //   ) {
  //     return this.conversationService.update(updateConversationDto, id);
  //   }
}
