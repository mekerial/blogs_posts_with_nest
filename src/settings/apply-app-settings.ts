import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../app.module';
import { useContainer } from 'class-validator';
import { HttpExceptionFilter } from '../infrastructure/exception-filters/http-exception-filter';
import cookieParser from 'cookie-parser';

export const applyAppSettings = (app: INestApplication) => {
  app.use(cookieParser());
  setAppPipes(app);
  setAppExceptionFilters(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const customErrors = [];

        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints);

          constraintKeys.forEach((cKey) => {
            const msg = e.constraints![cKey];
            customErrors.push({ field: e.property, message: msg });
          });
        });
        // Error 400
        throw new BadRequestException(customErrors);
      },
    }),
  );
};
const setAppExceptionFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
