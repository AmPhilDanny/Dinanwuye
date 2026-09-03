import 'reflect-metadata';
import { bootstrapService } from './shared';
import { AppModule } from './app.module';

async function main(): Promise<void> {
  await bootstrapService(AppModule, {
    serviceName: 'dinanwuye-api',
    version: '0.1.0',
    description: 'Dinanwuye Consolidated Backend API',
    port: Number(process.env.PORT ?? 3000),
    corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8100,http://localhost:5173,https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com').split(','),
  });
}

void main();
