/**
 * @dinanwuye/shared — service bootstrap helper.
 * Wraps NestFactory with Swagger, global validation pipe, CORS and shutdown hooks
 * so each service's main.ts is only a few lines.
 */
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import express from 'express';
import { API_PREFIX } from './constants';

export interface BootstrapOptions {
  serviceName: string;
  version: string;
  description?: string;
  port: number;
  corsOrigins?: string[];
  swaggerEnabled?: boolean;
}

export async function bootstrapService<T>(appModule: T, options: BootstrapOptions): Promise<INestApplication> {
  const logger = new Logger(options.serviceName);

  const app = await NestFactory.create(appModule as never, {
    logger: ['log', 'warn', 'error'],
  });

  app.setGlobalPrefix(API_PREFIX);
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const corsOrigins = options.corsOrigins ?? ['http://localhost:8100', 'http://localhost:5173', 'https://dinanwuye.onrender.com', 'https://dinanwuye-admin.onrender.com', 'https://dinanwuye.com', 'https://www.dinanwuye.com'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  if (options.swaggerEnabled !== false) {
    const config = new DocumentBuilder()
      .setTitle(options.serviceName)
      .setDescription(options.description ?? `${options.serviceName} API`)
      .setVersion(options.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const uploadsDir = join(process.cwd(), 'uploads', 'photos');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/uploads/photos', express.static(uploadsDir));

  await app.listen(options.port);
  logger.log(`🚀 ${options.serviceName} v${options.version} listening on :${options.port}`);

  return app;
}
