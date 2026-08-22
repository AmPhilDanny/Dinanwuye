import 'reflect-metadata';
import { bootstrapService } from '@dinanwuye/shared';
import { AppModule } from './app.module';
import { PORTS } from '@dinanwuye/shared';

async function main(): Promise<void> {
  await bootstrapService(AppModule, {
    serviceName: 'auth-service',
    version: '0.1.0',
    description: 'Dinanwuye Auth & Identity Service',
    port: Number(process.env.PORT ?? process.env.AUTH_SERVICE_PORT ?? PORTS.AUTH),
    corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8100').split(','),
  });
}

void main();