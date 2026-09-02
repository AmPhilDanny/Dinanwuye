import type { UserStatus } from './constants';
export interface JwtPayload {
    sub: string;
    email?: string;
    phone?: string;
    role: string;
    status: UserStatus;
    iat?: number;
    exp?: number;
}
export interface JwtRequest {
    user?: JwtPayload;
    [key: string]: unknown;
}
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
/**
 * Passport JWT guard — verifies Bearer token via jwt-strategy registered
 * in each service's AppModule. Throws 401 when missing/invalid.
 */
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    handleRequest<TUser = JwtPayload>(err: unknown, user: TUser | false): TUser;
}
/** Helper to pull the JWT payload from a request in controllers/gateways. */
export declare function getUserFromRequest(request: JwtRequest): JwtPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map