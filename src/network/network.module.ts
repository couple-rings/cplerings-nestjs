import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';
import { NetWorkController } from './network.controller';
import { TokenModule } from 'src/token/token.module';

@Module({
  providers: [NetworkService],
  controllers: [NetWorkController],
  exports: [NetworkService],
  imports: [TokenModule],
})
export class NetworkModule {}
