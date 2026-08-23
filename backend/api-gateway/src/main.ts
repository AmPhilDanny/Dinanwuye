import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'https://dinanwuye-frontend.onrender.com',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Dinanwuye API Gateway')
    .setDescription('API Gateway for Dinanwuye services including admin dashboard')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('health', 'Health check')
    .addTag('auth', 'Authentication')
    .addTag('users', 'User management')
    .addTag('profiles', 'Profile management')
    .addTag('photos', 'Photo management')
    .addTag('matches', 'Match management')
    .addTag('swipes', 'Swipe analytics')
    .addTag('audit', 'Audit logs')
    .addTag('admins', 'Admin management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway running on port ${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/v1/docs`);
}

bootstrap();