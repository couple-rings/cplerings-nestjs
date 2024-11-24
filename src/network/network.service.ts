import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LoginRequestDto } from './dto/login-request.dto';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { TokenHttpService } from 'src/token/token.service';

@Injectable()
export class NetworkService {
  constructor(private readonly tokenService: TokenHttpService) {}

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
}
