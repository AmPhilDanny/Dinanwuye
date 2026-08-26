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

  // CORS - support multiple origins (comma-separated)
  const corsOrigins = (process.env.CORS_ORIGIN || 'https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global prefix
  app.setGlobalPrefix('api/v1/admin');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Dinanwuye Admin Dashboard API')
    .setDescription('Admin dashboard API for managing users, profiles, matches, and content')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Admin authentication')
    .addTag('users', 'User management')
    .addTag('profiles', 'Profile management')
    .addTag('photos', 'Photo moderation')
    .addTag('matches', 'Match management')
    .addTag('swipes', 'Swipe analytics')
    .addTag('audit', 'Audit logs')
    .addTag('admins', 'Admin user management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3007;
  await app.listen(port);
  console.log(`Admin service running on port ${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/v1/admin/docs`);
}

bootstrap();