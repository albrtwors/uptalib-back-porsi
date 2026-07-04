import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

// Guardamos la instancia de express de forma global para reusarla en las Lambdas
let cachedExpressApp: any;

async function bootstrapServer() {
  if (cachedExpressApp) {
    return cachedExpressApp;
  }

  const app = await NestFactory.create(AppModule);
  const cookieParser = require('cookie-parser');
  const localConfig = { origin: ['http://localhost:3000'], credentials: true };
  const isLocal = process.env.isLocal;

  app.enableCors(isLocal == 'true' ? localConfig : {});
  app.use(cookieParser());
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

  // 💡 IMPORTANTE: En Vercel no usamos app.listen(), iniciamos la app internamente
  await app.init();

  // Extraemos y guardamos el servidor express nativo
  cachedExpressApp = app.getHttpAdapter().getInstance();
  return cachedExpressApp;
}

// Para desarrollo local (si corres npm run start:dev)
if (process.env.isLocal === 'true') {
  async function bootstrapLocal() {
    const app = await NestFactory.create(AppModule);
    const cookieParser = require('cookie-parser');
    const localConfig = { origin: ['http://localhost:3000'], credentials: true };

    app.enableCors(localConfig);
    app.use(cookieParser());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.listen(process.env.PORT || 3000, '0.0.0.0');
    console.log(`Aplicación corriendo localmente en: ${await app.getUrl()}`);
  }
  bootstrapLocal();
}

// 🔥 EL EXPORT CRUCIAL: Esto es lo que lee Vercel para evitar el crash 128 en producción
export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  return server(req, res);
};