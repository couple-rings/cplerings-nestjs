import { IsNotEmpty } from 'class-validator';

export class RefreshRequestDto {
  @IsNotEmpty()
  refreshToken: string;
}
