import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, configSchema } from './config.schema';
import { ConfigService } from './config.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: configSchema }]),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class MyConfigModule {}
