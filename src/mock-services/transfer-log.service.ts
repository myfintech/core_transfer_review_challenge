import { Injectable } from '@nestjs/common';

export interface TransferRecord {
  transferId: string;
  customerId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  date: string; // YYYY-MM-DD
}

/**
 * Transfer history stub. See API_DOCUMENTATION.md.
 * DO NOT MODIFY.
 *
 * Note: amounts are stored in the ORIGINAL transfer currency.
 */
@Injectable()
export class TransferLogService {
  private readonly log: TransferRecord[] = [];
  private seq = 1;

  /** Transfers made FROM the given account on the given date. */
  async getTransfers(accountId: string, date: string): Promise<TransferRecord[]> {
    return this.log.filter(
      (t) => t.fromAccountId === accountId && t.date === date,
    );
  }

  /** ALL transfers made by the given customer on the given date. */
  async getTransfersByCustomer(
    customerId: string,
    date: string,
  ): Promise<TransferRecord[]> {
    return this.log.filter(
      (t) => t.customerId === customerId && t.date === date,
    );
  }

  async record(
    entry: Omit<TransferRecord, 'transferId' | 'date'>,
  ): Promise<string> {
    const transferId = `TRF-${this.seq++}`;
    this.log.push({
      ...entry,
      transferId,
      date: new Date().toISOString().slice(0, 10),
    });
    return transferId;
  }
}
