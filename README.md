# Code Review Challenge: Funds Transfer (Full-Stack)

## Welcome

You're reviewing a pull request. Our AI coding agent implemented ticket **CORE-1893** overnight and pushed branch **`coding-agent/CORE-1893-transfers`**. All of its tests pass. You're the human gate: decide whether this ships.

**Your deliverable (by the end of the session):**
1. A **ship / don't-ship** verdict
2. Your **top issues, ranked by severity**
3. What you'd tell the author

This PR was written by an AI coding agent and all of its tests pass. You're the human gate — the review is yours alone, so please close any AI assistants and disable inline autocomplete for the hour. Everything else is fair game: read the code, run the tests, run the app, write your own tests. Every issue you raise, you should be able to demonstrate and defend.

**Estimated Time:** 45-60 minutes

---

## The Ticket (CORE-1893)

> **Move money between a customer's own accounts** — the `POST /transfers` API **and** the **Move Money** screen in the web app, including cross-currency transfers.
>
> **Acceptance Criteria:**
> 1. Reject transfers that exceed the source account's available balance.
> 2. Enforce a daily transfer limit of **$10,000 USD-equivalent per customer**, across all of their transfers that day.
> 3. A single customer action must **never move money twice**. API requests carry an `Idempotency-Key` header: the same key must never double-execute a transfer, and a retried request must receive the **same response** as the original attempt. This guarantee must hold **end-to-end** — automatic retries and repeated clicks in the UI included.
> 4. **Currency conversion:** a cross-currency transfer needs a live exchange rate from the exchange-rate service. If that service is unavailable, **reject the transfer** with a clear error — never fall back to a cached, estimated or previous rate. (Compliance requirement: the rate applied must be the live rate at the moment the transfer executes.)
> 5. **Move Money screen:** the customer picks a source and a destination account, enters an amount **in the source account's currency**, and submits. On success, show a confirmation with the transfer ID. On failure, tell the customer why.
> 6. **Support debugging:** log every transfer request in full — customer, source and destination accounts, amount, currency — so Support can reproduce a customer's issue from the logs alone.

---

## Quick Start

Two processes — the API and the web client:

```bash
# 1. Get the code under review
git checkout coding-agent/CORE-1893-transfers

# 2. API (terminal 1)
npm install
npm test        # the author's tests — they pass
npm start       # http://localhost:5556

# 3. Web client (terminal 2)
cd client
npm install
npm run dev     # http://localhost:5173
```

You can also read the change as a diff on GitHub:
**Compare view:** https://github.com/myfintech/core_transfer_review_challenge/compare/main...coding-agent/CORE-1893-transfers

---

## Project Structure

```
src/                                # NestJS API
├── main.ts                         # App entry point
├── app.module.ts                   # Root module
│
├── accounts/                       # read-only account listing (pre-existing)
│
├── mock-services/                  # DO NOT MODIFY — legacy core stubs
│   ├── API_DOCUMENTATION.md        # ⭐ SERVICE DOCUMENTATION — read this!
│   ├── account-core.service.ts     # accounts, balances, debit/credit
│   ├── exchange.service.ts         # FX rates
│   └── transfer-log.service.ts     # transfer history
│
└── transfer/                       # ⭐ UNDER REVIEW (API side)
    ├── transfer.controller.ts
    ├── transfer.types.ts           # the API contract
    ├── transfer.service.ts
    └── transfer.service.spec.ts    # the author's tests

client/                             # React web app (Vite)
└── src/
    ├── App.tsx                     # shell + accounts view (pre-existing)
    ├── api.ts                      # ⭐ UNDER REVIEW (client API layer)
    ├── MoveMoney.tsx               # ⭐ UNDER REVIEW (the new screen)
    └── types.ts                    # client-side contract mirror
```

---

**Feel free to ask clarifying questions — treat this like a working session with a teammate.**
