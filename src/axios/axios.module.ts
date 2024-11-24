import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosHttpService } from './axios.service';
import { ConfigService as MyConfigService } from 'src/config/config.service';
import { NetworkService } from 'src/network/network.service';
import { MyConfigModule } from 'src/config/config.module';
import { NetworkModule } from 'src/network/network.module';
import { AxiosError } from 'axios';
import { ConfigKey } from 'src/util/enum';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('MAIN_SERVER_URL'),
      }),
      inject: [ConfigService],
    }),
    MyConfigModule,
    NetworkModule,
  ],
  providers: [
    {
      provide: AxiosHttpService,
      useExisting: HttpService,
    },
  ],
  exports: [AxiosHttpService],
})
export class AxiosModule implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private myConfigService: MyConfigService,
    private configService: ConfigService,
    private networkService: NetworkService,
  ) {}

  // Defining others configuration for our Axios instance
  onModuleInit() {
    // this.httpService.axiosRef.defaults.headers.common['Accept'] =
    //   'application/json';

    const axiosRef = this.httpService.axiosRef;

    // Declare request interceptor
    axiosRef.interceptors.request.use(
      async (config) => {
        let accessToken = '';

        const tokensConfig = await this.myConfigService.getConfig(
          ConfigKey.Authentication,
        );
        if (!tokensConfig) {
          const email = this.configService.get<string>('EMAIL');
          const password = this.configService.get<string>('PASSWORD');

          const response = await this.networkService.postLogin({
            email,
            password,
          });
          if (response.data) {
            const { token, refreshToken } = response.data;
            const createConfigResponse = await this.myConfigService.create({
              key: ConfigKey.Authentication,
              value: { accessToken: token, refreshToken },
            });

            accessToken = createConfigResponse.toObject().value.accessToken;

            //check error
          } else console.log(response);
        } else accessToken = tokensConfig.toObject().value.accessToken;

        config.headers['Authorization'] = 'Bearer ' + accessToken;

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
        return response.data ? response.data : response;
      },
      async (error: AxiosError<IResponse<undefined>>) => {
        console.error('Refresh Response Error:', error);

        const status = error.response?.status || 500;

        if (status === 400) {
          if (error.response && error.config) {
            const { errors } = error.response.data;

            if (errors) {
              const expiredError = errors.find((err) => err.code === '008');

              if (expiredError) {
                if (error.config.url === 'auth/refresh') console.log('login');
                else {
                  const tokensConfig = await this.myConfigService.getConfig(
                    ConfigKey.Authentication,
                  );

                  const refreshToken =
                    tokensConfig.toObject().value.refreshToken;

                  const refreshResponse =
                    await this.networkService.postRefreshToken({
                      refreshToken,
                    });

                  if (refreshResponse.data) {
                    const { token, refreshToken } = refreshResponse.data;

                    const updateResponse = await this.myConfigService.update({
                      key: ConfigKey.Authentication,
                      value: { accessToken: token, refreshToken },
                    });

                    console.log(updateResponse);

                    error.config.headers['Authorization'] = `Bearer ${token}`;

                    return axiosRef.request(error.config);
                  }
                }
              }
            }
          }
        }

        return error.response ? error.response : error;
      },
    );
  }
}
