import { ValidationPipeOptions } from '@nestjs/common';

interface EditedValidationPipeOptions extends ValidationPipeOptions {
  enableDebugMessages: boolean;
}

const validationOptions: EditedValidationPipeOptions = {
  disableErrorMessages: process.env.NODE_ENV === 'development',
  whitelist: true,
  enableDebugMessages: process.env.NODE_ENV === 'development',
  transform: true,
};

export default validationOptions;
