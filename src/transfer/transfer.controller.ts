import { Body, Controller, Headers, Post } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferRequest, TransferResult } from './transfer.types';

@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async create(
    @Body() body: TransferRequest,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<TransferResult> {
    return this.transferService.createTransfer(body, idempotencyKey);
  }
}
