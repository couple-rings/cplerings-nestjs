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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
