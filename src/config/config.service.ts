import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Config } from './config.schema';
import { CreateConfigDto } from './dto/create-config.dto';
import { ConfigKey } from 'src/util/enum';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectModel(Config.name)
    private configModel: Model<Config>,
  ) {}

  async create(createConfigDto: CreateConfigDto) {
    const { key } = createConfigDto;

    const configs = await this.configModel.find({
      key,
    });
    if (configs.length > 0) return configs[0];

    return this.configModel.create(createConfigDto);
  }

  async getConfig(key: ConfigKey) {
    return this.configModel.findOne({ key });
  }

  async update(updateConfigDto: UpdateConfigDto) {
    const { key } = updateConfigDto;

    const config = await this.configModel.findOne({ key });
    if (!config) return null;

    return this.configModel.findOneAndUpdate({ key }, updateConfigDto, {
      new: true,
    });
  }
}
