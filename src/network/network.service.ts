import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LoginRequestDto } from './dto/login-request.dto';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { TokenHttpService } from 'src/token/token.service';
import { AxiosHttpService } from 'src/axios/axios.service';
import qs from 'qs';

@Injectable()
export class NetworkService {
  constructor(
    private readonly tokenService: TokenHttpService,
    private readonly axiosService: AxiosHttpService,
  ) {}

  async postLogin(data: LoginRequestDto) {
    const response = await firstValueFrom(
      this.tokenService.post<IResponse<ILoginResponse>>('auth/login', data),
    );
    return response.data;
  }

  async postRefreshToken(data: RefreshRequestDto) {
    const response = await firstValueFrom(
      this.tokenService.post<IResponse<IRefreshTokenResponse>>(
        `auth/refresh`,
        data,
      ),
    );
    return response.data;
  }

  async getUsers(userIds: number[]) {
    if (userIds.length === 0) throw new BadRequestException();

    const queryUrl = qs.stringify(
      { userIds },
      {
        arrayFormat: 'repeat',
        encode: false,
      },
    );
    const response = await firstValueFrom(
      this.axiosService.get<IResponse<{ users: IUser[] }>>(
        `accounts/users?${queryUrl}`,
      ),
    );
    console.log(response);
    return response.data;
  }

  async getRandomStaff() {
    const response = await firstValueFrom(
      this.axiosService.get<IResponse<IUser>>(`accounts/staffs/random`),
    );
    return response.data;
  }
}
