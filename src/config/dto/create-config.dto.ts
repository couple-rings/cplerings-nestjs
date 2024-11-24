import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ConfigKey } from 'src/util/enum';
import { Type } from 'class-transformer';

class Tokens {
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;
}

export class CreateConfigDto {
  @IsNotEmpty()
  @IsEnum(ConfigKey)
  key: ConfigKey;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Tokens)
  value: Tokens;
}
