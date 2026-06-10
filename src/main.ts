import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cookieParser = require('cookie-parser')
  const localConfig = { origin: ['http://localhost:3000'], credentials: true }
  const isLocal = process.env.isLocal
  app.enableCors(isLocal == 'true' ? localConfig : {})
  app.use(cookieParser())
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));



  const config = new DocumentBuilder()
    .setTitle('Books API')
    .setDescription('sistema para la gestión de libros e inventarios xd')
    .setVersion('1.2')
    .addTag('books')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`Aplicación corriendo en: ${await app.getUrl()}`);
}
bootstrap();