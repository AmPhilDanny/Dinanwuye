/**
 * @dinanwuye/shared — health controller template reused by each service.
 * Import and register in each service's AppModule to expose GET /health.
 */
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthResponseDto } from './dto';

export const SERVICE_NAME_TOKEN = 'SERVICE_NAME';
export const SERVICE_VERSION_TOKEN = 'SERVICE_VERSION';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @Inject(SERVICE_NAME_TOKEN) private readonly serviceName: string,
    @Inject(SERVICE_VERSION_TOKEN) private readonly version: string,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Service health check' })
  check(): HealthResponseDto {
    return {
      status: 'healthy',
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      version: this.version,
    };
  }
}
