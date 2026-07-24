import { Module } from '@nestjs/common';
import { MockServicesModule } from '../mock-services';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [MockServicesModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
