import { useCallback, useEffect, useState } from 'react';
import { fetchAccounts } from './api';
import { Account } from './types';

const DEMO_CUSTOMERS = ['CUST-1', 'CUST-2'];

export default function App() {
  const [customerId, setCustomerId] = useState(DEMO_CUSTOMERS[0]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAccounts = useCallback(() => {
    fetchAccounts(customerId)
      .then((accts) => {
        setAccounts(accts);
        setLoadError(null);
      })
      .catch((err) => setLoadError(String(err)));
  }, [customerId]);

  useEffect(loadAccounts, [loadAccounts]);

  return (
    <main className="app">
      <header>
        <h1>Online Banking</h1>
        <label>
          Signed in as{' '}
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {DEMO_CUSTOMERS.map((id) => (
              <option key={id}>{id}</option>
            ))}
          </select>
        </label>
      </header>

      <section className="card">
        <h2>Your accounts</h2>
        {loadError && <p className="error">{loadError}</p>}
        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Currency</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.accountId}>
                <td>{a.accountId}</td>
                <td>{a.currency}</td>
                <td>
                  {a.balance.toLocaleString(undefined, {
                    style: 'currency',
                    currency: a.currency,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card placeholder">
        <h2>Move money</h2>
        <p>Coming soon — CORE-1893.</p>
      </section>
    </main>
  );
}
