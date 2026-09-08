import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [AccountsModule, TransferModule],
})
export class AppModule {}
