import 'reflect-metadata';
import { bootstrapService } from '@dinanwuye/shared';
import { AppModule } from './app.module';
import { PORTS } from '@dinanwuye/shared';

async function main(): Promise<void> {
  await bootstrapService(AppModule, {
    serviceName: 'profile-service',
    version: '0.1.0',
    description: 'Dinanwuye Profile Service',
    port: Number(process.env.PROFILE_SERVICE_PORT ?? PORTS.PROFILE),
    corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8100').split(','),
  });
}

void main();