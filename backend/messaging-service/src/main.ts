import 'reflect-metadata';
import { bootstrapService } from '@dinanwuye/shared';
import { AppModule } from './app.module';
import { PORTS } from '@dinanwuye/shared';

async function main(): Promise<void> {
  await bootstrapService(AppModule, {
    serviceName: 'messaging-service',
    version: '0.1.0',
    description: 'Dinanwuye Messaging Service (REST + Socket.IO on the same HTTP port)',
    port: Number(process.env.PORT ?? process.env.MESSAGING_SERVICE_PORT ?? PORTS.MESSAGING),
    corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:8100').split(','),
  });
}

void main();