import { HealthResponseDto } from './dto';
export declare const SERVICE_NAME_TOKEN = "SERVICE_NAME";
export declare const SERVICE_VERSION_TOKEN = "SERVICE_VERSION";
export declare class HealthController {
    private readonly serviceName;
    private readonly version;
    constructor(serviceName: string, version: string);
    check(): HealthResponseDto;
}
//# sourceMappingURL=health.d.ts.map