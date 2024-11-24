import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseAsyncConfig } from 'src/database/datasource.config';
import { ConfigModule } from '@nestjs/config';
import { ConversationsModule } from './conversation/conversations.module';
import { MessagesModule } from './message/messages.module';
import { ChatModule } from './chat/chat.module';
import { FilesModule } from './file/files.module';
import { LocationModule } from './location/location.module';
import { MyConfigModule } from './config/config.module';
import { NetworkModule } from './network/network.module';
import { TokenModule } from './token/token.module';
import { AxiosModule } from './axios/axios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync(mongooseAsyncConfig),
    ConversationsModule,
    MessagesModule,
    ChatModule,
    FilesModule,
    LocationModule,
    MyConfigModule,
    NetworkModule,
    TokenModule,
    AxiosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
