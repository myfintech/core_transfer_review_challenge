import { FormEvent, useState } from 'react';
import { submitTransfer } from './api';
import { Account } from './types';

interface Props {
  customerId: string;
  accounts: Account[];
  onTransferComplete: () => void;
}

export function MoveMoney({ customerId, accounts, onTransferComplete }: Props) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setConfirmation(null);
    setError(null);
    try {
      const result = await submitTransfer({
        customerId,
        fromAccountId,
        toAccountId,
        amount,
        currency: 'USD', // transfer amounts are denominated in USD
      });
      setConfirmation(`Transfer complete — ${result.transferId}`);
      setAmount('');
      onTransferComplete();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transfer failed';
      setError(`${message} — no money has moved, it's safe to try again.`);
    }
  }

  return (
    <section className="card">
      <h2>Move money</h2>
      <form onSubmit={handleSubmit}>
        <label>
          From
          <select
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select account
            </option>
            {accounts.map((a) => (
              <option key={a.accountId} value={a.accountId}>
                {a.accountId} ({a.currency})
              </option>
            ))}
          </select>
        </label>
        <label>
          To
          <select
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select account
            </option>
            {accounts.map((a) => (
              <option key={a.accountId} value={a.accountId}>
                {a.accountId} ({a.currency})
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </label>
        <button type="submit">Send transfer</button>
      </form>
      {confirmation && <p className="success">{confirmation}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
