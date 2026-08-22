/**
 * @dinanwuye/shared — service bootstrap helper.
 * Wraps NestFactory with Swagger, global validation pipe, CORS and shutdown hooks
 * so each service's main.ts is only a few lines.
 */
import { INestApplication } from '@nestjs/common';
export interface BootstrapOptions {
    serviceName: string;
    version: string;
    description?: string;
    port: number;
    corsOrigins?: string[];
    swaggerEnabled?: boolean;
}
export declare function bootstrapService<T>(appModule: T, options: BootstrapOptions): Promise<INestApplication>;
//# sourceMappingURL=bootstrap.d.ts.map