import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenHttpService } from './token.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('MAIN_SERVER_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: TokenHttpService,
      useExisting: HttpService,
    },
  ],
  exports: [TokenHttpService],
})
export class TokenModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  // Defining others configuration for our Axios instance
  onModuleInit() {
    // this.httpService.axiosRef.defaults.headers.common['Accept'] =
    //   'application/json';

    const axiosRef = this.httpService.axiosRef;

    // Declare request interceptor
    axiosRef.interceptors.request.use(
      async (config) => {
        return config;
      },
      (error) => {
        console.error('Refresh Request Error:', error);
        return Promise.reject(error);
      },
    );

    // Declare response interceptor
    axiosRef.interceptors.response.use(
      (response) => {
        console.log('Refresh Response Interceptor:', response.data);
        return response;
      },
      (error) => {
        console.error('Refresh Response Error:', error);
        return error.response ? error.response : error;
      },
    );
  }
}
