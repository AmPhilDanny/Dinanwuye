import { PrismaService } from '../prisma/prisma.module';
import { PreferencesDto, UpdatePreferencesDto } from './dto/profile.dto';
export declare class PreferencesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /** Get-or-create preference row with sane defaults. */
    getPreferences(userId: string): Promise<PreferencesDto>;
    updatePreferences(userId: string, dto: UpdatePreferencesDto): Promise<PreferencesDto>;
}
//# sourceMappingURL=preferences.service.d.ts.map