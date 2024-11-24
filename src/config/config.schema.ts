import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ConfigKey } from 'src/util/enum';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
class Tokens {
  @Prop({ required: true, type: String })
  accessToken: string;

  @Prop({ required: true, type: String })
  refreshToken: string;
}

const tokensSchema = SchemaFactory.createForClass(Tokens);

@Schema({ timestamps: true })
export class Config {
  @Prop({ required: true, type: String, enum: ConfigKey })
  key: ConfigKey;

  @Prop({ required: true, type: tokensSchema })
  value: Tokens;
}

export const configSchema = SchemaFactory.createForClass(Config);
