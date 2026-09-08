import { Module } from '@nestjs/common';
import { MockServicesModule } from '../mock-services';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [MockServicesModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
