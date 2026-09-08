import { Account, TransferRequest, TransferResult } from './types';

export async function fetchAccounts(customerId: string): Promise<Account[]> {
  const res = await fetch(`/customers/${customerId}/accounts`);
  if (!res.ok) {
    throw new Error(`Failed to load accounts (${res.status})`);
  }
  return res.json();
}

export async function submitTransfer(
  req: TransferRequest,
): Promise<TransferResult> {
  throw new Error('Not implemented — see CORE-1893');
}
