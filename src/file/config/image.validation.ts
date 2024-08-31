import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export default new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /^(image\/jpeg|image\/png)$/, // allow .jpg, .jpeg and .png,
  })
  .addMaxSizeValidator({
    maxSize: 1024 * 1024 * 30, // Max 30Mb,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
