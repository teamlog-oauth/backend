import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { isDevelopment } from './utils/env';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

const swagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('TeamLog OAuth 2.0')
    .setDescription('TeamLog OAuth 2.0 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
};

async function bootstrap() {
  const config = new ConfigService();

  const port = config.get<number>('PORT');

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  if (isDevelopment()) swagger(app);

  await app.listen(3000);

  Logger.log(`Server running on http://localhost:${port}`, `Bootstrap`);
  if (isDevelopment())
    Logger.log(`Swagger running on http://localhost:${port}/docs`, `Bootstrap`);
}
bootstrap();
