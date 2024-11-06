import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { maxSize } from 'src/util/constants';

export default new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType:
      /^(application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/, // allow .pdf, .doc and .docx,
  })
  .addMaxSizeValidator({
    maxSize: maxSize, // Max 30Mb,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    fileIsRequired: false,
  });
