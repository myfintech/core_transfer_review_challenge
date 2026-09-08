# Internal Services API Documentation

> **Note:** These services simulate our legacy core banking systems.
> Do not modify them.

---

## AccountCoreService

Legacy account core. Account data and money movement.

### Methods

#### `getBalance(accountId: string)`
**Returns:** the account's current balance (number), in the account's own currency.

#### `getCurrency(accountId: string)`
**Returns:** the account's currency code (e.g. `USD`, `EUR`, `GBP`).

#### `getCustomerId(accountId: string)`
**Returns:** the ID of the customer who owns the account.

#### `getAccountsByCustomer(customerId: string)`
**Returns:** all accounts belonging to the customer, as `{ accountId, currency, balance }[]`. Each balance is in that account's own currency.

#### `debit(accountId: string, amount: number)` / `credit(accountId: string, amount: number)`
Moves money. **The legacy core does NOT validate balances or amounts** — callers are responsible for all checks.

---

## ExchangeService

Currency exchange rate service.

### Methods

#### `getRate(from: string, to: string)`
**Returns:** the current exchange rate multiplier.
**Throws:** `ServiceUnavailableException` when the service is unreachable.

> **Testing tip:** set `EXCHANGE_SERVICE_DOWN=1` to simulate an outage.

---

## TransferLogService

Transfer history.

### Methods

#### `getTransfers(accountId: string, date: string)`
**Returns:** transfers made **from the given account** on the given date (`YYYY-MM-DD`).

#### `getTransfersByCustomer(customerId: string, date: string)`
**Returns:** **all** transfers made by the given customer on the given date, across all of their accounts.

#### `record(entry)`
Appends a transfer to the log and returns its `transferId`.

> **Note:** logged amounts are stored in the **original transfer currency**.
