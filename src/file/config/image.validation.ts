import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { maxSize } from 'src/util/constants';

export default new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /^(image\/jpeg|image\/png)$/, // allow .jpg, .jpeg and .png,
  })
  .addMaxSizeValidator({
    maxSize: maxSize, // Max 30Mb,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    fileIsRequired: false,
  });
