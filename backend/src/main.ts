import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: 'http://localhost:4200' });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Subscriptions Tracker API')
    .setDescription('API to manage subscriptions and recurring costs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
  console.log('Swagger docs: http://localhost:3000/api/docs');
}

bootstrap();
