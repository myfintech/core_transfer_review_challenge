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
