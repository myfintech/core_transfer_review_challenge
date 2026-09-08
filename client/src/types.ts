/** Client-side mirror of the API contract — see src/transfer/transfer.types.ts. */

export interface Account {
  accountId: string;
  currency: string;
  balance: number;
}

export interface TransferRequest {
  customerId: string;
  fromAccountId: string;
  toAccountId: string;
  /** Decimal string, e.g. "2500.00", in the source account's currency. */
  amount: string;
  /** Currency of the source account. */
  currency: string;
}

export interface TransferResult {
  status: 'completed';
  transferId?: string;
}
