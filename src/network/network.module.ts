import { forwardRef, Module } from '@nestjs/common';
import { NetworkService } from './network.service';
import { NetWorkController } from './network.controller';
import { TokenModule } from 'src/token/token.module';
import { AxiosModule } from 'src/axios/axios.module';

@Module({
  providers: [NetworkService],
  controllers: [NetWorkController],
  exports: [NetworkService],
  imports: [TokenModule, forwardRef(() => AxiosModule)],
})
export class NetworkModule {}
