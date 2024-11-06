import { SetMetadata } from '@nestjs/common';
import { ValidationOptions, registerDecorator } from 'class-validator';

export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

export function ValidateFile(
  acceptMimeTypes: string[],
  options?: ValidationOptions,
) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(mimeType) {
          const fileType = acceptMimeTypes.find((type) => type === mimeType);
          return !!fileType;
        },
      },
    });
  };
}
