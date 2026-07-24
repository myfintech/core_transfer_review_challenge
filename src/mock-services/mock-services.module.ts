import { Module } from '@nestjs/common';
import { AccountCoreService } from './account-core.service';
import { ExchangeService } from './exchange.service';
import { TransferLogService } from './transfer-log.service';

@Module({
  providers: [AccountCoreService, ExchangeService, TransferLogService],
  exports: [AccountCoreService, ExchangeService, TransferLogService],
})
export class MockServicesModule {}
