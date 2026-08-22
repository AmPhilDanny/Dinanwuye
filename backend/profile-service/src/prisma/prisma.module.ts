import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

export class PrismaService extends PrismaClient implements OnModuleDestroy {
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: () => new PrismaService(),
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}