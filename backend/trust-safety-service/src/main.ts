import 'reflect-metadata';
import { bootstrapService } from '@dinanwuye/shared';
import { AppModule } from './app.module';
import { PORTS } from '@dinanwuye/shared';

async function main(): Promise<void> {
  await bootstrapService(AppModule, {
    serviceName: 'trust-safety-service',
    version: '0.1.0',
    description: 'Dinanwuye Trust & Safety Service',
    port: Number(process.env.TRUST_SAFETY_SERVICE_PORT ?? PORTS.TRUST_SAFETY),
    corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8100').split(','),
  });
}

void main();