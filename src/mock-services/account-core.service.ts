import { Injectable, NotFoundException } from '@nestjs/common';

interface AccountRecord {
  customerId: string;
  balance: number;
  currency: string;
}

/**
 * Legacy account core stub. See API_DOCUMENTATION.md.
 * DO NOT MODIFY.
 */
@Injectable()
export class AccountCoreService {
  private readonly accounts: Map<string, AccountRecord> = new Map([
    ['CHK-001', { customerId: 'CUST-1', balance: 5000, currency: 'USD' }],
    ['SAV-001', { customerId: 'CUST-1', balance: 1200, currency: 'USD' }],
    ['SAV-EUR-1', { customerId: 'CUST-1', balance: 300, currency: 'EUR' }],
    ['CHK-777', { customerId: 'CUST-2', balance: 50000, currency: 'USD' }],
    ['SAV-777', { customerId: 'CUST-2', balance: 0, currency: 'USD' }],
    ['SAV-GBP-7', { customerId: 'CUST-2', balance: 100, currency: 'GBP' }],
  ]);

  async getBalance(accountId: string): Promise<number> {
    return this.get(accountId).balance;
  }

  async getCurrency(accountId: string): Promise<string> {
    return this.get(accountId).currency;
  }

  async getCustomerId(accountId: string): Promise<string> {
    return this.get(accountId).customerId;
  }

  /** Debits the account. The legacy core does NOT validate balances. */
  async debit(accountId: string, amount: number): Promise<void> {
    this.get(accountId).balance -= amount;
  }

  async credit(accountId: string, amount: number): Promise<void> {
    this.get(accountId).balance += amount;
  }

  private get(accountId: string): AccountRecord {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new NotFoundException(`Unknown account: ${accountId}`);
    }
    return account;
  }
}
