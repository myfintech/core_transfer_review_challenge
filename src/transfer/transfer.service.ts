import { Injectable } from '@nestjs/common';
import {
  AccountCoreService,
  ExchangeService,
  TransferLogService,
} from '../mock-services';
import { TransferRequest, TransferResult } from './transfer.types';

/**
 * CORE-1893: implement POST /transfers.
 * See README.md for the ticket and acceptance criteria.
 */
@Injectable()
export class TransferService {
  constructor(
    private readonly accounts: AccountCoreService,
    private readonly exchange: ExchangeService,
    private readonly transferLog: TransferLogService,
  ) {}

  async createTransfer(
    req: TransferRequest,
    idempotencyKey: string,
  ): Promise<TransferResult> {
    throw new Error('Not implemented — see CORE-1893');
  }
}
