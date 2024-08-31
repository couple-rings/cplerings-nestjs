import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export default new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType:
      /^(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/, // allow .pdf, .doc and .docx,
  })
  .addMaxSizeValidator({
    maxSize: 1024 * 1024 * 30, // Max 30Mb,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
