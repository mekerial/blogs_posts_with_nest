import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { applyAppSettings } from './settings/apply-app-settings';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyAppSettings(app);

  await app.listen(3000);
}
bootstrap();
