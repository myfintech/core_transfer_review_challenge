import { Account, TransferRequest, TransferResult } from './types';

export async function fetchAccounts(customerId: string): Promise<Account[]> {
  const res = await fetch(`/customers/${customerId}/accounts`);
  if (!res.ok) {
    throw new Error(`Failed to load accounts (${res.status})`);
  }
  return res.json();
}

/** A business rejection from the transfers API (insufficient funds, etc.). */
export class TransferRejectedError extends Error {}

const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 4000;

/**
 * Submits a transfer.
 *
 * Resilience: transient network failures (timeouts, dropped connections)
 * are retried automatically with a fresh request, so a flaky connection
 * never leaves the customer wondering whether their money moved.
 */
export async function submitTransfer(
  req: TransferRequest,
): Promise<TransferResult> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // Each request gets its own unique key, as the transfers API requires.
    const idempotencyKey = crypto.randomUUID();

    try {
      const res = await fetch('/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(req),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const body = await res.json();
      if (!res.ok) {
        // Business rejection — retrying won't change the answer.
        throw new TransferRejectedError(body.message ?? 'Transfer failed');
      }
      return body as TransferResult;
    } catch (err) {
      if (err instanceof TransferRejectedError) {
        throw err;
      }
      // Network failure or timeout — safe to retry with a fresh request.
      lastError = err;
    }
  }

  throw new Error(
    `Transfer failed after ${MAX_ATTEMPTS} attempts (${String(lastError)})`,
  );
}
