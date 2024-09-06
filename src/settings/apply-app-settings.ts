import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../app.module';
import { useContainer } from 'class-validator';

export const applyAppSettings = (app: INestApplication) => {
  setAppPipes(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors = [];

        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints);

          constraintKeys.forEach((cKey) => {
            const msg = e.constraints![cKey];
            customErrors.push({ key: e.property, message: msg });
          });
        });
        // Error 400
        throw new BadRequestException(customErrors);
      },
    }),
  );
};
